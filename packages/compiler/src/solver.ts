import highsModule, { type Highs, type LegacyHighsSolution } from "highs";
import { buildLinearProgram, type ValidatedProblem } from "./model.js";

// highs publishes dual CJS/ESM runtime entries; this cast bridges TypeScript's
// NodeNext interop view to the package's declared default loader signature.
const loadHighs = highsModule as unknown as () => Promise<Highs>;
let runtime: Promise<Highs> | undefined;
const loadRuntime = () => runtime ??= loadHighs();

export type SolveOutcome =
  | { readonly kind: "optimal"; readonly result: LegacyHighsSolution }
  | { readonly kind: "infeasible"; readonly status: string }
  | { readonly kind: "failure"; readonly status: string; readonly message: string };

export async function solveProblem(problem: ValidatedProblem, includeBudget: boolean): Promise<SolveOutcome> {
  try {
    const highs = await loadRuntime();
    const result = highs.solve(buildLinearProgram(problem, includeBudget), {
      output_flag: false,
      solver: "simplex",
      primal_feasibility_tolerance: 1e-7,
      dual_feasibility_tolerance: 1e-7
    });
    if (result.Status === "Optimal") return { kind: "optimal", result };
    if (result.Status === "Infeasible" || result.Status === "Primal infeasible or unbounded") return { kind: "infeasible", status: result.Status };
    return { kind: "failure", status: result.Status, message: "HiGHS did not prove an optimal solution or infeasibility" };
  } catch (error) {
    return { kind: "failure", status: "exception", message: error instanceof Error ? error.message : "unknown solver exception" };
  }
}
