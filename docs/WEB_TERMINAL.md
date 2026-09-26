# Web terminal (BUILD 02.1)

Contour opens directly into a read-only terminal with two explicitly separate modes.

`Verified Fixture Demo` is deterministic data and uses the same compiler and exact verifier as the production packages. It is intentionally labelled as a demo and provides a reproducible feasible construction.

`Live Market` reads public Hyperliquid BTC perpetual data, normalized HIP-4 binaries, and only the selected exact settlement group's books. It never falls back to fixture data. A live infeasibility result is a truthful statement about the captured eligible liquidity, not an application error.

Financial compilation and verification occur in server route handlers. Browser components receive first-party presentation DTOs only; they never receive raw Hyperliquid payloads and never determine whether a payoff passes. The chart uses display samples solely for visualization. Exact verifier evidence, including symbolic boundary states, remains authoritative.

Every result carries a deterministic compiler-request identity. The terminal renders it only while its active mode, compiler-affecting inputs, and (for live requests) captured market context still match. Mode switches, edits, and market refreshes clear the visible construction before another compile. Exact order-book snapshot identity remains attached to a live result for traceability.

The verified fixture is deterministic BTC-denominated demo data, not live liquidity. Money, BTC prices, quantities, and UTC timestamps cross a presentation-only formatting boundary; exact decimal values remain in the compiler and verifier.

Public-account inspection accepts a public address, reads public perpetual positions, and allows a supported BTC position to be selected as a read-only input. It does not connect a wallet or imply account control.

Freshness is shown as `LIVE`, `STALE`, or `UNAVAILABLE`. A verified live compile has a strict book-age policy, so stale books cannot be silently used.

For local development, install workspace dependencies and run `pnpm dev`. The terminal is available at `/`; `/system` reports read-only integration status. No signing, execution, or custody capability exists.

BUILD 02.1 audited reported `data-scribe-recorder-ready` hydration markup and MetaMask connection noise. Neither string nor a wallet API reference exists in Contour; the observed messages originate in browser extensions and receive no application workaround.
