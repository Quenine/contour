# Contour compiler (BUILD 01)

The compiler synthesizes a minimum-cost, buy-only HIP-4 binary overlay for one fixed terminal portfolio and one exact settlement horizon. It is terminal-payoff synthesis, not trade execution or liquidation insurance.

## Supported optimization problem

Every ask level on every eligible YES and NO book becomes a separate continuous decision variable `q(i)` with exact bounds `0 <= q(i) <= displayedDepth(i)`. The objective minimizes acquisition premium plus any explicitly supplied deterministic per-share fee. A best ask, midpoint, or theoretical probability is never substituted for book depth.

For every relevant settlement state, the LP contains:

`existing terminal PnL + sum((binary payout - unit cost - included fee) × q(i)) >= requested floor`

It also enforces total budget and level-capacity bounds. The compiler first checks the existing portfolio and returns `ALREADY_SATISFIED` when no overlay is needed. If a budgeted model is infeasible, an uncapped solve distinguishes `BUDGET_TOO_LOW` from structural liquidity or payoff coverage failure.

## Eligibility and discontinuities

An instrument is eligible only when its normalized underlying and UTC settlement timestamp exactly equal the request. Different horizons are never combined. Ambiguous/generic markets cannot enter the compiler API.

Settlement states are derived symbolically from the closed interval endpoints and all eligible strikes. Exact strike values and the one-sided states lying inside the interval are separate states at the same numeric price. This includes strikes located exactly at `Smin` or `Smax`. No epsilon or price-grid sampling is used.

## Numerical boundary and verification

Domain inputs and LP coefficients originate as exact `DecimalAmount` values. HiGHS 1.15 solves the continuous LP using floating-point arithmetic with a documented `1e-7` solver feasibility tolerance. Candidate quantities are reconstructed as bounded exact decimals with 12 decimal places; this is a solver-output normalization, **not** a claim about exchange lot precision.

The reconstructed portfolio is independently evaluated by the exact BUILD 00 settlement-payoff verifier. Exact depth bounds, exact budget, and every exact/one-sided settlement state must pass without tolerance before the compiler may return `FEASIBLE`. A solver success that fails reconstruction or exact verification returns `VERIFICATION_FAILED`.

## Fees and precision

The fee boundary is explicit. `excluded` means the guarantee and budget contain acquisition premium but no transaction fee. `fixedPerShare` includes the supplied exact fee in both the optimization and terminal payoff. Contour does not fabricate a live fee percentage.

Current outcome metadata/order books do not provide a sufficiently reliable execution lot/quantity-precision rule for BUILD 01. The compiler therefore reports exact normalized depth-segment quantities and does not claim those quantities are directly signable. Execution precision must be resolved and reverified in a later execution build.

## Unsupported

Selling, borrowing, price buckets, multiple timestamps, cross-asset hedges, funding forecasts, margin/liquidation paths, correlations, integer lot constraints, signing, and order submission are out of scope.
