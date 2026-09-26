import { DecimalAmount, UtcTimestamp } from "@contour/domain";
import type { ExecutionTrustPolicy, EvidenceAuthority, ProtocolRuleEvidence } from "./types.js";

const rank: Record<EvidenceAuthority, number> = {
  FIXTURE: 0,
  SECONDARY_DOCUMENTATION: 1,
  EMPIRICAL_LIVE_OBSERVATION: 2,
  MAINTAINED_SDK: 3,
  OPERATOR_OVERRIDE: 4,
  OFFICIAL_DOCUMENTATION: 5,
  LIVE_PROTOCOL_METADATA: 6
};

export interface EvidenceResolution<T> {
  readonly status: "UNRESOLVED" | "RESOLVED" | "CONFLICT";
  readonly selected?: ProtocolRuleEvidence<T>;
  readonly conflicts: readonly ProtocolRuleEvidence<T>[];
}

function stable(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stable).join(",")}]`;
  if (value !== null && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
    return `{${entries.map(([key, item]) => `${JSON.stringify(key)}:${stable(item)}`).join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}

/** Content identity omits no fields and is stable across object insertion order. */
export function evidenceSnapshotIdentity(snapshot: unknown): string {
  const canonical = stable(snapshot);
  let hash = 0xcbf29ce484222325n;
  for (const byte of new TextEncoder().encode(canonical)) hash = BigInt.asUintN(64, (hash ^ BigInt(byte)) * 0x100000001b3n);
  return `contour-evidence-v1:fnv1a64:${hash.toString(16).padStart(16, "0")}`;
}

/** Resolve by authority without discarding weaker contradictory observations. */
export function resolveEvidence<T>(items: readonly ProtocolRuleEvidence<T>[]): EvidenceResolution<T> {
  if (items.length === 0) return { status: "UNRESOLVED", conflicts: [] };
  const topRank = Math.max(...items.map((item) => rank[item.authority]));
  const top = items.filter((item) => rank[item.authority] === topRank);
  const key = (value: T): string => JSON.stringify(value, (_key, current: unknown) => current instanceof DecimalAmount ? current.toString() : current);
  const distinct = new Set(top.map((item) => key(item.value)));
  if (distinct.size > 1) return { status: "CONFLICT", conflicts: top };
  const selected = top[0]!;
  return { status: "RESOLVED", selected, conflicts: items.filter((item) => key(item.value) !== key(selected.value)) };
}

export function evidenceSatisfiesPolicy(evidence: ProtocolRuleEvidence<unknown>, policy: ExecutionTrustPolicy): boolean {
  if (evidence.authority === "OFFICIAL_DOCUMENTATION") return (evidence.network === "mainnet" || evidence.network === "not-applicable") && /hip-?4|outcome/i.test(evidence.applicability) && !/does not identify|not (?:explicitly )?(?:scoped|specific|applicable)|applicability (?:is )?(?:unclear|unspecified|unknown)/i.test(evidence.applicability);
  if (evidence.authority === "LIVE_PROTOCOL_METADATA") return evidence.network === "mainnet" || policy === "DEVELOPMENT_DRY_RUN";
  if (policy === "STRICT_MAINNET") return false;
  return evidence.authority === "MAINTAINED_SDK" || evidence.authority === "OPERATOR_OVERRIDE" || evidence.authority === "FIXTURE";
}

export interface ExplicitOperatorOverrides {
  readonly enabled: true;
  readonly trustPolicy: "DEVELOPMENT_DRY_RUN";
  readonly szDecimals?: number;
  readonly minimumNotional?: string;
  readonly evidence: readonly ProtocolRuleEvidence<string | number>[];
}

/** Overrides are deliberately opt-in and require the development policy variable. */
export function readOperatorOverrides(environment: Readonly<Record<string, string | undefined>>, observedAt = UtcTimestamp.fromEpochMilliseconds(Date.now())): ExplicitOperatorOverrides | undefined {
  const szRaw = environment.CONTOUR_OUTCOME_SZ_DECIMALS;
  const minimumRaw = environment.CONTOUR_MIN_NOTIONAL;
  if (szRaw === undefined && minimumRaw === undefined) return undefined;
  if (environment.CONTOUR_EXECUTION_TRUST_POLICY !== "DEVELOPMENT_DRY_RUN") throw new Error("execution overrides require CONTOUR_EXECUTION_TRUST_POLICY=DEVELOPMENT_DRY_RUN");
  const evidence: ProtocolRuleEvidence<string | number>[] = [];
  let szDecimals: number | undefined;
  let minimumNotional: string | undefined;
  if (szRaw !== undefined) {
    if (!/^(0|[1-8])$/.test(szRaw)) throw new Error("CONTOUR_OUTCOME_SZ_DECIMALS must be an integer from 0 to 8");
    szDecimals = Number(szRaw);
    evidence.push({ value: szDecimals, authority: "OPERATOR_OVERRIDE", source: "CONTOUR_OUTCOME_SZ_DECIMALS", observedAt, network: "mainnet", applicability: "operator-supplied development dry-run only; not protocol-discovered", confidence: "operator-supplied" });
  }
  if (minimumRaw !== undefined) {
    const parsed = DecimalAmount.parse(minimumRaw);
    if (parsed.compare(DecimalAmount.zero) <= 0) throw new Error("CONTOUR_MIN_NOTIONAL must be positive");
    minimumNotional = parsed.toString();
    evidence.push({ value: minimumNotional, authority: "OPERATOR_OVERRIDE", source: "CONTOUR_MIN_NOTIONAL", observedAt, network: "mainnet", applicability: "operator-supplied development dry-run only; not protocol-discovered", confidence: "operator-supplied" });
  }
  return { enabled: true, trustPolicy: "DEVELOPMENT_DRY_RUN", ...(szDecimals === undefined ? {} : { szDecimals }), ...(minimumNotional === undefined ? {} : { minimumNotional }), evidence };
}

export function evidence<T>(value: T, details: Omit<ProtocolRuleEvidence<T>, "value">): ProtocolRuleEvidence<T> {
  return { value, ...details };
}
