# Contour · BUILD 04 technical brief

## Product

Contour turns a terminal PnL constraint over a specified BTC settlement range into a minimum-cost, buy-only HIP-4 binary overlay. It is an inspection and compilation tool, not an execution product. The demo provides an immediately runnable deterministic fixture and a separate public read-only live workflow.

## Problem and protocol opportunity

A portfolio's settlement payoff can be discontinuous, while manually choosing binary outcome positions across multiple strikes is easy to mis-size and expensive to reason about. HIP-4 outcome markets expose price-contingent contracts and observable order-book depth; a construction must therefore reason about both the payoff at settlement and the actual offered liquidity used to build it.

## What is different

Contour treats the desired terminal floor as a compilation constraint, rather than asking a trader to hand-pick strikes. It connects a recognized same-settlement outcome universe to an optimization model, then checks the result independently with exact decimal arithmetic. Its output carries request and book-snapshot identities, so a proof is not presented as belonging to a different set of inputs or observations.

## Compiler formulation and exact verification

The compiler models existing perpetual exposure and binary payoff segments over the requested settlement interval. It minimizes acquisition cost subject to the terminal PnL floor, budget, and finite ask-depth constraints. Candidate solver values are reconstructed into exact decimal domain values; an independent interval/boundary verifier determines whether the requested floor holds. A chart samples this function for orientation but is never authoritative.

## Liquidity awareness

Each ask level is a separate bounded construction segment. The compiler cannot allocate more quantity to a level than the observed size and reports chosen segments alongside available depth. Reads are timestamped and the live path does not substitute stale or fixture books when a read fails. Book data is uncached; an infeasible result is a valid statement about the eligible current snapshot, not proof the solver failed.

## Execution planning and protocol evidence

The planner applies protocol normalization, fee/precision/notional rules, snapshot freshness, and a second exact portfolio verification. Every execution-critical rule records authority, source, network, observation time, applicability, and confidence. `STRICT_MAINNET` rejects evidence that is merely empirical, fixture-derived, or not explicitly applicable; unresolved HIP-4 precision keeps live execution readiness blocked. The preview is a dry-run representation only.

## Current limitations

The model covers terminal payoff at a specified settlement horizon; it does not model liquidation paths, funding, future liquidity, partial fills, settlement disputes, or guarantee execution. The live integration depends on a public read-only Info API, recognizes only validated BTC binary market formats, excludes fees where shown, and truthfully reports missing or infeasible live data. No wallet or order action exists.

## Demo path

Open the terminal, keep **Verified Fixture Demo** selected, and choose **Run verified demo**. The fixture passes through the same compiler, exact verifier, and development dry-run planner without contacting Hyperliquid. Switch to **Live Market** to inspect freshness and current eligible horizons; provider failures and infeasible snapshots remain distinct from fixture output. Use **Preview Execution** to inspect the non-submitting readiness result.

## Runtime shape

`apps/web` is a Next.js App Router app. It serves the terminal, `/system`, fixture compile/preview endpoints, public account inspection, live market discovery/compilation, and `/api/health`. Workspace packages separate domain values, protocol normalization, payoff math, compilation, exact verification, and execution planning. The web DTO is the presentation boundary: protocol payloads and compiler internals do not cross into React.

The deterministic fixture runs locally through the same compiler, independent verifier, and dry-run planner. Live compilation fetches current metadata and current side books, uses bounded concurrency, and attaches freshness and exact snapshot identities. A live-provider error remains an explicit error; fixture values are never used as a fallback.

## Trust and financial boundary

The compiler's numerical feasibility and the execution planner's protocol readiness are separate results. BUILD 03.1's evidence model is unchanged: strict-mainnet execution remains blocked when authoritative, applicable precision/notional evidence is unresolved. The fixture may illustrate a labelled dry run, but no report describes it as a submitted order. Chart samples are explanatory only; exact arithmetic and the independent verifier determine whether the constraint holds.

There is no wallet, key, signature, approval, order-action serialization, order submission, broadcast, custody, or account-control proof. Public account inspection reads public state from a user-supplied address. Fees and venue-dependent risks remain disclosed; there is no liquidation or outcome guarantee.

## BUILD 04 operational protections

- Eight-second upstream read timeout, one retry for transient idempotent Info reads, and 15-second in-memory caching/coalescing for successful outcome metadata only.
- Current order books and public account state are never cached; all API and browser reads use `no-store`.
- Live book fetches cap at three markets concurrently and reject horizons over 80 eligible markets.
- Public JSON requests are content-type checked, capped at 16 KiB, and field-validated; public addresses are syntax checked. Expensive routes have bounded per-instance fixed-window limits, with edge/CDN controls recommended for coordinated quotas.
- API errors are intentionally generic for provider/server failures. Structured logs contain event, error class, service, and time only—never addresses, payloads, or exception messages.
- `/api/health` reports app/compiler/verifier and live-provider availability separately. `/system` remains renderable during upstream degradation.
- CSP, HSTS (production), frame denial, MIME sniffing protection, referrer and permissions policies are configured at the app boundary.
- CI runs lint, typecheck, unit/property tests, and production build without contacting the exchange. The production smoke script checks rendered pages, headers, health/build identity, fixture paths, and method guards.

## Deploy and verify

Use Node.js 22.12+, pnpm 11.15.1, repository-root install/build, and the `apps/web` Next.js package on Vercel. No secrets are required. See [deployment and operations](DEPLOYMENT.md).

Quality gates: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`. Production check: `pnpm start` then `pnpm smoke:production -- http://localhost:3000`. Live probes are optional operational observations, not CI gates or execution evidence.
