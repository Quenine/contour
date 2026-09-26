# Contour — BUILD 00

Contour is a future payoff compiler for Hyperliquid. BUILD 00 is deliberately a small, read-only foundation: it validates public Hyperliquid data, evaluates terminal settlement payoffs exactly, and verifies supported payoff ranges.

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm probe:markets
pnpm probe:account -- 0xYOUR_PUBLIC_ADDRESS
```

No key, signature, order, database, or liquidation guarantee exists in this build.

See [architecture](docs/ARCHITECTURE.md), [payoff model](docs/PAYOFF_MODEL.md), [protocol notes](docs/PROTOCOL_NOTES.md), and [security](docs/SECURITY.md).
