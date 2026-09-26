import type { AssetSymbol, BinaryPriceOutcome, DecimalAmount, MarketFreshness, OrderBookSnapshot, OutcomeId, OutcomeSide, Price, UtcTimestamp } from "@contour/domain";
import type { SettlementPayoffVerification, SettlementState, TerminalPortfolio } from "@contour/payoff";

export interface ExecutableBinaryInstrument {
  readonly market: BinaryPriceOutcome;
  readonly yesBook: OrderBookSnapshot;
  readonly noBook: OrderBookSnapshot;
}

export type CompilerFeeModel =
  | { readonly kind: "excluded" }
  | { readonly kind: "fixedPerShare"; readonly feePerShare: DecimalAmount };

export interface CompilePolicy {
  readonly maximumBookAgeMs: number;
  readonly compilationTime: UtcTimestamp;
  readonly feeModel: CompilerFeeModel;
}

export interface CompileTerminalPayoffRequest {
  readonly existingPortfolio: TerminalPortfolio;
  readonly settlement: {
    readonly underlying: AssetSymbol;
    readonly timestamp: UtcTimestamp;
    readonly priceRange: { readonly min: Price; readonly max: Price };
  };
  readonly constraint: { readonly minimumTerminalPnl: DecimalAmount };
  readonly maximumAcquisitionCost: DecimalAmount;
  readonly instruments: readonly ExecutableBinaryInstrument[];
  readonly policy: CompilePolicy;
}

export interface ExecutionSegment {
  readonly marketId: OutcomeId;
  readonly side: OutcomeSide;
  readonly bookLevel: number;
  readonly bookPrice: Price;
  readonly quantity: DecimalAmount;
  readonly maximumAvailableAtSnapshot: DecimalAmount;
  readonly acquisitionCost: DecimalAmount;
  readonly estimatedFee: DecimalAmount;
}

export interface SelectedPosition {
  readonly marketId: OutcomeId;
  readonly side: OutcomeSide;
  readonly totalQuantity: DecimalAmount;
  /** Exact ratio; quotient display rounding is intentionally left to presentation code. */
  readonly weightedAveragePrice: { readonly acquisitionCost: DecimalAmount; readonly quantity: DecimalAmount };
  readonly acquisitionCost: DecimalAmount;
  readonly estimatedFee: DecimalAmount;
}

export interface CompilerDiagnostics {
  readonly solver: "HiGHS 1.15";
  readonly solverStatus: string;
  readonly solverFeasibilityTolerance: "1e-7 (solver only)";
  readonly candidateDecimalPlaces: 12;
  readonly exactPostSolveVerification: true;
}

interface ResultContext {
  readonly underlying: AssetSymbol;
  readonly settlementTimestamp: UtcTimestamp;
  readonly requestedPriceRange: { readonly min: Price; readonly max: Price };
  readonly minimumTerminalPnl: DecimalAmount;
  readonly maximumAcquisitionCost: DecimalAmount;
}

export interface FeasibleResult extends ResultContext {
  readonly status: "FEASIBLE";
  readonly selectedPositions: readonly SelectedPosition[];
  readonly executionSegments: readonly ExecutionSegment[];
  readonly totalAcquisitionCost: DecimalAmount;
  readonly estimatedFees: DecimalAmount;
  readonly feeTreatment: "excluded" | "included-fixed-per-share";
  readonly verification: SettlementPayoffVerification;
  readonly marketSnapshots: readonly MarketFreshness[];
  readonly relevantBoundaryStates: readonly SettlementState[];
  readonly diagnostics: CompilerDiagnostics;
}

export interface AlreadySatisfiedResult extends ResultContext {
  readonly status: "ALREADY_SATISFIED";
  readonly selectedPositions: readonly [];
  readonly executionSegments: readonly [];
  readonly totalAcquisitionCost: DecimalAmount;
  readonly estimatedFees: DecimalAmount;
  readonly verification: SettlementPayoffVerification;
}

export type InfeasibilityReason = "NO_ELIGIBLE_MARKETS" | "STALE_MARKET_DATA" | "INSUFFICIENT_LIQUIDITY_OR_COVERAGE" | "BUDGET_TOO_LOW";
export interface InfeasibleResult extends ResultContext { readonly status: "INFEASIBLE"; readonly reason: InfeasibilityReason; readonly explanation: string; readonly minimumAcquisitionCost?: DecimalAmount; }
export interface InvalidRequestResult { readonly status: "INVALID_REQUEST"; readonly issues: readonly string[]; }
export interface VerificationFailedResult extends ResultContext { readonly status: "VERIFICATION_FAILED"; readonly explanation: string; readonly verification?: SettlementPayoffVerification; readonly executionSegments: readonly ExecutionSegment[]; readonly diagnostics: CompilerDiagnostics; }
export interface SolverFailureResult extends ResultContext { readonly status: "SOLVER_FAILURE"; readonly solverStatus: string; readonly explanation: string; }

export type CompileTerminalPayoffResult = FeasibleResult | AlreadySatisfiedResult | InfeasibleResult | InvalidRequestResult | VerificationFailedResult | SolverFailureResult;
