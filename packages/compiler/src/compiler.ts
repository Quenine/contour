import { DecimalAmount } from "@contour/domain";
import { terminalPnlAtSettlementState, verifyTerminalPayoff, type BinaryTerminalComponent, type SettlementPayoffVerification, type TerminalPortfolio } from "@contour/payoff";
import { contributionAtState, unitCost, type DecisionSegment, type ValidatedProblem } from "./model.js";
import { CANDIDATE_DECIMAL_PLACES, repairQuantities } from "./repair.js";
import { solveProblem, type SolveOutcome } from "./solver.js";
import type { CompileTerminalPayoffRequest, CompileTerminalPayoffResult, CompilerDiagnostics, ExecutionSegment, SelectedPosition, VerificationFailureReason } from "./types.js";
import { validateCompileRequest } from "./validation.js";

const diagnostics = (status: string): CompilerDiagnostics => ({ solver: "HiGHS 1.15", solverStatus: status, solverFeasibilityTolerance: "1e-7 (solver only)", candidateDecimalPlaces: CANDIDATE_DECIMAL_PLACES, repairMaximumDecimalPlaces: 15, exactPostSolveVerification: true });
const context = (request: CompileTerminalPayoffRequest) => ({ underlying: request.settlement.underlying, settlementTimestamp: request.settlement.timestamp, requestedPriceRange: request.settlement.priceRange, minimumTerminalPnl: request.constraint.minimumTerminalPnl, maximumAcquisitionCost: request.maximumAcquisitionCost });

function reconstructQuantity(value: number, maximum: DecimalAmount): DecimalAmount | undefined {
  if (!Number.isFinite(value) || value < -1e-7) return undefined;
  const candidate = DecimalAmount.parse(Math.max(0, value).toFixed(CANDIDATE_DECIMAL_PLACES));
  return candidate.compare(maximum) > 0 ? maximum : candidate;
}

interface Candidate { readonly executionSegments: readonly ExecutionSegment[]; readonly portfolio: TerminalPortfolio; readonly acquisitionCost: DecimalAmount; readonly fees: DecimalAmount; }
function reconstructQuantities(problem: ValidatedProblem, solved: Extract<SolveOutcome, { kind: "optimal" }>): readonly DecimalAmount[] | undefined {
  const quantities: DecimalAmount[] = [];
  for (const segment of problem.segments) {
    const column = solved.result.Columns[segment.variable];
    if (!column || !("Primal" in column)) return undefined;
    const quantity = reconstructQuantity(column.Primal, segment.available);
    if (!quantity) return undefined;
    quantities.push(quantity);
  }
  return quantities;
}

function reconstructCandidate(problem: ValidatedProblem, quantities: readonly DecimalAmount[]): Candidate {
  const executionSegments: ExecutionSegment[] = [];
  const overlay: BinaryTerminalComponent[] = [];
  for (const [index, segment] of problem.segments.entries()) {
    const quantity = quantities[index]!;
    if (quantity.isZero()) continue;
    const acquisitionCost = segment.price.multiply(quantity);
    const estimatedFee = segment.feePerShare.multiply(quantity);
    executionSegments.push({ marketId: segment.market.id, side: segment.side, bookLevel: segment.bookLevel, bookPrice: segment.price, quantity, maximumAvailableAtSnapshot: segment.available, acquisitionCost, estimatedFee });
    overlay.push({ kind: "binary", comparator: segment.market.comparator, threshold: segment.market.threshold, side: segment.side, shares: quantity, premium: acquisitionCost.add(estimatedFee) });
  }
  executionSegments.sort((left, right) => BigInt(left.marketId) < BigInt(right.marketId) ? -1 : BigInt(left.marketId) > BigInt(right.marketId) ? 1 : left.side !== right.side ? left.side.localeCompare(right.side) : left.bookLevel - right.bookLevel);
  const acquisitionCost = executionSegments.reduce((sum, segment) => sum.add(segment.acquisitionCost), DecimalAmount.zero);
  const fees = executionSegments.reduce((sum, segment) => sum.add(segment.estimatedFee), DecimalAmount.zero);
  return { executionSegments, portfolio: { components: [...problem.request.existingPortfolio.components, ...overlay] }, acquisitionCost, fees };
}

