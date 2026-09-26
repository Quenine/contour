export type CompileMode = "fixture" | "live";

export interface LiveRequestFingerprintInput {
  readonly mode: "live";
  readonly exposure: { readonly source: "synthetic"; readonly direction: "long" | "short"; readonly quantity: string; readonly entryPrice: string } | { readonly source: "account"; readonly address: string; readonly positionIndex: number };
  readonly settlementTimestamp: string;
  readonly minimumPrice: string;
  readonly maximumPrice: string;
  readonly constraintMode: "minimumPnl" | "maximumLoss";
  readonly constraintValue: string;
  readonly maximumBudget: string;
  readonly feeTreatment: "excluded";
}

export interface ActiveRequestIdentity {
  readonly mode: CompileMode;
  readonly requestIdentity: string;
  readonly marketContextIdentity?: string;
}

export interface ResultRequestIdentity extends ActiveRequestIdentity {
  readonly marketSnapshotIdentity?: string;
}

function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(Object.entries(value).sort(([left], [right]) => left.localeCompare(right)).map(([key, entry]) => [key, canonicalize(entry)]));
  }
  return value;
}

/** Deterministic identity for compiler-affecting request data; display-only fields are deliberately absent. */
export function compileRequestFingerprint(input: LiveRequestFingerprintInput | { readonly mode: "fixture"; readonly fixtureVersion: string }): string {
  return `contour-request-v1:${JSON.stringify(canonicalize(input))}`;
}

export function liveRequestFingerprint(input: LiveRequestFingerprintInput): string {
  return compileRequestFingerprint(input);
}

export function marketContextFingerprint(freshness: { readonly observedAt?: string; readonly source?: string; readonly network?: string } | undefined): string {
  return `contour-market-context-v1:${JSON.stringify(canonicalize(freshness ?? {}))}`;
}

export function marketSnapshotFingerprint(snapshots: readonly { readonly marketId: string; readonly side: "yes" | "no"; readonly observedAt: string; readonly source: string; readonly network: string }[]): string {
  return `contour-market-snapshot-v1:${JSON.stringify(canonicalize(snapshots))}`;
}

export function isResultCurrent(result: ResultRequestIdentity | undefined, active: ActiveRequestIdentity): boolean {
  return result?.mode === active.mode && result.requestIdentity === active.requestIdentity && (active.mode !== "live" || result.marketContextIdentity === active.marketContextIdentity);
}
