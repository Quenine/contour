# Deployment and operations · BUILD 04

## Vercel

In Vercel, import the GitHub repository, select **Other** only if automatic Next.js detection does not activate, and set the project root directory to `apps/web`. Keep the package manager lockfile at the repository root and let Vercel install the pnpm workspace. Set the install command to `pnpm install --frozen-lockfile` and the build command to `pnpm --filter @contour/web... build` so the app's local package dependencies are built first. Leave the output directory to Next.js' default. The app package is `@contour/web`. Use Node.js 22.12 or newer (the repository pins the minimum) and pnpm 11.15.1. See Vercel's [monorepo root-directory guide](https://vercel.com/docs/monorepos) and [build settings](https://vercel.com/docs/builds/configure-a-build).

CLI alternative from the repository root: link the project once with `pnpm dlx vercel link`, configure the Vercel project root as `apps/web`, then deploy with `pnpm dlx vercel deploy` for a preview or `pnpm dlx vercel deploy --prod` for production. Vercel documents these [CLI deploy commands](https://vercel.com/docs/cli/deploy).

No environment variables or secrets are required. The optional public revision identity uses only `VERCEL_GIT_COMMIT_SHA`, `GITHUB_SHA`, or `BUILD_ID`; arbitrary values are reduced to `deployment` and are never used as credentials. Do not add wallet, signing, or exchange-action secrets to this build.

## Runtime behavior

- Public API JSON and browser fetches are `no-store`; no market, account, compiler, or execution response is served from a shared cache.
- Successful outcome metadata alone has a 15-second in-process cache, with in-flight request coalescing. Order books and account state are never cached. Cache state is per serverless instance and is not a consistency guarantee.
- Each upstream Info read has an 8-second bounded timeout, one retry for transient network/5xx/rate-limit responses, and no retry for deterministic client errors or invalid payloads. Live order-book reads are capped at three markets in flight and 80 markets per request.
- The health route has a 2.5-second upstream timeout. It returns application/compiler/verifier health separately from `liveData`; upstream degradation does not make the deterministic fixture unavailable.
- API JSON bodies are capped at 16 KiB, validated again on the server, and replies do not expose provider payloads, stack traces, or address values in logs. Expensive and public read routes have simple per-instance fixed-window limits; these are a coarse abuse guard, not a distributed quota.

`/api/health` is a lightweight deployment check. A healthy app may return `liveData: "degraded"`; that is an upstream condition, not a failed deployment. All API responses are non-cacheable. Platform/CDN-level abuse controls are still recommended for a public production deployment because in-process limits cannot coordinate across serverless instances.

## Verification and rollback

Before promotion, run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`, then start the production server and run `pnpm smoke:production -- https://DEPLOYMENT_HOST`. The smoke script checks page rendering, CSP, health identity, both deterministic fixture endpoints, and method restrictions; it does not require live exchange data to be healthy.

After deployment, check `/api/health` and `/system`. If live reads degrade, keep the deployment up if the fixture/compiler path is healthy, show the provider status, and do not substitute synthetic prices/books into Live Market. Roll back by promoting the last healthy deployment through the platform's deployment controls; no database migration or external protocol action exists in this build.

## Headers and CSP

The Next.js config sets CSP, HSTS in production, `X-Content-Type-Options`, frame denial, strict referrer policy, and a restrictive permissions policy. Inline script/style allowances are required for the current Next.js rendering model; production does not allow `unsafe-eval`. Re-test the policy when adding analytics, fonts, image hosts, or client-side provider connections instead of broadly adding wildcards.
