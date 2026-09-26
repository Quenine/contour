import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { assetSymbol, DecimalAmount, outcomeId, UtcTimestamp, type BinaryPriceOutcome, type MarketFreshness, type OrderBookSnapshot } from "@contour/domain";
import { verifyTerminalPayoff, type PerpetualTerminalComponent } from "@contour/payoff";
import { compileTerminalPayoff, type CompileTerminalPayoffRequest, type ExecutableBinaryInstrument } from "../src/index.js";

const d = (value: string) => DecimalAmount.parse(value);
const BTC = assetSymbol("BTC");
const ETH = assetSymbol("ETH");
const T = UtcTimestamp.parse("2026-10-01T00:00:00Z");
const T2 = UtcTimestamp.parse("2026-10-02T00:00:00Z");
const freshness: MarketFreshness = { network: "mainnet", source: "hyperliquid-direct", observedAt: UtcTimestamp.parse("2026-09-30T23:59:30Z") };

function book(id: string, sideIndex: 0 | 1, asks: readonly [string, string][], observed = freshness): OrderBookSnapshot {
  return { outcomeId: outcomeId(id), sideIndex, coin: `#${BigInt(id) * 10n + BigInt(sideIndex)}`, bids: [], asks: asks.map(([price, quantity]) => ({ price: d(price), quantity: d(quantity), orderCount: 1 })), freshness: observed };
}
function instrument(id: string, threshold: string, yesAsks: readonly [string, string][] = [["0.9", "100"]], noAsks: readonly [string, string][] = [["0.2", "100"]], options: { underlying?: typeof BTC; settlement?: UtcTimestamp; observed?: MarketFreshness } = {}): ExecutableBinaryInstrument {
  const marketId = outcomeId(id);
  const underlying = options.underlying ?? BTC; const settlementAt = options.settlement ?? T;
  const market: BinaryPriceOutcome = {
    kind: "binaryPrice", id: marketId, underlying, settlementAt, threshold: d(threshold), comparator: "greaterThan",
    yesSide: "yes", noSide: "no", sourceName: "fixture", freshness: options.observed ?? freshness,
    protocol: { outcomeId: marketId, yesCoin: `#${BigInt(id) * 10n}`, noCoin: `#${BigInt(id) * 10n + 1n}`, yesAssetId: `${100_000_000n + BigInt(id) * 10n}`, noAssetId: `${100_000_001n + BigInt(id) * 10n}` }
  };
  return { market, yesBook: book(id, 0, yesAsks, options.observed), noBook: book(id, 1, noAsks, options.observed) };
}
function longPerp(entry = "100", quantity = "1"): PerpetualTerminalComponent { return { kind: "perpetual", asset: BTC, direction: "long", quantity: d(quantity), entryPrice: d(entry), externalTerms: "excluded" }; }
function request(overrides: Partial<CompileTerminalPayoffRequest> = {}): CompileTerminalPayoffRequest {
  return {
    existingPortfolio: { components: [longPerp()] },
    settlement: { underlying: BTC, timestamp: T, priceRange: { min: d("0"), max: d("100") } },
    constraint: { minimumTerminalPnl: d("-60") }, maximumAcquisitionCost: d("10"),
    instruments: [instrument("1", "50")],
    policy: { maximumBookAgeMs: 60_000, compilationTime: UtcTimestamp.parse("2026-10-01T00:00:00Z"), feeModel: { kind: "excluded" } },
    ...overrides
  };
}

