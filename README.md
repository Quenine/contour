# Contour — BUILD 00

Contour is a payoff compiler for Hyperliquid. BUILD 01 adds a read-only optimizer that consumes normalized HIP-4 ask depth and synthesizes the cheapest supported binary overlay, followed by independent exact terminal-payoff verification.

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm probe:markets
pnpm probe:account -- 0xYOUR_PUBLIC_ADDRESS
pnpm probe:compiler:fixture
pnpm probe:compiler:live
```

No key, signature, order submission, database, or liquidation guarantee exists in this build.

See [architecture](docs/ARCHITECTURE.md), [compiler](docs/COMPILER.md), [payoff model](docs/PAYOFF_MODEL.md), [protocol notes](docs/PROTOCOL_NOTES.md), and [security](docs/SECURITY.md).
