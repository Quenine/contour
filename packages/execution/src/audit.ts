import type { CompileTerminalPayoffRequest } from "@contour/compiler";
import { DecimalAmount } from "@contour/domain";
import { verifyTerminalPayoff, type BinaryTerminalComponent } from "@contour/payoff";
import { normalizeLimitPrice } from "./decimal.js";
import { executionSnapshot } from "./identity.js";
import type { ExecutionBlocker, ExecutionPlan, ExecutionPlanAudit } from "./types.js";

/** Rebuilds authority from request books and order fields; it never trusts the report's PASS label. */
export function auditExecutionPlan(request: CompileTerminalPayoffRequest, plan: ExecutionPlan): ExecutionPlanAudit {
  const snapshot = executionSnapshot(request);
  if (snapshot.identity !== plan.snapshot.identity || snapshot.identity !== plan.compilerSnapshotIdentity) return { passed: false, blockers: [{ kind: "MARKET_CHANGED", expectedSnapshotIdentity: plan.compilerSnapshotIdentity, actualSnapshotIdentity: snapshot.identity }] };
  const blockers: ExecutionBlocker[] = []; const binaries: BinaryTerminalComponent[] = [];
  for (const order of plan.orders) {
    const instrument = request.instruments.find((item) => item.market.id === order.marketId);
    const source = (order.side === "yes" ? instrument?.yesBook : instrument?.noBook)?.asks[order.sourceBookLevel];
    if (!instrument || !source || source.price.compare(order.sourcePrice) !== 0 || source.quantity.compare(order.sourceAvailableQuantity) !== 0) {
      blockers.push({ kind: "INVALID_COMPILER_RESULT", explanation: `order ${order.sequence} no longer maps to its source ask segment` }); continue;
    }
    const canonicalPrice = normalizeLimitPrice(source.price, order.precision, "BUY");
    if (canonicalPrice.text !== order.plannedPriceText || canonicalPrice.value.compare(order.plannedLimitPrice) !== 0 || order.plannedQuantity.toString() !== order.plannedQuantityText || order.plannedQuantity.scale > order.precision.szDecimals) blockers.push({ kind: "PRECISION_UNSUPPORTED", marketId: order.marketId, side: order.side, explanation: `order ${order.sequence} contains non-canonical protocol decimals` });
    if (order.plannedQuantity.isZero() || order.plannedQuantity.compare(source.quantity) > 0) blockers.push({ kind: "INSUFFICIENT_CURRENT_DEPTH", marketId: order.marketId, side: order.side, requested: order.plannedQuantity.toString(), available: source.quantity.toString() });
    const exactNotional = order.plannedLimitPrice.multiply(order.plannedQuantity);
    if (exactNotional.compare(order.notional) !== 0 || exactNotional.compare(order.minimumNotional.amount) < 0) blockers.push({ kind: "MIN_NOTIONAL_VIOLATION", marketId: order.marketId, side: order.side, minimumNotional: order.minimumNotional.amount.toString(), maximumPossibleNotional: exactNotional.toString() });
    binaries.push({ kind: "binary", comparator: instrument.market.comparator, threshold: instrument.market.threshold, side: order.side, shares: order.plannedQuantity, premium: exactNotional });
  }
  if (blockers.length > 0) return { passed: false, blockers };
  const totalCost = plan.orders.reduce((sum, order) => sum.add(order.notional), DecimalAmount.zero);
  const verification = verifyTerminalPayoff({ components: [...request.existingPortfolio.components, ...binaries] }, { settlementPriceMin: request.settlement.priceRange.min, settlementPriceMax: request.settlement.priceRange.max, minimumPnl: request.constraint.minimumTerminalPnl });
  if (totalCost.compare(request.maximumAcquisitionCost) > 0 || !verification.holds) return { passed: false, blockers: [{ kind: "ROUNDING_INVALIDATED_PAYOFF", explanation: "the independently reconstructed plan violates the exact budget or terminal payoff floor" }] };
  return { passed: true, verification, totalCost };
}