describe("Contour compiler", () => {
  it("returns ALREADY_SATISFIED without buying positions", async () => {
    const result = await compileTerminalPayoff(request({ constraint: { minimumTerminalPnl: d("-100") }, instruments: [] }));
    expect(result.status).toBe("ALREADY_SATISFIED");
    if (result.status === "ALREADY_SATISFIED") expect(result.totalAcquisitionCost.toString()).toBe("0");
  });

  it("uses one NO binary to satisfy an exact strict-threshold constraint", async () => {
    const result = await compileTerminalPayoff(request());
    expect(result.status).toBe("FEASIBLE");
    if (result.status === "FEASIBLE") {
      expect(result.verification.holds).toBe(true);
      expect(result.selectedPositions).toHaveLength(1);
      expect(result.selectedPositions[0]?.side).toBe("no");
      expect(result.totalAcquisitionCost.toString()).toBe("10");
      expect(result.verification.evaluatedPoints.find((point) => point.price.toString() === "50" && point.position === "exact")?.terminalPnl.toString()).toBe("-10");
      expect(result.verification.evaluatedPoints.find((point) => point.price.toString() === "50" && point.position === "rightLimit")?.terminalPnl.toString()).toBe("-60");
    }
  });

  it("uses cheapest depth first and respects multiple levels", async () => {
    const result = await compileTerminalPayoff(request({ instruments: [instrument("1", "50", [["0.9", "100"]], [["0.1", "20"], ["0.2", "100"]])], maximumAcquisitionCost: d("20") }));
    expect(result.status).toBe("FEASIBLE");
    if (result.status === "FEASIBLE") {
      expect(result.executionSegments).toHaveLength(2);
      expect(result.executionSegments[0]?.quantity.toString()).toBe("20");
      expect(result.executionSegments[1]?.quantity.toString()).toBe("27.5");
      expect(result.totalAcquisitionCost.toString()).toBe("7.5");
    }
  });

  it("requires several strikes when each higher-strike book has bounded depth", async () => {
    const markets = [instrument("1", "25", [], [["0.1", "30"]]), instrument("2", "50", [], [["0.1", "30"]]), instrument("3", "75", [], [["0.1", "40"]])];
    const result = await compileTerminalPayoff(request({ constraint: { minimumTerminalPnl: d("-40") }, maximumAcquisitionCost: d("100"), instruments: markets }));
    expect(result.status).toBe("FEASIBLE");
    if (result.status === "FEASIBLE") expect(new Set(result.selectedPositions.map((position) => position.marketId)).size).toBeGreaterThan(1);
  });

  it("reports structural infeasibility after exhausting depth", async () => {
    const result = await compileTerminalPayoff(request({ instruments: [instrument("1", "50", [], [["0.1", "10"], ["0.2", "10"]])], maximumAcquisitionCost: d("100") }));
    expect(result).toMatchObject({ status: "INFEASIBLE", reason: "INSUFFICIENT_LIQUIDITY_OR_COVERAGE" });
  });

  it("distinguishes an exactly binding budget from one exact cent below", async () => {
    const exact = await compileTerminalPayoff(request({ maximumAcquisitionCost: d("10") }));
    const below = await compileTerminalPayoff(request({ maximumAcquisitionCost: d("9.99") }));
    expect(exact.status).toBe("FEASIBLE");
    expect(below).toMatchObject({ status: "INFEASIBLE", reason: "BUDGET_TOO_LOW" });
    if (below.status === "INFEASIBLE") expect(below.minimumAcquisitionCost?.toString()).toBe("10");
  });

  it("rejects a universe with no exact settlement-horizon match", async () => {
    const result = await compileTerminalPayoff(request({ instruments: [instrument("1", "50", undefined, undefined, { settlement: T2 })] }));
    expect(result).toMatchObject({ status: "INFEASIBLE", reason: "NO_ELIGIBLE_MARKETS" });
  });

  it("rejects a universe with no matching underlying", async () => {
    const result = await compileTerminalPayoff(request({ instruments: [instrument("1", "50", undefined, undefined, { underlying: ETH })] }));
    expect(result).toMatchObject({ status: "INFEASIBLE", reason: "NO_ELIGIBLE_MARKETS" });
  });

  it("rejects stale books under the explicit compile policy", async () => {
    const stale = { ...freshness, observedAt: UtcTimestamp.parse("2026-09-30T23:00:00Z") };
    const result = await compileTerminalPayoff(request({ instruments: [instrument("1", "50", undefined, undefined, { observed: stale })] }));
    expect(result).toMatchObject({ status: "INFEASIBLE", reason: "STALE_MARKET_DATA" });
  });

  it("supports YES-side contribution for a short perpetual", async () => {
    const short: PerpetualTerminalComponent = { kind: "perpetual", asset: BTC, direction: "short", quantity: d("1"), entryPrice: d("100"), externalTerms: "excluded" };
    const result = await compileTerminalPayoff(request({ existingPortfolio: { components: [short] }, settlement: { underlying: BTC, timestamp: T, priceRange: { min: d("100"), max: d("200") } }, instruments: [instrument("1", "150", [["0.2", "100"]], [["0.9", "100"]])] }));
    expect(result.status).toBe("FEASIBLE");
    if (result.status === "FEASIBLE") expect(result.selectedPositions[0]?.side).toBe("yes");
  });

  it("rejects malformed, zero-quantity, and crossed ask depth", async () => {
    const malformed = instrument("1", "50", [["0.9", "100"]], [["0.2", "10"], ["0.1", "0"]]);
    const result = await compileTerminalPayoff(request({ instruments: [malformed] }));
    expect(result.status).toBe("INVALID_REQUEST");
  });

  it("keeps deterministic fixed-per-share fees separate and inside the guarantee", async () => {
    const withFees = request({ constraint: { minimumTerminalPnl: d("-61") }, maximumAcquisitionCost: d("20"), policy: { maximumBookAgeMs: 60_000, compilationTime: UtcTimestamp.parse("2026-10-01T00:00:00Z"), feeModel: { kind: "fixedPerShare", feePerShare: d("0.01") } } });
    const result = await compileTerminalPayoff(withFees);
    expect(result.status).toBe("FEASIBLE");
    if (result.status === "FEASIBLE") { expect(result.feeTreatment).toBe("included-fixed-per-share"); expect(result.estimatedFees.compare(d("0"))).toBe(1); }
  });

  it("the independent exact verifier rejects a deliberately corrupted candidate", () => {
    const corrupted = { components: [longPerp(), { kind: "binary" as const, comparator: "greaterThan" as const, threshold: d("50"), side: "no" as const, shares: d("49.999999"), premium: d("9.9999998") }] };
    expect(verifyTerminalPayoff(corrupted, { settlementPriceMin: d("0"), settlementPriceMax: d("100"), minimumPnl: d("-60") }).holds).toBe(false);
  });

  it("keeps output ordering stable by market id and side", async () => {
    const result = await compileTerminalPayoff(request({ constraint: { minimumTerminalPnl: d("-40") }, maximumAcquisitionCost: d("100"), instruments: [instrument("30", "75", [], [["0.1", "40"]]), instrument("2", "50", [], [["0.1", "30"]]), instrument("1", "25", [], [["0.1", "30"]])] }));
    if (result.status === "FEASIBLE") {
      expect(result.selectedPositions.map((position) => position.marketId)).toEqual([...result.selectedPositions.map((position) => position.marketId)].sort((a, b) => BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0));
      expect(result.executionSegments.map((segment) => segment.marketId)).toEqual([...result.executionSegments.map((segment) => segment.marketId)].sort((a, b) => BigInt(a) < BigInt(b) ? -1 : BigInt(a) > BigInt(b) ? 1 : 0));
    }
  });
});

