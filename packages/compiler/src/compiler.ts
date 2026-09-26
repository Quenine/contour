import { DecimalAmount } from "@contour/domain";
import { verifyTerminalPayoff, type BinaryTerminalComponent, type TerminalPortfolio } from "@contour/payoff";
import { type DecisionSegment, type ValidatedProblem } from "./model.js";
import { solveProblem, type SolveOutcome } from "./solver.js";
import type { CompileTerminalPayoffRequest, CompileTerminalPayoffResult, CompilerDiagnostics, ExecutionSegment, FeasibleResult, SelectedPosition } from "./types.js";
import { validateCompileRequest } from "./validation.js";

const diagnostics = (status: string): CompilerDiagnostics => ({ solver: "HiGHS 1.15", solverStatus: status, solverFeasibilityTolerance: "1e-7 (solver only)", candidateDecimalPlaces: 12, exactPostSolveVerification: true });
const context = (request: CompileTerminalPayoffRequest) => ({ underlying: request.settlement.underlying, settlementTimestamp: request.settlement.timestamp, requestedPriceRange: request.settlement.priceRange, minimumTerminalPnl: request.constraint.minimumTerminalPnl, maximumAcquisitionCost: request.maximumAcquisitionCost });

function reconstructQuantity(value: number, maximum: DecimalAmount): DecimalAmount | undefined {
  if (!Number.isFinite(value) || value < -1e-7) return undefined;
  const candidate = DecimalAmount.parse(Math.max(0, value).toFixed(12));
  return candidate.compare(maximum) > 0 ? maximum : candidate;
}

interface Candidate { readonly executionSegments: readonly ExecutionSegment[]; readonly portfolio: TerminalPortfolio; readonly acquisitionCost: DecimalAmount; readonly fees: DecimalAmount; }
function reconstructCandidate(problem: ValidatedProblem, solved: Extract<SolveOutcome, { kind: "optimal" }>): Candidate | undefined {
  const executionSegments: ExecutionSegment[] = [];
  const overlay: BinaryTerminalComponent[] = [];
  for (const segment of problem.segments) {
    const column = solved.result.Columns[segment.variable];
    if (!column || !("Primal" in column)) return undefined;
    const quantity = reconstructQuantity(column.Primal, segment.available);
    if (!quantity) return undefined;
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

function verifyCandidate(problem: ValidatedProblem, solved: Extract<SolveOutcome, { kind: "optimal" }>): FeasibleResult | Extract<CompileTerminalPayoffResult, { status: "VERIFICATION_FAILED" }> {
  const candidate = reconstructCandidate(problem, solved);
  if (!candidate) return { status: "VERIFICATION_FAILED", ...context(problem.request), explanation: "solver quantities could not be reconstructed as bounded exact decimals", executionSegments: [], diagnostics: diagnostics(solved.result.Status) };
  const verification = verifyTerminalPayoff(candidate.portfolio, { settlementPriceMin: problem.request.settlement.priceRange.min, settlementPriceMax: problem.request.settlement.priceRange.max, minimumPnl: problem.request.constraint.minimumTerminalPnl });
  const totalCost = candidate.acquisitionCost.add(candidate.fees);
  const segmentBoundsHold = candidate.executionSegments.every((segment) => segment.quantity.compare(segment.maximumAvailableAtSnapshot) <= 0);
  if (!verification.holds || totalCost.compare(problem.request.maximumAcquisitionCost) > 0 || !segmentBoundsHold) {
    return { status: "VERIFICATION_FAILED", ...context(problem.request), explanation: "the reconstructed candidate failed exact payoff, budget, or depth verification", verification, executionSegments: candidate.executionSegments, diagnostics: diagnostics(solved.result.Status) };
  }
  return {
    status: "FEASIBLE", ...context(problem.request), selectedPositions: selectedPositions(candidate.executionSegments), executionSegments: candidate.executionSegments,
    totalAcquisitionCost: candidate.acquisitionCost, estimatedFees: candidate.fees,
    feeTreatment: problem.request.policy.feeModel.kind === "excluded" ? "excluded" : "included-fixed-per-share",
    verification, marketSnapshots: problem.segments.map((segment: DecisionSegment) => segment.freshness).filter((item, index, all) => all.findIndex((candidateFreshness) => candidateFreshness.observedAt.value === item.observedAt.value && candidateFreshness.network === item.network && candidateFreshness.source === item.source) === index),
    relevantBoundaryStates: problem.states, diagnostics: diagnostics(solved.result.Status)
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
  const budgeted = await solveProblem(validation.problem, true);
  if (budgeted.kind === "optimal") return verifyCandidate(validation.problem, budgeted);
  if (budgeted.kind === "failure") return { status: "SOLVER_FAILURE", ...context(request), solverStatus: budgeted.status, explanation: budgeted.message };
  const uncapped = await solveProblem(validation.problem, false);
  if (uncapped.kind === "failure") return { status: "SOLVER_FAILURE", ...context(request), solverStatus: uncapped.status, explanation: uncapped.message };
  if (uncapped.kind === "infeasible") return { status: "INFEASIBLE", ...context(request), reason: "INSUFFICIENT_LIQUIDITY_OR_COVERAGE", explanation: "even all eligible book depth cannot satisfy every exact settlement state" };
  const uncappedCandidate = reconstructCandidate(validation.problem, uncapped);
  if (!uncappedCandidate) return { status: "SOLVER_FAILURE", ...context(request), solverStatus: uncapped.result.Status, explanation: "uncapped solver quantities could not be reconstructed" };
  const uncappedVerification = verifyTerminalPayoff(uncappedCandidate.portfolio, { settlementPriceMin: request.settlement.priceRange.min, settlementPriceMax: request.settlement.priceRange.max, minimumPnl: request.constraint.minimumTerminalPnl });
  if (!uncappedVerification.holds) return { status: "VERIFICATION_FAILED", ...context(request), explanation: "uncapped budget diagnostic failed exact verification", verification: uncappedVerification, executionSegments: uncappedCandidate.executionSegments, diagnostics: diagnostics(uncapped.result.Status) };
  return { status: "INFEASIBLE", ...context(request), reason: "BUDGET_TOO_LOW", explanation: "the exact-verified minimum-cost candidate exceeds the maximum acquisition cost", minimumAcquisitionCost: uncappedCandidate.acquisitionCost.add(uncappedCandidate.fees) };
}
