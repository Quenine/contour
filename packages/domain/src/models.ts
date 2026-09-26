import { DecimalAmount } from "./decimal.js";

export type AssetSymbol = string & { readonly __assetSymbol: unique symbol };
export function assetSymbol(value: string): AssetSymbol {
  if (!/^[A-Z0-9:_-]{1,32}$/.test(value)) throw new RangeError(`Invalid asset symbol: ${value}`);
  return value as AssetSymbol;
}
export type OutcomeId = string & { readonly __outcomeId: unique symbol };
export function outcomeId(value: string): OutcomeId {
  if (!/^\d+$/.test(value)) throw new RangeError(`Invalid outcome id: ${value}`);
  return value as OutcomeId;
}
export type Direction = "long" | "short";
export type OutcomeSide = "yes" | "no";
export type Comparator = "greaterThanOrEqual" | "greaterThan";
export type Price = DecimalAmount;
export type Quantity = DecimalAmount;
export type Money = DecimalAmount;

export class UtcTimestamp {
  readonly value: string;
  private constructor(value: string) { this.value = value; }
  static parse(value: string): UtcTimestamp {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value) || Number.isNaN(Date.parse(value))) {
      throw new RangeError(`Invalid UTC timestamp: ${value}`);
    }
    return new UtcTimestamp(new Date(value).toISOString());
  }
  static fromEpochMilliseconds(value: number): UtcTimestamp {
    if (!Number.isSafeInteger(value) || value < 0) throw new RangeError("Invalid epoch timestamp");
    return new UtcTimestamp(new Date(value).toISOString());
  }
}

export interface MarketFreshness { readonly observedAt: UtcTimestamp; readonly source: "hyperliquid-direct" | "indexer-assisted"; readonly network: "mainnet" | "testnet"; }
export interface PerpetualPosition { readonly asset: AssetSymbol; readonly direction: Direction; readonly quantity: Quantity; readonly entryPrice: Price; readonly unrealizedPnl?: Money; }
export interface PerpetualAccountSnapshot { readonly address: string; readonly positions: readonly PerpetualPosition[]; readonly freshness: MarketFreshness; }
export interface OutcomeProtocolIdentifiers { readonly outcomeId: OutcomeId; readonly yesCoin: string; readonly noCoin: string; readonly yesAssetId: string; readonly noAssetId: string; }
export interface BinaryPriceOutcome { readonly kind: "binaryPrice"; readonly id: OutcomeId; readonly underlying: AssetSymbol; readonly settlementAt: UtcTimestamp; readonly threshold: Price; readonly comparator: Comparator; readonly yesSide: OutcomeSide; readonly noSide: OutcomeSide; readonly protocol: OutcomeProtocolIdentifiers; readonly sourceName: string; readonly freshness: MarketFreshness; }
export interface PriceBucketOutcome { readonly kind: "priceBucket"; readonly id: OutcomeId; readonly underlying: AssetSymbol; readonly settlementAt: UtcTimestamp; readonly thresholds: readonly Price[]; readonly lowerBound?: Price; readonly upperBound?: Price; readonly freshness: MarketFreshness; }
export interface OutcomeMarket { readonly kind: "generic"; readonly id: OutcomeId; readonly name: string; readonly description: string; readonly freshness: MarketFreshness; }
export interface OrderBookLevel { readonly price: Price; readonly quantity: Quantity; readonly orderCount: number; }
export interface OrderBookSnapshot { readonly outcomeId: OutcomeId; readonly sideIndex: 0 | 1; readonly coin: string; readonly bids: readonly OrderBookLevel[]; readonly asks: readonly OrderBookLevel[]; readonly freshness: MarketFreshness; }