function selectedPositions(segments: readonly ExecutionSegment[]): readonly SelectedPosition[] {
  const groups = new Map<string, ExecutionSegment[]>();
  for (const segment of segments) {
    const key = `${segment.marketId}:${segment.side}`;
    groups.set(key, [...(groups.get(key) ?? []), segment]);
  }
  return [...groups.values()].map((items) => {
    const first = items[0]!;
    const totalQuantity = items.reduce((sum, item) => sum.add(item.quantity), DecimalAmount.zero);
    const acquisitionCost = items.reduce((sum, item) => sum.add(item.acquisitionCost), DecimalAmount.zero);
    const estimatedFee = items.reduce((sum, item) => sum.add(item.estimatedFee), DecimalAmount.zero);
    return { marketId: first.marketId, side: first.side, totalQuantity, weightedAveragePrice: { acquisitionCost, quantity: totalQuantity }, acquisitionCost, estimatedFee };
  }).sort((left, right) => BigInt(left.marketId) < BigInt(right.marketId) ? -1 : BigInt(left.marketId) > BigInt(right.marketId) ? 1 : left.side.localeCompare(right.side));
}

/** A one-state exact upper bound is a valid infeasibility certificate. */
function impossibleEvenAtFullDepth(problem: ValidatedProblem): boolean {
  return problem.states.some((state) => {
    const optimistic = problem.segments.reduce((pnl, segment) => {
      const contribution = contributionAtState(segment, state);
      return contribution.compare(DecimalAmount.zero) > 0 ? pnl.add(contribution.multiply(segment.available)) : pnl;
    }, terminalPnlAtSettlementState(problem.request.existingPortfolio, state));
    return optimistic.compare(problem.request.constraint.minimumTerminalPnl) < 0;
  });
}

/** Fractional knapsack gives an exact optimistic payoff bound for each state. */
function impossibleWithinBudget(problem: ValidatedProblem): boolean {
  return problem.states.some((state) => {
    const favorable = problem.segments.map((segment) => ({ segment, benefit: contributionAtState(segment, state), cost: unitCost(segment) }))
      .filter(({ benefit }) => benefit.compare(DecimalAmount.zero) > 0)
      .sort((left, right) => right.benefit.multiply(left.cost).compare(left.benefit.multiply(right.cost)));
    let pnl = terminalPnlAtSettlementState(problem.request.existingPortfolio, state);
    let remaining = problem.request.maximumAcquisitionCost;
    for (const { segment, benefit, cost } of favorable) {
      if (pnl.compare(problem.request.constraint.minimumTerminalPnl) >= 0) return false;
      const fullCost = cost.multiply(segment.available);
      if (fullCost.compare(remaining) > 0) {
        const deficit = problem.request.constraint.minimumTerminalPnl.subtract(pnl);
        return deficit.multiply(cost).compare(remaining.multiply(benefit)) > 0;
      }
      pnl = pnl.add(benefit.multiply(segment.available));
      remaining = remaining.subtract(fullCost);
    }
    return pnl.compare(problem.request.constraint.minimumTerminalPnl) < 0;
  });
}

type VerifiedCandidate = { readonly candidate: Candidate; readonly verification: SettlementPayoffVerification };
type FailedCandidate = Extract<CompileTerminalPayoffResult, { status: "VERIFICATION_FAILED" }>;

function assessCandidate(problem: ValidatedProblem, candidate: Candidate, includeBudget: boolean): { readonly verification: SettlementPayoffVerification; readonly failures: readonly VerificationFailureReason[] } {
  const verification = verifyTerminalPayoff(candidate.portfolio, { settlementPriceMin: problem.request.settlement.priceRange.min, settlementPriceMax: problem.request.settlement.priceRange.max, minimumPnl: problem.request.constraint.minimumTerminalPnl });
  const failures: VerificationFailureReason[] = [];
  if (candidate.executionSegments.some((segment) => segment.quantity.isNegative() || segment.quantity.compare(segment.maximumAvailableAtSnapshot) > 0)) failures.push("DEPTH_FAILED");
  if (includeBudget && candidate.acquisitionCost.add(candidate.fees).compare(problem.request.maximumAcquisitionCost) > 0) failures.push("BUDGET_FAILED");
  if (!verification.holds) failures.push("PAYOFF_FAILED");
  return { verification, failures };
}

