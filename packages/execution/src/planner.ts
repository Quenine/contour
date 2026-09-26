import { DecimalAmount } from "@contour/domain";
import { verifyTerminalPayoff, type BinaryTerminalComponent, type TerminalPortfolio } from "@contour/payoff";
import { executionPlanIdentity, executionSnapshot } from "./identity.js";
import { minimumSizeForNotional, normalizeLimitPrice, normalizeSize } from "./decimal.js";
import { renderDryRunReport } from "./report.js";
import { auditExecutionPlan } from "./audit.js";
import type { BuilderFeeTreatment, ExecutionBlocker, ExecutionLeg, ExecutionOrder, ExecutionPlan, ExecutionPlanResult, ExecutionPlannerInput, ClientOrderIntentId } from "./types.js";

const blocked = (status: Exclude<ExecutionPlanResult["status"], "READY" | "NOT_NEEDED">, blocker: ExecutionBlocker, snapshot?: ReturnType<typeof executionSnapshot>): ExecutionPlanResult => ({ status, blockers: [blocker], ...(snapshot ? { snapshot } : {}) });
const metadataKey = (marketId: string, side: string): string => `${marketId}:${side}`;

interface Seed { readonly segmentIndex: number; readonly market: ExecutionPlannerInput["request"]["instruments"][number]["market"]; readonly order: Omit<ExecutionOrder, "sequence" | "intentId" | "plannedQuantity" | "plannedQuantityText" | "notional">; readonly down: DecimalAmount; readonly up: DecimalAmount; }

function builderTreatment(input: ExecutionPlannerInput): BuilderFeeTreatment | ExecutionBlocker {
  const requested = input.builderFee?.requestedRateTenthsBps ?? 0;
  if (!Number.isSafeInteger(requested) || requested < 0 || requested > 1000) return { kind: "FEE_UNRESOLVED", explanation: "builder fee must be an integer from 0 to 1000 tenths of a basis point" };
  if (requested !== 0 || input.builderFee?.builderAddress) return { kind: "FEE_UNRESOLVED", explanation: "official HIP-4 semantics apply builder codes to outcome sell orders, not the protective BUY orders planned here" };
  return { requestedRateTenthsBps: 0, maximumAllowedTenthsBps: 1000, userApprovalRequired: false, supportedForOrder: false, state: "DISABLED" };
}

function candidateOrders(seeds: readonly Seed[], useUpThrough: number, intentNamespace: string): ExecutionOrder[] {
  return seeds.map((seed, index) => {
    const plannedQuantity = index <= useUpThrough ? seed.up : seed.down;
    const plannedQuantityText = plannedQuantity.toString();
    const notional = seed.order.plannedLimitPrice.multiply(plannedQuantity);
    const intentId = `contour-intent-v1:${intentNamespace}:${seed.order.marketId}:${seed.order.side}:${seed.order.sourceBookLevel}:${seed.order.plannedPriceText}:${plannedQuantityText}` as ClientOrderIntentId;
    return { ...seed.order, sequence: index + 1, intentId, plannedQuantity, plannedQuantityText, notional };
  });
}

function exactVerification(input: ExecutionPlannerInput, seeds: readonly Seed[], orders: readonly ExecutionOrder[]): { readonly verification: ReturnType<typeof verifyTerminalPayoff>; readonly portfolio: TerminalPortfolio } {
  const binaries: BinaryTerminalComponent[] = orders.filter((order) => !order.plannedQuantity.isZero()).map((order) => {
    const seed = seeds.find((item) => item.order.marketId === order.marketId && item.order.side === order.side && item.order.sourceBookLevel === order.sourceBookLevel)!;
    return { kind: "binary", comparator: seed.market.comparator, threshold: seed.market.threshold, side: order.side, shares: order.plannedQuantity, premium: order.notional };
  });
  const portfolio: TerminalPortfolio = { components: [...input.request.existingPortfolio.components, ...binaries] };
  return { portfolio, verification: verifyTerminalPayoff(portfolio, { settlementPriceMin: input.request.settlement.priceRange.min, settlementPriceMax: input.request.settlement.priceRange.max, minimumPnl: input.request.constraint.minimumTerminalPnl }) };
}

