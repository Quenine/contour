import { describe, expect, it } from "vitest";
import { assertFresh, InvalidExternalPayload, normalizeBtcPerpetual, normalizeHip4Outcome, normalizeOutcomeOrderBook, normalizePerpetualAccount, StaleMarketData } from "../src/index.js";
const freshness = { network: "mainnet" as const, source: "hyperliquid-direct" as const, observedAt: { value: "2026-01-01T00:00:00.000Z" } };
describe("Hyperliquid normalization", () => {
  it("normalizes BTC perp state without protocol types escaping", () => {
    const state = normalizeBtcPerpetual([{ universe: [{ name: "ETH" }, { name: "BTC" }] }, [{ markPx: "1", oraclePx: "1" }, { markPx: "80000.25", oraclePx: "80001" }]], freshness);
    expect(state.markPrice.toString()).toBe("80000.25");
  });
  it("normalizes an explicitly structured HIP-4 priceBinary description", () => {
    const market = normalizeHip4Outcome({ outcome: 17, name: "BTC above", description: "class:priceBinary\nunderlying:BTC\ntargetPrice:75000\nexpiry:2026-12-01T00:00:00Z\ncomparator:gte\nperiod:1d" }, freshness);
    expect(market.kind).toBe("binaryPrice"); if (market.kind === "binaryPrice") expect(market.threshold.toString()).toBe("75000");
  });
  it("normalizes the currently observed binaryPrice template without guessing other templates", () => {
    const market = normalizeHip4Outcome({ outcome: 17, name: "template:binaryPrice", description: "perp:BTC|priceDescription:BTC-USDC mark|seconds:1|threshold:75000|time:20261001-0000", sideSpecs: [{ name: "template:Yes" }, { name: "template:No" }] }, freshness);
    expect(market.kind).toBe("binaryPrice"); if (market.kind === "binaryPrice") { expect(market.comparator).toBe("greaterThan"); expect(market.settlementAt.value).toBe("2026-10-01T00:00:00.000Z"); }
  });
  it("keeps arbitrary natural-language outcomes generic", () => expect(normalizeHip4Outcome({ outcome: 18, name: "Will BTC moon?", description: "Some language about bitcoin" }, freshness).kind).toBe("generic"));
  it("normalizes a compact protocol order book", () => {
    const book = normalizeOutcomeOrderBook("17", 0, { levels: [[{ px: "0.4", sz: "12", n: 2 }], [{ px: "0.6", sz: "7", n: 1 }]] }, freshness);
    expect(book.asks[0]?.price.toString()).toBe("0.6");
  });
  it("rejects stale external observations when a caller supplies a freshness bound", () => expect(() => assertFresh(freshness, 1, Date.parse(freshness.observedAt.value) + 2)).toThrow(StaleMarketData));
  it("rejects malformed payloads", () => expect(() => normalizeBtcPerpetual({}, freshness)).toThrow(InvalidExternalPayload));
  it("normalizes public perp positions and removes zeros", () => {
    const account = normalizePerpetualAccount("0x0000000000000000000000000000000000000000", { assetPositions: [{ position: { coin: "BTC", szi: "-0.3", entryPx: "80000", unrealizedPnl: "1" } }, { position: { coin: "ETH", szi: "0", entryPx: "1", unrealizedPnl: "0" } }] }, freshness);
    expect(account.positions[0]?.direction).toBe("short"); expect(account.positions).toHaveLength(1);
  });
});
