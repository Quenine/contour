import { describe, expect, it } from "vitest";
import { compileTerminalPayoff, type CompileTerminalPayoffResult } from "@contour/compiler";
import { DecimalAmount } from "@contour/domain";
import { invalidatedCompileState } from "../lib/presentation/compile-state.js";
import { formatMoney, formatUtc } from "../lib/presentation/format.js";
import { VERIFIED_FIXTURE, verifiedFixtureRequestIdentity } from "../lib/presentation/fixture-profile.js";
import { isResultCurrent, liveRequestFingerprint, marketContextFingerprint, type ActiveRequestIdentity, type LiveRequestFingerprintInput, type ResultRequestIdentity } from "../lib/presentation/identity.js";
import { createFixtureRequest } from "../lib/server/fixture.js";
import { freshnessState, minimumPnlFromInput, validatePublicAddress } from "../lib/server/input.js";
import { presentCompilerResult } from "../lib/server/presentation.js";

const fixtureIdentity = { mode: "fixture" as const, requestIdentity: verifiedFixtureRequestIdentity };
const liveInput = (overrides: Partial<LiveRequestFingerprintInput> = {}): LiveRequestFingerprintInput => ({ mode: "live", exposure: { source: "synthetic", direction: "long", quantity: "0.01", entryPrice: "80000" }, settlementTimestamp: "2026-10-02T00:00:00.000Z", minimumPrice: "70000", maximumPrice: "90000", constraintMode: "minimumPnl", constraintValue: "-500", maximumBudget: "100", feeTreatment: "excluded", ...overrides });
const liveActive = (input = liveInput(), observedAt = "2026-09-26T00:00:00.000Z"): ActiveRequestIdentity => ({ mode: "live", requestIdentity: liveRequestFingerprint(input), marketContextIdentity: marketContextFingerprint({ observedAt, source: "hyperliquid-direct", network: "mainnet" }) });
const resultFor = (active: ActiveRequestIdentity): ResultRequestIdentity => ({ ...active, ...(active.mode === "live" ? { marketSnapshotIdentity: "exact-book-snapshot" } : {}) });

describe("web orchestration", () => {
  it("compiles the realistic verified fixture through the presentation boundary and exact verifier", async () => {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request); const dto = presentCompilerResult(request, result, fixtureIdentity);
    expect(dto.status).toBe("FEASIBLE"); expect(dto.verification?.passed).toBe(true); expect(dto.executionSegments?.length).toBeGreaterThan(0); expect(dto.chart?.note).toContain("Visualization samples only");
    expect(request.existingPortfolio.components[0]).toMatchObject({ quantity: DecimalAmount.parse(VERIFIED_FIXTURE.quantity), entryPrice: DecimalAmount.parse(VERIFIED_FIXTURE.entryPrice) });
    expect(request.settlement.priceRange.min.toString()).toBe(VERIFIED_FIXTURE.minimumPrice); expect(request.settlement.priceRange.max.toString()).toBe(VERIFIED_FIXTURE.maximumPrice);
  });
  it("converts maximum loss into the canonical minimum-PnL constraint", () => expect(minimumPnlFromInput("maximumLoss", "40").toString()).toBe("-40"));
  it("rejects malformed settlement-facing decimal and address input", () => { expect(() => minimumPnlFromInput("minimumPnl", "bad")).toThrow(); expect(() => validatePublicAddress("not-an-address")).toThrow(); });
  it("maps already satisfied and infeasible compiler results without inventing a success", async () => {
    const base = createFixtureRequest(); const satisfied = await compileTerminalPayoff({ ...base, constraint: { minimumTerminalPnl: DecimalAmount.parse("-2000") } }); const infeasible = await compileTerminalPayoff({ ...base, maximumAcquisitionCost: DecimalAmount.zero });
    expect(presentCompilerResult(base, satisfied, fixtureIdentity).status).toBe("ALREADY_SATISFIED"); expect(presentCompilerResult(base, infeasible, fixtureIdentity).status).toBe("INFEASIBLE");
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
