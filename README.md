# Contour — BUILD 00

Contour is a payoff compiler for Hyperliquid. BUILD 02 provides a read-only web terminal around the existing exact compiler: deterministic fixture and live-market workflows, payoff visualization, construction detail, and exact verification evidence.

```sh
pnpm install
pnpm lint && pnpm typecheck && pnpm test && pnpm build
pnpm probe:markets
pnpm probe:account -- 0xYOUR_PUBLIC_ADDRESS
pnpm probe:compiler:fixture
pnpm probe:compiler:live
pnpm dev
```

No key, signature, order submission, database, or liquidation guarantee exists in this build.

See [architecture](docs/ARCHITECTURE.md), [web terminal](docs/WEB_TERMINAL.md), [compiler](docs/COMPILER.md), [payoff model](docs/PAYOFF_MODEL.md), [protocol notes](docs/PROTOCOL_NOTES.md), and [security](docs/SECURITY.md).
