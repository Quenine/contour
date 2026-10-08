import { afterEach, describe, expect, it, vi } from "vitest";
import { compileTerminalPayoff, type CompileTerminalPayoffResult } from "@contour/compiler";
import type { CompilationDto } from "../lib/presentation/types.js";
import { DecimalAmount } from "@contour/domain";
import { verifyTerminalPayoff } from "@contour/payoff";
import { invalidatedCompileState } from "../lib/presentation/compile-state.js";
import { apiErrorMessage } from "../lib/presentation/api-error.js";
import { formatMoney, formatUtc } from "../lib/presentation/format.js";
import { VERIFIED_FIXTURE, verifiedFixtureRequestIdentity } from "../lib/presentation/fixture-profile.js";
import { isResultCurrent, liveRequestFingerprint, marketContextFingerprint, type ActiveRequestIdentity, type LiveRequestFingerprintInput, type ResultRequestIdentity } from "../lib/presentation/identity.js";
import { createFixtureRequest } from "../lib/server/fixture.js";
import { freshnessState, minimumPnlFromInput, parseLiveCompileInput, validatePublicAddress } from "../lib/server/input.js";
import { limitPublicRequest, readJsonBounded } from "../lib/server/http.js";
import { createBuildIdentity } from "../lib/server/build-identity.js";
import { healthPayload } from "../lib/server/health.js";
import { upstreamMessage, upstreamStatus } from "../lib/server/observability.js";
import { NetworkFailure } from "@contour/hyperliquid";
import { planLiveExecution } from "../lib/server/execution.js";
import { executionSnapshot } from "@contour/execution";
import { presentCompilerResult } from "../lib/server/presentation.js";
import { planFixtureExecution } from "../lib/server/execution.js";
import { payoffChartEmptyState } from "../lib/presentation/payoff-chart-state.js";

const fixtureIdentity = { mode: "fixture" as const, requestIdentity: verifiedFixtureRequestIdentity };
const liveInput = (overrides: Partial<LiveRequestFingerprintInput> = {}): LiveRequestFingerprintInput => ({ mode: "live", exposure: { source: "synthetic", direction: "long", quantity: "0.01", entryPrice: "80000" }, settlementTimestamp: "2026-10-02T00:00:00.000Z", minimumPrice: "70000", maximumPrice: "90000", constraintMode: "minimumPnl", constraintValue: "-500", maximumBudget: "100", feeTreatment: "excluded", ...overrides });
const liveActive = (input = liveInput(), observedAt = "2026-09-26T00:00:00.000Z"): ActiveRequestIdentity => ({ mode: "live", requestIdentity: liveRequestFingerprint(input), marketContextIdentity: marketContextFingerprint({ observedAt, source: "hyperliquid-direct", network: "mainnet" }) });
const resultFor = (active: ActiveRequestIdentity): ResultRequestIdentity => ({ ...active, ...(active.mode === "live" ? { marketSnapshotIdentity: "exact-book-snapshot" } : {}) });
const liveCompileBody = (marketContextIdentity: string) => ({ settlementTimestamp: "2026-10-02T00:00:00.000Z", minimumPrice: "55000", maximumPrice: "85000", constraintMode: "maximumLoss", constraintValue: "100", maximumBudget: "400", marketContextIdentity, exposure: { source: "synthetic", direction: "long", quantity: "0.01", entryPrice: "84757" } });

