import { DecimalAmount, type AssetSymbol, type Comparator, type Direction, type OutcomeSide, type Price, type Quantity } from "@contour/domain";

export interface PerpetualTerminalComponent { readonly kind: "perpetual"; readonly asset?: AssetSymbol; readonly direction: Direction; readonly quantity: Quantity; readonly entryPrice: Price; readonly externalTerms: "excluded"; }
export interface BinaryTerminalComponent { readonly kind: "binary"; readonly comparator: Comparator; readonly threshold: Price; readonly side: OutcomeSide; readonly shares: Quantity; readonly premium: DecimalAmount; }
export type TerminalPayoffComponent = PerpetualTerminalComponent | BinaryTerminalComponent;
export interface TerminalPortfolio { readonly components: readonly TerminalPayoffComponent[]; }

export function perpetualTerminalPnl(component: PerpetualTerminalComponent, settlementPrice: Price): DecimalAmount {
  const raw = component.quantity.multiply(settlementPrice.subtract(component.entryPrice));
  return component.direction === "long" ? raw : raw.negate();
}
export function binaryResolvesYes(comparator: Comparator, settlementPrice: Price, threshold: Price): boolean {
  const comparison = settlementPrice.compare(threshold);
  return comparator === "greaterThanOrEqual" ? comparison >= 0 : comparison > 0;
}
export function binaryTerminalPnl(component: BinaryTerminalComponent, settlementPrice: Price): DecimalAmount {
  const resolvesYes = binaryResolvesYes(component.comparator, settlementPrice, component.threshold);
  const wins = component.side === "yes" ? resolvesYes : !resolvesYes;
  return (wins ? component.shares : DecimalAmount.zero).subtract(component.premium);
}
export function terminalPnl(portfolio: TerminalPortfolio, settlementPrice: Price): DecimalAmount {
  return portfolio.components.reduce<DecimalAmount>((sum, component) => sum.add(component.kind === "perpetual" ? perpetualTerminalPnl(component, settlementPrice) : binaryTerminalPnl(component, settlementPrice)), DecimalAmount.zero);
}
export function evaluateScenarios(portfolio: TerminalPortfolio, settlementPrices: readonly Price[]): readonly { readonly settlementPrice: Price; readonly terminalPnl: DecimalAmount }[] {
  return settlementPrices.map((settlementPrice) => ({ settlementPrice, terminalPnl: terminalPnl(portfolio, settlementPrice) }));
}
