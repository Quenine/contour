import type { CompilationDto } from "./types";

export function payoffChartEmptyState(result: CompilationDto | undefined): string {
  if (!result) return "Awaiting a verified construction.";
  if (result.status === "ALREADY_SATISFIED") return "No construction required. The current position already meets this target.";
  if (result.status === "INFEASIBLE") return "No verified construction was found for this request.";
  if (result.status === "VERIFICATION_FAILED") return "A candidate could not pass exact proof.";
  if (result.status === "SOLVER_FAILURE") return "Compilation did not complete successfully.";
  if (result.status === "INVALID_REQUEST") return "A valid request is required before compilation.";
  return "The verified payoff chart is unavailable for this result.";
}
