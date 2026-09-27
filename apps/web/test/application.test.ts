import { afterEach, describe, expect, it, vi } from "vitest";
import { compileTerminalPayoff, type CompileTerminalPayoffResult } from "@contour/compiler";
import { DecimalAmount } from "@contour/domain";
import { invalidatedCompileState } from "../lib/presentation/compile-state.js";
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

const fixtureIdentity = { mode: "fixture" as const, requestIdentity: verifiedFixtureRequestIdentity };
const liveInput = (overrides: Partial<LiveRequestFingerprintInput> = {}): LiveRequestFingerprintInput => ({ mode: "live", exposure: { source: "synthetic", direction: "long", quantity: "0.01", entryPrice: "80000" }, settlementTimestamp: "2026-10-02T00:00:00.000Z", minimumPrice: "70000", maximumPrice: "90000", constraintMode: "minimumPnl", constraintValue: "-500", maximumBudget: "100", feeTreatment: "excluded", ...overrides });
const liveActive = (input = liveInput(), observedAt = "2026-09-26T00:00:00.000Z"): ActiveRequestIdentity => ({ mode: "live", requestIdentity: liveRequestFingerprint(input), marketContextIdentity: marketContextFingerprint({ observedAt, source: "hyperliquid-direct", network: "mainnet" }) });
const resultFor = (active: ActiveRequestIdentity): ResultRequestIdentity => ({ ...active, ...(active.mode === "live" ? { marketSnapshotIdentity: "exact-book-snapshot" } : {}) });

describe("web orchestration", () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });
  it("compiles the realistic verified fixture through the presentation boundary and exact verifier", async () => {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request); const dto = presentCompilerResult(request, result, fixtureIdentity);
    expect(dto.status).toBe("FEASIBLE"); expect(dto.verification?.passed).toBe(true); expect(dto.executionSegments?.length).toBeGreaterThan(0); expect(dto.chart?.note).toContain("Visualization samples only");
    expect(request.existingPortfolio.components[0]).toMatchObject({ quantity: DecimalAmount.parse(VERIFIED_FIXTURE.quantity), entryPrice: DecimalAmount.parse(VERIFIED_FIXTURE.entryPrice) });
    expect(request.settlement.priceRange.min.toString()).toBe(VERIFIED_FIXTURE.minimumPrice); expect(request.settlement.priceRange.max.toString()).toBe(VERIFIED_FIXTURE.maximumPrice);
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
  it("maps verification failure as a persistent non-success presentation", () => {
    const request = createFixtureRequest(); const failed: CompileTerminalPayoffResult = { status: "VERIFICATION_FAILED", underlying: request.settlement.underlying, settlementTimestamp: request.settlement.timestamp, requestedPriceRange: request.settlement.priceRange, minimumTerminalPnl: request.constraint.minimumTerminalPnl, maximumAcquisitionCost: request.maximumAcquisitionCost, explanation: "exact verifier rejected reconstructed candidate", executionSegments: [], diagnostics: { solver: "HiGHS 1.15", solverStatus: "Optimal", solverFeasibilityTolerance: "1e-7 (solver only)", candidateDecimalPlaces: 12, exactPostSolveVerification: true } };
    expect(presentCompilerResult(request, failed, fixtureIdentity)).toMatchObject({ status: "VERIFICATION_FAILED", explanation: "exact verifier rejected reconstructed candidate" });
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
  it("does not render a compiled chart/result when its request identity mismatches", () => {
    const original = liveActive(); const changed = liveActive(liveInput({ maximumPrice: "91000" })); expect(isResultCurrent(resultFor(original), changed)).toBe(false);
  });
});

describe("presentation boundaries", () => {
  it("formats money without changing the exact financial value", () => { const exact = "-39.9999999999997"; expect(formatMoney(exact)).toBe("-$40.00"); expect(exact).toBe("-39.9999999999997"); });
  it("formats UTC timestamps deterministically", () => expect(formatUtc("2026-10-01T00:00:00.000Z")).toBe("Oct 1, 2026 · 00:00 UTC"));
});
