import { describe, expect, it } from "vitest";
import { formatExecutionEvidence } from "../src/evidence-format.js";

describe("execution evidence probe formatting", () => {
  it("prints provenance, empirical scope, trust readiness, and the read-only boundary", () => {
    const output = formatExecutionEvidence({
      network: "mainnet", observedAt: "2026-09-26T00:00:00.000Z", snapshotIdentity: "contour-evidence-v1:test",
      metadata: { outcomeCount: 20, precisionFieldCount: 0, spotTokenCount: 500, outcomeTokenCount: 0, outcomeMidsCount: 24, quoteTokens: ["USDC"] },
      empirical: { marketsInspected: 12, sidesInspected: 24, bookLevelsInspected: 40, tradesInspected: 20, fractionalBookSizes: 0, fractionalTradeSizes: 0, failedReads: 0 },
      sizePrecision: "UNRESOLVED", minimumNotional: { sdkValue: "1", sdkVersion: "@outcome.xyz/hip4@1.2.0-beta.1", officialEvidence: "generic $10 example; HIP-4 scope not specified", changelog: "SDK note", conflict: "$10 older guide" },
      strictMainnet: "BLOCKED", developmentDryRun: "BLOCKED_UNTIL_EXPLICIT_SIZE_PRECISION_OVERRIDE_OR_FIXTURE_METADATA", blockers: ["missing authoritative szDecimals"]
    });
    expect(output).toContain("CONTOUR EXECUTION PROTOCOL EVIDENCE");
    expect(output).toContain("Outcome markets inspected");
    expect(output).toContain("fractional sizes: NO");
    expect(output).toContain("Maintained SDK:");
    expect(output).toContain("not found in current public Info docs");
    expect(output).toContain("STRICT_MAINNET: BLOCKED");
    expect(output).toContain("NO ORDER SUBMISSION");
    expect(output).toContain("quote asset is read separately");
  });
});
