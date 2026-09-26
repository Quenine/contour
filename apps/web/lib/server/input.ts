import { DecimalAmount } from "@contour/domain";

export type ConstraintMode = "minimumPnl" | "maximumLoss";

export function parseDecimalInput(value: unknown, label: string): DecimalAmount {
  if (typeof value !== "string") throw new Error(`${label} must be supplied as a decimal string`);
  try { return DecimalAmount.parse(value); } catch { throw new Error(`${label} must be a valid decimal`); }
}
export function minimumPnlFromInput(mode: unknown, value: unknown): DecimalAmount {
  const amount = parseDecimalInput(value, mode === "maximumLoss" ? "maximum loss" : "minimum terminal PnL");
  if (mode === "minimumPnl") return amount;
  if (mode === "maximumLoss") {
    if (amount.isNegative()) throw new Error("maximum loss must be non-negative");
    return amount.negate();
  }
  throw new Error("constraint mode is unsupported");
}
export function validatePublicAddress(value: unknown): string {
  if (typeof value !== "string" || !/^0x[0-9a-fA-F]{40}$/.test(value)) throw new Error("enter a valid public Hyperliquid address");
  return value;
}
export function freshnessState(observedAt: string | undefined, maximumAgeMs: number, nowMs = Date.now()): "LIVE" | "STALE" | "UNAVAILABLE" {
  if (!observedAt || !Number.isSafeInteger(maximumAgeMs) || maximumAgeMs < 0) return "UNAVAILABLE";
  const observed = Date.parse(observedAt);
  if (!Number.isFinite(observed)) return "UNAVAILABLE";
  return nowMs - observed <= maximumAgeMs ? "LIVE" : "STALE";
}
