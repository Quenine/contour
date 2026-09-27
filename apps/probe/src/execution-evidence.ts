import { UtcTimestamp } from "@contour/domain";
import { evidenceSnapshotIdentity, readOperatorOverrides } from "@contour/execution";
import { formatExecutionEvidence } from "./evidence-format.js";

const INFO = "https://api.hyperliquid.xyz/info";
const observedAt = UtcTimestamp.fromEpochMilliseconds(Date.now());
const READ_TIMEOUT_MS = 8_000;

class EvidenceReadError extends Error {
  constructor(readonly category: "Timeout" | "Http" | "Network" | "InvalidPayload", message: string) { super(message); this.name = "EvidenceReadError"; }
}

async function info<T>(body: Readonly<Record<string, unknown>>): Promise<T> {
  const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), READ_TIMEOUT_MS);
  try {
    const response = await fetch(INFO, { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body), cache: "no-store", signal: controller.signal });
    if (!response.ok) throw new EvidenceReadError("Http", `Hyperliquid info ${String(body.type)}: HTTP ${response.status}`);
    try { return await response.json() as T; } catch { throw new EvidenceReadError("InvalidPayload", `Hyperliquid info ${String(body.type)} returned invalid JSON`); }
  } catch (error) {
    if (error instanceof EvidenceReadError) throw error;
    if (controller.signal.aborted) throw new EvidenceReadError("Timeout", `Hyperliquid info ${String(body.type)} exceeded ${READ_TIMEOUT_MS}ms`);
    throw new EvidenceReadError("Network", `Hyperliquid info ${String(body.type)} failed`);
  } finally { clearTimeout(timeout); }
}

interface OutcomeRow { readonly outcome: number; readonly description?: string; readonly sideSpecs?: readonly Readonly<Record<string, unknown>>[]; readonly [key: string]: unknown }
interface OutcomeMeta { readonly outcomes: readonly OutcomeRow[] }
interface SpotMeta { readonly tokens: readonly { readonly name: string; readonly szDecimals?: number }[] }
interface BookLevel { readonly sz: string }
interface Book { readonly levels: readonly (readonly BookLevel[])[] }
interface Trade { readonly sz: string }

function expiryFromDescription(description: string): number | undefined {
  const match = /(?:time|expiry):(\d{8})-(\d{4})/.exec(description);
  if (!match) return undefined;
  const date = match[1]!; const time = match[2]!;
  return Date.UTC(Number(date.slice(0, 4)), Number(date.slice(4, 6)) - 1, Number(date.slice(6, 8)), Number(time.slice(0, 2)), Number(time.slice(2, 4)));
}

function broadSample(outcomes: readonly OutcomeRow[], now: number): readonly OutcomeRow[] {
  const grouped = new Map<string, OutcomeRow[]>();
  for (const outcome of outcomes) {
    if (!outcome.description || (expiryFromDescription(outcome.description) ?? 0) <= now) continue;
    const underlying = /(?:perp|underlying):([^|]+)/.exec(outcome.description)?.[1] ?? "other";
    grouped.set(underlying, [...(grouped.get(underlying) ?? []), outcome]);
  }
  for (const group of grouped.values()) group.sort((a, b) => a.outcome - b.outcome);
  const selected: OutcomeRow[] = [];
  while (selected.length < 20 && [...grouped.values()].some((group) => group.length > 0)) {
    for (const key of [...grouped.keys()].sort()) {
      if (selected.length >= 20) break;
      const outcome = grouped.get(key)!.shift(); if (outcome) selected.push(outcome);
    }
  }
  return selected;
}

async function limitedMap<T, R>(items: readonly T[], width: number, work: (item: T) => Promise<R>): Promise<readonly R[]> {
  const results = Array.from({ length: items.length }, () => undefined as unknown as R); let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(width, items.length) }, async () => {
    while (cursor < items.length) { const index = cursor++; results[index] = await work(items[index]!); }
  }));
  return results;
}

function isFractional(text: string): boolean {
  const normalized = text.includes(".") ? text.replace(/0+$/, "").replace(/\.$/, "") : text;
  return normalized.includes(".");
}

