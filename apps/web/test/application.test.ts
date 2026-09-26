import { describe, expect, it } from "vitest";
import { compileTerminalPayoff, type CompileTerminalPayoffResult } from "@contour/compiler";
import { DecimalAmount } from "@contour/domain";
import { createFixtureRequest } from "../lib/server/fixture.js";
import { freshnessState, minimumPnlFromInput, validatePublicAddress } from "../lib/server/input.js";
import { presentCompilerResult } from "../lib/server/presentation.js";

describe("web orchestration", () => {
  it("compiles the verified fixture through the presentation boundary", async () => {
    const request = createFixtureRequest(); const result = await compileTerminalPayoff(request); const dto = presentCompilerResult(request, result);
    expect(dto.status).toBe("FEASIBLE"); expect(dto.verification?.passed).toBe(true); expect(dto.executionSegments?.length).toBeGreaterThan(0); expect(dto.chart?.note).toContain("Visualization samples only");
  });
  it("converts maximum loss into the canonical minimum-PnL constraint", () => expect(minimumPnlFromInput("maximumLoss", "40").toString()).toBe("-40"));
  it("rejects malformed settlement-facing decimal and address input", () => { expect(() => minimumPnlFromInput("minimumPnl", "bad")).toThrow(); expect(() => validatePublicAddress("not-an-address")).toThrow(); });
  it("maps already satisfied and infeasible compiler results without inventing a success", async () => {
    const base = createFixtureRequest();
    const satisfied = await compileTerminalPayoff({ ...base, constraint: { minimumTerminalPnl: DecimalAmount.parse("-100") } });
    const infeasible = await compileTerminalPayoff({ ...base, maximumAcquisitionCost: DecimalAmount.zero });
    expect(presentCompilerResult(base, satisfied).status).toBe("ALREADY_SATISFIED");
    expect(presentCompilerResult(base, infeasible).status).toBe("INFEASIBLE");
  });
  it("maps verification failure as a persistent non-success presentation", () => {
    const request = createFixtureRequest();
    const failed: CompileTerminalPayoffResult = { status: "VERIFICATION_FAILED", underlying: request.settlement.underlying, settlementTimestamp: request.settlement.timestamp, requestedPriceRange: request.settlement.priceRange, minimumTerminalPnl: request.constraint.minimumTerminalPnl, maximumAcquisitionCost: request.maximumAcquisitionCost, explanation: "exact verifier rejected reconstructed candidate", executionSegments: [], diagnostics: { solver: "HiGHS 1.15", solverStatus: "Optimal", solverFeasibilityTolerance: "1e-7 (solver only)", candidateDecimalPlaces: 12, exactPostSolveVerification: true } };
    expect(presentCompilerResult(request, failed)).toMatchObject({ status: "VERIFICATION_FAILED", explanation: "exact verifier rejected reconstructed candidate" });
  });
  it("maps freshness without relying on chart samples for verification", () => {
    expect(freshnessState("2026-01-01T00:00:00.000Z", 1, Date.parse("2026-01-01T00:00:00.001Z"))).toBe("LIVE");
    expect(freshnessState("2026-01-01T00:00:00.000Z", 1, Date.parse("2026-01-01T00:00:00.002Z"))).toBe("STALE");
    expect(freshnessState(undefined, 1)).toBe("UNAVAILABLE");
  });
});
