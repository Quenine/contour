import { compileTerminalPayoff, type CompileTerminalPayoffRequest, type ExecutableBinaryInstrument } from "@contour/compiler";
import { assetSymbol, DecimalAmount, UtcTimestamp, type BinaryPriceOutcome } from "@contour/domain";
import { executionSnapshot, knownHip4ProtocolFee, outcomeMetadataForRequest, planExecution } from "@contour/execution";
import { HyperliquidReader } from "@contour/hyperliquid";
import type { PerpetualTerminalComponent } from "@contour/payoff";

const d = (value: string) => DecimalAmount.parse(value); const reader = new HyperliquidReader(); const btc = assetSymbol("BTC");

async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, work: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length); let nextIndex = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (true) { const index = nextIndex++; if (index >= items.length) return; results[index] = await work(items[index]!); }
  }));
  return results;
}
console.log("CONTOUR EXECUTION — LIVE READ-ONLY DRY RUN");
const [perp, outcomes] = await Promise.all([reader.btcPerpetual(), reader.outcomeMarkets()]);
const binaries = outcomes.filter((outcome): outcome is BinaryPriceOutcome => outcome.kind === "binaryPrice" && outcome.underlying === btc);
const groups = new Map<string, BinaryPriceOutcome[]>(); for (const market of binaries) if (Date.parse(market.settlementAt.value) > Date.now()) groups.set(market.settlementAt.value, [...(groups.get(market.settlementAt.value) ?? []), market]);
const selected = [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))[0];
if (!selected) console.log("Status: COMPILER_INFEASIBLE — no future exact-settlement BTC binary group is available");
else {
  const markets = selected[1].slice(0, 12); const instruments = await mapWithConcurrency(markets, 3, async (market): Promise<ExecutableBinaryInstrument> => { const [yesBook, noBook] = await Promise.all([reader.outcomeOrderBook(market.id, 0), reader.outcomeOrderBook(market.id, 1)]); return { market, yesBook, noBook }; });
  const existing: PerpetualTerminalComponent = { kind: "perpetual", asset: btc, direction: "long", quantity: d("0.01"), entryPrice: perp.markPrice, externalTerms: "excluded" }; const checkedAt = UtcTimestamp.fromEpochMilliseconds(Date.now());
  const request: CompileTerminalPayoffRequest = { existingPortfolio: { components: [existing] }, settlement: { underlying: btc, timestamp: markets[0]!.settlementAt, priceRange: { min: perp.markPrice.subtract(d("5000")), max: perp.markPrice.add(d("5000")) } }, constraint: { minimumTerminalPnl: d("-20") }, maximumAcquisitionCost: d("50"), instruments, policy: { maximumBookAgeMs: 120_000, compilationTime: checkedAt, feeModel: { kind: "excluded" } } };
  const compiled = await compileTerminalPayoff(request); console.log(`Settlement: ${selected[0]}; markets: ${markets.length}; compiler: ${compiled.status}`);
  if (compiled.status !== "FEASIBLE") console.log(`Status: COMPILER_INFEASIBLE${compiled.status === "INFEASIBLE" ? ` — ${compiled.reason}: ${compiled.explanation}` : ` — ${compiled.status}`}`);
  else { const snapshot = executionSnapshot(request); const plan = planExecution({ request, compilerResult: compiled, requestIdentity: "contour-live-probe-v1", compilerSnapshotIdentity: snapshot.identity, protocolMetadata: outcomeMetadataForRequest(request, { precision: { kind: "UNAVAILABLE", source: "live Hyperliquid outcomeMeta", explanation: "outcomeMeta does not expose outcome-side szDecimals; current books appear integer-sized, but this empirical observation cannot establish authoritative precision" }, observedAt: checkedAt }), protocolFee: knownHip4ProtocolFee(checkedAt), checkedAt, maximumBookAgeMs: 30_000, trustPolicy: "STRICT_MAINNET" }); console.log(`Status: ${plan.status}`); if (plan.status === "READY") console.log(plan.plan.report.text); else if (plan.status !== "NOT_NEEDED") console.log(`Blocker: ${plan.blockers.map((blocker) => blocker.kind).join(", ")}`); }
}
