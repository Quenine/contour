export type FreshnessState = "LIVE" | "PARTIALLY_AVAILABLE" | "STALE" | "UNAVAILABLE";
export type TerminalMode = "fixture" | "live";

export interface FreshnessDto { readonly state: FreshnessState; readonly observedAt?: string; readonly source?: string; readonly network?: string; }
export interface MarketOptionDto { readonly id: string; readonly threshold: string; readonly comparator: ">" | ">="; }
export interface SettlementGroupDto { readonly timestamp: string; readonly markets: readonly MarketOptionDto[]; readonly marketCount: number; }
export interface LiveUniverseDto {
  readonly freshness: FreshnessDto;
  readonly btcMark?: string;
  readonly btcOracle?: string;
  readonly supportedBinaryCount: number;
  readonly settlementGroups: readonly SettlementGroupDto[];
  readonly unavailableReason?: string;
}
export interface LiveMarketDiagnosticsDto { readonly eligibleMarkets: number; readonly eligibleMarketIds: readonly string[]; readonly yesAskLevels: number; readonly noAskLevels: number; readonly oldestBookObservation: string; }
export interface PublicPositionDto { readonly index: number; readonly asset: string; readonly direction: "long" | "short"; readonly quantity: string; readonly entryPrice: string; }
export interface PublicAccountDto { readonly address: string; readonly positions: readonly PublicPositionDto[]; readonly freshness: FreshnessDto; }
export interface ChartPointDto { readonly price: number; readonly originalPnl: number; readonly compiledPnl?: number; }
export interface StrikeMarkerDto { readonly price: number; readonly label: string; }
export interface VerificationDto { readonly passed: boolean; readonly worstCasePnl: string; readonly worstCasePrice: string; readonly worstCasePosition: string; readonly boundaryStateCount: number; readonly points: readonly { readonly price: string; readonly position: string; readonly pnl: string }[]; }
export interface PositionDto { readonly marketId: string; readonly statement: string; readonly side: "yes" | "no"; readonly outcomeExplanation: string; readonly quantity: string; readonly weightedAverage: { readonly acquisitionCost: string; readonly quantity: string }; readonly acquisitionCost: string; readonly estimatedFee: string; }
export interface RiskSummaryDto {
  readonly existingExposure?: { readonly direction: "long" | "short"; readonly quantity: string; readonly entryPrice: string; };
  readonly existingWorstCasePnl: string;
  readonly existingWorstCasePrice: string;
  readonly existingWorstCasePosition: string;
  readonly target: { readonly mode: "minimumPnl" | "maximumLoss"; readonly value: string; readonly minimumPnl: string; };
  readonly compiledWorstCasePnl?: string;
  readonly improvement?: string;
  readonly selectedPositionCount: number;
  readonly executionSegmentCount: number;
}
export interface ExecutionSegmentDto { readonly marketId: string; readonly side: "yes" | "no"; readonly bookLevel: number; readonly bookPrice: string; readonly quantity: string; readonly available: string; readonly acquisitionCost: string; readonly estimatedFee: string; }
export interface ExecutionOrderDto { readonly sequence: number; readonly intentId: string; readonly marketId: string; readonly side: "yes" | "no"; readonly assetId: string; readonly sourceBookLevel: number; readonly sourcePrice: string; readonly sourceAvailable: string; readonly limitPrice: string; readonly quantity: string; readonly notional: string; readonly szDecimals: number; readonly minimumNotional: string; readonly protocolFee: string; readonly builderFee: "DISABLED" | "UNSUPPORTED"; }
export interface ExecutionPreviewDto {
  readonly status: "READY" | "NOT_NEEDED" | "STALE_MARKET" | "PRECISION_UNSUPPORTED" | "MIN_NOTIONAL_VIOLATION" | "ROUNDING_INVALIDATED_PAYOFF" | "INSUFFICIENT_CURRENT_DEPTH" | "MARKET_CHANGED" | "INVALID_COMPILER_RESULT" | "FEE_UNRESOLVED" | "PROTOCOL_METADATA_UNAVAILABLE";
  readonly planIdentity?: string;
  readonly snapshotIdentity?: string;
  readonly checkedAt?: string;
  readonly maximumAgeMs?: number;
  readonly maximumAllowedAgeMs?: number;
  readonly originalPremium?: string;
  readonly executablePremium?: string;
  readonly budget?: string;
  readonly verificationPassed?: boolean;
  readonly worstCasePnl?: string;
  readonly worstCasePrice?: string;
  readonly orders?: readonly ExecutionOrderDto[];
  readonly blockers?: readonly { readonly kind: string; readonly explanation: string }[];
  readonly warnings?: readonly string[];
  readonly reportText?: string;
}
export interface CompilationDto {
  readonly mode: TerminalMode;
  /** Deterministic identity of the compiler-affecting request fields. */
  readonly requestIdentity: string;
  /** UI market context captured before a live request; prevents old books from looking current after refresh. */
  readonly marketContextIdentity?: string;
  /** Canonical identity of the exact order-book snapshots used by the compiler. */
  readonly marketSnapshotIdentity?: string;
  readonly status: "FEASIBLE" | "ALREADY_SATISFIED" | "INFEASIBLE" | "INVALID_REQUEST" | "VERIFICATION_FAILED" | "SOLVER_FAILURE";
  readonly underlying?: string;
  readonly settlementTimestamp?: string;
  readonly priceRange?: { readonly min: string; readonly max: string };
  readonly minimumTerminalPnl?: string;
  readonly maximumAcquisitionCost?: string;
  readonly acquisitionCost?: string;
  readonly estimatedFees?: string;
  readonly feeTreatment?: string;
  readonly verification?: VerificationDto;
  /** Exact server-side values; chart points are never an authority for these fields. */
  readonly riskSummary?: RiskSummaryDto;
  readonly selectedPositions?: readonly PositionDto[];
  readonly executionSegments?: readonly ExecutionSegmentDto[];
  readonly executionPreview?: ExecutionPreviewDto;
  readonly infeasibility?: { readonly reason: string; readonly explanation: string; readonly minimumRequiredBudget?: string };
  readonly verificationFailure?: { readonly reasons: readonly string[]; readonly worstCasePrice?: string; readonly worstCasePosition?: string; readonly worstCasePnl?: string; readonly requestedFloor?: string; readonly exactDeficit?: string };
  readonly issues?: readonly string[];
  readonly explanation?: string;
  readonly freshness: readonly FreshnessDto[];
  readonly liveMarketDiagnostics?: LiveMarketDiagnosticsDto;
  readonly chart?: { readonly points: readonly ChartPointDto[]; readonly strikes: readonly StrikeMarkerDto[]; readonly floor: number; readonly protectedMin: number; readonly protectedMax: number; readonly note: string; };
}
