# Terminal payoff model

All money, price, and quantity calculations use exact decimal coefficients (`bigint` plus base-10 scale), never JavaScript floating point.

For a perpetual, BUILD 00 evaluates `direction × quantity × (settlementPrice − entryPrice)`. Funding, fees, margin changes, and other external terms are explicitly excluded. A binary position pays its number of shares when its selected YES/NO side resolves, less the explicitly represented acquisition premium.

For a portfolio of linear perpetual components and binary steps, payoff is piecewise linear. The verifier checks interval endpoints, each strike's actual value, and every one-sided limit lying inside the closed interval. This includes the right-hand state for a strike at `Smin` and the left-hand state for a strike at `Smax`—a BUILD 01 correction to BUILD 00's endpoint handling. A linear function reaches its infimum at segment boundaries, so these values establish the true worst case for this supported family without arbitrary dense sampling.

This is **terminal settlement payoff** verification only. It does not model margin requirements, mark-price movement, funding, exchange operation, or path-dependent perpetual liquidation before settlement. A passing result must never be interpreted as liquidation insurance.