function candidateValid(input: ExecutionPlannerInput, seeds: readonly Seed[], orders: readonly ExecutionOrder[]): { readonly ok: boolean; readonly verification: ReturnType<typeof verifyTerminalPayoff>; readonly total: DecimalAmount } {
  const total = orders.reduce((sum, order) => sum.add(order.notional), DecimalAmount.zero);
  const verification = exactVerification(input, seeds, orders).verification;
  const valid = orders.every((order) => !order.plannedQuantity.isZero() && order.plannedQuantity.compare(order.sourceAvailableQuantity) <= 0 && order.notional.compare(order.minimumNotional.amount) >= 0)
    && total.compare(input.request.maximumAcquisitionCost) <= 0 && verification.holds;
  return { ok: valid, verification, total };
}

export function planExecution(input: ExecutionPlannerInput): ExecutionPlanResult {
  if (input.compilerResult.status === "ALREADY_SATISFIED") return { status: "NOT_NEEDED", explanation: "the existing portfolio already satisfies the terminal floor" };
  if (input.compilerResult.status !== "FEASIBLE" || !input.compilerResult.verification.holds) return blocked("INVALID_COMPILER_RESULT", { kind: "INVALID_COMPILER_RESULT", explanation: `execution planning requires an exactly verified FEASIBLE compiler result; received ${input.compilerResult.status}` });
  if (!Number.isSafeInteger(input.maximumBookAgeMs) || input.maximumBookAgeMs < 0) return blocked("INVALID_COMPILER_RESULT", { kind: "INVALID_COMPILER_RESULT", explanation: "execution freshness maximum must be a non-negative safe integer" });

  const snapshot = executionSnapshot(input.request);
  const currentIdentity = input.currentSnapshotIdentity ?? snapshot.identity;
  if (input.compilerSnapshotIdentity !== snapshot.identity || currentIdentity !== snapshot.identity) return blocked("MARKET_CHANGED", { kind: "MARKET_CHANGED", expectedSnapshotIdentity: input.compilerSnapshotIdentity, actualSnapshotIdentity: currentIdentity === snapshot.identity ? snapshot.identity : currentIdentity }, snapshot);
  const checkedMs = Date.parse(input.checkedAt.value);
  for (const instrument of input.request.instruments) for (const book of [instrument.yesBook, instrument.noBook]) {
    const observedMs = Date.parse(book.freshness.observedAt.value); const ageMs = checkedMs - observedMs;
    if (ageMs < 0 || ageMs > input.maximumBookAgeMs) return blocked("STALE_MARKET", { kind: "STALE_MARKET", observedAt: book.freshness.observedAt.value, checkedAt: input.checkedAt.value, ageMs, maximumAllowedAgeMs: input.maximumBookAgeMs }, snapshot);
  }

  const builder = builderTreatment(input);
  if ("kind" in builder) return blocked("FEE_UNRESOLVED", builder, snapshot);
  if (input.protocolFee.kind !== "KNOWN_ZERO_OUTCOME_MARKET") return blocked("FEE_UNRESOLVED", { kind: "FEE_UNRESOLVED", explanation: input.protocolFee.explanation }, snapshot);

  const metadata = new Map(input.protocolMetadata.map((item) => [metadataKey(item.marketId, item.side), item]));
  const seeds: Seed[] = [];
  for (let segmentIndex = 0; segmentIndex < input.compilerResult.executionSegments.length; segmentIndex += 1) {
    const segment = input.compilerResult.executionSegments[segmentIndex]!;
    const instrument = input.request.instruments.find((item) => item.market.id === segment.marketId);
    if (!instrument || instrument.market.underlying !== input.request.settlement.underlying || instrument.market.settlementAt.value !== input.request.settlement.timestamp.value) return blocked("INVALID_COMPILER_RESULT", { kind: "INVALID_COMPILER_RESULT", explanation: `selected market ${segment.marketId} does not share the requested underlying and settlement` }, snapshot);
    const book = segment.side === "yes" ? instrument.yesBook : instrument.noBook;
    const source = book.asks[segment.bookLevel];
    if (!source || source.price.compare(segment.bookPrice) !== 0 || source.quantity.compare(segment.maximumAvailableAtSnapshot) !== 0) return blocked("MARKET_CHANGED", { kind: "MARKET_CHANGED", expectedSnapshotIdentity: input.compilerSnapshotIdentity, actualSnapshotIdentity: snapshot.identity }, snapshot);
    const protocol = metadata.get(metadataKey(segment.marketId, segment.side));
    if (!protocol) return blocked("PROTOCOL_METADATA_UNAVAILABLE", { kind: "PROTOCOL_METADATA_UNAVAILABLE", marketId: segment.marketId, side: segment.side, field: "precision", explanation: "no protocol metadata was supplied for the selected outcome side" }, snapshot);
    if (protocol.precision.kind === "UNAVAILABLE") return blocked("PROTOCOL_METADATA_UNAVAILABLE", { kind: "PROTOCOL_METADATA_UNAVAILABLE", marketId: segment.marketId, side: segment.side, field: "precision", explanation: protocol.precision.explanation }, snapshot);
    if (!Number.isSafeInteger(protocol.precision.szDecimals) || protocol.precision.szDecimals < 0 || protocol.precision.szDecimals > 8 || protocol.precision.maximumPriceDecimalPlaces !== 8 - protocol.precision.szDecimals) return blocked("PRECISION_UNSUPPORTED", { kind: "PRECISION_UNSUPPORTED", marketId: segment.marketId, side: segment.side, explanation: "outcome precision must use the documented spot-style 8 - szDecimals price rule" }, snapshot);
    if (protocol.minimumNotional.kind === "UNAVAILABLE") return blocked("PROTOCOL_METADATA_UNAVAILABLE", { kind: "PROTOCOL_METADATA_UNAVAILABLE", marketId: segment.marketId, side: segment.side, field: "minimumNotional", explanation: protocol.minimumNotional.explanation }, snapshot);
    const plannedPrice = normalizeLimitPrice(source.price, protocol.precision, "BUY");
    if (plannedPrice.value.compare(source.price) < 0 || plannedPrice.value.compare(DecimalAmount.one) > 0) return blocked("PRECISION_UNSUPPORTED", { kind: "PRECISION_UNSUPPORTED", marketId: segment.marketId, side: segment.side, explanation: "safe BUY price normalization produced an invalid outcome limit" }, snapshot);
    const down = normalizeSize(segment.quantity, protocol.precision.szDecimals, "DOWN").value;
    const roundedUp = normalizeSize(segment.quantity, protocol.precision.szDecimals, "UP").value;
    const minSize = minimumSizeForNotional(protocol.minimumNotional.amount, plannedPrice.value, protocol.precision.szDecimals);
    const up = roundedUp.compare(minSize) >= 0 ? roundedUp : minSize;
    if (minSize.compare(source.quantity) > 0) return blocked("MIN_NOTIONAL_VIOLATION", { kind: "MIN_NOTIONAL_VIOLATION", marketId: segment.marketId, side: segment.side, minimumNotional: protocol.minimumNotional.amount.toString(), maximumPossibleNotional: plannedPrice.value.multiply(source.quantity).toString() }, snapshot);
    if (roundedUp.compare(source.quantity) > 0) return blocked("INSUFFICIENT_CURRENT_DEPTH", { kind: "INSUFFICIENT_CURRENT_DEPTH", marketId: segment.marketId, side: segment.side, requested: roundedUp.toString(), available: source.quantity.toString() }, snapshot);
    seeds.push({ segmentIndex, market: instrument.market, down, up, order: {
      marketId: segment.marketId, side: segment.side, protocolAssetId: protocol.assetId, coin: protocol.coin, direction: "BUY", orderType: "LIMIT", timeInForce: "GTC",
      sourceBookLevel: segment.bookLevel, sourcePrice: source.price, sourceAvailableQuantity: source.quantity,
      plannedLimitPrice: plannedPrice.value, plannedPriceText: plannedPrice.text, precision: protocol.precision, minimumNotional: protocol.minimumNotional, protocolFee: input.protocolFee, builderFee: builder
    } });
  }

  seeds.sort((a, b) => {
    const price = a.order.plannedLimitPrice.compare(b.order.plannedLimitPrice);
    if (price !== 0) return price;
    if (BigInt(a.order.marketId) < BigInt(b.order.marketId)) return -1;
    if (BigInt(a.order.marketId) > BigInt(b.order.marketId)) return 1;
    return a.order.side.localeCompare(b.order.side) || a.order.sourceBookLevel - b.order.sourceBookLevel;
  });
  let chosen: ExecutionOrder[] | undefined; let chosenVerification: ReturnType<typeof verifyTerminalPayoff> | undefined; let chosenTotal: DecimalAmount | undefined;
  const intentNamespace = `${input.requestIdentity}:${snapshot.identity}`;
  for (let useUpThrough = -1; useUpThrough < seeds.length; useUpThrough += 1) {
    const orders = candidateOrders(seeds, useUpThrough, intentNamespace); const checked = candidateValid(input, seeds, orders);
    if (checked.ok) { chosen = orders; chosenVerification = checked.verification; chosenTotal = checked.total; break; }
  }
  if (!chosen || !chosenVerification || !chosenTotal) return blocked("ROUNDING_INVALIDATED_PAYOFF", { kind: "ROUNDING_INVALIDATED_PAYOFF", explanation: "no deterministic floor/ceiling size candidate preserved payoff, budget, depth, and minimum notional constraints" }, snapshot);

  const maxAgeMs = Math.max(...input.request.instruments.flatMap((instrument) => [instrument.yesBook, instrument.noBook]).map((book) => checkedMs - Date.parse(book.freshness.observedAt.value)));
  const legs: ExecutionLeg[] = [...new Set(chosen.map((order) => metadataKey(order.marketId, order.side)))].map((key) => {
    const orders = chosen.filter((order) => metadataKey(order.marketId, order.side) === key); const first = orders[0]!;
    return { marketId: first.marketId, side: first.side, orderIntentIds: orders.map((order) => order.intentId), totalQuantity: orders.reduce((sum, order) => sum.add(order.plannedQuantity), DecimalAmount.zero), totalNotional: orders.reduce((sum, order) => sum.add(order.notional), DecimalAmount.zero) };
  });
  const identity = executionPlanIdentity(input.requestIdentity, snapshot.identity, chosen);
  const network = input.request.instruments[0]?.market.freshness.network ?? "mainnet";
  const withoutReport = {
    identity, status: "READY" as const, network, underlying: input.request.settlement.underlying, settlementTimestamp: input.request.settlement.timestamp.value,
    requestIdentity: input.requestIdentity, compilerSnapshotIdentity: input.compilerSnapshotIdentity, snapshot,
    freshness: { checkedAt: input.checkedAt.value, maximumAllowedAgeMs: input.maximumBookAgeMs, maximumAgeMs: maxAgeMs }, orders: chosen, legs,
    originalCompiledPremium: input.compilerResult.totalAcquisitionCost, executableNormalizedPremium: chosenTotal, budget: input.request.maximumAcquisitionCost, verification: chosenVerification
  };
  const plan: ExecutionPlan = { ...withoutReport, report: renderDryRunReport(withoutReport) };
  const audit = auditExecutionPlan(input.request, plan);
  if (!audit.passed) return { status: "ROUNDING_INVALIDATED_PAYOFF", blockers: audit.blockers, snapshot };
  return { status: "READY", plan };
}
