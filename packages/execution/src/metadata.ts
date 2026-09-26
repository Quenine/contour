import type { CompileTerminalPayoffRequest } from "@contour/compiler";
import { DecimalAmount, type UtcTimestamp } from "@contour/domain";
import type { OutcomeSideProtocolMetadata, ProtocolFeeTreatment, ProtocolPrecision, ProtocolRuleEvidence, EvidenceAuthority } from "./types.js";
import { evidence } from "./evidence.js";
import type { ExplicitOperatorOverrides } from "./evidence.js";

export const HIP4_MINIMUM_NOTIONAL_SOURCE = "@outcome.xyz/hip4@1.2.0-beta.1 src/adapter/hyperliquid/pricing.ts (MAINTAINED_SDK, not official protocol publication)";
export const HIP4_OFFICIAL_GENERIC_MINIMUM_SOURCE = "Hyperliquid Exchange endpoint Place an order example (generic '$10' minimum error; HIP-4 applicability unspecified)";
export const HIP4_MINIMUM_NOTIONAL_CONFLICT_SOURCE = "@perps/hip4 v2 upgrade notes (SECONDARY_DOCUMENTATION; documents $10 floor)";
export const HIP4_ZERO_FEE_SOURCE = "Hyperliquid HIP-4 outcome markets documentation (initial-mainnet fees currently zero; observed 2026-09-26)";
export const HIP4_MIN_NOTIONAL_CHANGELOG = "@outcome.xyz/hip4 CHANGELOG.md [1.2.0-beta] (dated 2026-09-05; claims network upgrade lowered $10 to $1; not independently confirmed by official Hyperliquid documentation)";

export function parseMaintainedSdkMinimumNotional(sourceText: string, observedAt: UtcTimestamp, source = HIP4_MINIMUM_NOTIONAL_SOURCE): ProtocolRuleEvidence<string> | undefined {
  const match = /export\s+const\s+MIN_NOTIONAL\s*=\s*(\d+(?:\.\d+)?)\s*;/.exec(sourceText);
  if (!match) return undefined;
  const value = DecimalAmount.parse(match[1]!).toString();
  return evidence(value, {
  authority: "MAINTAINED_SDK", source, observedAt, network: "mainnet",
  applicability: "Outcome.xyz SDK's stated HIP-4 exchange minimum; not independently confirmed by official Hyperliquid docs", confidence: "maintained"
  });
}

const sdkMinimumEvidence = (observedAt: UtcTimestamp): ProtocolRuleEvidence<string> => {
  const parsed = parseMaintainedSdkMinimumNotional("export const MIN_NOTIONAL = 1;", observedAt);
  if (!parsed) throw new Error("audited maintained SDK minimum-notional constant was not parseable");
  return parsed;
};
const olderMinimumEvidence = (observedAt: UtcTimestamp): ProtocolRuleEvidence<string> => evidence("10", {
  authority: "SECONDARY_DOCUMENTATION", source: HIP4_MINIMUM_NOTIONAL_CONFLICT_SOURCE, observedAt, network: "not-applicable",
  applicability: "Older ecosystem SDK guidance; may be stale/client-side", confidence: "observed"
});
const officialGenericMinimumEvidence = (observedAt: UtcTimestamp): ProtocolRuleEvidence<string> => evidence("10", {
  authority: "OFFICIAL_DOCUMENTATION", source: HIP4_OFFICIAL_GENERIC_MINIMUM_SOURCE, observedAt, network: "not-applicable",
  applicability: "generic exchange order error example; does not identify HIP-4 or establish applicability to outcome assets", confidence: "authoritative"
});

export function knownHip4ProtocolFee(observedAt: UtcTimestamp): ProtocolFeeTreatment {
  return { kind: "KNOWN_ZERO_OUTCOME_MARKET", evidence: evidence("zero", { authority: "OFFICIAL_DOCUMENTATION", source: HIP4_ZERO_FEE_SOURCE, observedAt, network: "mainnet", applicability: "official HIP-4 initial-testing fee statement; recheck before any later execution phase", confidence: "authoritative" }), settlementFeeIncluded: false };
}

export function outcomeMetadataForRequest(request: CompileTerminalPayoffRequest, options: {
  readonly precision: { readonly kind: "KNOWN"; readonly szDecimals: number; readonly source: string; readonly authority?: EvidenceAuthority; readonly network?: "mainnet" | "testnet" | "fixture" | "not-applicable" } | { readonly kind: "UNAVAILABLE"; readonly source: string; readonly explanation: string };
  readonly observedAt: UtcTimestamp;
  readonly operatorOverrides?: ExplicitOperatorOverrides;
}): readonly OutcomeSideProtocolMetadata[] {
  const precision = (): ProtocolPrecision => options.operatorOverrides?.szDecimals !== undefined
    ? { kind: "KNOWN", regime: "SPOT_STYLE", szDecimals: options.operatorOverrides.szDecimals, maximumPriceSignificantFigures: 5, maximumPriceDecimalPlaces: 8 - options.operatorOverrides.szDecimals, evidence: options.operatorOverrides.evidence.find((item) => typeof item.value === "number") as ProtocolRuleEvidence<number> }
    : options.precision.kind === "KNOWN"
      ? { kind: "KNOWN", regime: "SPOT_STYLE", szDecimals: options.precision.szDecimals, maximumPriceSignificantFigures: 5, maximumPriceDecimalPlaces: 8 - options.precision.szDecimals, evidence: evidence(options.precision.szDecimals, { authority: options.precision.authority ?? "FIXTURE", source: options.precision.source, observedAt: options.observedAt, network: options.precision.network ?? "fixture", applicability: "explicit deterministic metadata input", confidence: options.precision.authority === "OPERATOR_OVERRIDE" ? "operator-supplied" : options.precision.authority === "MAINTAINED_SDK" ? "maintained" : options.precision.authority === "FIXTURE" || options.precision.authority === undefined ? "fixture" : "observed" }) }
    : { kind: "UNAVAILABLE", source: options.precision.source, observedAt: options.observedAt, explanation: options.precision.explanation };
  const minimumNotional = () => options.operatorOverrides?.minimumNotional !== undefined
    ? { kind: "KNOWN" as const, amount: DecimalAmount.parse(options.operatorOverrides.minimumNotional), quoteAsset: "USDC", evidence: options.operatorOverrides.evidence.find((item) => typeof item.value === "string") as ProtocolRuleEvidence<string>, conflicts: [officialGenericMinimumEvidence(options.observedAt), sdkMinimumEvidence(options.observedAt), olderMinimumEvidence(options.observedAt)] }
    : { kind: "KNOWN" as const, amount: DecimalAmount.one, quoteAsset: "USDC", evidence: sdkMinimumEvidence(options.observedAt), conflicts: [officialGenericMinimumEvidence(options.observedAt), olderMinimumEvidence(options.observedAt)] };
  return request.instruments.flatMap((instrument) => ([
    { marketId: instrument.market.id, side: "yes" as const, coin: instrument.market.protocol.yesCoin, assetId: instrument.market.protocol.yesAssetId, precision: precision(), minimumNotional: minimumNotional() },
    { marketId: instrument.market.id, side: "no" as const, coin: instrument.market.protocol.noCoin, assetId: instrument.market.protocol.noAssetId, precision: precision(), minimumNotional: minimumNotional() }
  ]));
}
