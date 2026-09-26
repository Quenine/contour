export function StatusPill({ value }: { readonly value: string }): React.JSX.Element {
  const tone = value === "FEASIBLE" || value === "READY" || value === "LIVE" || value === "ALREADY_SATISFIED" || value === "NOT_NEEDED" ? "good" : value === "INFEASIBLE" || value === "STALE" || value === "STALE_MARKET" ? "warn" : value === "UNAVAILABLE" || value === "INVALID_REQUEST" || value === "VERIFICATION_FAILED" || value === "SOLVER_FAILURE" || value.endsWith("UNAVAILABLE") || value.includes("VIOLATION") || value.includes("INVALIDATED") || value === "MARKET_CHANGED" || value === "FEE_UNRESOLVED" || value === "INVALID_COMPILER_RESULT" ? "bad" : "neutral";
  return <span className={`status-pill ${tone}`}>{value.replaceAll("_", " ")}</span>;
}
