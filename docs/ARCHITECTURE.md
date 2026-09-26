# Architecture

Dependency direction is one-way:

`domain <- hyperliquid`, `domain <- payoff`, and `(domain, payoff) <- compiler`; `apps/probe` composes the public packages.

`@contour/domain` has the small financial vocabulary and exact base-10 `DecimalAmount`. It has no network or SDK dependency. `@contour/hyperliquid` is an anti-corruption adapter: it reads public `/info` payloads, validates them, and maps them into domain models. Raw protocol and SDK types cannot cross its public API. `@contour/payoff` is deterministic and has no network dependency. `@contour/compiler` accepts only those first-party domain/payoff types; HiGHS is contained behind its solver boundary and the package performs no network calls.

`apps/web` is a thin Next.js orchestration layer. Its server route handlers compose the adapter, compiler, and verifier; React receives only first-party presentation DTOs. Chart samples are display-only and cannot establish a financial pass/fail result. The probes remain manual read-only diagnostics. Failures remain visible; normal tests use fixtures and never call the network.
