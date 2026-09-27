import { DecimalAmount } from "@contour/domain";

export type ConstraintMode = "minimumPnl" | "maximumLoss";

export function parseDecimalInput(value: unknown, label: string): DecimalAmount {
  if (typeof value !== "string" || value.length > 80) throw new Error(`${label} must be supplied as a decimal string of at most 80 characters`);
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
  if (typeof value !== "string" || value.length !== 42 || !/^0x[0-9a-fA-F]{40}$/.test(value)) throw new Error("enter a valid public Hyperliquid address");
  return value;
}

export function parseLiveCompileInput(value: unknown): import("./live").LiveCompileInput {
  if (typeof value !== "object" || value === null || Array.isArray(value)) throw new Error("request body must be an object");
  const body = value as Record<string, unknown>;
  const requiredString = (key: string, maxLength = 80): string => {
    const field = body[key];
    if (typeof field !== "string" || field.length === 0 || field.length > maxLength) throw new Error(`${key} must be a non-empty string of at most ${maxLength} characters`);
    return field;
  };
  const constraintMode = body.constraintMode;
  if (constraintMode !== "minimumPnl" && constraintMode !== "maximumLoss") throw new Error("constraint mode is unsupported");
  const exposure = body.exposure;
  if (typeof exposure !== "object" || exposure === null || Array.isArray(exposure)) throw new Error("exposure must be an object");
  const source = (exposure as Record<string, unknown>).source;
  let parsedExposure: import("./live").LiveCompileInput["exposure"];
  if (source === "synthetic") {
    const candidate = exposure as Record<string, unknown>;
    if (candidate.direction !== "long" && candidate.direction !== "short") throw new Error("synthetic direction is unsupported");
    parsedExposure = { source, direction: candidate.direction, quantity: boundedString(candidate.quantity, "BTC quantity"), entryPrice: boundedString(candidate.entryPrice, "entry price") };
  } else if (source === "account") {
    const candidate = exposure as Record<string, unknown>;
    if (!Number.isSafeInteger(candidate.positionIndex) || (candidate.positionIndex as number) < 0 || (candidate.positionIndex as number) > 1000) throw new Error("public account position selection is invalid");
    parsedExposure = { source, address: validatePublicAddress(candidate.address), positionIndex: candidate.positionIndex as number };
  } else throw new Error("exposure source is unsupported");
  const settlementTimestamp = requiredString("settlementTimestamp", 40);
  if (!Number.isFinite(Date.parse(settlementTimestamp)) || !settlementTimestamp.endsWith("Z")) throw new Error("settlement timestamp must be a UTC ISO timestamp");
  return {
    settlementTimestamp,
    minimumPrice: requiredString("minimumPrice"),
    maximumPrice: requiredString("maximumPrice"),
    constraintMode,
    constraintValue: requiredString("constraintValue"),
    maximumBudget: requiredString("maximumBudget"),
    marketContextIdentity: requiredString("marketContextIdentity", 128),
    exposure: parsedExposure
  };
}

function boundedString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 80) throw new Error(`${label} must be a non-empty decimal string of at most 80 characters`);
  return value;
}
export function freshnessState(observedAt: string | undefined, maximumAgeMs: number, nowMs = Date.now()): "LIVE" | "STALE" | "UNAVAILABLE" {
  if (!observedAt || !Number.isSafeInteger(maximumAgeMs) || maximumAgeMs < 0) return "UNAVAILABLE";
  const observed = Date.parse(observedAt);
  if (!Number.isFinite(observed)) return "UNAVAILABLE";
  return nowMs - observed <= maximumAgeMs ? "LIVE" : "STALE";
}
