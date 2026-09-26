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
- BUILD 01 consumes every normalized ask level as separately bounded liquidity. Current live metadata does not expose a version-stable quantity/lot precision rule that Contour can safely assert, so candidate quantities are not represented as execution-ready signed quantities.
- The live compiler's fee policy remains explicit and currently excludes fees; no reliable universal fee percentage is inferred from the book or metadata.
- The repository records no fabricated live snapshot. Run `pnpm probe:markets` to make a current observation.

## BUILD 03 execution observations (2026-09-26)

- Official tick/lot documentation defines the five-significant-figure rule, spot maximum of `8 - szDecimals` price decimals, and `szDecimals` lot precision. HIP-4 uses spot-like order mechanics, but current live `outcomeMeta` and its side specs expose no `szDecimals`. Live readiness therefore blocks rather than deriving it from displayed book quantities.
- Official HIP-4 documentation currently says outcome-market protocol fees are zero for initial testing and builder codes follow spot behavior, applying to sells. BUILD 03 BUY plans record known-zero protocol fee provenance and disable builder fees.
- Official docs do not state the current outcome minimum notional. Maintained `@outcome.xyz/hip4@1.2.0-beta.1` source says the exchange-enforced minimum is 1 USDC after a 2026-09-05 upgrade, while older README/npm-latest material still shows a 10-USDC client setting. Contour uses the current beta's 1-USDC rule with explicit provenance; this remains a protocol uncertainty to re-audit.
