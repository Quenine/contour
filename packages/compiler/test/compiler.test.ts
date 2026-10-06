import fc from "fast-check";
import { describe, expect, it } from "vitest";
import { assetSymbol, DecimalAmount, outcomeId, UtcTimestamp, type BinaryPriceOutcome, type MarketFreshness, type OrderBookSnapshot } from "@contour/domain";
import { verifyTerminalPayoff, type BinaryTerminalComponent, type PerpetualTerminalComponent } from "@contour/payoff";
import { compileTerminalPayoff, contributionAtState, solveProblem, validateCompileRequest, type CompileTerminalPayoffRequest, type ExecutableBinaryInstrument } from "../src/index.js";

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

function liveGeometry(): CompileTerminalPayoffRequest {
  const settlement = UtcTimestamp.parse("2026-10-05T08:00:00.000Z");
  const observed: MarketFreshness = { ...freshness, observedAt: UtcTimestamp.parse("2026-10-05T07:59:30.000Z") };
  return request({
    existingPortfolio: { components: [longPerp("84725", "0.01")] },
    settlement: { underlying: BTC, timestamp: settlement, priceRange: { min: d("55000"), max: d("85000") } },
    constraint: { minimumTerminalPnl: d("-290") }, maximumAcquisitionCost: d("400"),
    instruments: [instrument("5372", "65000", [], [["0.28", "10"]], { settlement, observed }), instrument("5376", "75000", [], [["0.94", "10"]], { settlement, observed })],
    policy: { maximumBookAgeMs: 60_000, compilationTime: settlement, feeModel: { kind: "excluded" } }
  });
}

