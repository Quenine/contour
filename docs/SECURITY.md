# Security

BUILD 01 remains read-only. It has no wallet connector, private-key parameter, signing code, order endpoint, authentication flow, database, or secret configuration. The local HiGHS WebAssembly solver receives only normalized numerical model data and performs no network calls.

The public-address probe accepts only an address and calls the public account-state endpoint. Network data is untrusted and validated before becoming a Contour model. Failed requests become explicit typed errors; they are never silently replaced with fixtures.

Compiler output is independently exact-verified, but terminal-payoff verification is not a safety guarantee against liquidation, oracle behavior, market outages, stale liquidity after the snapshot, execution slippage, fees excluded by policy, or settlement disputes.

The BUILD 02 web terminal validates browser input again on the server. Public-address inspection is read-only; it does not connect a wallet or establish account control. Raw protocol payloads and internal error stacks are not returned to browser components.
