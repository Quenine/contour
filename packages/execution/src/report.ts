import type { ExecutionPlan, DryRunReport } from "./types.js";

export const dryRunWarnings = [
  "Partial-fill and multi-leg risk remains until every required leg fills.",
  "Market movement can invalidate this snapshot-bound plan; recompile before any future execution.",
  "Perpetual funding, liquidation paths, and path-dependent risk are excluded.",
  "Future close or settlement fee changes are not included."
] as const;

export function renderDryRunReport(plan: Omit<ExecutionPlan, "report">): DryRunReport {
  const lines = [
    "CONTOUR EXECUTION DRY RUN", "", `Network: ${plan.network}`, `Trust policy: ${plan.trustPolicy}`, `Underlying: ${plan.underlying}`, `Settlement: ${plan.settlementTimestamp}`,
    "", "Compiler:", "  FEASIBLE", "", "Orders:"
  ];
  for (const order of plan.orders) lines.push(
    "", `${order.sequence}.`, `  market: ${order.marketId} ${order.side.toUpperCase()}`, `  asset: ${order.protocolAssetId}`,
    `  source ask: ${order.sourcePrice.toString()}`, `  source available: ${order.sourceAvailableQuantity.toString()}`,
    `  planned limit: ${order.plannedPriceText}`, `  planned quantity: ${order.plannedQuantityText}`, `  notional: ${order.notional.toString()}`,
    `  size precision: ${order.precision.szDecimals} decimals (${order.precision.evidence.authority}: ${order.precision.evidence.source})`, `  min notional: ${order.minimumNotional.amount.toString()} ${order.minimumNotional.quoteAsset} (${order.minimumNotional.evidence.authority}: ${order.minimumNotional.evidence.source})`,
    ...(order.precision.evidence.authority === "OPERATOR_OVERRIDE" || order.minimumNotional.evidence.authority === "OPERATOR_OVERRIDE" ? ["  OPERATOR OVERRIDE: explicitly supplied for development dry-run; not protocol-discovered"] : []),
    ...(order.minimumNotional.conflicts.length ? [`  minimum-notional conflicting evidence: ${order.minimumNotional.conflicts.map((item) => `${item.authority}=${item.value} (${item.source})`).join("; ")}`] : []),
    `  builder fee: ${order.builderFee.state.toLowerCase()} (${order.builderFee.requestedRateTenthsBps})`, `  protocol fee: ${order.protocolFee.kind}`
  );
  lines.push(
    "", `Original compiled premium: ${plan.originalCompiledPremium.toString()}`, `Executable normalized premium: ${plan.executableNormalizedPremium.toString()}`, `Budget: ${plan.budget.toString()}`,
    "", "Exact post-normalization verification:", `  ${plan.verification.holds ? "PASS" : "FAIL"}`,
    `  Worst terminal PnL: ${plan.verification.worstCase.terminalPnl.toString()}`, `  Worst settlement state: ${plan.verification.worstCase.price.toString()} (${plan.verification.worstCase.position})`,
    "", `Market snapshot: ${plan.snapshot.identity}`, `Freshness: ${plan.freshness.maximumAgeMs}ms / ${plan.freshness.maximumAllowedAgeMs}ms maximum`,
    "", "Execution:", "  DRY RUN ONLY", "  NO SIGNATURE", "  NO BROADCAST", "", "Warnings:", ...dryRunWarnings.map((warning) => `  ${warning}`)
  );
  return { title: "CONTOUR EXECUTION DRY RUN", text: lines.join("\n"), warnings: dryRunWarnings, noSignature: true, noBroadcast: true };
}
