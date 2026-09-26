import type { CompileTerminalPayoffRequest } from "@contour/compiler";
import { DecimalAmount, type UtcTimestamp } from "@contour/domain";
import type { OutcomeSideProtocolMetadata, ProtocolFeeTreatment, ProtocolPrecision } from "./types.js";

export const HIP4_MINIMUM_NOTIONAL_SOURCE = "@outcome.xyz/hip4@1.2.0-beta.1 (maintained SDK; protocol minimum changed to 1 USDC in its 2026-09-05 upgrade note)";
export const HIP4_ZERO_FEE_SOURCE = "Hyperliquid HIP-4 outcome markets documentation (initial-mainnet fees currently zero; observed 2026-09-26)";

export function knownHip4ProtocolFee(observedAt: UtcTimestamp): ProtocolFeeTreatment {
  return { kind: "KNOWN_ZERO_OUTCOME_MARKET", source: HIP4_ZERO_FEE_SOURCE, observedAt, settlementFeeIncluded: false };
}

export function outcomeMetadataForRequest(request: CompileTerminalPayoffRequest, options: {
  readonly precision: { readonly kind: "KNOWN"; readonly szDecimals: number; readonly source: string } | { readonly kind: "UNAVAILABLE"; readonly source: string; readonly explanation: string };
  readonly observedAt: UtcTimestamp;
}): readonly OutcomeSideProtocolMetadata[] {
  const precision = (): ProtocolPrecision => options.precision.kind === "KNOWN"
    ? { kind: "KNOWN", regime: "SPOT_STYLE", szDecimals: options.precision.szDecimals, maximumPriceSignificantFigures: 5, maximumPriceDecimalPlaces: 8 - options.precision.szDecimals, source: options.precision.source, observedAt: options.observedAt }
    : { kind: "UNAVAILABLE", source: options.precision.source, observedAt: options.observedAt, explanation: options.precision.explanation };
  return request.instruments.flatMap((instrument) => ([
    { marketId: instrument.market.id, side: "yes" as const, coin: instrument.market.protocol.yesCoin, assetId: instrument.market.protocol.yesAssetId, precision: precision(), minimumNotional: { kind: "KNOWN" as const, amount: DecimalAmount.one, quoteAsset: "USDC", protocolEnforced: true, source: HIP4_MINIMUM_NOTIONAL_SOURCE, observedAt: options.observedAt } },
    { marketId: instrument.market.id, side: "no" as const, coin: instrument.market.protocol.noCoin, assetId: instrument.market.protocol.noAssetId, precision: precision(), minimumNotional: { kind: "KNOWN" as const, amount: DecimalAmount.one, quoteAsset: "USDC", protocolEnforced: true, source: HIP4_MINIMUM_NOTIONAL_SOURCE, observedAt: options.observedAt } }
  ]));
}
