# Protocol notes (BUILD 00)

## Direct reads

The adapter uses public, unauthenticated Hyperliquid `POST /info` calls:

- `metaAndAssetCtxs` for BTC perpetual mark/oracle context;
- `clearinghouseState` for a public address's perpetual positions;
- `outcomeMeta` for HIP-4 outcome metadata;
- `l2Book` for an outcome-side book.

Network is explicit (`mainnet` by default, or testnet) and every normalized result carries `network`, `source: hyperliquid-direct`, and an observation timestamp. The maintained `@nktkas/hyperliquid` TypeScript library was inspected (0.33.3 at implementation) but is not a runtime dependency; direct validated reads make the integration boundary auditable. `@outcome.xyz/hip4` was also inspected (1.1.0-beta); it offers a higher-level market classifier but is third-party and not used as protocol authority.

## HIP-4 semantics

`outcomeMeta` exposes outcome IDs, names, descriptions, side specs, quote token, and (where applicable) question links. On the mainnet read of **2026-09-26**, 231 outcomes were returned. Current `template:binaryPrice` records use pipe fields such as `perp:BTC|...|threshold:84315|time:20260928-2000`, have `template:Yes`/`template:No` sides, and quote in **USDC**. The adapter treats this exact combination as a strict `price > threshold` binary—the registered template describes Yes as price *above* the threshold. It also retains the older documented `class:priceBinary` newline key/value form only when it declares an explicit `gt` or `gte` comparator. Arbitrary natural-language titles/descriptions and other templates (for example `priceTouch`) remain generic. This prevents false payoff claims.

Order-book lookup uses the current public-info coin key `#(10 × outcomeId + sideIndex)`; the distinct `100000000 + 10 × outcomeId + sideIndex` asset ID is preserved for a future order action. On the live probe, `#12100` returned a populated book. The adapter preserves both side coins and both action asset IDs, alongside the source outcome ID.

## Uncertainties / limitations

- HIP-4 metadata and documentation have changed rapidly. The older `class:priceBinary|underlying|expiry|targetPrice` documentation disagrees with the currently observed `template:binaryPrice|perp|time|threshold` mainnet schema; both are handled only as explicit formats. Mainnet and testnet may expose different active templates, collateral/quote tokens, descriptions, and market availability. The probe prints what its selected network actually returns; it does not infer missing semantics.
- BUILD 00 does not normalize price buckets from live metadata because this direct response does not provide a version-stable, unambiguous bucket-bound schema in the adapter's supported structured description. Generic treatment is intentional.
- A returned book does not establish executable fill price, liquidity, settlement validity, or collateral behavior. Quote/collateral behavior is observed only through live metadata and is not assumed to be USDC.
- The repository records no fabricated live snapshot. Run `pnpm probe:markets` to make a current observation.
