# Execution planner

BUILD 03 separates mathematical feasibility from protocol executability. The compiler may return `FEASIBLE` with exact 12-decimal reconstructed solver quantities; the execution planner accepts that result only as input. It binds the result to the exact books, applies protocol rules, rebuilds the acquired portfolio, and invokes the independent exact payoff verifier again. Only that second proof can produce `READY`.

## Protocol precision

Hyperliquid's current rule allows at most five significant figures in a price, plus at most `8 - szDecimals` decimal places for spot-style assets; integer prices remain valid. Size is limited to the asset's `szDecimals`. HIP-4 outcomes share most trading mechanics with spot, but the current `outcomeMeta` response does not expose an outcome-side `szDecimals`. Contour therefore accepts precision only through timestamped protocol metadata and returns `PROTOCOL_METADATA_UNAVAILABLE` for a live plan when that value is absent. It does not infer precision from observed book strings.

BUY limits are rounded upward to the smallest protocol-valid value so a normalized limit never falls below the compiler's source ask. The result must still be at most the outcome payout bound and remain within the exact budget. Formatting uses exact decimal coefficients and removes trailing zeroes; no JavaScript floating-point value is financial authority.

Size planning first tries protocol-valid floor quantities, then deterministically promotes segments to the corresponding ceiling/minimum-notional quantity in cheapest-price, numeric-market, side, and level order. Every candidate is checked against the original segment capacity, exact budget, minimum notional, and terminal payoff. If no candidate survives, the result is blocked; original solver feasibility is never reused as proof.

## Minimum notional and protocol disagreements

Official Hyperliquid documentation does not currently publish a HIP-4 minimum notional. The maintained `@outcome.xyz/hip4` `1.2.0-beta.1` source and changelog state that the exchange-enforced minimum changed from 10 to 1 USDC in the 2026-09-05 network upgrade. Its older README/current npm `latest` examples still show a configurable 10-USDC client floor. Contour records the maintained beta and observation timestamp as provenance, enforces 1 USDC, and keeps the field discriminated so it can become unavailable rather than guessed if that evidence is no longer current.

## Snapshot binding and freshness

`contour-book-v1` identity canonically includes every instrument, outcome side, coin, bid and ask price/quantity/order count, observation timestamp, source, and network. The compiler snapshot identity, current planning identity, and reconstructed request identity must agree. A changed book returns `MARKET_CHANGED`.

Execution freshness is separate from compile freshness and configurable. The fixture uses 45 seconds; the live web planner uses 30 seconds. The report records `observedAt`, `checkedAt`, age, and maximum age. A future timestamp or expired book returns `STALE_MARKET`.

## Fees and order shape

The current official HIP-4 page says outcome-market fees are zero during initial testing. Contour records this as observed protocol metadata rather than applying generic spot/perpetual schedules. Future close/settlement changes remain excluded and called out in warnings.

Builder fees are separate. Official docs say outcome builder codes follow spot behavior and apply to sells; BUILD 03 produces BUY orders only. Builder fees therefore default to disabled/zero. Any nonzero request is blocked as `FEE_UNRESOLVED`; no address, approval, or applicability is invented.

Every order is a protocol-neutral BUY LIMIT with GTC as an explicit future execution intent, its source ask segment, action asset ID, coin, exact strings, minimum-notional evidence, and deterministic `ClientOrderIntentId`. GTC is representable by the current exchange API, but BUILD 03 does not serialize an exchange action. Deterministic order sequencing does not remove partial-fill or multi-leg risk.

## Independent audit and dry-run boundary

`auditExecutionPlan` ignores the report's PASS label. It remaps every order to source depth, rechecks canonical price/size, recalculates notional, checks budget and minimum notional, reconstructs binary premiums, and runs `verifyTerminalPayoff`. The planner audits its own result before returning `READY`.

The report is machine-readable and text-readable, and always states `DRY RUN ONLY`, `NO SIGNATURE`, and `NO BROADCAST`. BUILD 03 has no wallet integration, key material, approval action, signing call, exchange POST, custody, or submission state machine.

## Sources audited 2026-09-26

- [Hyperliquid tick and lot size](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/tick-and-lot-size)
- [Hyperliquid HIP-4 outcome markets](https://hyperliquid.gitbook.io/hyperliquid-docs/hyperliquid-improvement-proposals-hips/hip-4-outcome-markets)
- [Hyperliquid asset IDs](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/asset-ids)
- [Hyperliquid exchange endpoint](https://hyperliquid.gitbook.io/hyperliquid-docs/for-developers/api/exchange-endpoint)
- [Hyperliquid builder codes](https://hyperliquid.gitbook.io/hyperliquid-docs/trading/builder-codes)
- [Maintained Outcome.xyz HIP-4 SDK](https://github.com/Outcome-xyz/hip4)
