import { HyperliquidReadError } from "@contour/hyperliquid";

export function logServerEvent(event: string, error?: unknown): void {
  const category = error instanceof HyperliquidReadError ? error.category : error instanceof Error ? error.name : "UnknownError";
  // Never include addresses, request bodies, provider payloads, or exception messages.
  console.warn(JSON.stringify({ service: "contour-web", event, category, at: new Date().toISOString() }));
}

export function logCompileOutcome(mode: "fixture" | "live", status: string, executionStatus?: string): void {
  const record = { service: "contour-web", event: "compile-completed", mode, status, ...(executionStatus ? { executionStatus } : {}), at: new Date().toISOString() };
  console.info(JSON.stringify(record));
}

export function upstreamStatus(error: unknown): number {
  if (error instanceof HyperliquidReadError && error.category === "RateLimited") return 503;
  if (error instanceof HyperliquidReadError) return 502;
  return 500;
}

export function upstreamMessage(error: unknown): string {
  if (error instanceof HyperliquidReadError && error.category === "Timeout") return "Market data provider timed out. Please try again.";
  if (error instanceof HyperliquidReadError && error.category === "RateLimited") return "Market data provider is busy. Please try again shortly.";
  if (error instanceof HyperliquidReadError) return "Market data provider is temporarily unavailable.";
  return "The request could not be completed. Please try again.";
}
