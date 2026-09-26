import fc from "fast-check";
import { beforeAll, describe, expect, it } from "vitest";
import { compileTerminalPayoff, type CompileTerminalPayoffRequest, type FeasibleResult, type ExecutableBinaryInstrument } from "@contour/compiler";
import { assetSymbol, DecimalAmount, outcomeId, UtcTimestamp, type BinaryPriceOutcome, type MarketFreshness, type OrderBookSnapshot } from "@contour/domain";
import type { PerpetualTerminalComponent } from "@contour/payoff";
import { auditExecutionPlan, executionSnapshot, knownHip4ProtocolFee, normalizeLimitPrice, normalizeSize, outcomeMetadataForRequest, planExecution, quantize, significantFigures, type ExecutionPlannerInput, type OutcomeSideProtocolMetadata, type ProtocolPrecision } from "../src/index.js";

const d = (value: string) => DecimalAmount.parse(value);
const BTC = assetSymbol("BTC"); const ETH = assetSymbol("ETH");
const settlement = UtcTimestamp.parse("2026-10-01T00:00:00Z");
const observedAt = UtcTimestamp.parse("2026-09-30T23:59:30Z");
const checkedAt = UtcTimestamp.parse("2026-10-01T00:00:00Z");
const freshness: MarketFreshness = { observedAt, source: "hyperliquid-direct", network: "mainnet" };
const knownPrecision: Extract<ProtocolPrecision, { kind: "KNOWN" }> = { kind: "KNOWN", regime: "SPOT_STYLE", szDecimals: 2, maximumPriceSignificantFigures: 5, maximumPriceDecimalPlaces: 6, source: "test metadata", observedAt };

function book(id: string, sideIndex: 0 | 1, asks: readonly [string, string][]): OrderBookSnapshot {
  return { outcomeId: outcomeId(id), sideIndex, coin: `#${10n * BigInt(id) + BigInt(sideIndex)}`, bids: [], asks: asks.map(([price, quantity]) => ({ price: d(price), quantity: d(quantity), orderCount: 1 })), freshness };
}
function instrument(id: string, threshold: string, noQuantity: string, noPrice = "0.1"): ExecutableBinaryInstrument {
  const marketId = outcomeId(id);
  const market: BinaryPriceOutcome = { kind: "binaryPrice", id: marketId, underlying: BTC, settlementAt: settlement, threshold: d(threshold), comparator: "greaterThan", yesSide: "yes", noSide: "no", sourceName: "execution fixture", freshness,
    protocol: { outcomeId: marketId, yesCoin: `#${10n * BigInt(id)}`, noCoin: `#${10n * BigInt(id) + 1n}`, yesAssetId: `${100_000_000n + 10n * BigInt(id)}`, noAssetId: `${100_000_001n + 10n * BigInt(id)}` } };
  return { market, yesBook: book(id, 0, [["0.8", "100"]]), noBook: book(id, 1, [[noPrice, noQuantity]]) };
}
function request(budget = "100"): CompileTerminalPayoffRequest {
  const existing: PerpetualTerminalComponent = { kind: "perpetual", asset: BTC, direction: "long", quantity: d("1"), entryPrice: d("100"), externalTerms: "excluded" };
  return { existingPortfolio: { components: [existing] }, settlement: { underlying: BTC, timestamp: settlement, priceRange: { min: d("0"), max: d("100") } }, constraint: { minimumTerminalPnl: d("-40") }, maximumAcquisitionCost: d(budget),
    instruments: [instrument("1", "25", "30"), instrument("2", "50", "30"), instrument("3", "75", "40")], policy: { maximumBookAgeMs: 60_000, compilationTime: checkedAt, feeModel: { kind: "excluded" } } };
}

let baseRequest: CompileTerminalPayoffRequest; let feasible: FeasibleResult;
beforeAll(async () => { baseRequest = request(); const result = await compileTerminalPayoff(baseRequest); if (result.status !== "FEASIBLE") throw new Error(`fixture must compile FEASIBLE, got ${result.status}`); feasible = result; });

function metadata(req = baseRequest, szDecimals = 2): readonly OutcomeSideProtocolMetadata[] { return outcomeMetadataForRequest(req, { precision: { kind: "KNOWN", szDecimals, source: "deterministic execution fixture" }, observedAt }); }
function input(overrides: Partial<ExecutionPlannerInput> = {}): ExecutionPlannerInput {
  const snapshot = executionSnapshot(baseRequest);
  return { request: baseRequest, compilerResult: feasible, requestIdentity: "execution-test-request-v1", compilerSnapshotIdentity: snapshot.identity, protocolMetadata: metadata(), protocolFee: knownHip4ProtocolFee(observedAt), checkedAt, maximumBookAgeMs: 45_000, ...overrides };
}