describe("web orchestration", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
  it("compiles the realistic verified fixture through the presentation boundary and exact verifier", async () => {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request); const dto = presentCompilerResult(request, result, fixtureIdentity);
    expect(dto.status).toBe("FEASIBLE"); expect(dto.verification?.passed).toBe(true); expect(dto.executionSegments?.length).toBeGreaterThan(0); expect(dto.chart?.note).toContain("Visualization samples only");
    expect(request.existingPortfolio.components[0]).toMatchObject({ quantity: DecimalAmount.parse(VERIFIED_FIXTURE.quantity), entryPrice: DecimalAmount.parse(VERIFIED_FIXTURE.entryPrice) });
    expect(request.settlement.priceRange.min.toString()).toBe(VERIFIED_FIXTURE.minimumPrice); expect(request.settlement.priceRange.max.toString()).toBe(VERIFIED_FIXTURE.maximumPrice);
  });
  it("keeps the fixture initial state uncompiled and allows deterministic reruns", async () => {
    expect(payoffChartEmptyState(undefined)).toBe("Awaiting a verified construction.");
    const request = createFixtureRequest();
    const first = await compileTerminalPayoff(request); const second = await compileTerminalPayoff(request);
    expect(first.status).toBe("FEASIBLE"); expect(second.status).toBe("FEASIBLE");
    expect(first.status === "FEASIBLE" && second.status === "FEASIBLE" ? second.executionSegments.map((segment) => segment.quantity.toString()) : []).toEqual(first.status === "FEASIBLE" ? first.executionSegments.map((segment) => segment.quantity.toString()) : []);
  });
  it.each([
    ["ALREADY_SATISFIED", "No construction required. The current position already meets this target."],
    ["INFEASIBLE", "No verified construction was found for this request."],
    ["VERIFICATION_FAILED", "A candidate could not pass exact proof."],
    ["SOLVER_FAILURE", "Compilation did not complete successfully."]
  ] as const)("uses state-aware payoff copy for %s", (status, message) => {
    const result = { mode: "live" as const, requestIdentity: "request", status, freshness: [] } as CompilationDto;
    expect(payoffChartEmptyState(result)).toBe(message);
    expect(payoffChartEmptyState(result)).not.toContain("Awaiting");
  });
  it("keeps the feasible payoff chart path and clears the presentation state on input invalidation", async () => {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request); const dto = presentCompilerResult(request, result, fixtureIdentity);
    expect(dto.status).toBe("FEASIBLE"); expect(dto.chart?.points.length).toBeGreaterThan(0); expect(dto.chart?.note).toContain("Visualization samples only");
    expect(invalidatedCompileState()).toEqual({ progress: "inputs changed", result: undefined, error: undefined });
  });
  it("attaches a READY, identity-bound dry-run preview to the feasible fixture", async () => {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request); const execution = planFixtureExecution(request, result, verifiedFixtureRequestIdentity); const dto = presentCompilerResult(request, result, fixtureIdentity, execution);
    expect(execution.status).toBe("READY"); expect(dto.executionPreview).toMatchObject({ status: "READY", verificationPassed: true }); expect(dto.executionPreview?.orders?.some((order) => order.quantity.includes("."))).toBe(true);
  });
  it("converts maximum loss into the canonical minimum-PnL constraint", () => expect(minimumPnlFromInput("maximumLoss", "40").toString()).toBe("-40"));
  it("rejects malformed settlement-facing decimal and address input", () => { expect(() => minimumPnlFromInput("minimumPnl", "bad")).toThrow(); expect(() => validatePublicAddress("not-an-address")).toThrow(); });
  it("validates the complete public live-compile request rather than trusting a type cast", () => {
    const parsed = parseLiveCompileInput({ settlementTimestamp: "2026-10-02T00:00:00.000Z", minimumPrice: "70000", maximumPrice: "90000", constraintMode: "minimumPnl", constraintValue: "-500", maximumBudget: "100", marketContextIdentity: "context", exposure: { source: "synthetic", direction: "long", quantity: "0.01", entryPrice: "80000" } });
    expect(parsed.exposure.source).toBe("synthetic");
    expect(() => parseLiveCompileInput({ exposure: { source: "account", address: "nope", positionIndex: 0 } })).toThrow();
    expect(() => parseLiveCompileInput({ settlementTimestamp: "2026-10-02T00:00:00.000Z", minimumPrice: "70000", maximumPrice: "90000", constraintMode: "minimumPnl", constraintValue: "-500", maximumBudget: "100", marketContextIdentity: "context", exposure: { source: "synthetic", direction: "long", quantity: "x".repeat(81), entryPrice: "80000" } })).toThrow();
  });
  it("accepts a generated compact market-context identity and rejects values over the public bound", () => {
    const identity = marketContextFingerprint({ observedAt: "2026-10-02T00:00:00.000Z", source: "hyperliquid-direct", network: "mainnet" });
    expect(identity.length).toBeLessThanOrEqual(128);
    expect(parseLiveCompileInput(liveCompileBody(identity)).marketContextIdentity).toBe(identity);
    expect(() => parseLiveCompileInput(liveCompileBody("x".repeat(129)))).toThrow();
  });
  it("returns safe API error text and validation issues instead of hiding them", () => {
    expect(apiErrorMessage({ error: "Live compile failed safely" })).toBe("Live compile failed safely");
    expect(apiErrorMessage({ issues: ["market context is stale"] })).toBe("market context is stale");
    expect(apiErrorMessage({ issues: [null, "quantity is invalid"] })).toBe("quantity is invalid");
    expect(apiErrorMessage({ error: 42, issues: "malformed" })).toBe("request failed");
  });
  it("rejects oversized and non-JSON public request bodies", async () => {
    await expect(readJsonBounded(new Request("https://contour.invalid", { method: "POST", headers: { "content-type": "text/plain" }, body: "{}" }))).rejects.toThrow("content-type");
    await expect(readJsonBounded(new Request("https://contour.invalid", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ data: "x".repeat(64) }) }), 32)).rejects.toThrow("too large");
  });
  it("applies a bounded fixed-window request limit with a retry hint", () => {
    const request = new Request("https://contour.invalid/api/live/compile", { headers: { "x-real-ip": "198.51.100.24" } });
    expect(limitPublicRequest(request, "test-rate-guard", 1, 1_000, 0)).toBeUndefined();
    const rejected = limitPublicRequest(request, "test-rate-guard", 1, 1_000, 100);
    expect(rejected?.status).toBe(429);
    expect(rejected?.headers.get("retry-after")).toBe("1");
    expect(limitPublicRequest(request, "test-rate-guard", 1, 1_000, 1_000)).toBeUndefined();
  });
  it("separates application availability from a degraded external provider", () => {
    const degraded = healthPayload("degraded", createBuildIdentity("1234567890abcdef"));
    expect(degraded).toMatchObject({ status: "ok", liveData: "degraded", compiler: "available", verifier: "available", build: { revision: "1234567890ab" } });
  });
  it("produces a stable, non-secret public build identity", () => {
    expect(createBuildIdentity("abcdef1234567890")).toEqual({ build: "BUILD 04", revision: "abcdef123456" });
    expect(createBuildIdentity("a-private-build-label").revision).toBe("deployment");
  });
  it("maps upstream failures to safe public responses without leaking exception messages", () => {
    const error = new NetworkFailure("provider echoed address 0x1234567890123456789012345678901234567890");
    expect(upstreamStatus(error)).toBe(502);
    expect(upstreamMessage(error)).not.toContain("0x123456");
    expect(upstreamStatus(new Error("unexpected internal exception"))).toBe(500);
  });
  it("keeps strict live execution blocked while fixture execution remains a deterministic dry run", async () => {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request);
    expect(planFixtureExecution(request, result, verifiedFixtureRequestIdentity).status).toBe("READY");
    const blocked = planLiveExecution(request, result, "live-request", request.policy.compilationTime);
    expect(blocked.status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
    const dto = presentCompilerResult(request, result, { mode: "live", requestIdentity: "live-request", marketSnapshotIdentity: executionSnapshot(request).identity }, blocked);
    expect(dto.executionPreview?.status).toBe("PROTOCOL_METADATA_UNAVAILABLE");
    expect(dto.executionPreview?.blockers?.some((blocker) => blocker.kind === "PROTOCOL_METADATA_UNAVAILABLE")).toBe(true);
  });
  it("runs the verified fixture without calling the protocol when live fetches are unavailable", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request);
    expect(result.status).toBe("FEASIBLE");
    expect(planFixtureExecution(request, result, verifiedFixtureRequestIdentity).status).toBe("READY");
  });
  it("maps already satisfied and infeasible compiler results without inventing a success", async () => {
    const base = createFixtureRequest(); const satisfied = await compileTerminalPayoff({ ...base, constraint: { minimumTerminalPnl: DecimalAmount.parse("-2000") } }); const infeasible = await compileTerminalPayoff({ ...base, maximumAcquisitionCost: DecimalAmount.zero });
    expect(presentCompilerResult(base, satisfied, fixtureIdentity).status).toBe("ALREADY_SATISFIED"); expect(presentCompilerResult(base, infeasible, fixtureIdentity).status).toBe("INFEASIBLE");
    const liveInfeasible = presentCompilerResult(base, infeasible, { mode: "live", requestIdentity: "live", marketSnapshotIdentity: executionSnapshot(base).identity });
    expect(liveInfeasible.liveMarketDiagnostics).toMatchObject({ eligibleMarkets: 3, eligibleMarketIds: ["101", "102", "103"], yesAskLevels: 3, noAskLevels: 4 });
  });
  it("builds the feasible payoff summary from exact server verification rather than chart samples", async () => {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request); const dto = presentCompilerResult(request, result, fixtureIdentity);
    expect(dto.status).toBe("FEASIBLE");
    expect(dto.riskSummary).toMatchObject({ existingExposure: { direction: "long", quantity: VERIFIED_FIXTURE.quantity, entryPrice: VERIFIED_FIXTURE.entryPrice }, existingWorstCasePnl: "-1400", target: { mode: "minimumPnl", value: VERIFIED_FIXTURE.minimumTerminalPnl }, selectedPositionCount: 3, executionSegmentCount: 3 });
    expect(dto.riskSummary?.compiledWorstCasePnl).toBe(dto.verification?.worstCasePnl);
    expect(dto.riskSummary?.improvement).toBe("600.0000000000003");
    expect(dto.chart?.note).toContain("Visualization samples only");
  });
  it("presents maximum loss as an exact target while retaining the canonical minimum PnL", async () => {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request); const dto = presentCompilerResult(request, result, { ...fixtureIdentity, targetPresentation: "maximumLoss" });
    expect(dto.riskSummary?.target).toEqual({ mode: "maximumLoss", value: "800", minimumPnl: "-800" });
  });
  it("summarizes short exposure and a one-position construction from server values", async () => {
    const request = createFixtureRequest(); const shortRequest = { ...request, existingPortfolio: { components: [{ ...request.existingPortfolio.components[0]!, direction: "short" as const }] }, constraint: { minimumTerminalPnl: DecimalAmount.parse("-540") }, maximumAcquisitionCost: DecimalAmount.parse("500"), instruments: [request.instruments[1]!] };
    const result = await compileTerminalPayoff(shortRequest); const dto = presentCompilerResult(shortRequest, result, fixtureIdentity);
    expect(dto.status).toBe("FEASIBLE"); expect(dto.riskSummary?.existingExposure?.direction).toBe("short"); expect(dto.riskSummary?.selectedPositionCount).toBe(1); expect(dto.selectedPositions?.[0]?.outcomeExplanation).toContain("YES benefits");
  });
  it("keeps exact risk context for already-satisfied and infeasible states", async () => {
    const request = createFixtureRequest(); const satisfied = await compileTerminalPayoff({ ...request, constraint: { minimumTerminalPnl: DecimalAmount.parse("-2000") } }); const infeasible = await compileTerminalPayoff({ ...request, maximumAcquisitionCost: DecimalAmount.zero });
    const satisfiedDto = presentCompilerResult(request, satisfied, fixtureIdentity); const infeasibleDto = presentCompilerResult(request, infeasible, fixtureIdentity);
    expect(satisfiedDto.riskSummary).toMatchObject({ existingWorstCasePnl: "-1400", selectedPositionCount: 0 }); expect(satisfiedDto.acquisitionCost).toBe("0");
    expect(infeasibleDto.riskSummary).toMatchObject({ existingWorstCasePnl: "-1400", target: { minimumPnl: "-800" } }); expect(infeasibleDto.infeasibility?.reason).toBe("BUDGET_TOO_LOW");
  });
  it("maps verification failure as a persistent non-success presentation", () => {
    const request = createFixtureRequest(); const verification = verifyTerminalPayoff(request.existingPortfolio, { settlementPriceMin: request.settlement.priceRange.min, settlementPriceMax: request.settlement.priceRange.max, minimumPnl: request.constraint.minimumTerminalPnl });
    const deficit = request.constraint.minimumTerminalPnl.subtract(verification.worstCase.terminalPnl);
    const failed: CompileTerminalPayoffResult = { status: "VERIFICATION_FAILED", underlying: request.settlement.underlying, settlementTimestamp: request.settlement.timestamp, requestedPriceRange: request.settlement.priceRange, minimumTerminalPnl: request.constraint.minimumTerminalPnl, maximumAcquisitionCost: request.maximumAcquisitionCost, failureReasons: ["PAYOFF_FAILED"], exactDeficit: deficit, verification, explanation: "exact verifier rejected reconstructed candidate", executionSegments: [], diagnostics: { solver: "HiGHS 1.15", solverStatus: "Optimal", solverFeasibilityTolerance: "1e-7 (solver only)", candidateDecimalPlaces: 12, repairMaximumDecimalPlaces: 15, exactPostSolveVerification: true } };
    expect(presentCompilerResult(request, failed, fixtureIdentity)).toMatchObject({ status: "VERIFICATION_FAILED", explanation: "exact verifier rejected reconstructed candidate", verificationFailure: { reasons: ["PAYOFF_FAILED"], worstCasePnl: verification.worstCase.terminalPnl.toString(), requestedFloor: request.constraint.minimumTerminalPnl.toString(), exactDeficit: deficit.toString() } });
  });
  it("maps freshness without relying on chart samples for verification", () => {
    expect(freshnessState("2026-01-01T00:00:00.000Z", 1, Date.parse("2026-01-01T00:00:00.001Z"))).toBe("LIVE"); expect(freshnessState("2026-01-01T00:00:00.000Z", 1, Date.parse("2026-01-01T00:00:00.002Z"))).toBe("STALE"); expect(freshnessState(undefined, 1)).toBe("UNAVAILABLE");
  });
});

