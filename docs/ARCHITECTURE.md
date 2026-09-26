# Architecture

Dependency direction is one-way:

`domain <- hyperliquid`, `domain <- payoff`, and `(domain, payoff) <- compiler`; `apps/probe` composes the public packages.

`@contour/domain` has the small financial vocabulary and exact base-10 `DecimalAmount`. It has no network or SDK dependency. `@contour/hyperliquid` is an anti-corruption adapter: it reads public `/info` payloads, validates them, and maps them into domain models. Raw protocol and SDK types cannot cross its public API. `@contour/payoff` is deterministic and has no network dependency. `@contour/compiler` accepts only those first-party domain/payoff types; HiGHS is contained behind its solver boundary and the package performs no network calls.

The probes are manual read-only diagnostics, not an application UI. The live compiler probe composes the adapter with the otherwise network-free compiler. Failures remain visible; normal tests use fixtures and never call the network.