describe("protocol decimal normalization", () => {
  it("rounds exact decimal quantities in either explicit direction", () => { expect(quantize(d("1.239"), 2, "DOWN").toString()).toBe("1.23"); expect(quantize(d("1.231"), 2, "UP").toString()).toBe("1.24"); });
  it("strips trailing zeroes from size strings", () => expect(normalizeSize(d("12.3400"), 3, "DOWN").text).toBe("12.34"));
  it("enforces five significant figures", () => { const value = normalizeLimitPrice(d("0.1234567"), knownPrecision, "BUY"); expect(value.text).toBe("0.12346"); expect(significantFigures(value.value)).toBeLessThanOrEqual(5); });
  it("enforces the spot maximum decimal rule", () => expect(normalizeLimitPrice(d("0.00000123456"), knownPrecision, "BUY").text).toBe("0.000002"));
  it("rounds a BUY limit up, never below its source ask", () => { const source = d("0.1234567"); expect(normalizeLimitPrice(source, knownPrecision, "BUY").value.compare(source)).toBeGreaterThanOrEqual(0); });
  it("allows protocol-valid integer prices irrespective of significant figures", () => expect(normalizeLimitPrice(d("123456"), knownPrecision, "BUY").text).toBe("123456"));
});

describe("execution planner", () => {
  it("creates a READY plan only after nontrivial size adjustment and exact re-verification", () => {
    const result = planExecution(input()); expect(result.status).toBe("READY");
    if (result.status === "READY") { expect(result.plan.orders.some((order, index) => order.plannedQuantity.compare(feasible.executionSegments[index]?.quantity ?? order.plannedQuantity) !== 0)).toBe(true); expect(result.plan.verification.holds).toBe(true); expect(result.plan.executableNormalizedPremium.compare(result.plan.budget)).toBeLessThanOrEqual(0); }
  });
  it("keeps every normalized order inside its referenced depth segment", () => { const result = planExecution(input()); if (result.status === "READY") expect(result.plan.orders.every((order) => order.plannedQuantity.compare(order.sourceAvailableQuantity) <= 0)).toBe(true); });
  it("blocks when rounding up would exceed the referenced segment capacity", () => {
    const target = feasible.executionSegments.find((segment) => segment.marketId === "3")!;
    const tightRequest = { ...baseRequest, instruments: baseRequest.instruments.map((item) => item.market.id === "3" ? { ...item, noBook: { ...item.noBook, asks: item.noBook.asks.map((level, index) => index === target.bookLevel ? { ...level, quantity: target.quantity } : level) } } : item) };
    const tightResult = { ...feasible, executionSegments: feasible.executionSegments.map((segment) => segment.marketId === "3" ? { ...segment, maximumAvailableAtSnapshot: segment.quantity } : segment) };
    expect(planExecution(input({ request: tightRequest, compilerResult: tightResult, compilerSnapshotIdentity: executionSnapshot(tightRequest).identity, protocolMetadata: metadata(tightRequest) })).status).toBe("INSUFFICIENT_CURRENT_DEPTH");
  });
  it("passes the known one-USDC maintained-SDK minimum notional", () => { const result = planExecution(input()); if (result.status === "READY") expect(result.plan.orders.every((order) => order.notional.compare(d("1")) >= 0)).toBe(true); });
  it("fails a minimum notional that cannot fit in current depth", () => {
    const highMinimum = metadata().map((item) => ({ ...item, minimumNotional: { kind: "KNOWN" as const, amount: d("100"), quoteAsset: "USDC", protocolEnforced: true, source: "test", observedAt } }));
    expect(planExecution(input({ protocolMetadata: highMinimum })).status).toBe("MIN_NOTIONAL_VIOLATION");
  });
  it("blocks when minimum-notional metadata is unknown", () => {
    const unknown = metadata().map((item) => ({ ...item, minimumNotional: { kind: "UNAVAILABLE" as const, source: "test", observedAt, explanation: "not published" } }));
    expect(planExecution(input({ protocolMetadata: unknown })).status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
  });
  it("blocks when outcome size precision is unavailable", () => {
    const unknown = outcomeMetadataForRequest(baseRequest, { precision: { kind: "UNAVAILABLE", source: "live outcomeMeta", explanation: "outcomeMeta omits szDecimals" }, observedAt });
    expect(planExecution(input({ protocolMetadata: unknown })).status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
  });
  it("accepts a fresh snapshot and rejects a stale one with an explicit age", () => {
    expect(planExecution(input()).status).toBe("READY"); const result = planExecution(input({ maximumBookAgeMs: 10_000 })); expect(result.status).toBe("STALE_MARKET");
    if (result.status === "STALE_MARKET") expect(result.blockers[0]).toMatchObject({ kind: "STALE_MARKET", ageMs: 30_000, maximumAllowedAgeMs: 10_000 });
  });
  it("rejects compiler snapshot identity mismatch and a changed current book", () => {
    expect(planExecution(input({ compilerSnapshotIdentity: "wrong" })).status).toBe("MARKET_CHANGED");
    expect(planExecution(input({ currentSnapshotIdentity: "refetched-and-changed" })).status).toBe("MARKET_CHANGED");
  });
  it("independently rejects a selected market with another underlying", () => {
    const changed = { ...baseRequest, instruments: baseRequest.instruments.map((item, index) => index === 0 ? { ...item, market: { ...item.market, underlying: ETH } } : item) };
    expect(planExecution(input({ request: changed, compilerSnapshotIdentity: executionSnapshot(changed).identity, protocolMetadata: metadata(changed) })).status).toBe("INVALID_COMPILER_RESULT");
  });
  it("independently rejects a selected market with another settlement", () => {
    const other = UtcTimestamp.parse("2026-10-02T00:00:00Z"); const changed = { ...baseRequest, instruments: baseRequest.instruments.map((item, index) => index === 0 ? { ...item, market: { ...item.market, settlementAt: other } } : item) };
    expect(planExecution(input({ request: changed, compilerSnapshotIdentity: executionSnapshot(changed).identity, protocolMetadata: metadata(changed) })).status).toBe("INVALID_COMPILER_RESULT");
  });
  it("rejects a compiler result whose exact verification was corrupted", () => { const corrupted = { ...feasible, verification: { ...feasible.verification, holds: false } }; expect(planExecution(input({ compilerResult: corrupted })).status).toBe("INVALID_COMPILER_RESULT"); });
  it("rejects a deliberately corrupted READY plan by independently reconstructing it", () => { const result = planExecution(input()); if (result.status !== "READY") throw new Error("fixture plan must be ready"); const first = result.plan.orders[0]!; const corrupted = { ...result.plan, orders: [{ ...first, plannedQuantity: DecimalAmount.zero, plannedQuantityText: "0", notional: DecimalAmount.zero }, ...result.plan.orders.slice(1)] }; expect(auditExecutionPlan(baseRequest, corrupted).passed).toBe(false); });
  it("proves that naive rounding down invalidates the fixture payoff", () => { const result = planExecution(input()); if (result.status !== "READY") throw new Error("fixture plan must be ready"); const orders = result.plan.orders.map((order) => order.marketId === "3" ? { ...order, plannedQuantity: d("16.66"), plannedQuantityText: "16.66", notional: d("1.666") } : order); expect(auditExecutionPlan(baseRequest, { ...result.plan, orders }).passed).toBe(false); });
  it("blocks unsupported nonzero builder-fee semantics instead of guessing", () => expect(planExecution(input({ builderFee: { requestedRateTenthsBps: 1 } })).status).toBe("FEE_UNRESOLVED"));
  it("defaults builder fees to disabled zero and uses documented zero outcome protocol fees", () => { const result = planExecution(input()); if (result.status === "READY") { expect(result.plan.orders.every((order) => order.builderFee.state === "DISABLED" && order.builderFee.requestedRateTenthsBps === 0)).toBe(true); expect(result.plan.orders.every((order) => order.protocolFee.kind === "KNOWN_ZERO_OUTCOME_MARKET")).toBe(true); } });
  it("blocks unresolved protocol fee treatment", () => expect(planExecution(input({ protocolFee: { kind: "UNKNOWN", explanation: "no authoritative classification", settlementFeeIncluded: false } })).status).toBe("FEE_UNRESOLVED"));
  it("keeps cheapest-price, numeric-market sequencing and plan identity deterministic", () => { const first = planExecution(input()); const second = planExecution(input()); expect(first.status).toBe("READY"); expect(second.status).toBe("READY"); if (first.status === "READY" && second.status === "READY") { expect(first.plan.identity).toBe(second.plan.identity); expect(first.plan.orders.map((order) => order.marketId)).toEqual(["1", "2", "3"]); } });
  it("reports NOT_NEEDED for an already-satisfied compiler result", async () => { const satisfiedRequest = { ...baseRequest, constraint: { minimumTerminalPnl: d("-100") } }; const result = await compileTerminalPayoff(satisfiedRequest); expect(planExecution(input({ request: satisfiedRequest, compilerResult: result, compilerSnapshotIdentity: executionSnapshot(satisfiedRequest).identity, protocolMetadata: metadata(satisfiedRequest) })).status).toBe("NOT_NEEDED"); });
  it("rejects rounding when the adjusted plan exceeds the exact budget", () => expect(planExecution(input({ request: { ...baseRequest, maximumAcquisitionCost: feasible.totalAcquisitionCost }, compilerSnapshotIdentity: executionSnapshot({ ...baseRequest, maximumAcquisitionCost: feasible.totalAcquisitionCost }).identity })).status).toBe("ROUNDING_INVALIDATED_PAYOFF"));
  it("binds the dry-run report to no signature and no broadcast", () => { const result = planExecution(input()); if (result.status === "READY") expect(result.plan.report).toMatchObject({ noSignature: true, noBroadcast: true, title: "CONTOUR EXECUTION DRY RUN" }); });
});

describe("READY invariant property", () => {
  it("every reported READY plan passes exact post-normalization verification", () => {
    fc.assert(fc.property(fc.integer({ min: 2, max: 4 }), (decimals) => { const result = planExecution(input({ protocolMetadata: metadata(baseRequest, decimals) })); if (result.status === "READY") { expect(result.plan.verification.holds).toBe(true); expect(result.plan.executableNormalizedPremium.compare(result.plan.budget)).toBeLessThanOrEqual(0); expect(result.plan.orders.every((order) => order.plannedQuantity.scale <= decimals)).toBe(true); } }), { seed: 20261003, numRuns: 20 });
  });
});
