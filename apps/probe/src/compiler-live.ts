import { compileTerminalPayoff, type ExecutableBinaryInstrument } from "@contour/compiler";
import { assetSymbol, DecimalAmount, UtcTimestamp, type BinaryPriceOutcome } from "@contour/domain";
import { HyperliquidReader } from "@contour/hyperliquid";
import type { PerpetualTerminalComponent } from "@contour/payoff";

const d = (value: string) => DecimalAmount.parse(value);
const reader = new HyperliquidReader();
const btc = assetSymbol("BTC");
const [perp, outcomes] = await Promise.all([reader.btcPerpetual(), reader.outcomeMarkets()]);
const binaries = outcomes.filter((outcome): outcome is BinaryPriceOutcome => outcome.kind === "binaryPrice" && outcome.underlying === btc);
const groups = new Map<string, BinaryPriceOutcome[]>();
for (const market of binaries) groups.set(market.settlementAt.value, [...(groups.get(market.settlementAt.value) ?? []), market]);
const now = Date.now();
const selectedGroup = [...groups.entries()].filter(([timestamp]) => Date.parse(timestamp) > now).sort((left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0]))[0];

console.log("CONTOUR COMPILER — LIVE READ-ONLY");
console.log(`Network: ${perp.freshness.network}; BTC mark ${perp.markPrice.toString()}; oracle ${perp.oraclePrice.toString()}`);
console.log(`Current normalized BTC binary universe: ${binaries.length}; settlement groups: ${groups.size}`);
if (!selectedGroup) {
  console.log("Status: INFEASIBLE");
  console.log("Diagnosis: NO_ELIGIBLE_MARKETS — no future exact-settlement BTC binary group is currently available");
} else {
  const [timestamp, markets] = selectedGroup;
  const selectedMarkets = markets.slice(0, 12);
  const executable: ExecutableBinaryInstrument[] = await Promise.all(selectedMarkets.map(async (market) => {
    const [yesBook, noBook] = await Promise.all([reader.outcomeOrderBook(market.id, 0), reader.outcomeOrderBook(market.id, 1)]);
    return { market, yesBook, noBook };
  }));
  const synthetic: PerpetualTerminalComponent = { kind: "perpetual", asset: btc, direction: "long", quantity: d("0.01"), entryPrice: perp.markPrice, externalTerms: "excluded" };
  const rangeMin = perp.markPrice.subtract(d("5000")); const rangeMax = perp.markPrice.add(d("5000"));
  const compileTime = UtcTimestamp.fromEpochMilliseconds(Date.now());
  const result = await compileTerminalPayoff({
    existingPortfolio: { components: [synthetic] }, settlement: { underlying: btc, timestamp: selectedMarkets[0]!.settlementAt, priceRange: { min: rangeMin, max: rangeMax } },
    constraint: { minimumTerminalPnl: d("-20") }, maximumAcquisitionCost: d("50"), instruments: executable,
    policy: { maximumBookAgeMs: 120_000, compilationTime: compileTime, feeModel: { kind: "excluded" } }
  });
  const askSegments = executable.reduce((count, item) => count + item.yesBook.asks.length + item.noBook.asks.length, 0);
  console.log(`Selected exact settlement: ${timestamp}; markets read: ${selectedMarkets.length}; ask segments: ${askSegments}`);
  console.log(`Synthetic exposure: long 0.01 BTC @ ${perp.markPrice.toString()}; range [${rangeMin.toString()}, ${rangeMax.toString()}]`);
  console.log("Constraint: terminal PnL >= -20; maximum premium budget 50; fees excluded");
  console.log(`Status: ${result.status}`);
  if (result.status === "FEASIBLE") {
    console.log(`Selected positions: ${result.selectedPositions.map((position) => `#${position.marketId} ${position.side.toUpperCase()} ${position.totalQuantity.toString()}`).join(", ")}`);
    console.log(`Acquisition cost: ${result.totalAcquisitionCost.toString()}`);
    console.log(`Worst exact terminal PnL: ${result.verification.worstCase.terminalPnl.toString()} @ ${result.verification.worstCase.price.toString()} (${result.verification.worstCase.position})`);
    console.log(`Exact verification: ${result.verification.holds ? "PASS" : "FAIL"}`);
  } else if (result.status === "INFEASIBLE") console.log(`Diagnosis: ${result.reason} — ${result.explanation}`);
  else if (result.status === "INVALID_REQUEST") console.log(`Diagnosis: ${result.issues.join("; ")}`);
  else if (result.status === "ALREADY_SATISFIED") console.log("Diagnosis: synthetic existing position already satisfies the constraint; no overlay required");
  else console.log(`Diagnosis: ${result.explanation}`);
}
