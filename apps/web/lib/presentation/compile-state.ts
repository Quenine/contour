export type CompileProgress = "not compiled" | "inputs changed";

/** Shared transition used for compiler-affecting edits and mode changes. */
export function invalidatedCompileState(progress: CompileProgress = "inputs changed"): { readonly progress: CompileProgress; readonly result: undefined; readonly error: undefined } {
  return { progress, result: undefined, error: undefined };
}
