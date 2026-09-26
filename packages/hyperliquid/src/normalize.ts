import { assetSymbol, DecimalAmount, type BinaryPriceOutcome, type Comparator, type MarketFreshness, type OrderBookLevel, type OrderBookSnapshot, outcomeId, type OutcomeMarket, type PerpetualAccountSnapshot, type PerpetualPosition, UtcTimestamp } from "@contour/domain";
import { InvalidExternalPayload } from "./errors.js";
import { StaleMarketData } from "./errors.js";

type RecordValue = Record<string, unknown>;
const record = (value: unknown, context: string): RecordValue => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new InvalidExternalPayload(`${context} must be an object`);
  return value as RecordValue;
};
const string = (value: unknown, context: string): string => { if (typeof value !== "string") throw new InvalidExternalPayload(`${context} must be a string`); return value; };
const finiteInteger = (value: unknown, context: string): number => { if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new InvalidExternalPayload(`${context} must be a safe integer`); return value; };
const decimal = (value: unknown, context: string): DecimalAmount => { try { return DecimalAmount.parse(string(value, context)); } catch { throw new InvalidExternalPayload(`${context} must be a decimal string`); } };

export interface BtcPerpetualMarketState { readonly asset: "BTC"; readonly markPrice: DecimalAmount; readonly oraclePrice: DecimalAmount; readonly freshness: MarketFreshness; }
export function assertFresh(freshness: MarketFreshness, maxAgeMs: number, nowMs = Date.now()): void {
  if (!Number.isSafeInteger(maxAgeMs) || maxAgeMs < 0 || nowMs - Date.parse(freshness.observedAt.value) > maxAgeMs) throw new StaleMarketData("Market data exceeds its allowed freshness age");
}
export function outcomeSideCoin(id: string, sideIndex: 0 | 1): string { return `#${10n * BigInt(id) + BigInt(sideIndex)}`; }
export function outcomeSideAssetId(id: string, sideIndex: 0 | 1): string { return (100_000_000n + 10n * BigInt(id) + BigInt(sideIndex)).toString(); }
function protocolIdentifiers(id: ReturnType<typeof outcomeId>) {
  return { outcomeId: id, yesCoin: outcomeSideCoin(id, 0), noCoin: outcomeSideCoin(id, 1), yesAssetId: outcomeSideAssetId(id, 0), noAssetId: outcomeSideAssetId(id, 1) };
}
export function normalizeBtcPerpetual(payload: unknown, freshness: MarketFreshness): BtcPerpetualMarketState {
  if (!Array.isArray(payload) || payload.length !== 2) throw new InvalidExternalPayload("metaAndAssetCtxs must be a two item array");
  const arrayPayload = payload as unknown[];
  const metaPayload = arrayPayload[0]; const contexts = arrayPayload[1];
  const meta = record(metaPayload, "meta"); const universe = meta["universe"];
  if (!Array.isArray(universe) || !Array.isArray(contexts) || universe.length !== contexts.length) throw new InvalidExternalPayload("universe/context mismatch");
  const index = universe.findIndex((item) => { try { return string(record(item, "universe item")["name"], "universe name") === "BTC"; } catch { return false; } });
  if (index < 0) throw new InvalidExternalPayload("BTC absent from perpetual universe");
  const ctx = record(contexts[index], "BTC asset context");
  return { asset: "BTC", markPrice: decimal(ctx["markPx"], "markPx"), oraclePrice: decimal(ctx["oraclePx"], "oraclePx"), freshness };
}

export function normalizePerpetualAccount(address: string, payload: unknown, freshness: MarketFreshness): PerpetualAccountSnapshot {
  const root = record(payload, "clearinghouseState"); const rawPositions = root["assetPositions"];
  if (!Array.isArray(rawPositions)) throw new InvalidExternalPayload("assetPositions must be an array");
  const positions: PerpetualPosition[] = rawPositions.map((entry, index) => {
    const position = record(record(entry, `assetPositions[${index}]`)["position"], `position[${index}]`);
    const signed = decimal(position["szi"], `position[${index}].szi`);
    const direction: "long" | "short" = signed.isNegative() ? "short" : "long";
    return { asset: assetSymbol(string(position["coin"], "position coin")), direction, quantity: signed.abs(), entryPrice: decimal(position["entryPx"], "entryPx"), unrealizedPnl: decimal(position["unrealizedPnl"], "unrealizedPnl") };
  }).filter((position) => !position.quantity.isZero());
  return { address, positions, freshness };
}

