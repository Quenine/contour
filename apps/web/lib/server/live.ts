import { compileTerminalPayoff, type CompileTerminalPayoffRequest, type ExecutableBinaryInstrument } from "@contour/compiler";
import { assetSymbol, DecimalAmount, UtcTimestamp, type BinaryPriceOutcome } from "@contour/domain";
import { HyperliquidReader } from "@contour/hyperliquid";
import type { PerpetualTerminalComponent } from "@contour/payoff";
import type { CompilationDto, LiveUniverseDto, PublicAccountDto } from "../presentation/types";
import { freshnessState, minimumPnlFromInput, parseDecimalInput, validatePublicAddress } from "./input";
import { presentCompilerResult } from "./presentation";

const reader = new HyperliquidReader();
const btc = assetSymbol("BTC");
const fresh = (observedAt: string, source: string, network: string) => ({ state: freshnessState(observedAt, 120_000), observedAt, source, network } as const);

export interface LiveCompileInput {
  readonly settlementTimestamp: string;
  readonly minimumPrice: string;
  readonly maximumPrice: string;
  readonly constraintMode: "minimumPnl" | "maximumLoss";
  readonly constraintValue: string;
  readonly maximumBudget: string;
  readonly exposure: { readonly source: "synthetic"; readonly direction: "long" | "short"; readonly quantity: string; readonly entryPrice: string } | { readonly source: "account"; readonly address: string; readonly positionIndex: number };
}

function binaryMarkets(outcomes: readonly (BinaryPriceOutcome | { readonly kind: "generic" })[]): readonly BinaryPriceOutcome[] {
  return outcomes.filter((outcome): outcome is BinaryPriceOutcome => outcome.kind === "binaryPrice" && outcome.underlying === btc);
}

export async function getLiveUniverse(): Promise<LiveUniverseDto> {
  try {
    const [perp, outcomes] = await Promise.all([reader.btcPerpetual(), reader.outcomeMarkets()]);
    const supported = binaryMarkets(outcomes);
    const groups = new Map<string, BinaryPriceOutcome[]>();
    for (const market of supported) {
      if (Date.parse(market.settlementAt.value) > Date.now()) groups.set(market.settlementAt.value, [...(groups.get(market.settlementAt.value) ?? []), market]);
    }
    return {
      freshness: fresh(perp.freshness.observedAt.value, perp.freshness.source, perp.freshness.network), btcMark: perp.markPrice.toString(), btcOracle: perp.oraclePrice.toString(), supportedBinaryCount: supported.length,
      settlementGroups: [...groups.entries()].map(([timestamp, markets]) => ({ timestamp, marketCount: markets.length, markets: markets.sort((left, right) => left.threshold.compare(right.threshold)).map((market) => ({ id: market.id, threshold: market.threshold.toString(), comparator: market.comparator === "greaterThan" ? ">" as const : ">=" as const })) })).sort((left, right) => left.timestamp.localeCompare(right.timestamp))
    };
  } catch (error) {
    return { freshness: { state: "UNAVAILABLE" }, supportedBinaryCount: 0, settlementGroups: [], unavailableReason: error instanceof Error ? error.message : "live market data is unavailable" };
  }
}

export async function getPublicAccount(addressInput: unknown): Promise<PublicAccountDto> {
  const address = validatePublicAddress(addressInput);
  const snapshot = await reader.accountPerpetuals(address);
  return { address: snapshot.address, positions: snapshot.positions.map((position, index) => ({ index, asset: position.asset, direction: position.direction, quantity: position.quantity.toString(), entryPrice: position.entryPrice.toString() })), freshness: fresh(snapshot.freshness.observedAt.value, snapshot.freshness.source, snapshot.freshness.network) };
}

async function existingExposure(input: LiveCompileInput["exposure"]): Promise<PerpetualTerminalComponent> {
  if (input.source === "synthetic") {
    if (input.direction !== "long" && input.direction !== "short") throw new Error("synthetic direction is unsupported");
    const quantity = parseDecimalInput(input.quantity, "BTC quantity");
    if (quantity.compare(DecimalAmount.zero) <= 0) throw new Error("BTC quantity must be positive");
    return { kind: "perpetual", asset: btc, direction: input.direction, quantity, entryPrice: parseDecimalInput(input.entryPrice, "entry price"), externalTerms: "excluded" };
  }
  const account = await getPublicAccount(input.address);
  if (!Number.isSafeInteger(input.positionIndex) || input.positionIndex < 0) throw new Error("public account position selection is invalid");
  const selected = account.positions[input.positionIndex];
  if (!selected || selected.asset !== "BTC") throw new Error("the selected public account position is not a supported BTC perpetual");
  return { kind: "perpetual", asset: btc, direction: selected.direction, quantity: DecimalAmount.parse(selected.quantity), entryPrice: DecimalAmount.parse(selected.entryPrice), externalTerms: "excluded" };
}

export async function compileLive(input: LiveCompileInput): Promise<CompilationDto> {
  const settlementTimestamp = UtcTimestamp.parse(input.settlementTimestamp);
  const outcomes = await reader.outcomeMarkets();
  const eligible = binaryMarkets(outcomes).filter((market) => market.settlementAt.value === settlementTimestamp.value);
  const instruments: ExecutableBinaryInstrument[] = await Promise.all(eligible.map(async (market) => {
    const [yesBook, noBook] = await Promise.all([reader.outcomeOrderBook(market.id, 0), reader.outcomeOrderBook(market.id, 1)]);
    return { market, yesBook, noBook };
  }));
  const request: CompileTerminalPayoffRequest = {
    existingPortfolio: { components: [await existingExposure(input.exposure)] },
    settlement: { underlying: btc, timestamp: settlementTimestamp, priceRange: { min: parseDecimalInput(input.minimumPrice, "minimum settlement price"), max: parseDecimalInput(input.maximumPrice, "maximum settlement price") } },
    constraint: { minimumTerminalPnl: minimumPnlFromInput(input.constraintMode, input.constraintValue) }, maximumAcquisitionCost: parseDecimalInput(input.maximumBudget, "maximum acquisition budget"), instruments,
    policy: { maximumBookAgeMs: 120_000, compilationTime: UtcTimestamp.fromEpochMilliseconds(Date.now()), feeModel: { kind: "excluded" } }
  };
  return presentCompilerResult(request, await compileTerminalPayoff(request));
}
