# Contour — BUILD 03

Contour is a payoff compiler for Hyperliquid. BUILD 03 adds a dry-run execution-readiness boundary: protocol precision, minimum notional, book/freshness binding, exact post-normalization verification, and a clearly non-executable web preview.

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm probe:markets
pnpm probe:account -- 0xYOUR_PUBLIC_ADDRESS
pnpm probe:compiler:fixture
pnpm probe:compiler:live
pnpm probe:execution:fixture
pnpm probe:execution:live
pnpm dev
```

No key, wallet connection, signature, approval, order submission, broadcast, custody, database, or liquidation guarantee exists in this build.

See [execution planner](docs/EXECUTION_PLANNER.md), [architecture](docs/ARCHITECTURE.md), [web terminal](docs/WEB_TERMINAL.md), [compiler](docs/COMPILER.md), [payoff model](docs/PAYOFF_MODEL.md), [protocol notes](docs/PROTOCOL_NOTES.md), and [security](docs/SECURITY.md).
