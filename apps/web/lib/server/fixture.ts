import { type CompileTerminalPayoffRequest, type ExecutableBinaryInstrument } from "@contour/compiler";
import { assetSymbol, DecimalAmount, outcomeId, UtcTimestamp, type BinaryPriceOutcome, type MarketFreshness, type OrderBookSnapshot } from "@contour/domain";
import type { PerpetualTerminalComponent } from "@contour/payoff";
import { VERIFIED_FIXTURE } from "../presentation/fixture-profile";

const d = (value: string) => DecimalAmount.parse(value);
const btc = assetSymbol("BTC");
const settlement = UtcTimestamp.parse(VERIFIED_FIXTURE.settlementTimestamp);
const freshness: MarketFreshness = { network: "mainnet", source: "hyperliquid-direct", observedAt: UtcTimestamp.parse("2026-09-30T23:59:30Z") };

function fixtureBook(id: string, sideIndex: 0 | 1, asks: readonly [string, string][]): OrderBookSnapshot {
  return { outcomeId: outcomeId(id), sideIndex, coin: `#${BigInt(id) * 10n + BigInt(sideIndex)}`, bids: [], asks: asks.map(([price, quantity]) => ({ price: d(price), quantity: d(quantity), orderCount: 1 })), freshness };
}
function fixtureMarket(id: string, threshold: string, yes: readonly [string, string][], no: readonly [string, string][]): ExecutableBinaryInstrument {
  const marketId = outcomeId(id);
  const market: BinaryPriceOutcome = {
    kind: "binaryPrice", id: marketId, underlying: btc, settlementAt: settlement, threshold: d(threshold), comparator: "greaterThan", yesSide: "yes", noSide: "no", sourceName: "Verified fixture", freshness,
    protocol: { outcomeId: marketId, yesCoin: `#${BigInt(id) * 10n}`, noCoin: `#${BigInt(id) * 10n + 1n}`, yesAssetId: `${100_000_000n + BigInt(id) * 10n}`, noAssetId: `${100_000_001n + BigInt(id) * 10n}` }
  };
  return { market, yesBook: fixtureBook(id, 0, yes), noBook: fixtureBook(id, 1, no) };
}

export function createFixtureRequest(): CompileTerminalPayoffRequest {
  const existing: PerpetualTerminalComponent = { kind: "perpetual", asset: btc, direction: VERIFIED_FIXTURE.direction, quantity: d(VERIFIED_FIXTURE.quantity), entryPrice: d(VERIFIED_FIXTURE.entryPrice), externalTerms: "excluded" };
  return {
    existingPortfolio: { components: [existing] }, settlement: { underlying: btc, timestamp: settlement, priceRange: { min: d(VERIFIED_FIXTURE.minimumPrice), max: d(VERIFIED_FIXTURE.maximumPrice) } }, constraint: { minimumTerminalPnl: d(VERIFIED_FIXTURE.minimumTerminalPnl) }, maximumAcquisitionCost: d(VERIFIED_FIXTURE.maximumBudget),
    instruments: [fixtureMarket("101", VERIFIED_FIXTURE.strikes[0], [["0.8", "300"]], [["0.1", "300"]]), fixtureMarket("102", VERIFIED_FIXTURE.strikes[1], [["0.8", "300"]], [["0.1", "300"]]), fixtureMarket("103", VERIFIED_FIXTURE.strikes[2], [["0.8", "300"]], [["0.1", "300"], ["0.12", "300"]])],
    policy: { maximumBookAgeMs: 60_000, compilationTime: UtcTimestamp.parse("2026-10-01T00:00:00Z"), feeModel: { kind: "excluded" } }
  };
}
