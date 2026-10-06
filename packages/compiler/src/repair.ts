import { DecimalAmount } from "@contour/domain";
import { terminalPnlAtSettlementState } from "@contour/payoff";
import { contributionAtState, unitCost, type ValidatedProblem } from "./model.js";

// This is compiler reconstruction precision. Exchange lot-size normalization is a
// separate execution-planner boundary and may have much coarser increments.
export const CANDIDATE_DECIMAL_PLACES = 12;
const ticks = ["0.000000000000001", "0.00000000000001", "0.0000000000001", "0.000000000001"].map((value) => DecimalAmount.parse(value));
const maximumVariables = 4;
const maximumTicks = 4;

/**
 * Search a small exact decimal neighborhood of a floating LP proposal. Every
 * payoff row, the budget, and every variable bound are checked as exact decimals.
 * Failure to find a point is not an infeasibility proof; the caller fails closed.
 */
export function repairQuantities(problem: ValidatedProblem, quantities: readonly DecimalAmount[], includeBudget: boolean): readonly DecimalAmount[] | undefined {
  const floor = problem.request.constraint.minimumTerminalPnl;
  const states = problem.states;
  const basePnl = states.map((state) => problem.segments.reduce((total, segment, index) => total.add(contributionAtState(segment, state).multiply(quantities[index]!)), terminalPnlAtSettlementState(problem.request.existingPortfolio, state)));
  const deficits = basePnl.map((pnl) => floor.subtract(pnl));
  const violated = deficits.map((deficit, index) => deficit.compare(DecimalAmount.zero) > 0 ? index : -1).filter((index) => index >= 0);
  const baseCost = problem.segments.reduce((total, segment, index) => total.add(unitCost(segment).multiply(quantities[index]!)), DecimalAmount.zero);
  if (violated.length === 0 && (!includeBudget || baseCost.compare(problem.request.maximumAcquisitionCost) <= 0)) return undefined;

  // Interior selected variables are usually the rounding-sensitive LP basics.
  // Bounds and zero variables are considered when a selected basic cannot move.
  const candidates = problem.segments.map((segment, index) => {
    const quantity = quantities[index]!;
    const coefficients = violated.map((stateIndex) => contributionAtState(segment, states[stateIndex]!));
    const useful = coefficients.some((coefficient) => !coefficient.isZero()) || (violated.length === 0 && !unitCost(segment).isZero());
    const movable = quantity.compare(DecimalAmount.zero) > 0 && quantity.compare(segment.available) < 0 ? 0 : quantity.isZero() ? 2 : 1;
    return { index, useful, movable, sensitivity: coefficients.reduce((sum, coefficient) => sum.add(coefficient.abs()), DecimalAmount.zero) };
  }).filter((entry) => entry.useful).sort((left, right) => left.movable - right.movable || right.sensitivity.compare(left.sensitivity) || left.index - right.index).slice(0, maximumVariables);
  if (candidates.length === 0) return undefined;

  const coefficients = candidates.map(({ index }) => states.map((state) => contributionAtState(problem.segments[index]!, state)));
  const costs = candidates.map(({ index }) => unitCost(problem.segments[index]!));
  const fits = (deltas: readonly DecimalAmount[]): boolean => {
    const bounded = candidates.every(({ index }, position) => {
      const changed = quantities[index]!.add(deltas[position]!);
      return !changed.isNegative() && changed.compare(problem.segments[index]!.available) <= 0;
    });
    if (!bounded) return false;
    const cost = deltas.reduce((total, delta, index) => total.add(costs[index]!.multiply(delta)), baseCost);
    if (includeBudget && cost.compare(problem.request.maximumAcquisitionCost) > 0) return false;
    return states.every((_state, stateIndex) => deltas.reduce((pnl, delta, index) => pnl.add(coefficients[index]![stateIndex]!.multiply(delta)), basePnl[stateIndex]!).compare(floor) >= 0);
  };
  const changedQuantities = (deltas: readonly DecimalAmount[]): readonly DecimalAmount[] => {
    const repaired = [...quantities];
    candidates.forEach(({ index }, position) => { repaired[index] = quantities[index]!.add(deltas[position]!); });
    return repaired;
  };

  // A 12-place rounding miss can require hundreds of 15-place ticks. This
  // single-coordinate pass reaches that exact neighborhood without expanding
  // the multi-variable search exponentially.
  for (let steps = 1; steps <= 1000; steps += 1) {
    for (const position of candidates.keys()) {
      for (const direction of [-1, 1]) {
        const deltas = candidates.map((_candidate, index) => index === position ? ticks[0]!.multiply(DecimalAmount.parse(String(direction * steps))) : DecimalAmount.zero);
        if (fits(deltas)) return changedQuantities(deltas);
      }
    }
  }
  const offsets: number[][] = [];
  const enumerate = (prefix: number[]): void => {
    if (prefix.length === candidates.length) { if (prefix.some((offset) => offset !== 0)) offsets.push(prefix); return; }
    for (let offset = -maximumTicks; offset <= maximumTicks; offset += 1) enumerate([...prefix, offset]);
  };
  enumerate([]);
  offsets.sort((left, right) => {
    const magnitude = left.reduce((sum, value) => sum + Math.abs(value), 0) - right.reduce((sum, value) => sum + Math.abs(value), 0);
    if (magnitude !== 0) return magnitude;
    for (let index = 0; index < left.length; index += 1) if (left[index] !== right[index]) return left[index]! - right[index]!;
    return 0;
  });

  for (const tick of ticks) {
    for (const offsetsForCandidate of offsets) {
      const deltas = offsetsForCandidate.map((offset) => tick.multiply(DecimalAmount.parse(String(offset))));
      if (fits(deltas)) return changedQuantities(deltas);
    }
  }
  return undefined;
}
