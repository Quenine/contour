import { DecimalAmount, type BinaryPriceOutcome } from "@contour/domain";
import { terminalPnl, type BinaryTerminalComponent, type TerminalPortfolio } from "@contour/payoff";
import type { CompileTerminalPayoffRequest, CompileTerminalPayoffResult } from "@contour/compiler";
import type { ChartPointDto, CompilationDto, FreshnessDto, TerminalMode } from "../presentation/types";
import { freshnessState } from "./input";
import { formatBtcPrice, formatUtc } from "../presentation/format";
import type { ExecutionPlanResult } from "@contour/execution";

const displayNumber = (value: DecimalAmount): number => Number(value.toString());
const freshness = (value: { readonly observedAt: { readonly value: string }; readonly source: string; readonly network: string }, maximumAgeMs = 120_000): FreshnessDto => ({ state: freshnessState(value.observedAt.value, maximumAgeMs), observedAt: value.observedAt.value, source: value.source, network: value.network });

function compiledPortfolio(request: CompileTerminalPayoffRequest, result: Extract<CompileTerminalPayoffResult, { status: "FEASIBLE" }>): TerminalPortfolio {
  const markets = new Map<string, BinaryPriceOutcome>(request.instruments.map((instrument) => [instrument.market.id, instrument.market]));
  const overlay: BinaryTerminalComponent[] = result.executionSegments.map((segment) => {
    const market = markets.get(segment.marketId);
    if (!market) throw new Error("selected compiler market missing from request");
    return { kind: "binary", comparator: market.comparator, threshold: market.threshold, side: segment.side, shares: segment.quantity, premium: segment.acquisitionCost.add(segment.estimatedFee) };
  });
  return { components: [...request.existingPortfolio.components, ...overlay] };
}

/** Chart points are display-only samples. Exact verification is represented separately. */
function chartSamples(request: CompileTerminalPayoffRequest, result: Extract<CompileTerminalPayoffResult, { status: "FEASIBLE" }>): readonly ChartPointDto[] {
  const original = request.existingPortfolio; const compiled = compiledPortfolio(request, result);
  const minimum = displayNumber(request.settlement.priceRange.min); const maximum = displayNumber(request.settlement.priceRange.max);
  const count = 40;
  return Array.from({ length: count + 1 }, (_, index) => {
    const price = minimum + (maximum - minimum) * index / count;
    const exactDisplayPrice = DecimalAmount.parse(price.toFixed(8));
    return { price, originalPnl: displayNumber(terminalPnl(original, exactDisplayPrice)), compiledPnl: displayNumber(terminalPnl(compiled, exactDisplayPrice)) };
  });
}

const common = (result: Exclude<CompileTerminalPayoffResult, { status: "INVALID_REQUEST" }>) => ({
  underlying: result.underlying,
  settlementTimestamp: result.settlementTimestamp.value,
  priceRange: { min: result.requestedPriceRange.min.toString(), max: result.requestedPriceRange.max.toString() },
  minimumTerminalPnl: result.minimumTerminalPnl.toString(),
  maximumAcquisitionCost: result.maximumAcquisitionCost.toString()
});

function liveMarketDiagnostics(request: CompileTerminalPayoffRequest): NonNullable<CompilationDto["liveMarketDiagnostics"]> {
  const observations = request.instruments.flatMap((instrument) => [instrument.yesBook.freshness.observedAt.value, instrument.noBook.freshness.observedAt.value]);
  if (observations.length === 0) return { eligibleMarkets: 0, eligibleMarketIds: [], yesAskLevels: 0, noAskLevels: 0, oldestBookObservation: request.policy.compilationTime.value };
  return {
    eligibleMarkets: request.instruments.length,
    eligibleMarketIds: request.instruments.map((instrument) => instrument.market.id),
    yesAskLevels: request.instruments.reduce((sum, instrument) => sum + instrument.yesBook.asks.length, 0),
    noAskLevels: request.instruments.reduce((sum, instrument) => sum + instrument.noBook.asks.length, 0),
    oldestBookObservation: observations.reduce((oldest, current) => Date.parse(current) < Date.parse(oldest) ? current : oldest)
  };
}