describe("compiler properties", () => {
  it("preserves exact feasibility under a larger budget and never exceeds depth", async () => {
    await fc.assert(fc.asyncProperty(fc.integer({ min: 0, max: 10_000 }), async (extraCents) => {
      const budget = d(`${10 + Math.floor(extraCents / 100)}.${String(extraCents % 100).padStart(2, "0")}`);
      const result = await compileTerminalPayoff(request({ maximumAcquisitionCost: budget }));
      expect(result.status).toBe("FEASIBLE");
      if (result.status !== "FEASIBLE") return;
      expect(result.verification.holds).toBe(true);
      expect(result.executionSegments.every((segment) => segment.quantity.compare(segment.maximumAvailableAtSnapshot) <= 0)).toBe(true);
      const sum = result.executionSegments.reduce((total, segment) => total.add(segment.acquisitionCost), DecimalAmount.zero);
      expect(sum.toString()).toBe(result.totalAcquisitionCost.toString());
    }), { seed: 20261001, numRuns: 20 });
  });
});

describe("scale sanity", () => {
  it("solves roughly 30 outcomes with both sides and three levels", async () => {
    const markets = Array.from({ length: 30 }, (_, index) => instrument(String(index + 1), String((index + 1) * 10), [["0.2", "10"], ["0.3", "20"], ["0.4", "30"]], [["0.2", "10"], ["0.3", "20"], ["0.4", "30"]]));
    const result = await compileTerminalPayoff(request({ existingPortfolio: { components: [longPerp("300")] }, settlement: { underlying: BTC, timestamp: T, priceRange: { min: d("0"), max: d("300") } }, constraint: { minimumTerminalPnl: d("-250") }, maximumAcquisitionCost: d("500"), instruments: markets }));
    expect(["FEASIBLE", "INFEASIBLE", "VERIFICATION_FAILED"]).toContain(result.status);
    expect(result.status).not.toBe("SOLVER_FAILURE");
  });
});