const failures: string[] = [];
const [outcomeMeta, spotMeta, spotMetaAndAssetCtxs, allMids] = await Promise.all([
  info<OutcomeMeta>({ type: "outcomeMeta" }),
  info<SpotMeta>({ type: "spotMeta" }),
  info<readonly [SpotMeta, unknown]>({ type: "spotMetaAndAssetCtxs" }),
  info<Record<string, string>>({ type: "allMids" })
]);
const now = Date.now(); const selected = broadSample(outcomeMeta.outcomes, now);
const sides = selected.flatMap((outcome) => [0, 1].map((side) => ({ outcomeId: outcome.outcome, side, coin: `#${10 * outcome.outcome + side}` })));
let booksSeen = 0; let tradesSeen = 0; let fractionalBooks = 0; let fractionalTrades = 0;
const empirical = await limitedMap(sides, 6, async ({ coin }) => {
  let bookLevels: readonly BookLevel[] = []; let trades: readonly Trade[] = [];
  try { const book = await info<Book>({ type: "l2Book", coin }); bookLevels = [...(book.levels[0] ?? []), ...(book.levels[1] ?? [])]; }
  catch (error) { failures.push(`${coin} l2Book: ${error instanceof Error ? error.message : String(error)}`); }
  try { trades = await info<readonly Trade[]>({ type: "recentTrades", coin }); }
  catch (error) { failures.push(`${coin} recentTrades: ${error instanceof Error ? error.message : String(error)}`); }
  booksSeen += bookLevels.length; tradesSeen += trades.length;
  for (const level of bookLevels) if (isFractional(level.sz)) fractionalBooks += 1;
  for (const trade of trades) if (isFractional(trade.sz)) fractionalTrades += 1;
  return { coin, bookLevels: bookLevels.map((level) => level.sz), trades: trades.map((trade) => trade.sz) };
});

const precisionFields = outcomeMeta.outcomes.reduce((count, outcome) => count + Object.keys(outcome).filter((key) => key.toLowerCase().includes("szdecimal")).length + (outcome.sideSpecs ?? []).reduce((sideCount, side) => sideCount + Object.keys(side).filter((key) => key.toLowerCase().includes("szdecimal")).length, 0), 0);
const spotTokens = spotMeta.tokens;
const fromCombined = spotMetaAndAssetCtxs[0].tokens;
const outcomeTokenCount = [...spotTokens, ...fromCombined].filter((token) => token.name.startsWith("+")).length;
const outcomeMidCount = Object.keys(allMids).filter((coin) => coin.startsWith("#")).length;
const quoteTokens = [...new Set(outcomeMeta.outcomes.map((item) => typeof item.quoteToken === "string" ? item.quoteToken : "unknown"))].sort();
const override = readOperatorOverrides(process.env, observedAt);
const hasPrecisionOverride = override?.szDecimals !== undefined;
const sampleSnapshot = {
  network: "mainnet", outcomeIds: selected.map((item) => item.outcome).sort((a, b) => a - b),
  levelsAndTrades: [...empirical].sort((a, b) => a.coin.localeCompare(b.coin)),
  metadataCounts: { outcomeCount: outcomeMeta.outcomes.length, precisionFields, spotTokenCount: spotTokens.length, outcomeTokenCount, outcomeMidCount, quoteTokens }
};
const snapshotIdentity = evidenceSnapshotIdentity(sampleSnapshot);
const summary = {
  network: "mainnet" as const, observedAt: observedAt.value, snapshotIdentity,
  metadata: { outcomeCount: outcomeMeta.outcomes.length, precisionFieldCount: precisionFields, spotTokenCount: spotTokens.length, outcomeTokenCount, outcomeMidsCount: outcomeMidCount, quoteTokens },
  empirical: { marketsInspected: selected.length, sidesInspected: sides.length, bookLevelsInspected: booksSeen, tradesInspected: tradesSeen, fractionalBookSizes: fractionalBooks, fractionalTradeSizes: fractionalTrades, failedReads: failures.length },
  sizePrecision: "UNRESOLVED" as const,
  minimumNotional: { sdkValue: "1", sdkVersion: "@outcome.xyz/hip4@1.2.0-beta.1 (src/adapter/hyperliquid/pricing.ts; source audit 2026-09-26)", officialEvidence: "generic Place an order error example says '$10'; not explicitly scoped to HIP-4 outcome assets", changelog: "CHANGELOG.md [1.2.0-beta], 2026-09-05: claims HIP-4 network upgrade reduced $10 to $1; not independently confirmed by an explicit official HIP-4 source", conflict: "official generic $10 example (applicability unclear) and @perps/hip4 v2 guide ($10, secondary/stale possible) differ from HIP-4 SDK $1" },
  strictMainnet: "BLOCKED" as const,
  developmentDryRun: hasPrecisionOverride ? "READY_WITH_EXPLICIT_OPERATOR_OVERRIDE_AND_SDK_MINIMUM_EVIDENCE" as const : "BLOCKED_UNTIL_EXPLICIT_SIZE_PRECISION_OVERRIDE_OR_FIXTURE_METADATA" as const,
  blockers: ["no official/live authoritative outcome-side szDecimals field discovered", "minimum-notional source applicability is unresolved: official generic example shows $10, maintained HIP-4 SDK says $1", ...(hasPrecisionOverride ? [] : ["DEVELOPMENT_DRY_RUN needs explicit CONTOUR_OUTCOME_SZ_DECIMALS or fixture precision metadata"]), ...(override ? ["operator override active: " + override.evidence.map((item) => `${item.source}=${item.value}`).join(", ")] : [])]
};
console.log(formatExecutionEvidence(summary));
if (failures.length) console.log(`Read errors (not counted as evidence):\n${failures.map((failure) => `- ${failure}`).join("\n")}`);
