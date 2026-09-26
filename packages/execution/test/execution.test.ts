import fc from "fast-check";
import { beforeAll, describe, expect, it } from "vitest";
import { compileTerminalPayoff, type CompileTerminalPayoffRequest, type FeasibleResult, type ExecutableBinaryInstrument } from "@contour/compiler";
import { assetSymbol, DecimalAmount, outcomeId, UtcTimestamp, type BinaryPriceOutcome, type MarketFreshness, type OrderBookSnapshot } from "@contour/domain";
import type { PerpetualTerminalComponent } from "@contour/payoff";
import { auditExecutionPlan, evidence, evidenceSnapshotIdentity, evidenceSatisfiesPolicy, executionSnapshot, knownHip4ProtocolFee, normalizeLimitPrice, normalizeSize, outcomeMetadataForRequest, parseMaintainedSdkMinimumNotional, planExecution, quantize, readOperatorOverrides, resolveEvidence, significantFigures, type ExecutionPlannerInput, type OutcomeSideProtocolMetadata, type ProtocolPrecision } from "../src/index.js";

const d = (value: string) => DecimalAmount.parse(value);
const BTC = assetSymbol("BTC"); const ETH = assetSymbol("ETH");
const settlement = UtcTimestamp.parse("2026-10-01T00:00:00Z");
const observedAt = UtcTimestamp.parse("2026-09-30T23:59:30Z");
const checkedAt = UtcTimestamp.parse("2026-10-01T00:00:00Z");
const freshness: MarketFreshness = { observedAt, source: "hyperliquid-direct", network: "mainnet" };
const knownPrecision: Extract<ProtocolPrecision, { kind: "KNOWN" }> = { kind: "KNOWN", regime: "SPOT_STYLE", szDecimals: 2, maximumPriceSignificantFigures: 5, maximumPriceDecimalPlaces: 6, evidence: evidence(2, { authority: "FIXTURE", source: "test metadata", observedAt, network: "fixture", applicability: "test only", confidence: "fixture" }) };

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
  return { request: baseRequest, compilerResult: feasible, requestIdentity: "execution-test-request-v1", compilerSnapshotIdentity: snapshot.identity, protocolMetadata: metadata(), protocolFee: knownHip4ProtocolFee(observedAt), checkedAt, maximumBookAgeMs: 45_000, trustPolicy: "DEVELOPMENT_DRY_RUN", ...overrides };
}

describe("protocol decimal normalization", () => {
  it("rounds exact decimal quantities in either explicit direction", () => { expect(quantize(d("1.239"), 2, "DOWN").toString()).toBe("1.23"); expect(quantize(d("1.231"), 2, "UP").toString()).toBe("1.24"); });
  it("strips trailing zeroes from size strings", () => expect(normalizeSize(d("12.3400"), 3, "DOWN").text).toBe("12.34"));
  it("enforces five significant figures", () => { const value = normalizeLimitPrice(d("0.1234567"), knownPrecision, "BUY"); expect(value.text).toBe("0.12346"); expect(significantFigures(value.value)).toBeLessThanOrEqual(5); });
  it("enforces the spot maximum decimal rule", () => expect(normalizeLimitPrice(d("0.00000123456"), knownPrecision, "BUY").text).toBe("0.000002"));
  it("rounds a BUY limit up, never below its source ask", () => { const source = d("0.1234567"); expect(normalizeLimitPrice(source, knownPrecision, "BUY").value.compare(source)).toBeGreaterThanOrEqual(0); });
  it("allows protocol-valid integer prices irrespective of significant figures", () => expect(normalizeLimitPrice(d("123456"), knownPrecision, "BUY").text).toBe("123456"));
});

