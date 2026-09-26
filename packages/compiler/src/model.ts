import { DecimalAmount, type BinaryPriceOutcome, type MarketFreshness, type OrderBookLevel, type OutcomeSide } from "@contour/domain";
import { binaryResolvesYesAtState, terminalPnlAtSettlementState, type SettlementState } from "@contour/payoff";
import type { CompileTerminalPayoffRequest, ExecutableBinaryInstrument } from "./types.js";

export interface DecisionSegment {
  readonly variable: string;
  readonly market: BinaryPriceOutcome;
  readonly side: OutcomeSide;
  readonly bookLevel: number;
  readonly price: DecimalAmount;
  readonly available: DecimalAmount;
  readonly feePerShare: DecimalAmount;
  readonly freshness: MarketFreshness;
}

export interface ValidatedProblem {
  readonly request: CompileTerminalPayoffRequest;
  readonly instruments: readonly ExecutableBinaryInstrument[];
  readonly segments: readonly DecisionSegment[];
  readonly states: readonly SettlementState[];
}

export const unitCost = (segment: DecisionSegment): DecimalAmount => segment.price.add(segment.feePerShare);

export function contributionAtState(segment: DecisionSegment, state: SettlementState): DecimalAmount {
  const resolvesYes = binaryResolvesYesAtState({ comparator: segment.market.comparator, threshold: segment.market.threshold }, state);
  const wins = segment.side === "yes" ? resolvesYes : !resolvesYes;
  return (wins ? DecimalAmount.one : DecimalAmount.zero).subtract(unitCost(segment));
}

function expression(terms: readonly { coefficient: DecimalAmount; variable: string }[]): string {
  if (terms.length === 0) return "0";
  return terms.map(({ coefficient, variable }, index) => {
    const negative = coefficient.isNegative();
    const sign = negative ? "-" : index === 0 ? "" : "+";
    return `${sign} ${coefficient.abs().toString()} ${variable}`.trim();
  }).join(" ");
}

export function buildLinearProgram(problem: ValidatedProblem, includeBudget: boolean): string {
  const objective = expression(problem.segments.map((segment) => ({ coefficient: unitCost(segment), variable: segment.variable })));
  const rows = problem.states.map((state, index) => {
    const existing = terminalPnlAtSettlementState(problem.request.existingPortfolio, state);
    const required = problem.request.constraint.minimumTerminalPnl.subtract(existing);
    const terms = problem.segments.map((segment) => ({ coefficient: contributionAtState(segment, state), variable: segment.variable }));
    return ` state_${index}: ${expression(terms)} >= ${required.toString()}`;
  });
  if (includeBudget) rows.push(` budget: ${objective} <= ${problem.request.maximumAcquisitionCost.toString()}`);
  const bounds = problem.segments.map((segment) => ` 0 <= ${segment.variable} <= ${segment.available.toString()}`);
  return ["Minimize", ` cost: ${objective}`, "Subject To", ...rows, "Bounds", ...bounds, "End"].join("\n");
}

export function validateBookLevels(levels: readonly OrderBookLevel[], context: string): readonly string[] {
  const issues: string[] = [];
  levels.forEach((level, index) => {
    if (level.price.compare(DecimalAmount.zero) <= 0 || level.price.compare(DecimalAmount.one) > 0) issues.push(`${context} ask ${index} price must be in (0, 1]`);
    if (level.quantity.compare(DecimalAmount.zero) <= 0) issues.push(`${context} ask ${index} quantity must be positive`);
    if (index > 0 && level.price.compare(levels[index - 1]!.price) < 0) issues.push(`${context} asks must be ordered cheapest first`);
  });
  return issues;
}
