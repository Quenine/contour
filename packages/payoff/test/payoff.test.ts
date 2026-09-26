import { describe, expect, it } from "vitest";
import { DecimalAmount } from "@contour/domain";
import { binaryTerminalPnl, evaluateScenarios, perpetualTerminalPnl, terminalPnl, verifyTerminalPayoff, type BinaryTerminalComponent, type TerminalPortfolio } from "../src/index.js";
const d = (value: string) => DecimalAmount.parse(value);
const perp = { kind: "perpetual" as const, direction: "long" as const, quantity: d("0.30"), entryPrice: d("80000"), externalTerms: "excluded" as const };
const no = { kind: "binary" as const, comparator: "greaterThanOrEqual" as const, threshold: d("75000"), side: "no" as const, shares: d("1000"), premium: d("200") };
describe("terminal payoff", () => {
  it("calculates exact long perp payoff", () => expect(perpetualTerminalPnl(perp, d("70000")).toString()).toBe("-3000"));
  it("pays binary NO below and removes acquisition premium", () => { expect(binaryTerminalPnl(no, d("74999.99")).toString()).toBe("800"); expect(binaryTerminalPnl(no, d("75000")).toString()).toBe("-200"); });
  it("aggregates the requested mixed portfolio exactly", () => { const portfolio = { components: [perp, no] }; expect(terminalPnl(portfolio, d("70000")).toString()).toBe("-2200"); expect(terminalPnl(portfolio, d("80000")).toString()).toBe("-200"); });
  it("evaluates supplied finite scenarios", () => expect(evaluateScenarios({ components: [perp] }, [d("80000"), d("81000")])[1]?.terminalPnl.toString()).toBe("300"));
});
describe("exact interval verification", () => {
  it("tests strike limits and exact equality rather than dense sampling", () => {
    const portfolio: TerminalPortfolio = { components: [perp, no] };
    const result = verifyTerminalPayoff(portfolio, { settlementPriceMin: d("70000"), settlementPriceMax: d("80000"), minimumPnl: d("-2200") });
    expect(result.holds).toBe(true); expect(result.evaluatedPoints).toHaveLength(5);
  });
  it("handles strict comparator equality and several strikes", () => {
    const yes: BinaryTerminalComponent = { kind: "binary", comparator: "greaterThan", threshold: d("75000"), side: "yes", shares: d("10"), premium: d("0") };
    const another: BinaryTerminalComponent = { kind: "binary", comparator: "greaterThanOrEqual", threshold: d("76000"), side: "no", shares: d("5"), premium: d("0") };
    const result = verifyTerminalPayoff({ components: [yes, another] }, { settlementPriceMin: d("74000"), settlementPriceMax: d("77000"), minimumPnl: d("0") });
    expect(result.holds).toBe(true); expect(result.evaluatedPoints).toHaveLength(8);
  });
  it("supports no strikes, short exposure, and zero quantity", () => {
    const result = verifyTerminalPayoff({ components: [{ ...perp, direction: "short", quantity: d("0") }] }, { settlementPriceMin: d("1"), settlementPriceMax: d("2"), minimumPnl: d("0") });
    expect(result.holds).toBe(true);
  });
  it("rejects invalid ranges", () => expect(() => verifyTerminalPayoff({ components: [] }, { settlementPriceMin: d("2"), settlementPriceMax: d("1"), minimumPnl: d("0") })).toThrow(RangeError));
  it("checks the interior one-sided states at strikes on interval endpoints", () => {
    const noAtMin: BinaryTerminalComponent = { kind: "binary", comparator: "greaterThan", threshold: d("10"), side: "no", shares: d("5"), premium: d("0") };
    const yesAtMax: BinaryTerminalComponent = { kind: "binary", comparator: "greaterThanOrEqual", threshold: d("20"), side: "yes", shares: d("7"), premium: d("0") };
    const result = verifyTerminalPayoff({ components: [noAtMin, yesAtMax] }, { settlementPriceMin: d("10"), settlementPriceMax: d("20"), minimumPnl: d("0") });
    expect(result.holds).toBe(true);
    expect(result.evaluatedPoints.map((point) => `${point.price.toString()}:${point.position}`)).toEqual(["10:exact", "10:rightLimit", "20:leftLimit", "20:exact"]);
  });
});
