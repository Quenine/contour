import { DecimalAmount, type Price } from "@contour/domain";
import { type BinaryTerminalComponent, type TerminalPortfolio } from "./payoff.js";
import { deriveRelevantSettlementStates, terminalPnlAtSettlementState, type SettlementStatePosition } from "./settlement-states.js";

export interface TerminalPayoffConstraint { readonly minimumPnl: DecimalAmount; readonly settlementPriceMin: Price; readonly settlementPriceMax: Price; }
export interface VerificationPoint { readonly price: Price; readonly position: SettlementStatePosition; readonly terminalPnl: DecimalAmount; }
export interface SettlementPayoffVerification { readonly kind: "SettlementPayoffVerification"; readonly holds: boolean; readonly constraint: TerminalPayoffConstraint; readonly worstCase: VerificationPoint; readonly evaluatedPoints: readonly VerificationPoint[]; }

/**
 * Exact for the supported payoff family: one or more linear perps plus finite binary
 * steps. Between strikes the sum is linear, so its infimum is at a segment boundary.
 * At a strike we test the actual value and both one-sided limits; a closed interval
 * excludes exterior limits at its endpoints. Funding and liquidation paths are not modelled.
 */
export function verifyTerminalPayoff(portfolio: TerminalPortfolio, constraint: TerminalPayoffConstraint): SettlementPayoffVerification {
  const strikes = portfolio.components.filter((component): component is BinaryTerminalComponent => component.kind === "binary").map((component) => component.threshold)
  const points: VerificationPoint[] = deriveRelevantSettlementStates(constraint.settlementPriceMin, constraint.settlementPriceMax, strikes)
    .map((state) => ({ ...state, terminalPnl: terminalPnlAtSettlementState(portfolio, state) }));
  const worstCase = points.reduce((worst, point) => point.terminalPnl.compare(worst.terminalPnl) < 0 ? point : worst);
  return { kind: "SettlementPayoffVerification", holds: worstCase.terminalPnl.compare(constraint.minimumPnl) >= 0, constraint, worstCase, evaluatedPoints: points };
}
