import type { CompileTerminalPayoffRequest, CompileTerminalPayoffResult } from "@contour/compiler";
import type { DecimalAmount, OutcomeId, OutcomeSide, UtcTimestamp } from "@contour/domain";
import type { SettlementPayoffVerification } from "@contour/payoff";

export type ExecutionPlanStatus =
  | "READY" | "NOT_NEEDED" | "STALE_MARKET" | "PRECISION_UNSUPPORTED"
  | "MIN_NOTIONAL_VIOLATION" | "ROUNDING_INVALIDATED_PAYOFF"
  | "INSUFFICIENT_CURRENT_DEPTH" | "MARKET_CHANGED" | "INVALID_COMPILER_RESULT"
  | "FEE_UNRESOLVED" | "PROTOCOL_METADATA_UNAVAILABLE";

export type ExecutionBlocker =
  | { readonly kind: "STALE_MARKET"; readonly observedAt: string; readonly checkedAt: string; readonly ageMs: number; readonly maximumAllowedAgeMs: number }
  | { readonly kind: "PRECISION_UNSUPPORTED"; readonly marketId: string; readonly side: OutcomeSide; readonly explanation: string }
  | { readonly kind: "MIN_NOTIONAL_VIOLATION"; readonly marketId: string; readonly side: OutcomeSide; readonly minimumNotional: string; readonly maximumPossibleNotional: string }
  | { readonly kind: "ROUNDING_INVALIDATED_PAYOFF"; readonly explanation: string }
  | { readonly kind: "INSUFFICIENT_CURRENT_DEPTH"; readonly marketId: string; readonly side: OutcomeSide; readonly requested: string; readonly available: string }
  | { readonly kind: "MARKET_CHANGED"; readonly expectedSnapshotIdentity: string; readonly actualSnapshotIdentity: string }
  | { readonly kind: "INVALID_COMPILER_RESULT"; readonly explanation: string }
  | { readonly kind: "FEE_UNRESOLVED"; readonly explanation: string }
  | { readonly kind: "PROTOCOL_METADATA_UNAVAILABLE"; readonly marketId: string; readonly side: OutcomeSide; readonly field: "precision" | "minimumNotional"; readonly explanation: string };

export type ProtocolPrecision =
  | { readonly kind: "KNOWN"; readonly regime: "SPOT_STYLE"; readonly szDecimals: number; readonly maximumPriceSignificantFigures: 5; readonly maximumPriceDecimalPlaces: number; readonly source: string; readonly observedAt: UtcTimestamp }
  | { readonly kind: "UNAVAILABLE"; readonly source: string; readonly observedAt: UtcTimestamp; readonly explanation: string };

export type MinimumNotional =
  | { readonly kind: "KNOWN"; readonly amount: DecimalAmount; readonly quoteAsset: string; readonly protocolEnforced: boolean; readonly source: string; readonly observedAt: UtcTimestamp }
  | { readonly kind: "UNAVAILABLE"; readonly source: string; readonly observedAt: UtcTimestamp; readonly explanation: string };

export interface OutcomeSideProtocolMetadata {
  readonly marketId: OutcomeId;
  readonly side: OutcomeSide;
  readonly coin: string;
  readonly assetId: string;
  readonly precision: ProtocolPrecision;
  readonly minimumNotional: MinimumNotional;
}

export type ProtocolFeeTreatment =
  | { readonly kind: "KNOWN_ZERO_OUTCOME_MARKET"; readonly source: string; readonly observedAt: UtcTimestamp; readonly settlementFeeIncluded: false }
  | { readonly kind: "USER_SPECIFIC" | "FILL_DEPENDENT" | "UNKNOWN"; readonly explanation: string; readonly settlementFeeIncluded: false };

export interface BuilderFeeTreatment {
  readonly requestedRateTenthsBps: number;
  readonly builderAddress?: string;
  readonly maximumAllowedTenthsBps: 1000;
  readonly userApprovalRequired: boolean;
  readonly supportedForOrder: boolean;
  readonly state: "DISABLED" | "UNSUPPORTED";
}

