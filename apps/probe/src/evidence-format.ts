export interface ExecutionEvidenceSummary {
  readonly network: "mainnet" | "testnet";
  readonly observedAt: string;
  readonly snapshotIdentity: string;
  readonly metadata: { readonly outcomeCount: number; readonly precisionFieldCount: number; readonly spotTokenCount: number; readonly outcomeTokenCount: number; readonly outcomeMidsCount: number; readonly quoteTokens: readonly string[] };
  readonly empirical: { readonly marketsInspected: number; readonly sidesInspected: number; readonly bookLevelsInspected: number; readonly tradesInspected: number; readonly fractionalBookSizes: number; readonly fractionalTradeSizes: number; readonly failedReads: number };
  readonly sizePrecision: "UNRESOLVED";
  readonly minimumNotional: { readonly sdkValue: string; readonly sdkVersion: string; readonly officialEvidence: string; readonly changelog: string; readonly conflict: string };
  readonly strictMainnet: "BLOCKED";
  readonly developmentDryRun: string;
  readonly blockers: readonly string[];
}

export function formatExecutionEvidence(summary: ExecutionEvidenceSummary): string {
  return [
    "CONTOUR EXECUTION PROTOCOL EVIDENCE", "", `Network: ${summary.network}`, `Observed: ${summary.observedAt}`, `Evidence snapshot: ${summary.snapshotIdentity}`,
    "", "Outcome precision", "-----------------", "Official outcomeMeta field: NOT PROVIDED (outcome and sideSpecs expose no szDecimals)",
    `Other official metadata: spotMeta tokens=${summary.metadata.spotTokenCount}; outcome-named (+...) tokens=${summary.metadata.outcomeTokenCount}; outcome coins in allMids=${summary.metadata.outcomeMidsCount}; observed outcomeMeta quoteToken(s)=${summary.metadata.quoteTokens.join(", ") || "none"}; no outcome-side precision field`,
    "Maintained SDK behavior: strips trailing zeroes and applies price/minimum-notional checks; does not derive szDecimals or validate quantity decimal places",
    `Empirical L2 observations: Outcome markets inspected: ${summary.empirical.marketsInspected}; ${summary.empirical.sidesInspected} sides, ${summary.empirical.bookLevelsInspected} levels; fractional sizes: ${summary.empirical.fractionalBookSizes ? "YES" : "NO"}`,
    `Empirical trade observations: ${summary.empirical.tradesInspected} trades via a read-only recentTrades Info query (not found in current public Info docs); fractional sizes: ${summary.empirical.fractionalTradeSizes ? "YES" : "NO"}; ${summary.empirical.failedReads} read failures`,
    `Public balance/position size representations: NOT QUERIED (user-address-scoped endpoint; no address supplied)`,
    "Resolved szDecimals: UNRESOLVED", "Trust status: empirical integer-only data is observation, not protocol metadata",
    "", "Minimum notional", "----------------", `Official documentation: ${summary.minimumNotional.officialEvidence}`, `Maintained SDK: $${summary.minimumNotional.sdkValue} notional stated by ${summary.minimumNotional.sdkVersion} (quote asset is read separately from live metadata)`,
    `SDK version/commit: ${summary.minimumNotional.sdkVersion}`, `Changelog evidence: ${summary.minimumNotional.changelog}`, `Conflicting sources: ${summary.minimumNotional.conflict}`,
    "Resolved value: UNRESOLVED for HIP-4; official generic example may or may not apply, while the maintained SDK says $1", "Trust status: HIP-4 applicability is unconfirmed; insufficient for STRICT_MAINNET",
    "", "Mainnet readiness", "-----------------", `STRICT_MAINNET: ${summary.strictMainnet}`, `DEVELOPMENT_DRY_RUN: ${summary.developmentDryRun}`, "Blockers:", ...summary.blockers.map((blocker) => `- ${blocker}`),
    "", "Safety: READ-ONLY INFO QUERIES ONLY · NO SIGNATURE · NO ORDER SUBMISSION · NO FUNDS"
  ].join("\n");
}
