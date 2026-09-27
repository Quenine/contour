import { type BinaryPriceOutcome, type MarketFreshness, type OrderBookSnapshot, type OutcomeMarket, type PerpetualAccountSnapshot, UtcTimestamp } from "@contour/domain";
import { InvalidExternalPayload, NetworkFailure, NotFound, RateLimited, Timeout } from "./errors.js";
import { type BtcPerpetualMarketState, normalizeBtcPerpetual, normalizeOutcomeMeta, normalizeOutcomeOrderBook, normalizePerpetualAccount, outcomeSideCoin } from "./normalize.js";

export type Network = "mainnet" | "testnet";
export interface HyperliquidReaderOptions { readonly network?: Network; readonly timeoutMs?: number; readonly metadataCacheMs?: number; readonly fetchImplementation?: typeof fetch; }
const endpoint = (network: Network): string => network === "mainnet" ? "https://api.hyperliquid.xyz/info" : "https://api.hyperliquid-testnet.xyz/info";

/** Read-only protocol adapter. It never accepts signing material or emits exchange SDK types. */
export class HyperliquidReader {
  readonly network: Network; private readonly timeoutMs: number; private readonly metadataCacheMs: number; private readonly requestFetch: typeof fetch;
  private metadataCache?: { readonly expiresAt: number; readonly value: readonly (BinaryPriceOutcome | OutcomeMarket)[] };
  private metadataPending: Promise<readonly (BinaryPriceOutcome | OutcomeMarket)[]> | undefined;
  constructor(options: HyperliquidReaderOptions = {}) {
    this.network = options.network ?? "mainnet";
    this.timeoutMs = Math.min(15_000, Math.max(250, options.timeoutMs ?? 8_000));
    this.metadataCacheMs = Math.min(60_000, Math.max(0, options.metadataCacheMs ?? 15_000));
    this.requestFetch = options.fetchImplementation ?? fetch;
  }
  async btcPerpetual(): Promise<BtcPerpetualMarketState> { const freshness = this.freshness(); return normalizeBtcPerpetual(await this.info({ type: "metaAndAssetCtxs" }), freshness); }
  async accountPerpetuals(address: string): Promise<PerpetualAccountSnapshot> { if (!/^0x[0-9a-fA-F]{40}$/.test(address)) throw new InvalidExternalPayload("address must be a 20-byte hexadecimal address"); return normalizePerpetualAccount(address, await this.info({ type: "clearinghouseState", user: address }), this.freshness()); }
  async outcomeMarkets(): Promise<readonly (BinaryPriceOutcome | OutcomeMarket)[]> {
    const now = Date.now();
    if (this.metadataCache && this.metadataCache.expiresAt > now) return this.metadataCache.value;
    if (this.metadataPending) return this.metadataPending;
    const pending = (async () => {
      const result = normalizeOutcomeMeta(await this.info({ type: "outcomeMeta" }), this.freshness());
      if (this.metadataCacheMs > 0) this.metadataCache = { value: result, expiresAt: Date.now() + this.metadataCacheMs };
      return result;
    })();
    this.metadataPending = pending;
    try { return await pending; } finally { if (this.metadataPending === pending) this.metadataPending = undefined; }
  }
  async outcomeOrderBook(outcomeId: string, sideIndex = 0): Promise<OrderBookSnapshot> {
    if (!/^\d+$/.test(outcomeId) || (sideIndex !== 0 && sideIndex !== 1)) throw new InvalidExternalPayload("invalid outcome identifier or side index");
    // Info reads use #<10*outcome+side>; the 100m-offset asset id is for order actions.
    return normalizeOutcomeOrderBook(outcomeId, sideIndex, await this.info({ type: "l2Book", coin: outcomeSideCoin(outcomeId, sideIndex) }), this.freshness());
  }
  private freshness(): MarketFreshness { return { observedAt: UtcTimestamp.fromEpochMilliseconds(Date.now()), network: this.network, source: "hyperliquid-direct" }; }
  private async info(body: Record<string, unknown>): Promise<unknown> {
    // Info API calls are idempotent reads; permit one retry for transient HTTP/network failures.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
      try {
        const response = await this.requestFetch(endpoint(this.network), { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body), cache: "no-store", signal: controller.signal });
        if (response.status === 429) { if (attempt === 0) { await response.body?.cancel(); await new Promise((resolve) => setTimeout(resolve, 150)); continue; } throw new RateLimited("Hyperliquid read was rate limited"); }
        if (response.status === 404) throw new NotFound("Hyperliquid resource not found");
        if (response.status >= 500 && attempt === 0) { await response.body?.cancel(); await new Promise((resolve) => setTimeout(resolve, 100)); continue; }
        if (!response.ok) throw new NetworkFailure(`Hyperliquid returned HTTP ${response.status}`);
        try { return await response.json(); } catch { throw new InvalidExternalPayload("Hyperliquid returned invalid JSON"); }
      } catch (error) {
        if (error instanceof RateLimited || error instanceof NotFound || error instanceof InvalidExternalPayload) throw error;
        if (error instanceof NetworkFailure && error.message.startsWith("Hyperliquid returned HTTP ")) throw error;
        if (error instanceof NetworkFailure && attempt > 0) throw error;
        if (controller.signal.aborted) {
          if (attempt === 0) continue;
          throw new Timeout(`Hyperliquid read exceeded ${this.timeoutMs}ms`);
        }
        if (attempt === 0) continue;
        throw new NetworkFailure("Hyperliquid read failed", error);
      } finally { clearTimeout(timeout); }
    }
    throw new NetworkFailure("Hyperliquid read failed");
  }
}