export interface ExecutionSnapshot {
  readonly identity: string;
  readonly observedAt: readonly string[];
  readonly sourceNetworks: readonly string[];
}

export type ClientOrderIntentId = string & { readonly __clientOrderIntentId: unique symbol };

export interface ExecutionOrder {
  readonly sequence: number;
  readonly intentId: ClientOrderIntentId;
  readonly marketId: OutcomeId;
  readonly side: OutcomeSide;
  readonly protocolAssetId: string;
  readonly coin: string;
  readonly direction: "BUY";
  readonly orderType: "LIMIT";
  readonly timeInForce: "GTC";
  readonly sourceBookLevel: number;
  readonly sourcePrice: DecimalAmount;
  readonly sourceAvailableQuantity: DecimalAmount;
  readonly plannedLimitPrice: DecimalAmount;
  readonly plannedPriceText: string;
  readonly plannedQuantity: DecimalAmount;
  readonly plannedQuantityText: string;
  readonly notional: DecimalAmount;
  readonly precision: Extract<ProtocolPrecision, { kind: "KNOWN" }>;
  readonly minimumNotional: Extract<MinimumNotional, { kind: "KNOWN" }>;
  readonly protocolFee: ProtocolFeeTreatment;
  readonly builderFee: BuilderFeeTreatment;
}

export interface ExecutionLeg {
  readonly marketId: OutcomeId;
  readonly side: OutcomeSide;
  readonly orderIntentIds: readonly ClientOrderIntentId[];
  readonly totalQuantity: DecimalAmount;
  readonly totalNotional: DecimalAmount;
}

export interface DryRunReport {
  readonly title: "CONTOUR EXECUTION DRY RUN";
  readonly text: string;
  readonly warnings: readonly string[];
  readonly noSignature: true;
  readonly noBroadcast: true;
}

export interface ExecutionPlan {
  readonly identity: string;
  readonly status: "READY";
  readonly network: "mainnet" | "testnet";
  readonly underlying: string;
  readonly settlementTimestamp: string;
  readonly requestIdentity: string;
  readonly compilerSnapshotIdentity: string;
  readonly snapshot: ExecutionSnapshot;
  readonly freshness: { readonly checkedAt: string; readonly maximumAllowedAgeMs: number; readonly maximumAgeMs: number };
  readonly orders: readonly ExecutionOrder[];
  readonly legs: readonly ExecutionLeg[];
  readonly originalCompiledPremium: DecimalAmount;
  readonly executableNormalizedPremium: DecimalAmount;
  readonly budget: DecimalAmount;
  readonly verification: SettlementPayoffVerification;
  readonly report: DryRunReport;
}

export type ExecutionPlanResult =
  | { readonly status: "READY"; readonly plan: ExecutionPlan }
  | { readonly status: "NOT_NEEDED"; readonly explanation: string }
  | { readonly status: Exclude<ExecutionPlanStatus, "READY" | "NOT_NEEDED">; readonly blockers: readonly ExecutionBlocker[]; readonly snapshot?: ExecutionSnapshot };

export interface ExecutionPlannerInput {
  readonly request: CompileTerminalPayoffRequest;
  readonly compilerResult: CompileTerminalPayoffResult;
  readonly requestIdentity: string;
  readonly compilerSnapshotIdentity: string;
  readonly currentSnapshotIdentity?: string;
  readonly protocolMetadata: readonly OutcomeSideProtocolMetadata[];
  readonly protocolFee: ProtocolFeeTreatment;
  readonly checkedAt: UtcTimestamp;
  readonly maximumBookAgeMs: number;
  readonly builderFee?: { readonly requestedRateTenthsBps: number; readonly builderAddress?: string };
}

export type ExecutionPlanAudit =
  | { readonly passed: true; readonly verification: SettlementPayoffVerification; readonly totalCost: DecimalAmount }
  | { readonly passed: false; readonly blockers: readonly ExecutionBlocker[] };