export interface PresentationIdentity {
  readonly mode: TerminalMode;
  readonly requestIdentity: string;
  readonly marketContextIdentity?: string;
  readonly marketSnapshotIdentity?: string;
}

function identityFields(identity: PresentationIdentity): Pick<CompilationDto, "mode" | "requestIdentity"> & Partial<Pick<CompilationDto, "marketContextIdentity" | "marketSnapshotIdentity">> {
  return { mode: identity.mode, requestIdentity: identity.requestIdentity, ...(identity.marketContextIdentity ? { marketContextIdentity: identity.marketContextIdentity } : {}), ...(identity.marketSnapshotIdentity ? { marketSnapshotIdentity: identity.marketSnapshotIdentity } : {}) };
}

function presentExecution(result: ExecutionPlanResult | undefined): CompilationDto["executionPreview"] {
  if (!result) return undefined;
  if (result.status === "NOT_NEEDED") return { status: result.status, blockers: [{ kind: "NOT_NEEDED", explanation: result.explanation }] };
  if (result.status !== "READY") return { status: result.status, ...(result.snapshot ? { snapshotIdentity: result.snapshot.identity } : {}), blockers: result.blockers.map((blocker) => ({ kind: blocker.kind, explanation: "explanation" in blocker ? blocker.explanation : blocker.kind === "STALE_MARKET" ? `book age ${blocker.ageMs}ms exceeds ${blocker.maximumAllowedAgeMs}ms` : blocker.kind === "MARKET_CHANGED" ? "the compiler snapshot and current planning snapshot differ" : blocker.kind === "MIN_NOTIONAL_VIOLATION" ? `maximum segment notional ${blocker.maximumPossibleNotional} is below minimum ${blocker.minimumNotional}` : `planned ${blocker.requested} exceeds available ${blocker.available}` })) };
  const plan = result.plan;
  return { status: "READY", planIdentity: plan.identity, snapshotIdentity: plan.snapshot.identity, checkedAt: plan.freshness.checkedAt, maximumAgeMs: plan.freshness.maximumAgeMs, maximumAllowedAgeMs: plan.freshness.maximumAllowedAgeMs,
    originalPremium: plan.originalCompiledPremium.toString(), executablePremium: plan.executableNormalizedPremium.toString(), budget: plan.budget.toString(), verificationPassed: plan.verification.holds,
    worstCasePnl: plan.verification.worstCase.terminalPnl.toString(), worstCasePrice: plan.verification.worstCase.price.toString(), warnings: plan.report.warnings, reportText: plan.report.text,
    orders: plan.orders.map((order) => ({ sequence: order.sequence, intentId: order.intentId, marketId: order.marketId, side: order.side, assetId: order.protocolAssetId, sourceBookLevel: order.sourceBookLevel, sourcePrice: order.sourcePrice.toString(), sourceAvailable: order.sourceAvailableQuantity.toString(), limitPrice: order.plannedPriceText, quantity: order.plannedQuantityText, notional: order.notional.toString(), szDecimals: order.precision.szDecimals, minimumNotional: order.minimumNotional.amount.toString(), protocolFee: order.protocolFee.kind, builderFee: order.builderFee.state })) };
}