function verifyCandidate(problem: ValidatedProblem, solved: Extract<SolveOutcome, { kind: "optimal" }>, includeBudget: boolean): VerifiedCandidate | FailedCandidate {
  const quantities = reconstructQuantities(problem, solved);
  if (!quantities) return { status: "VERIFICATION_FAILED", ...context(problem.request), failureReasons: ["RECONSTRUCTION_FAILED"], explanation: "solver quantities could not be reconstructed as bounded exact decimals", executionSegments: [], diagnostics: diagnostics(solved.result.Status) };
  const candidate = reconstructCandidate(problem, quantities);
  const assessed = assessCandidate(problem, candidate, includeBudget);
  if (assessed.failures.length === 0) return { candidate, verification: assessed.verification };

  const repairedQuantities = repairQuantities(problem, quantities, includeBudget);
  if (repairedQuantities) {
    const repaired = reconstructCandidate(problem, repairedQuantities);
    const checked = assessCandidate(problem, repaired, includeBudget);
    if (checked.failures.length === 0) return { candidate: repaired, verification: checked.verification };
  }
  const deficit = problem.request.constraint.minimumTerminalPnl.subtract(assessed.verification.worstCase.terminalPnl);
  return {
    status: "VERIFICATION_FAILED", ...context(problem.request), failureReasons: assessed.failures,
    explanation: assessed.failures.map((reason) => reason.replaceAll("_", " ").toLowerCase()).join("; "),
    ...(deficit.compare(DecimalAmount.zero) > 0 ? { exactDeficit: deficit } : {}),
    verification: assessed.verification, executionSegments: candidate.executionSegments, diagnostics: diagnostics(solved.result.Status)
  };
}

