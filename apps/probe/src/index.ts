import { HyperliquidReader } from "@contour/hyperliquid";

const reader = new HyperliquidReader();
async function markets(): Promise<void> {
  const [perp, outcomes] = await Promise.all([reader.btcPerpetual(), reader.outcomeMarkets()]);
  const btc = outcomes.filter((outcome): outcome is Extract<typeof outcome, { kind: "binaryPrice" }> => outcome.kind === "binaryPrice" && outcome.underlying === "BTC");
  console.log("Contour BUILD 00 — read-only protocol checkpoint");
  console.log(`network: ${perp.freshness.network}; source: ${perp.freshness.source}; observed: ${perp.freshness.observedAt.value}`);
  console.log(`BTC perpetual: mark ${perp.markPrice.toString()}, oracle ${perp.oraclePrice.toString()}`);
  console.log(`HIP-4 outcomes discovered: ${outcomes.length}; safely normalized BTC price binaries: ${btc.length}`);
  for (const outcome of btc.slice(0, 5)) console.log(`  #${outcome.id}: BTC ${outcome.comparator === "greaterThanOrEqual" ? ">=" : ">"} ${outcome.threshold.toString()} @ ${outcome.settlementAt.value}`);
  const selected = btc[0];
  if (!selected) { console.log("order book: no safely classified BTC price binary was returned"); return; }
  try {
    const book = await reader.outcomeOrderBook(selected.id);
    console.log(`order book #${selected.id}: bid ${book.bids[0]?.price.toString() ?? "none"}; ask ${book.asks[0]?.price.toString() ?? "none"}; observed ${book.freshness.observedAt.value}`);
  } catch (error) { console.log(`order book #${selected.id}: unavailable (${error instanceof Error ? error.message : "unknown error"})`); }
}
async function account(address: string | undefined): Promise<void> {
  if (!address) throw new Error("Usage: pnpm probe:account -- <PUBLIC_ADDRESS>");
  const snapshot = await reader.accountPerpetuals(address);
  console.log(`network: ${snapshot.freshness.network}; source: ${snapshot.freshness.source}; observed: ${snapshot.freshness.observedAt.value}`);
  console.log(`account: ${snapshot.address}; non-zero perpetual positions: ${snapshot.positions.length}`);
  for (const position of snapshot.positions) console.log(`  ${position.direction} ${position.quantity.toString()} ${position.asset} @ ${position.entryPrice.toString()}`);
}
const [command, argument] = process.argv.slice(2);
if (command === "markets") void markets();
else if (command === "account") void account(argument);
else throw new Error("Usage: node index.js <markets|account>");
