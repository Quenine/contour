import { DecimalAmount } from "@contour/domain";

const ten = (power: number): bigint => 10n ** BigInt(power);

export function quantize(value: DecimalAmount, decimalPlaces: number, direction: "DOWN" | "UP"): DecimalAmount {
  if (!Number.isSafeInteger(decimalPlaces) || decimalPlaces < 0) throw new RangeError("decimalPlaces must be a non-negative safe integer");
  if (value.isNegative()) throw new RangeError("execution normalization accepts non-negative values only");
  if (value.scale <= decimalPlaces) return value;
  const divisor = ten(value.scale - decimalPlaces);
  let coefficient = value.coefficient / divisor;
  if (direction === "UP" && value.coefficient % divisor !== 0n) coefficient += 1n;
  return DecimalAmount.parse(decimalPlaces === 0 ? coefficient.toString() : `${(coefficient / ten(decimalPlaces)).toString()}.${(coefficient % ten(decimalPlaces)).toString().padStart(decimalPlaces, "0")}`);
}

function significantDecimalPlaces(value: DecimalAmount, significantFigures: number): number {
  const [integer = "0", fraction = ""] = value.toString().split(".");
  if (integer !== "0") return Math.max(0, significantFigures - integer.length);
  const leadingZeros = fraction.search(/[1-9]/);
  return leadingZeros < 0 ? significantFigures : leadingZeros + significantFigures;
}

export function normalizeLimitPrice(value: DecimalAmount, precision: Extract<import("./types.js").ProtocolPrecision, { kind: "KNOWN" }>, side: "BUY" | "SELL"): { readonly value: DecimalAmount; readonly text: string } {
  if (value.compare(DecimalAmount.zero) <= 0) throw new RangeError("limit price must be positive");
  const places = Math.min(precision.maximumPriceDecimalPlaces, significantDecimalPlaces(value, precision.maximumPriceSignificantFigures));
  const normalized = quantize(value, places, side === "BUY" ? "UP" : "DOWN");
  return { value: normalized, text: normalized.toString() };
}

export function normalizeSize(value: DecimalAmount, szDecimals: number, direction: "DOWN" | "UP"): { readonly value: DecimalAmount; readonly text: string } {
  const normalized = quantize(value, szDecimals, direction);
  return { value: normalized, text: normalized.toString() };
}

export function minimumSizeForNotional(minimum: DecimalAmount, price: DecimalAmount, szDecimals: number): DecimalAmount {
  if (minimum.isNegative() || price.compare(DecimalAmount.zero) <= 0) throw new RangeError("minimum notional and price must be positive");
  const numerator = minimum.coefficient * ten(price.scale + szDecimals);
  const denominator = price.coefficient * ten(minimum.scale);
  const units = (numerator + denominator - 1n) / denominator;
  return DecimalAmount.parse(szDecimals === 0 ? units.toString() : `${units / ten(szDecimals)}.${(units % ten(szDecimals)).toString().padStart(szDecimals, "0")}`);
}

export function isProtocolSize(value: DecimalAmount, szDecimals: number): boolean { return value.scale <= szDecimals; }

export function significantFigures(value: DecimalAmount): number {
  const digits = value.coefficient.toString().replace("-", "").replace(/^0+/, "");
  return digits.length;
}
