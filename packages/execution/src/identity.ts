import type { CompileTerminalPayoffRequest } from "@contour/compiler";
import type { ExecutionOrder, ExecutionSnapshot } from "./types.js";

export function executionSnapshot(request: CompileTerminalPayoffRequest): ExecutionSnapshot {
  const books = request.instruments.flatMap((instrument) => ([
    { marketId: instrument.market.id, side: "yes", coin: instrument.yesBook.coin, freshness: instrument.yesBook.freshness, bids: instrument.yesBook.bids, asks: instrument.yesBook.asks },
    { marketId: instrument.market.id, side: "no", coin: instrument.noBook.coin, freshness: instrument.noBook.freshness, bids: instrument.noBook.bids, asks: instrument.noBook.asks }
  ] as const)).sort((a, b) => BigInt(a.marketId) < BigInt(b.marketId) ? -1 : BigInt(a.marketId) > BigInt(b.marketId) ? 1 : a.side.localeCompare(b.side));
  const canonical = books.map((book) => ({
    marketId: book.marketId, side: book.side, coin: book.coin,
    observedAt: book.freshness.observedAt.value, source: book.freshness.source, network: book.freshness.network,
    bids: book.bids.map((level) => [level.price.toString(), level.quantity.toString(), level.orderCount]),
    asks: book.asks.map((level) => [level.price.toString(), level.quantity.toString(), level.orderCount])
  }));
  return {
    identity: `contour-book-v1:${JSON.stringify(canonical)}`,
    observedAt: [...new Set(books.map((book) => book.freshness.observedAt.value))].sort(),
    sourceNetworks: [...new Set(books.map((book) => `${book.freshness.source}:${book.freshness.network}`))].sort()
  };
}

export function executionPlanIdentity(requestIdentity: string, snapshotIdentity: string, orders: readonly Pick<ExecutionOrder, "marketId" | "side" | "sourceBookLevel" | "plannedPriceText" | "plannedQuantityText">[], trustPolicy: string): string {
  return `contour-plan-v1:${JSON.stringify({ requestIdentity, snapshotIdentity, trustPolicy, orders: orders.map((order) => [order.marketId, order.side, order.sourceBookLevel, order.plannedPriceText, order.plannedQuantityText]) })}`;
}
