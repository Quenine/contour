import { DecimalAmount, type Price } from "@contour/domain";
import { perpetualTerminalPnl, terminalPnl, type BinaryTerminalComponent, type TerminalPortfolio } from "./payoff.js";

export type SettlementStatePosition = "leftLimit" | "exact" | "rightLimit";
export interface SettlementState { readonly price: Price; readonly position: SettlementStatePosition; }

const positionOrder: Record<SettlementStatePosition, number> = { leftLimit: 0, exact: 1, rightLimit: 2 };

/**
 * Derives every economically distinct state in a closed interval. A strike at
 * an interval endpoint contributes only the one-sided limit that lies inside
 * the interval; no arbitrary epsilon is used.
 */
export function deriveRelevantSettlementStates(min: Price, max: Price, strikes: readonly Price[]): readonly SettlementState[] {
  if (min.compare(max) > 0) throw new RangeError("settlementPriceMin must not exceed settlementPriceMax");
  const states: SettlementState[] = [{ price: min, position: "exact" }];
  if (max.compare(min) !== 0) states.push({ price: max, position: "exact" });
  const uniqueStrikes = strikes
    .filter((strike) => strike.compare(min) >= 0 && strike.compare(max) <= 0)
    .filter((strike, index, all) => all.findIndex((candidate) => candidate.compare(strike) === 0) === index);
  for (const strike of uniqueStrikes) {
    if (strike.compare(min) > 0) states.push({ price: strike, position: "leftLimit" });
    if (!states.some((state) => state.position === "exact" && state.price.compare(strike) === 0)) states.push({ price: strike, position: "exact" });
    if (strike.compare(max) < 0) states.push({ price: strike, position: "rightLimit" });
  }
  return states.sort((left, right) => left.price.compare(right.price) || positionOrder[left.position] - positionOrder[right.position]);
}

export function binaryResolvesYesAtState(component: Pick<BinaryTerminalComponent, "comparator" | "threshold">, state: SettlementState): boolean {
  const comparison = state.price.compare(component.threshold);
  if (comparison < 0) return false;
  if (comparison > 0) return true;
  if (state.position === "leftLimit") return false;
  if (state.position === "rightLimit") return true;
  return component.comparator === "greaterThanOrEqual";
}

export function terminalPnlAtSettlementState(portfolio: TerminalPortfolio, state: SettlementState): DecimalAmount {
  if (state.position === "exact") return terminalPnl(portfolio, state.price);
  return portfolio.components.reduce<DecimalAmount>((sum, component) => {
    if (component.kind === "perpetual") return sum.add(perpetualTerminalPnl(component, state.price));
    const wins = component.side === "yes" ? binaryResolvesYesAtState(component, state) : !binaryResolvesYesAtState(component, state);
    return sum.add((wins ? component.shares : DecimalAmount.zero).subtract(component.premium));
  }, DecimalAmount.zero);
}