export async function compileTerminalPayoff(request: CompileTerminalPayoffRequest): Promise<CompileTerminalPayoffResult> {
  const basicIssues: string[] = [];
  if (request.settlement.priceRange.min.compare(request.settlement.priceRange.max) > 0) basicIssues.push("settlement price range min must not exceed max");
  if (request.settlement.priceRange.min.isNegative()) basicIssues.push("settlement prices must be non-negative");
  if (request.maximumAcquisitionCost.isNegative()) basicIssues.push("maximum acquisition cost must be non-negative");
  if (request.existingPortfolio.components.some((component) => component.kind !== "perpetual")) basicIssues.push("existingPortfolio may contain only perpetual exposure in BUILD 01");
  if (request.existingPortfolio.components.length > 1) basicIssues.push("BUILD 01 supports at most one existing perpetual component");
  if (!Number.isSafeInteger(request.policy.maximumBookAgeMs) || request.policy.maximumBookAgeMs < 0) basicIssues.push("maximumBookAgeMs must be a non-negative safe integer");
  if (request.policy.feeModel.kind === "fixedPerShare" && request.policy.feeModel.feePerShare.isNegative()) basicIssues.push("feePerShare must be non-negative");
  const existingPerp = request.existingPortfolio.components[0];
  if (existingPerp?.kind === "perpetual" && existingPerp.asset !== request.settlement.underlying) basicIssues.push("existing perpetual asset must match settlement underlying");
  if (basicIssues.length > 0) return { status: "INVALID_REQUEST", issues: basicIssues };
  const existingVerification = verifyTerminalPayoff(request.existingPortfolio, { settlementPriceMin: request.settlement.priceRange.min, settlementPriceMax: request.settlement.priceRange.max, minimumPnl: request.constraint.minimumTerminalPnl });
  if (existingVerification.holds) return { status: "ALREADY_SATISFIED", ...context(request), selectedPositions: [], executionSegments: [], totalAcquisitionCost: DecimalAmount.zero, estimatedFees: DecimalAmount.zero, verification: existingVerification };

  const validation = validateCompileRequest(request);
  if (!validation.ok) {
    if (validation.noEligible) return { status: "INFEASIBLE", ...context(request), reason: "NO_ELIGIBLE_MARKETS", explanation: validation.issues.join("; ") };
    if (validation.stale) return { status: "INFEASIBLE", ...context(request), reason: "STALE_MARKET_DATA", explanation: validation.issues.join("; ") };
    return { status: "INVALID_REQUEST", issues: validation.issues };
  }
  if (validation.problem.segments.length === 0) return { status: "INFEASIBLE", ...context(request), reason: "INSUFFICIENT_LIQUIDITY_OR_COVERAGE", explanation: "eligible markets contain no executable ask depth" };
  if (impossibleEvenAtFullDepth(validation.problem)) return { status: "INFEASIBLE", ...context(request), reason: "INSUFFICIENT_LIQUIDITY_OR_COVERAGE", explanation: "at least one exact settlement state cannot reach the floor even with every favorable segment at full depth" };
  const budgeted = await solveProblem(validation.problem, true);
  if (budgeted.kind === "optimal") {
    const checked = verifyCandidate(validation.problem, budgeted, true);
    if ("status" in checked) return impossibleWithinBudget(validation.problem) ? { status: "INFEASIBLE", ...context(request), reason: "BUDGET_TOO_LOW", explanation: "an exact settlement-state payoff bound cannot reach the floor within the budget and available depth" } : checked;
    const { candidate, verification } = checked;
    return {
      status: "FEASIBLE", ...context(request), selectedPositions: selectedPositions(candidate.executionSegments), executionSegments: candidate.executionSegments,
      totalAcquisitionCost: candidate.acquisitionCost, estimatedFees: candidate.fees,
      feeTreatment: request.policy.feeModel.kind === "excluded" ? "excluded" : "included-fixed-per-share",
      verification, marketSnapshots: validation.problem.segments.map((segment: DecisionSegment) => segment.freshness).filter((item, index, all) => all.findIndex((candidateFreshness) => candidateFreshness.observedAt.value === item.observedAt.value && candidateFreshness.network === item.network && candidateFreshness.source === item.source) === index),
      relevantBoundaryStates: validation.problem.states, diagnostics: diagnostics(budgeted.result.Status)
    };
  }
  if (budgeted.kind === "failure") return { status: "SOLVER_FAILURE", ...context(request), solverStatus: budgeted.status, explanation: budgeted.message };
  const uncapped = await solveProblem(validation.problem, false);
  if (uncapped.kind === "failure") return { status: "SOLVER_FAILURE", ...context(request), solverStatus: uncapped.status, explanation: uncapped.message };
  if (uncapped.kind === "infeasible") return { status: "INFEASIBLE", ...context(request), reason: "INSUFFICIENT_LIQUIDITY_OR_COVERAGE", explanation: "even all eligible book depth cannot satisfy every exact settlement state" };
  const uncappedChecked = verifyCandidate(validation.problem, uncapped, false);
  if ("status" in uncappedChecked) return uncappedChecked;
  const minimumAcquisitionCost = uncappedChecked.candidate.acquisitionCost.add(uncappedChecked.candidate.fees);
  if (minimumAcquisitionCost.compare(request.maximumAcquisitionCost) <= 0) return { status: "SOLVER_FAILURE", ...context(request), solverStatus: budgeted.status, explanation: "budgeted LP reported infeasibility despite an exact-verified affordable candidate" };
  if (!impossibleWithinBudget(validation.problem)) return { status: "VERIFICATION_FAILED", ...context(request), failureReasons: ["BUDGET_FAILED"], explanation: "the exact-verified uncapped candidate exceeds budget, but an exact infeasibility bound was not established", verification: uncappedChecked.verification, executionSegments: uncappedChecked.candidate.executionSegments, diagnostics: diagnostics(uncapped.result.Status) };
  return { status: "INFEASIBLE", ...context(request), reason: "BUDGET_TOO_LOW", explanation: "an exact settlement-state payoff bound cannot reach the floor within the budget and available depth", minimumAcquisitionCost };
}
