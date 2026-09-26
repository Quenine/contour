import { compileTerminalPayoff, type ExecutableBinaryInstrument } from "@contour/compiler";
import { assetSymbol, DecimalAmount, outcomeId, UtcTimestamp, type BinaryPriceOutcome, type MarketFreshness, type OrderBookSnapshot } from "@contour/domain";
import type { PerpetualTerminalComponent } from "@contour/payoff";

const d = (value: string) => DecimalAmount.parse(value);
const btc = assetSymbol("BTC");
const settlement = UtcTimestamp.parse("2026-10-01T00:00:00Z");
const observedAt = UtcTimestamp.parse("2026-09-30T23:59:30Z");
const freshness: MarketFreshness = { network: "mainnet", source: "hyperliquid-direct", observedAt };

function book(id: string, sideIndex: 0 | 1, asks: readonly [string, string][]): OrderBookSnapshot {
  return { outcomeId: outcomeId(id), sideIndex, coin: `#${BigInt(id) * 10n + BigInt(sideIndex)}`, bids: [], asks: asks.map(([price, quantity]) => ({ price: d(price), quantity: d(quantity), orderCount: 1 })), freshness };
}
function market(id: string, threshold: string, yes: readonly [string, string][], no: readonly [string, string][]): ExecutableBinaryInstrument {
  const marketId = outcomeId(id);
  const normalized: BinaryPriceOutcome = {
    kind: "binaryPrice", id: marketId, underlying: btc, settlementAt: settlement, threshold: d(threshold), comparator: "greaterThan", yesSide: "yes", noSide: "no", sourceName: "fixture", freshness,
    protocol: { outcomeId: marketId, yesCoin: `#${BigInt(id) * 10n}`, noCoin: `#${BigInt(id) * 10n + 1n}`, yesAssetId: `${100_000_000n + BigInt(id) * 10n}`, noAssetId: `${100_000_001n + BigInt(id) * 10n}` }
  };
  return { market: normalized, yesBook: book(id, 0, yes), noBook: book(id, 1, no) };
}

const existing: PerpetualTerminalComponent = { kind: "perpetual", asset: btc, direction: "long", quantity: d("1"), entryPrice: d("100"), externalTerms: "excluded" };
const instruments = [
  market("101", "25", [["0.8", "10"]], [["0.1", "30"]]),
  market("102", "50", [["0.8", "10"]], [["0.1", "30"]]),
  market("103", "75", [["0.8", "10"]], [["0.1", "20"], ["0.12", "20"]])
];

const started = performance.now();
const result = await compileTerminalPayoff({
  existingPortfolio: { components: [existing] }, settlement: { underlying: btc, timestamp: settlement, priceRange: { min: d("0"), max: d("100") } },
  constraint: { minimumTerminalPnl: d("-40") }, maximumAcquisitionCost: d("100"), instruments,
  policy: { maximumBookAgeMs: 60_000, compilationTime: UtcTimestamp.parse("2026-10-01T00:00:00Z"), feeModel: { kind: "excluded" } }
});
const elapsed = performance.now() - started;

console.log("CONTOUR COMPILER — FIXTURE");
console.log("Existing exposure: long 1 BTC perpetual @ 100");
console.log(`Settlement: BTC @ ${settlement.value}; range [0, 100]`);
console.log("Constraint: terminal PnL >= -40 at every supported settlement state");
console.log("Budget: 100 (premium only; fees explicitly excluded)");
console.log(`Eligible markets: ${instruments.length}`);
console.log(`Order-book depth segments: ${instruments.reduce((count, item) => count + item.yesBook.asks.length + item.noBook.asks.length, 0)}`);
console.log(`Status: ${result.status}`);
if (result.status === "FEASIBLE") {
  console.log(`Selected positions: ${result.selectedPositions.map((position) => `#${position.marketId} ${position.side.toUpperCase()} ${position.totalQuantity.toString()}`).join(", ")}`);
  console.log(`Acquisition cost: ${result.totalAcquisitionCost.toString()}`);
  console.log(`Worst verified terminal PnL: ${result.verification.worstCase.terminalPnl.toString()}`);
  console.log(`Worst settlement state: ${result.verification.worstCase.price.toString()} (${result.verification.worstCase.position})`);
  console.log(`Exact verification: ${result.verification.holds ? "PASS" : "FAIL"}`);
} else if (result.status === "INFEASIBLE") console.log(`Diagnosis: ${result.reason} — ${result.explanation}`);
console.log(`Compile time: ${elapsed.toFixed(2)} ms`);

const scaleMarkets = Array.from({ length: 30 }, (_, index) => market(String(index + 1), String((index + 1) * 10), [["0.2", "10"], ["0.3", "20"], ["0.4", "30"]], [["0.2", "10"], ["0.3", "20"], ["0.4", "30"]]));
const scaleStarted = performance.now();
const scaleResult = await compileTerminalPayoff({
  existingPortfolio: { components: [{ ...existing, entryPrice: d("300") }] }, settlement: { underlying: btc, timestamp: settlement, priceRange: { min: d("0"), max: d("300") } },
  constraint: { minimumTerminalPnl: d("-250") }, maximumAcquisitionCost: d("500"), instruments: scaleMarkets,
  policy: { maximumBookAgeMs: 60_000, compilationTime: UtcTimestamp.parse("2026-10-01T00:00:00Z"), feeModel: { kind: "excluded" } }
});
console.log(`Scale sanity: 30 markets / 180 depth segments -> ${scaleResult.status} in ${(performance.now() - scaleStarted).toFixed(2)} ms`);
