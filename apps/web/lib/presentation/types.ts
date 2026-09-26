export type FreshnessState = "LIVE" | "STALE" | "UNAVAILABLE";
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
export interface PublicPositionDto { readonly index: number; readonly asset: string; readonly direction: "long" | "short"; readonly quantity: string; readonly entryPrice: string; }
export interface PublicAccountDto { readonly address: string; readonly positions: readonly PublicPositionDto[]; readonly freshness: FreshnessDto; }
export interface ChartPointDto { readonly price: number; readonly originalPnl: number; readonly compiledPnl?: number; }
export interface StrikeMarkerDto { readonly price: number; readonly label: string; }
export interface VerificationDto { readonly passed: boolean; readonly worstCasePnl: string; readonly worstCasePrice: string; readonly worstCasePosition: string; readonly boundaryStateCount: number; readonly points: readonly { readonly price: string; readonly position: string; readonly pnl: string }[]; }
export interface PositionDto { readonly marketId: string; readonly statement: string; readonly side: "yes" | "no"; readonly quantity: string; readonly weightedAverage: { readonly acquisitionCost: string; readonly quantity: string }; readonly acquisitionCost: string; readonly estimatedFee: string; }
export interface ExecutionSegmentDto { readonly marketId: string; readonly side: "yes" | "no"; readonly bookLevel: number; readonly bookPrice: string; readonly quantity: string; readonly available: string; readonly acquisitionCost: string; readonly estimatedFee: string; }
export interface CompilationDto {
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
  readonly selectedPositions?: readonly PositionDto[];
  readonly executionSegments?: readonly ExecutionSegmentDto[];
  readonly infeasibility?: { readonly reason: string; readonly explanation: string; readonly minimumRequiredBudget?: string };
  readonly issues?: readonly string[];
  readonly explanation?: string;
  readonly freshness: readonly FreshnessDto[];
  readonly chart?: { readonly points: readonly ChartPointDto[]; readonly strikes: readonly StrikeMarkerDto[]; readonly floor: number; readonly protectedMin: number; readonly protectedMax: number; readonly note: string; };
}