describe("execution protocol evidence", () => {
  it("uses authority ranking while retaining contradictory weaker evidence", () => {
    const sdk = evidence("1", { authority: "MAINTAINED_SDK", source: "sdk", observedAt, network: "mainnet", applicability: "sdk", confidence: "maintained" });
    const secondary = evidence("10", { authority: "SECONDARY_DOCUMENTATION", source: "old guide", observedAt, network: "not-applicable", applicability: "historical", confidence: "observed" });
    const resolution = resolveEvidence([secondary, sdk]);
    expect(resolution.status).toBe("RESOLVED"); expect(resolution.selected).toBe(sdk); expect(resolution.conflicts).toEqual([secondary]);
  });
  it("preserves a same-authority contradiction as a conflict", () => {
    const a = evidence("1", { authority: "MAINTAINED_SDK", source: "sdk-a", observedAt, network: "mainnet", applicability: "test", confidence: "maintained" });
    const b = evidence("10", { authority: "MAINTAINED_SDK", source: "sdk-b", observedAt, network: "mainnet", applicability: "test", confidence: "maintained" });
    expect(resolveEvidence([a, b])).toMatchObject({ status: "CONFLICT", conflicts: [a, b] });
  });
  it("lets official evidence outrank contradictory secondary material", () => {
    const official = evidence("1", { authority: "OFFICIAL_DOCUMENTATION", source: "official", observedAt, network: "mainnet", applicability: "protocol", confidence: "authoritative" });
    const secondary = evidence("10", { authority: "SECONDARY_DOCUMENTATION", source: "old guide", observedAt, network: "not-applicable", applicability: "historical", confidence: "observed" });
    expect(resolveEvidence([secondary, official])).toMatchObject({ status: "RESOLVED", selected: official, conflicts: [secondary] });
  });
  it("does not treat a generic official $10 order example as HIP-4-applicable evidence", () => {
    const generic = evidence("10", { authority: "OFFICIAL_DOCUMENTATION", source: "generic order endpoint example", observedAt, network: "not-applicable", applicability: "generic exchange example; does not identify HIP-4 or outcome assets", confidence: "authoritative" });
    expect(evidenceSatisfiesPolicy(generic, "STRICT_MAINNET")).toBe(false);
  });
  it("rejects maintained-SDK-only precision under strict mainnet", () => {
    const sdkOnly = outcomeMetadataForRequest(baseRequest, { precision: { kind: "KNOWN", szDecimals: 0, source: "maintained SDK", authority: "MAINTAINED_SDK", network: "mainnet" }, observedAt });
    const result = planExecution(input({ protocolMetadata: sdkOnly, trustPolicy: "STRICT_MAINNET" }));
    expect(result.status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
    if (result.status === "PROTOCOL_METADATA_UNAVAILABLE") expect(result.blockers[0]).toMatchObject({ field: "precision" });
  });
  it("rejects maintained-SDK-only minimum notional under strict mainnet even with official live precision", () => {
    const livePrecisionOnly = outcomeMetadataForRequest(baseRequest, { precision: { kind: "KNOWN", szDecimals: 2, source: "mainnet outcome-side metadata", authority: "LIVE_PROTOCOL_METADATA", network: "mainnet" }, observedAt });
    const result = planExecution(input({ protocolMetadata: livePrecisionOnly, trustPolicy: "STRICT_MAINNET" }));
    expect(result.status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
    if (result.status === "PROTOCOL_METADATA_UNAVAILABLE") expect(result.blockers[0]).toMatchObject({ field: "minimumNotional" });
  });
  it("rejects empirical-only precision under strict mainnet and development dry-run", () => {
    const empirical = evidence(0, { authority: "EMPIRICAL_LIVE_OBSERVATION", source: "integer observed sizes", observedAt, network: "mainnet", applicability: "sample only", confidence: "observed" });
    expect(evidenceSatisfiesPolicy(empirical, "STRICT_MAINNET")).toBe(false);
    expect(evidenceSatisfiesPolicy(empirical, "DEVELOPMENT_DRY_RUN")).toBe(false);
    const empiricalMetadata = outcomeMetadataForRequest(baseRequest, { precision: { kind: "KNOWN", szDecimals: 0, source: empirical.source, authority: empirical.authority, network: "mainnet" }, observedAt });
    expect(planExecution(input({ protocolMetadata: empiricalMetadata, trustPolicy: "STRICT_MAINNET" })).status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
  });
  it("does not transfer testnet metadata authority to strict mainnet", () => {
    const testnetMetadata = evidence(0, { authority: "LIVE_PROTOCOL_METADATA", source: "testnet spotMeta", observedAt, network: "testnet", applicability: "testnet asset mapping", confidence: "authoritative" });
    expect(evidenceSatisfiesPolicy(testnetMetadata, "STRICT_MAINNET")).toBe(false);
    expect(evidenceSatisfiesPolicy(testnetMetadata, "DEVELOPMENT_DRY_RUN")).toBe(true);
  });
  it("blocks testnet book snapshots under strict-mainnet policy", () => {
    const testnetRequest = { ...baseRequest, instruments: baseRequest.instruments.map((instrument) => ({ ...instrument, market: { ...instrument.market, freshness: { ...instrument.market.freshness, network: "testnet" as const } }, yesBook: { ...instrument.yesBook, freshness: { ...instrument.yesBook.freshness, network: "testnet" as const } }, noBook: { ...instrument.noBook, freshness: { ...instrument.noBook.freshness, network: "testnet" as const } } })) };
    const snapshot = executionSnapshot(testnetRequest);
    expect(planExecution(input({ request: testnetRequest, protocolMetadata: metadata(testnetRequest), compilerSnapshotIdentity: snapshot.identity, trustPolicy: "STRICT_MAINNET" })).status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
  });
  it("accepts a visible, explicitly configured precision override only in development dry-run", () => {
    const overrides = readOperatorOverrides({ CONTOUR_EXECUTION_TRUST_POLICY: "DEVELOPMENT_DRY_RUN", CONTOUR_OUTCOME_SZ_DECIMALS: "0", CONTOUR_MIN_NOTIONAL: "1" }, observedAt);
    expect(overrides?.evidence.every((item) => item.authority === "OPERATOR_OVERRIDE")).toBe(true);
    const operatorMetadata = outcomeMetadataForRequest(baseRequest, { precision: { kind: "UNAVAILABLE", source: "outcomeMeta", explanation: "szDecimals not present" }, observedAt, operatorOverrides: overrides });
    const result = planExecution(input({ protocolMetadata: operatorMetadata, trustPolicy: "DEVELOPMENT_DRY_RUN" }));
    expect(result.status).toBe("READY");
    if (result.status === "READY") expect(result.plan.report.text).toContain("OPERATOR OVERRIDE: explicitly supplied");
    expect(planExecution(input({ protocolMetadata: operatorMetadata, trustPolicy: "STRICT_MAINNET" })).status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
  });
  it("has no default operator override and refuses values without explicit dry-run policy", () => {
    expect(readOperatorOverrides({}, observedAt)).toBeUndefined();
    expect(() => readOperatorOverrides({ CONTOUR_OUTCOME_SZ_DECIMALS: "0" }, observedAt)).toThrow(/require CONTOUR_EXECUTION_TRUST_POLICY/);
  });
  it("models current SDK minimum notional as SDK evidence and retains the $10 conflict", () => {
    const min = metadata()[0]!.minimumNotional;
    expect(min).toMatchObject({ kind: "KNOWN", amount: d("1"), evidence: { authority: "MAINTAINED_SDK", value: "1" } });
    if (min.kind === "KNOWN") {
      expect(min.conflicts.some((item) => item.authority === "OFFICIAL_DOCUMENTATION" && item.value === "10" && item.applicability.includes("does not identify HIP-4"))).toBe(true);
      expect(min.conflicts.some((item) => item.authority === "SECONDARY_DOCUMENTATION" && item.value === "10")).toBe(true);
    }
  });
  it("parses and labels the maintained SDK minimum-notional constant without network access", () => {
    expect(parseMaintainedSdkMinimumNotional("export const MIN_NOTIONAL = 1;", observedAt, "sdk source fixture")).toMatchObject({ value: "1", authority: "MAINTAINED_SDK", source: "sdk source fixture" });
    expect(parseMaintainedSdkMinimumNotional("export const MIN_NOTIONAL = 10;", observedAt, "older source fixture")?.value).toBe("10");
    expect(parseMaintainedSdkMinimumNotional("export const FLOOR = 1;", observedAt)).toBeUndefined();
  });
  it("does not infer szDecimals from an empirical integer-only observation", () => {
    const empiricalSize = evidence("integer-only", { authority: "EMPIRICAL_LIVE_OBSERVATION", source: "L2 and recentTrades", observedAt, network: "mainnet", applicability: "observed sample", confidence: "observed" });
    expect(resolveEvidence([empiricalSize])).toMatchObject({ status: "RESOLVED" });
    expect(evidenceSatisfiesPolicy(empiricalSize, "DEVELOPMENT_DRY_RUN")).toBe(false);
    expect(outcomeMetadataForRequest(baseRequest, { precision: { kind: "UNAVAILABLE", source: empiricalSize.source, explanation: "observation is not lot metadata" }, observedAt })[0]!.precision.kind).toBe("UNAVAILABLE");
  });
  it("keeps live strict plans blocked while fixture READY is unaffected", () => {
    expect(planExecution(input({ protocolMetadata: metadata().map((item) => ({ ...item, precision: { kind: "UNAVAILABLE" as const, source: "live outcomeMeta", observedAt, explanation: "authoritative szDecimals absent" } })), trustPolicy: "STRICT_MAINNET" })).status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
    expect(planExecution(input()).status).toBe("READY");
  });
  it("creates deterministic evidence snapshot identities independent of object-key order", () => {
    const first = evidenceSnapshotIdentity({ network: "mainnet", observed: { books: 4, trades: 9 } });
    expect(evidenceSnapshotIdentity({ observed: { trades: 9, books: 4 }, network: "mainnet" })).toBe(first);
    expect(evidenceSnapshotIdentity({ network: "mainnet", observed: { books: 5, trades: 9 } })).not.toBe(first);
  });
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
    const highMinimum = metadata().map((item) => { if (item.minimumNotional.kind !== "KNOWN") throw new Error("test metadata requires a known threshold"); return { ...item, minimumNotional: { ...item.minimumNotional, amount: d("100"), evidence: { ...item.minimumNotional.evidence, value: "100", source: "test" }, conflicts: [] } }; });
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
