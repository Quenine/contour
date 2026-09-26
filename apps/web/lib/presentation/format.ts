function splitDecimal(value: string): { readonly negative: boolean; readonly whole: string; readonly fraction: string } {
  const match = /^\s*(-?)(\d+)(?:\.(\d+))?\s*$/.exec(value);
  if (!match) return { negative: false, whole: value, fraction: "" };
  return { negative: match[1] === "-", whole: match[2] ?? "0", fraction: match[3] ?? "" };
}

function roundedDecimal(value: string, places: number, trimTrailingZeros: boolean): string {
  const parsed = splitDecimal(value);
  if (!/^\d+$/.test(parsed.whole)) return value;
  const fraction = `${parsed.fraction}${"0".repeat(places + 1)}`;
  let scaled = BigInt(`${parsed.whole}${fraction.slice(0, places)}` || "0");
  if (fraction[places] !== undefined && fraction[places] >= "5") scaled += 1n;
  const divisor = 10n ** BigInt(places);
  const whole = places === 0 ? scaled : scaled / divisor;
  let decimal = places === 0 ? "" : (scaled % divisor).toString().padStart(places, "0");
  if (trimTrailingZeros) decimal = decimal.replace(/0+$/, "");
  const formattedWhole = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const magnitude = decimal ? `${formattedWhole}.${decimal}` : formattedWhole;
  return parsed.negative && scaled !== 0n ? `-${magnitude}` : magnitude;
}

export function formatMoney(value: string): string {
  const formatted = roundedDecimal(value, 2, false);
  return formatted.startsWith("-") ? `-$${formatted.slice(1)}` : `$${formatted}`;
}

export function formatBtcPrice(value: string): string { return formatMoney(value); }
export function formatQuantity(value: string, unit = "shares"): string { return `${roundedDecimal(value, 3, true)} ${unit}`; }
export function formatOutcomePrice(value: string): string { return roundedDecimal(value, 4, true); }

export function formatUtc(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid timestamp";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()} · ${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")} UTC`;
}
