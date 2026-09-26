# Architecture

Dependency direction is one-way:

`domain <- hyperliquid` and `domain <- payoff`; `apps/probe -> hyperliquid`.

`@contour/domain` has the small financial vocabulary and exact base-10 `DecimalAmount`. It has no network or SDK dependency. `@contour/hyperliquid` is an anti-corruption adapter: it reads public `/info` payloads, validates them, and maps them into domain models. Raw protocol and SDK types cannot cross its public API. `@contour/payoff` is deterministic and has no network dependency.

The probe is a manual read-only diagnostic, not an application UI. Its failures remain visible; normal tests use fixtures and never call the network.
