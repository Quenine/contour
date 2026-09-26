import { DecimalAmount, type Price } from "@contour/domain";
import { terminalPnl, type BinaryTerminalComponent, type TerminalPortfolio } from "./payoff.js";

export interface TerminalPayoffConstraint { readonly minimumPnl: DecimalAmount; readonly settlementPriceMin: Price; readonly settlementPriceMax: Price; }
export interface VerificationPoint { readonly price: Price; readonly position: "exact" | "leftLimit" | "rightLimit"; readonly terminalPnl: DecimalAmount; }
export interface SettlementPayoffVerification { readonly kind: "SettlementPayoffVerification"; readonly holds: boolean; readonly constraint: TerminalPayoffConstraint; readonly worstCase: VerificationPoint; readonly evaluatedPoints: readonly VerificationPoint[]; }

function payoutAtSide(component: BinaryTerminalComponent, strike: Price, side: "leftLimit" | "rightLimit"): DecimalAmount {
  const strikeComparedToOutcome = strike.compare(component.threshold);
  let resolvesYes: boolean;
  if (strikeComparedToOutcome < 0) resolvesYes = false;
  else if (strikeComparedToOutcome > 0) resolvesYes = true;
  else resolvesYes = side === "rightLimit";
  const wins = component.side === "yes" ? resolvesYes : !resolvesYes;
  return (wins ? component.shares : DecimalAmount.zero).subtract(component.premium);
}
function terminalPnlAtLimit(portfolio: TerminalPortfolio, strike: Price, side: "leftLimit" | "rightLimit"): DecimalAmount {
  return portfolio.components.reduce<DecimalAmount>((sum, component) => {
    if (component.kind === "perpetual") {
      const raw = component.quantity.multiply(strike.subtract(component.entryPrice));
      return sum.add(component.direction === "long" ? raw : raw.negate());
    }
    return sum.add(payoutAtSide(component, strike, side));
  }, DecimalAmount.zero);
}

/**
 * Exact for the supported payoff family: one or more linear perps plus finite binary
 * steps. Between strikes the sum is linear, so its infimum is at a segment boundary.
 * At a strike we test the actual value and both one-sided limits; a closed interval
 * excludes exterior limits at its endpoints. Funding and liquidation paths are not modelled.
 */
export function verifyTerminalPayoff(portfolio: TerminalPortfolio, constraint: TerminalPayoffConstraint): SettlementPayoffVerification {
  if (constraint.settlementPriceMin.compare(constraint.settlementPriceMax) > 0) throw new RangeError("settlementPriceMin must not exceed settlementPriceMax");
  const points: VerificationPoint[] = [
    { price: constraint.settlementPriceMin, position: "exact", terminalPnl: terminalPnl(portfolio, constraint.settlementPriceMin) },
    { price: constraint.settlementPriceMax, position: "exact", terminalPnl: terminalPnl(portfolio, constraint.settlementPriceMax) }
  ];
  const strikes = portfolio.components.filter((component): component is BinaryTerminalComponent => component.kind === "binary").map((component) => component.threshold)
    .filter((strike, index, all) => strike.compare(constraint.settlementPriceMin) > 0 && strike.compare(constraint.settlementPriceMax) < 0 && all.findIndex((candidate) => candidate.compare(strike) === 0) === index);
  for (const strike of strikes) {
    points.push({ price: strike, position: "leftLimit", terminalPnl: terminalPnlAtLimit(portfolio, strike, "leftLimit") });
    points.push({ price: strike, position: "exact", terminalPnl: terminalPnl(portfolio, strike) });
    points.push({ price: strike, position: "rightLimit", terminalPnl: terminalPnlAtLimit(portfolio, strike, "rightLimit") });
  }
  const worstCase = points.reduce((worst, point) => point.terminalPnl.compare(worst.terminalPnl) < 0 ? point : worst);
  return { kind: "SettlementPayoffVerification", holds: worstCase.terminalPnl.compare(constraint.minimumPnl) >= 0, constraint, worstCase, evaluatedPoints: points };
}
