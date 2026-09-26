export function StatusPill({ value }: { readonly value: string }): React.JSX.Element {
  const tone = value === "FEASIBLE" || value === "LIVE" || value === "ALREADY_SATISFIED" ? "good" : value === "INFEASIBLE" || value === "STALE" ? "warn" : value === "UNAVAILABLE" || value === "INVALID_REQUEST" || value === "VERIFICATION_FAILED" || value === "SOLVER_FAILURE" ? "bad" : "neutral";
  return <span className={`status-pill ${tone}`}>{value.replaceAll("_", " ")}</span>;
}