/** Only the documented key:value priceBinary template is classified. Natural-language titles remain generic. */
export function normalizeHip4Outcome(raw: unknown, freshness: MarketFreshness): BinaryPriceOutcome | OutcomeMarket {
  const item = record(raw, "outcome");
  const id = outcomeId(String(finiteInteger(item["outcome"], "outcome id")));
  const name = string(item["name"], "outcome name"); const description = string(item["description"], "outcome description");
  const generic = (): OutcomeMarket => ({ kind: "generic", id, name, description, freshness });
  // Current mainnet template format (observed 2026-09-26). Its registered template
  // defines Yes as price strictly above threshold; do not apply it to any other name.
  if (name === "template:binaryPrice") {
    const fields = new Map<string, string>();
    for (const segment of description.split("|")) {
      const separator = segment.indexOf(":");
      if (separator > 0) fields.set(segment.slice(0, separator), segment.slice(separator + 1));
    }
    const perp = fields.get("perp"); const threshold = fields.get("threshold"); const time = fields.get("time");
    const sideSpecs = item["sideSpecs"];
    const validSides = Array.isArray(sideSpecs) && sideSpecs.length === 2 && record(sideSpecs[0], "yes side")["name"] === "template:Yes" && record(sideSpecs[1], "no side")["name"] === "template:No";
    const timeMatch = time === undefined ? undefined : /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})$/.exec(time);
    if (!perp || !threshold || !timeMatch || !validSides) return generic();
    try {
      return { kind: "binaryPrice", id, underlying: assetSymbol(perp), threshold: DecimalAmount.parse(threshold), settlementAt: UtcTimestamp.parse(`${timeMatch[1]}-${timeMatch[2]}-${timeMatch[3]}T${timeMatch[4]}:${timeMatch[5]}:00Z`), comparator: "greaterThan", yesSide: "yes", noSide: "no", protocol: protocolIdentifiers(id), sourceName: name, freshness };
    } catch { return generic(); }
  }
  const fields = new Map<string, string>();
  for (const line of description.split(/\r?\n/)) {
    const match = /^([a-zA-Z][\w-]*):\s*(.+)$/.exec(line.trim());
    if (match?.[1] && match[2]) fields.set(match[1], match[2].trim());
  }
  if (fields.get("class") !== "priceBinary") return generic();
  const underlying = fields.get("underlying"); const targetPrice = fields.get("targetPrice"); const expiry = fields.get("expiry");
  const comparatorRaw = fields.get("comparator");
  const comparator: Comparator | undefined = comparatorRaw === "gte" ? "greaterThanOrEqual" : comparatorRaw === "gt" ? "greaterThan" : undefined;
  if (!underlying || !targetPrice || !expiry || !comparator) return generic();
  try {
    return { kind: "binaryPrice", id, underlying: assetSymbol(underlying), threshold: DecimalAmount.parse(targetPrice.replaceAll(",", "")), settlementAt: UtcTimestamp.parse(expiry), comparator, yesSide: "yes", noSide: "no", protocol: protocolIdentifiers(id), sourceName: name, freshness };
  } catch { return generic(); }
}

export function normalizeOutcomeMeta(payload: unknown, freshness: MarketFreshness): readonly (BinaryPriceOutcome | OutcomeMarket)[] {
  const outcomes = record(payload, "outcomeMeta")["outcomes"];
  if (!Array.isArray(outcomes)) throw new InvalidExternalPayload("outcomeMeta.outcomes must be an array");
  return outcomes.map((outcome) => normalizeHip4Outcome(outcome, freshness));
}

function normalizeLevel(value: unknown, context: string): OrderBookLevel {
  const item = record(value, context);
  return { price: decimal(item["px"], `${context}.px`), quantity: decimal(item["sz"], `${context}.sz`), orderCount: finiteInteger(item["n"], `${context}.n`) };
}
export function normalizeOutcomeOrderBook(id: string, sideIndex: 0 | 1, payload: unknown, freshness: MarketFreshness): OrderBookSnapshot {
  const root = record(payload, "l2Book"); const levels = root["levels"];
  if (!Array.isArray(levels) || levels.length !== 2 || !Array.isArray(levels[0]) || !Array.isArray(levels[1])) throw new InvalidExternalPayload("l2Book levels must contain bids and asks");
  return { outcomeId: outcomeId(id), sideIndex, coin: outcomeSideCoin(id, sideIndex), bids: levels[0].map((level, index) => normalizeLevel(level, `bid[${index}]`)), asks: levels[1].map((level, index) => normalizeLevel(level, `ask[${index}]`)), freshness };
}