function portfolioFromSegments(input: CompileTerminalPayoffRequest, segments: readonly { readonly marketId: string; readonly side: "yes" | "no"; readonly quantity: DecimalAmount; readonly acquisitionCost: DecimalAmount; readonly estimatedFee: DecimalAmount }[]) {
  const overlay: BinaryTerminalComponent[] = segments.map((segment) => {
    const market = input.instruments.find((instrument) => instrument.market.id === segment.marketId)!.market;
    return { kind: "binary", side: segment.side, comparator: market.comparator, threshold: market.threshold, shares: segment.quantity, premium: segment.acquisitionCost.add(segment.estimatedFee) };
  });
  return { components: [...input.existingPortfolio.components, ...overlay] };
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

describe("exact decimal reconstruction", () => {
  it("reproduces the live boundary deficit offline and repairs the exact portfolio", async () => {
    const input = liveGeometry();
    const validated = validateCompileRequest(input);
    expect(validated.ok).toBe(true);
    if (!validated.ok) return;
    const solved = await solveProblem(validated.problem, true);
    expect(solved.kind).toBe("optimal");
    if (solved.kind !== "optimal") return;
    const columns = (solved.result as unknown as { Columns: Record<string, { Primal: number }> }).Columns;
    const first = d(columns.x_0_no_0!.Primal.toFixed(12));
    const second = d(columns.x_1_no_0!.Primal.toFixed(12));
    expect(first.toString()).toBe("10");
    expect(second.toString()).toBe("0.833333333333");
    const naiveSegments = [{ marketId: "5372", side: "no" as const, quantity: first, acquisitionCost: d("0.28").multiply(first), estimatedFee: d("0") }, { marketId: "5376", side: "no" as const, quantity: second, acquisitionCost: d("0.94").multiply(second), estimatedFee: d("0") }];
    const naive = verifyTerminalPayoff(portfolioFromSegments(input, naiveSegments), { settlementPriceMin: input.settlement.priceRange.min, settlementPriceMax: input.settlement.priceRange.max, minimumPnl: input.constraint.minimumTerminalPnl });
    expect(naive.holds).toBe(false);
    expect(naive.worstCase.price.toString()).toBe("55000");
    expect(naive.worstCase.terminalPnl.toString()).toBe("-290.00000000000002");
    expect(input.constraint.minimumTerminalPnl.subtract(naive.worstCase.terminalPnl).toString()).toBe("0.00000000000002");
    expect(naiveSegments.reduce((sum, segment) => sum.add(segment.acquisitionCost), d("0")).compare(input.maximumAcquisitionCost)).toBeLessThan(0);
    expect(first.compare(d("10"))).toBeLessThanOrEqual(0);
    expect(second.compare(d("10"))).toBeLessThanOrEqual(0);
    const exactNearby = [...naiveSegments.slice(0, 1), { ...naiveSegments[1]!, quantity: d("0.833333333334"), acquisitionCost: d("0.94").multiply(d("0.833333333334")) }];
    expect(verifyTerminalPayoff(portfolioFromSegments(input, exactNearby), { settlementPriceMin: input.settlement.priceRange.min, settlementPriceMax: input.settlement.priceRange.max, minimumPnl: input.constraint.minimumTerminalPnl }).holds).toBe(true);
    const result = await compileTerminalPayoff(input);
    expect(result.status).toBe("FEASIBLE");
    if (result.status !== "FEASIBLE") return;
    expect(result.verification.holds).toBe(true);
    expect(verifyTerminalPayoff(portfolioFromSegments(input, result.executionSegments), { settlementPriceMin: input.settlement.priceRange.min, settlementPriceMax: input.settlement.priceRange.max, minimumPnl: input.constraint.minimumTerminalPnl }).holds).toBe(true);
    expect(result.executionSegments.every((segment) => !segment.quantity.isNegative() && segment.quantity.compare(segment.maximumAvailableAtSnapshot) <= 0)).toBe(true);
    expect(result.totalAcquisitionCost.add(result.estimatedFees).compare(input.maximumAcquisitionCost)).toBeLessThanOrEqual(0);
  });

  it("accounts for a binary that helps one state and harms another", () => {
    const validated = validateCompileRequest(liveGeometry());
    expect(validated.ok).toBe(true);
    if (!validated.ok) return;
    const no = validated.problem.segments[0]!;
    const low = validated.problem.states.find((state) => state.price.toString() === "55000")!;
    const high = validated.problem.states.find((state) => state.price.toString() === "85000")!;
    expect(contributionAtState(no, low).compare(d("0"))).toBeGreaterThan(0);
    expect(contributionAtState(no, high).compare(d("0"))).toBeLessThan(0);
  });

  it("repairs two opposing boundary constraints without assuming one-sided rounding", async () => {
    const input = request({ existingPortfolio: { components: [] }, constraint: { minimumTerminalPnl: d("0.2") }, maximumAcquisitionCost: d("1"), instruments: [instrument("10", "50", [], [["0.2", "1"]]), instrument("11", "50", [["0.2", "1"]], [])] });
    const validated = validateCompileRequest(input);
    expect(validated.ok).toBe(true);
    if (!validated.ok) return;
    const low = validated.problem.states.find((state) => state.price.toString() === "0")!;
    const high = validated.problem.states.find((state) => state.price.toString() === "100")!;
    const no = validated.problem.segments.find((segment) => segment.side === "no")!;
    expect(contributionAtState(no, low).compare(d("0"))).toBeGreaterThan(0);
    expect(contributionAtState(no, high).compare(d("0"))).toBeLessThan(0);
    const roundedDown = d("0.333333333333");
    const naiveSegments = [{ marketId: "10", side: "no" as const, quantity: roundedDown, acquisitionCost: d("0.2").multiply(roundedDown), estimatedFee: d("0") }, { marketId: "11", side: "yes" as const, quantity: roundedDown, acquisitionCost: d("0.2").multiply(roundedDown), estimatedFee: d("0") }];
    const constraint = { settlementPriceMin: input.settlement.priceRange.min, settlementPriceMax: input.settlement.priceRange.max, minimumPnl: input.constraint.minimumTerminalPnl };
    expect(verifyTerminalPayoff(portfolioFromSegments(input, naiveSegments), constraint).holds).toBe(false);
    const oneSided = [{ ...naiveSegments[0]!, quantity: d("0.333333333334"), acquisitionCost: d("0.2").multiply(d("0.333333333334")) }, naiveSegments[1]!];
    const beforeHigh = verifyTerminalPayoff(portfolioFromSegments(input, naiveSegments), constraint).evaluatedPoints.find((point) => point.price.toString() === "100")!.terminalPnl;
    const afterHigh = verifyTerminalPayoff(portfolioFromSegments(input, oneSided), constraint).evaluatedPoints.find((point) => point.price.toString() === "100")!.terminalPnl;
    expect(afterHigh.compare(beforeHigh)).toBeLessThan(0);
    expect(verifyTerminalPayoff(portfolioFromSegments(input, oneSided), constraint).holds).toBe(false);
    const result = await compileTerminalPayoff(input);
    expect(result.status).toBe("FEASIBLE");
    if (result.status !== "FEASIBLE") return;
    expect(result.executionSegments).toHaveLength(2);
    expect(result.executionSegments.every((segment) => segment.quantity.compare(roundedDown) > 0)).toBe(true);
    expect(verifyTerminalPayoff(portfolioFromSegments(input, result.executionSegments), constraint).holds).toBe(true);
  });

  it.each([["1/3", "-0.75"], ["2/3", "-0.5"], ["5/6", "-0.375"]])("exact-verifies a repeating-fraction %s boundary", async (_fraction, floor) => {
    const input = request({ existingPortfolio: { components: [longPerp("1", "1")] }, settlement: { underlying: BTC, timestamp: T, priceRange: { min: d("0"), max: d("2") } }, constraint: { minimumTerminalPnl: d(floor) }, maximumAcquisitionCost: d("1"), instruments: [instrument("12", "1", [], [["0.25", "1"]])] });
    const result = await compileTerminalPayoff(input);
    expect(result.status).toBe("FEASIBLE");
    if (result.status !== "FEASIBLE") return;
    expect(verifyTerminalPayoff(portfolioFromSegments(input, result.executionSegments), { settlementPriceMin: d("0"), settlementPriceMax: d("2"), minimumPnl: d(floor) }).holds).toBe(true);
    expect(result.executionSegments.every((segment) => !segment.quantity.isNegative() && segment.quantity.compare(segment.maximumAvailableAtSnapshot) <= 0)).toBe(true);
  });

  it("does not spend beyond a tight budget or exceed depth to repair the live geometry", async () => {
    const input = liveGeometry();
    const tooSmallBudget = await compileTerminalPayoff({ ...input, maximumAcquisitionCost: d("3.58") });
    expect(tooSmallBudget).toMatchObject({ status: "INFEASIBLE", reason: "BUDGET_TOO_LOW" });
    const nearExactBudget = await compileTerminalPayoff({ ...input, maximumAcquisitionCost: d("3.58333333333335") });
    expect(nearExactBudget.status).toBe("FEASIBLE");
    if (nearExactBudget.status === "FEASIBLE") expect(nearExactBudget.totalAcquisitionCost.add(nearExactBudget.estimatedFees).compare(d("3.58333333333335"))).toBeLessThanOrEqual(0);
    const justEnoughDepth = input.instruments.map((item, index) => index === 1 ? { ...item, noBook: { ...item.noBook, asks: [{ ...item.noBook.asks[0]!, quantity: d("0.8333333333334") }] } } : item);
    const depthBoundary = await compileTerminalPayoff({ ...input, instruments: justEnoughDepth });
    expect(depthBoundary.status).toBe("FEASIBLE");
    if (depthBoundary.status === "FEASIBLE") expect(depthBoundary.executionSegments.every((segment) => segment.quantity.compare(segment.maximumAvailableAtSnapshot) <= 0)).toBe(true);
    const shallow = input.instruments.map((item, index) => index === 1 ? { ...item, noBook: { ...item.noBook, asks: [{ ...item.noBook.asks[0]!, quantity: d("0.833333333333") }] } } : item);
    const tooShallow = await compileTerminalPayoff({ ...input, instruments: shallow });
    expect(tooShallow).toMatchObject({ status: "INFEASIBLE", reason: "INSUFFICIENT_LIQUIDITY_OR_COVERAGE" });
  });

  it("is deterministic across repeated solves and fails closed at a sub-grid budget", async () => {
    const input = liveGeometry();
    const first = await compileTerminalPayoff(input); const second = await compileTerminalPayoff(input);
    expect(first.status).toBe("FEASIBLE"); expect(second.status).toBe("FEASIBLE");
    if (first.status !== "FEASIBLE" || second.status !== "FEASIBLE") return;
    expect(first.executionSegments.map((segment) => segment.quantity.toString())).toEqual(second.executionSegments.map((segment) => segment.quantity.toString()));
    expect(first.totalAcquisitionCost.toString()).toBe(second.totalAcquisitionCost.toString());
    const budgetTight = await compileTerminalPayoff({ ...input, maximumAcquisitionCost: d("3.58333333333302") });
    expect(budgetTight.status).not.toBe("FEASIBLE");
    if (budgetTight.status === "VERIFICATION_FAILED") {
      expect(budgetTight.failureReasons).toContain("PAYOFF_FAILED");
      expect(budgetTight.exactDeficit?.toString()).toBe("0.00000000000002");
    }
  });
});

describe("exact compiler output properties", () => {
  it("independently verifies every feasible randomized construction, depth, and total cost", async () => {
    await fc.assert(fc.asyncProperty(fc.record({ priceCents: fc.integer({ min: 10, max: 90 }), depth: fc.integer({ min: 1, max: 100 }), budgetCents: fc.integer({ min: 0, max: 2000 }), floor: fc.integer({ min: -99, max: -1 }) }), async ({ priceCents, depth, budgetCents, floor }) => {
      const price = d(`${Math.floor(priceCents / 100)}.${String(priceCents % 100).padStart(2, "0")}`);
      const input = request({ constraint: { minimumTerminalPnl: d(String(floor)) }, maximumAcquisitionCost: d(`${Math.floor(budgetCents / 100)}.${String(budgetCents % 100).padStart(2, "0")}`), instruments: [instrument("15", "50", [], [[price.toString(), String(depth)]])] });
      const result = await compileTerminalPayoff(input);
      if (result.status !== "FEASIBLE") return;
      const independent = verifyTerminalPayoff(portfolioFromSegments(input, result.executionSegments), { settlementPriceMin: input.settlement.priceRange.min, settlementPriceMax: input.settlement.priceRange.max, minimumPnl: input.constraint.minimumTerminalPnl });
      expect(independent.holds).toBe(true);
      expect(result.executionSegments.every((segment) => !segment.quantity.isNegative() && segment.quantity.compare(segment.maximumAvailableAtSnapshot) <= 0)).toBe(true);
      expect(result.executionSegments.reduce((sum, segment) => sum.add(segment.acquisitionCost).add(segment.estimatedFee), d("0")).compare(input.maximumAcquisitionCost)).toBeLessThanOrEqual(0);
    }), { seed: 20261005, numRuns: 50 });
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
