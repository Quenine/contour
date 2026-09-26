import { DecimalAmount } from "@contour/domain";
import { deriveRelevantSettlementStates } from "@contour/payoff";
import { validateBookLevels, type DecisionSegment, type ValidatedProblem } from "./model.js";
import type { CompileTerminalPayoffRequest } from "./types.js";

export type ValidationOutcome = { readonly ok: true; readonly problem: ValidatedProblem } | { readonly ok: false; readonly issues: readonly string[]; readonly noEligible: boolean; readonly stale: boolean };

function sameTimestamp(left: { readonly value: string }, right: { readonly value: string }): boolean { return left.value === right.value; }

export function validateCompileRequest(request: CompileTerminalPayoffRequest): ValidationOutcome {
  const issues: string[] = [];
  if (request.settlement.priceRange.min.compare(request.settlement.priceRange.max) > 0) issues.push("settlement price range min must not exceed max");
  if (request.settlement.priceRange.min.isNegative()) issues.push("settlement prices must be non-negative");
  if (request.maximumAcquisitionCost.isNegative()) issues.push("maximum acquisition cost must be non-negative");
  if (!Number.isSafeInteger(request.policy.maximumBookAgeMs) || request.policy.maximumBookAgeMs < 0) issues.push("maximumBookAgeMs must be a non-negative safe integer");
  if (request.policy.feeModel.kind === "fixedPerShare" && request.policy.feeModel.feePerShare.isNegative()) issues.push("feePerShare must be non-negative");
  if (request.existingPortfolio.components.some((component) => component.kind !== "perpetual")) issues.push("existingPortfolio may contain only the fixed perpetual exposure in BUILD 01");
  if (request.existingPortfolio.components.length > 1) issues.push("BUILD 01 supports at most one existing perpetual component");
  const existingPerp = request.existingPortfolio.components[0];
  if (existingPerp?.kind === "perpetual" && existingPerp.asset !== request.settlement.underlying) issues.push("existing perpetual asset must match settlement underlying");
  if (issues.length > 0) return { ok: false, issues, noEligible: false, stale: false };

  const eligible = request.instruments.filter((instrument) => instrument.market.underlying === request.settlement.underlying && sameTimestamp(instrument.market.settlementAt, request.settlement.timestamp));
  if (eligible.length === 0) return { ok: false, issues: ["no instruments match both settlement underlying and exact timestamp"], noEligible: true, stale: false };
  const duplicateIds = eligible.filter((instrument, index) => eligible.findIndex((candidate) => candidate.market.id === instrument.market.id) !== index);
  if (duplicateIds.length > 0) issues.push("eligible market identifiers must be unique");

  const now = Date.parse(request.policy.compilationTime.value);
  let stale = false;
  const segments: DecisionSegment[] = [];
  eligible.forEach((instrument, instrumentIndex) => {
    for (const [side, book, expectedIndex] of [["yes", instrument.yesBook, 0], ["no", instrument.noBook, 1]] as const) {
      const context = `market ${instrument.market.id} ${side}`;
      if (book.outcomeId !== instrument.market.id || book.sideIndex !== expectedIndex) issues.push(`${context} book identifiers do not match the market side`);
      issues.push(...validateBookLevels(book.asks, context));
      const bestBid = book.bids[0]; const bestAsk = book.asks[0];
      if (bestBid && bestAsk && bestBid.price.compare(bestAsk.price) > 0) issues.push(`${context} book is crossed`);
      const observed = Date.parse(book.freshness.observedAt.value);
      if (observed > now || now - observed > request.policy.maximumBookAgeMs) stale = true;
      book.asks.forEach((level, bookLevel) => segments.push({
        variable: `x_${instrumentIndex}_${side}_${bookLevel}`,
        market: instrument.market,
        side,
        bookLevel,
        price: level.price,
        available: level.quantity,
        feePerShare: request.policy.feeModel.kind === "fixedPerShare" ? request.policy.feeModel.feePerShare : DecimalAmount.zero,
        freshness: book.freshness
      }));
    }
  });
  if (stale) return { ok: false, issues: ["one or more eligible books violate the compile freshness policy"], noEligible: false, stale: true };
  if (issues.length > 0) return { ok: false, issues, noEligible: false, stale: false };
  const states = deriveRelevantSettlementStates(request.settlement.priceRange.min, request.settlement.priceRange.max, eligible.map((instrument) => instrument.market.threshold));
  return { ok: true, problem: { request, instruments: eligible, segments, states } };
}