export function presentCompilerResult(request: CompileTerminalPayoffRequest, result: CompileTerminalPayoffResult, identity: PresentationIdentity, execution?: ExecutionPlanResult): CompilationDto {
  const identified = identityFields(identity);
  if (result.status === "INVALID_REQUEST") return { ...identified, status: result.status, issues: result.issues, freshness: [] };
  if (result.status === "ALREADY_SATISFIED") return {
    ...identified, status: result.status, ...common(result), acquisitionCost: "0", estimatedFees: "0", feeTreatment: request.policy.feeModel.kind,
    verification: { passed: result.verification.holds, worstCasePnl: result.verification.worstCase.terminalPnl.toString(), worstCasePrice: result.verification.worstCase.price.toString(), worstCasePosition: result.verification.worstCase.position, boundaryStateCount: result.verification.evaluatedPoints.length, points: result.verification.evaluatedPoints.map((point) => ({ price: point.price.toString(), position: point.position, pnl: point.terminalPnl.toString() })) },
    selectedPositions: [], executionSegments: [], freshness: []
  };
  if (result.status === "INFEASIBLE") return { ...identified, status: result.status, ...common(result), infeasibility: { reason: result.reason, explanation: result.explanation, ...(result.minimumAcquisitionCost ? { minimumRequiredBudget: result.minimumAcquisitionCost.toString() } : {}) }, freshness: [], ...(identity.mode === "live" ? { liveMarketDiagnostics: liveMarketDiagnostics(request) } : {}) };
  if (result.status === "SOLVER_FAILURE") return { ...identified, status: result.status, ...common(result), explanation: `${result.solverStatus}: ${result.explanation}`, freshness: [] };
  if (result.status === "VERIFICATION_FAILED") return { ...identified, status: result.status, ...common(result), explanation: result.explanation, executionSegments: result.executionSegments.map((segment) => ({ marketId: segment.marketId, side: segment.side, bookLevel: segment.bookLevel, bookPrice: segment.bookPrice.toString(), quantity: segment.quantity.toString(), available: segment.maximumAvailableAtSnapshot.toString(), acquisitionCost: segment.acquisitionCost.toString(), estimatedFee: segment.estimatedFee.toString() })), freshness: [] };
  const verification = result.verification;
  return {
    ...identified, status: result.status, ...common(result), acquisitionCost: result.totalAcquisitionCost.toString(), estimatedFees: result.estimatedFees.toString(), feeTreatment: result.feeTreatment,
    verification: { passed: verification.holds, worstCasePnl: verification.worstCase.terminalPnl.toString(), worstCasePrice: verification.worstCase.price.toString(), worstCasePosition: verification.worstCase.position, boundaryStateCount: verification.evaluatedPoints.length, points: verification.evaluatedPoints.map((point) => ({ price: point.price.toString(), position: point.position, pnl: point.terminalPnl.toString() })) },
    selectedPositions: result.selectedPositions.map((position) => {
      const market = request.instruments.find((instrument) => instrument.market.id === position.marketId)?.market;
      return { marketId: position.marketId, statement: market ? `BTC ${market.comparator === "greaterThan" ? ">" : ">="} ${formatBtcPrice(market.threshold.toString())} at ${formatUtc(market.settlementAt.value)}` : "normalized binary outcome", side: position.side, quantity: position.totalQuantity.toString(), weightedAverage: { acquisitionCost: position.weightedAveragePrice.acquisitionCost.toString(), quantity: position.weightedAveragePrice.quantity.toString() }, acquisitionCost: position.acquisitionCost.toString(), estimatedFee: position.estimatedFee.toString() };
    }),
    executionSegments: result.executionSegments.map((segment) => ({ marketId: segment.marketId, side: segment.side, bookLevel: segment.bookLevel, bookPrice: segment.bookPrice.toString(), quantity: segment.quantity.toString(), available: segment.maximumAvailableAtSnapshot.toString(), acquisitionCost: segment.acquisitionCost.toString(), estimatedFee: segment.estimatedFee.toString() })),
    freshness: result.marketSnapshots.map((snapshot) => freshness(snapshot)), ...(execution ? { executionPreview: presentExecution(execution)! } : {}),
    chart: { points: chartSamples(request, result), strikes: request.instruments.map((instrument) => ({ price: displayNumber(instrument.market.threshold), label: `#${instrument.market.id}` })), floor: displayNumber(request.constraint.minimumTerminalPnl), protectedMin: displayNumber(request.settlement.priceRange.min), protectedMax: displayNumber(request.settlement.priceRange.max), note: "Visualization samples only. Exact settlement verification determines pass/fail." }
  };
}
