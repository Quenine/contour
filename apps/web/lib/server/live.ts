import { compileTerminalPayoff, type CompileTerminalPayoffRequest, type ExecutableBinaryInstrument } from "@contour/compiler";
import { assetSymbol, DecimalAmount, UtcTimestamp, type BinaryPriceOutcome } from "@contour/domain";
import { HyperliquidReader } from "@contour/hyperliquid";
import type { PerpetualTerminalComponent } from "@contour/payoff";
import type { CompilationDto, LiveUniverseDto, PublicAccountDto } from "../presentation/types";
import { liveRequestFingerprint, type LiveRequestFingerprintInput } from "../presentation/identity";
import { freshnessState, minimumPnlFromInput, parseDecimalInput, validatePublicAddress } from "./input";
import { presentCompilerResult } from "./presentation";
import { executionSnapshot } from "@contour/execution";
import { planLiveExecution } from "./execution";
import { logServerEvent } from "./observability";

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
  readonly marketContextIdentity: string;
  readonly exposure: { readonly source: "synthetic"; readonly direction: "long" | "short"; readonly quantity: string; readonly entryPrice: string } | { readonly source: "account"; readonly address: string; readonly positionIndex: number };
}

function requestFingerprintInput(input: LiveCompileInput): LiveRequestFingerprintInput {
  return { mode: "live", exposure: input.exposure, settlementTimestamp: input.settlementTimestamp, minimumPrice: input.minimumPrice, maximumPrice: input.maximumPrice, constraintMode: input.constraintMode, constraintValue: input.constraintValue, maximumBudget: input.maximumBudget, feeTreatment: "excluded" };
}

function binaryMarkets(outcomes: readonly (BinaryPriceOutcome | { readonly kind: "generic" })[]): readonly BinaryPriceOutcome[] {
  return outcomes.filter((outcome): outcome is BinaryPriceOutcome => outcome.kind === "binaryPrice" && outcome.underlying === btc);
}

export async function getLiveUniverse(): Promise<LiveUniverseDto> {
  const [perpResult, outcomeResult] = await Promise.allSettled([reader.btcPerpetual(), reader.outcomeMarkets()]);
  const perp = perpResult.status === "fulfilled" ? perpResult.value : undefined;
  const outcomes = outcomeResult.status === "fulfilled" ? outcomeResult.value : undefined;
  if (!perp) logServerEvent("live-universe-perpetual-unavailable", perpResult.status === "rejected" ? perpResult.reason : undefined);
  if (!outcomes) logServerEvent("live-universe-outcomes-unavailable", outcomeResult.status === "rejected" ? outcomeResult.reason : undefined);
  if (!perp && !outcomes) return { freshness: { state: "UNAVAILABLE" }, supportedBinaryCount: 0, settlementGroups: [], unavailableReason: "Live market data is temporarily unavailable. The verified fixture remains available." };
  const supported = binaryMarkets(outcomes ?? []);
  const groups = new Map<string, BinaryPriceOutcome[]>();
  for (const market of supported) {
    if (Date.parse(market.settlementAt.value) > Date.now()) groups.set(market.settlementAt.value, [...(groups.get(market.settlementAt.value) ?? []), market]);
  }
  const observation = perp?.freshness ?? supported[0]?.freshness;
  const state = !perp || !outcomes ? "PARTIALLY_AVAILABLE" : observation ? freshnessState(observation.observedAt.value, 120_000) : "LIVE";
  return {
    freshness: observation ? { ...fresh(observation.observedAt.value, observation.source, observation.network), state } : { state, source: "hyperliquid-direct", network: "mainnet" },
    ...(perp ? { btcMark: perp.markPrice.toString(), btcOracle: perp.oraclePrice.toString() } : {}),
    supportedBinaryCount: supported.length,
    settlementGroups: [...groups.entries()].map(([timestamp, markets]) => ({ timestamp, marketCount: markets.length, markets: markets.sort((left, right) => left.threshold.compare(right.threshold)).map((market) => ({ id: market.id, threshold: market.threshold.toString(), comparator: market.comparator === "greaterThan" ? ">" as const : ">=" as const })) })).sort((left, right) => left.timestamp.localeCompare(right.timestamp)),
    ...(!perp || !outcomes ? { unavailableReason: "Some live market sources are unavailable; displayed values may be incomplete. No fixture data has been substituted." } : {})
  };
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
  const requestIdentity = liveRequestFingerprint(requestFingerprintInput(input));
  if (typeof input.marketContextIdentity !== "string") throw new Error("live market context identity is required");
  const settlementTimestamp = UtcTimestamp.parse(input.settlementTimestamp);
  const outcomes = await reader.outcomeMarkets();
  const eligible = binaryMarkets(outcomes).filter((market) => market.settlementAt.value === settlementTimestamp.value);
  if (eligible.length > 80) throw new Error("selected horizon has too many markets to inspect in one request");
  const instruments = await mapWithConcurrency(eligible, 3, async (market): Promise<ExecutableBinaryInstrument> => {
    const [yesBook, noBook] = await Promise.all([reader.outcomeOrderBook(market.id, 0), reader.outcomeOrderBook(market.id, 1)]);
    return { market, yesBook, noBook };
  });
  const request: CompileTerminalPayoffRequest = {
    existingPortfolio: { components: [await existingExposure(input.exposure)] },
    settlement: { underlying: btc, timestamp: settlementTimestamp, priceRange: { min: parseDecimalInput(input.minimumPrice, "minimum settlement price"), max: parseDecimalInput(input.maximumPrice, "maximum settlement price") } },
    constraint: { minimumTerminalPnl: minimumPnlFromInput(input.constraintMode, input.constraintValue) }, maximumAcquisitionCost: parseDecimalInput(input.maximumBudget, "maximum acquisition budget"), instruments,
    policy: { maximumBookAgeMs: 120_000, compilationTime: UtcTimestamp.fromEpochMilliseconds(Date.now()), feeModel: { kind: "excluded" } }
  };
  const marketSnapshotIdentity = executionSnapshot(request).identity;
  const result = await compileTerminalPayoff(request);
  return presentCompilerResult(request, result, { mode: "live", requestIdentity, targetPresentation: input.constraintMode, marketContextIdentity: input.marketContextIdentity, marketSnapshotIdentity }, planLiveExecution(request, result, requestIdentity));
}

async function mapWithConcurrency<T, R>(items: readonly T[], limit: number, work: (item: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(items.length); let nextIndex = 0;
  const worker = async (): Promise<void> => {
    while (true) {
      const index = nextIndex++;
      if (index >= items.length) return;
      results[index] = await work(items[index]!);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return results;
}