describe("compile result identity and invalidation", () => {
  it("invalidates fixture results on Fixture-to-Live switch and live results on Live-to-Fixture switch", () => {
    const live = liveActive(); expect(isResultCurrent(resultFor(fixtureIdentity), live)).toBe(false); expect(isResultCurrent(resultFor(live), fixtureIdentity)).toBe(false);
  });
  it.each(["quantity", "entry price", "settlement", "protected range", "PnL constraint", "budget"])("invalidates a result when %s changes", (field) => {
    const original = liveInput(); const active = liveActive(original);
    const changed = field === "quantity" ? liveInput({ exposure: { source: "synthetic", direction: "long", quantity: "0.02", entryPrice: "80000" } }) : field === "entry price" ? liveInput({ exposure: { source: "synthetic", direction: "long", quantity: "0.01", entryPrice: "81000" } }) : field === "settlement" ? liveInput({ settlementTimestamp: "2026-10-03T00:00:00.000Z" }) : field === "protected range" ? liveInput({ minimumPrice: "71000" }) : field === "PnL constraint" ? liveInput({ constraintValue: "-501" }) : liveInput({ maximumBudget: "101" });
    expect(isResultCurrent(resultFor(active), liveActive(changed))).toBe(false);
  });
  it("clears the result and a settlement validation error as soon as valid input changes", () => {
    expect(invalidatedCompileState()).toEqual({ progress: "inputs changed", result: undefined, error: undefined });
  });
  it("does not allow INVALID_REQUEST or INFEASIBLE states to coexist with an old feasible construction", () => {
    const prior = resultFor(liveActive()); const changed = liveActive(liveInput({ maximumBudget: "0" }));
    expect(isResultCurrent(prior, changed)).toBe(false);
  });
  it("creates deterministic fingerprints, changes them for material inputs, and excludes display-only labels", () => {
    const first = liveRequestFingerprint(liveInput()); const second = liveRequestFingerprint(liveInput());
    expect(first).toBe(second); expect(first).not.toBe(liveRequestFingerprint(liveInput({ maximumBudget: "101" })));
    expect(first).toBe(liveRequestFingerprint({ ...liveInput() }));
  });
  it("creates a compact deterministic market-context identity from freshness inputs only", () => {
    const context = { observedAt: "2026-10-02T00:00:00.000Z", source: "hyperliquid-direct", network: "mainnet" };
    const first = marketContextFingerprint(context);
    expect(first).toBe(marketContextFingerprint(context));
    expect(first).toMatch(/^contour-market-context-v2:[0-9a-f]{16}$/);
    expect(first.length).toBeLessThanOrEqual(128);
    expect(first).not.toBe(marketContextFingerprint({ ...context, observedAt: "2026-10-02T00:00:01.000Z" }));
    expect(first).not.toBe(marketContextFingerprint({ ...context, network: "testnet" }));
    expect(first).not.toBe(marketContextFingerprint({ ...context, source: "other-source" }));
    expect(first).toBe(marketContextFingerprint({ ...context, state: "STALE", displayLabel: "changed" }));
  });
  it("keeps a result current when its generated compact live context identity is unchanged", () => {
    const context = { observedAt: "2026-10-02T00:00:00.000Z", source: "hyperliquid-direct", network: "mainnet" };
    const active: ActiveRequestIdentity = { mode: "live", requestIdentity: liveRequestFingerprint(liveInput()), marketContextIdentity: marketContextFingerprint(context) };
    expect(isResultCurrent(resultFor(active), { ...active })).toBe(true);
    expect(isResultCurrent(resultFor(active), { ...active, marketContextIdentity: marketContextFingerprint({ ...context, observedAt: "2026-10-02T00:00:01.000Z" }) })).toBe(false);
  });
  it("does not render a compiled chart/result when its request identity mismatches", () => {
    const original = liveActive(); const changed = liveActive(liveInput({ maximumPrice: "91000" })); expect(isResultCurrent(resultFor(original), changed)).toBe(false);
  });
});

describe("presentation boundaries", () => {
  it("formats money without changing the exact financial value", () => { const exact = "-39.9999999999997"; expect(formatMoney(exact)).toBe("-$40.00"); expect(exact).toBe("-39.9999999999997"); });
  it("formats UTC timestamps deterministically", () => expect(formatUtc("2026-10-01T00:00:00.000Z")).toBe("Oct 1, 2026 · 00:00 UTC"));
});
