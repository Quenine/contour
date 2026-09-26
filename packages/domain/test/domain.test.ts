import { describe, expect, it } from "vitest";
import { assetSymbol, DecimalAmount, UtcTimestamp } from "../src/index.js";
describe("DecimalAmount", () => {
  it("keeps decimal arithmetic exact", () => expect(DecimalAmount.parse("0.1").add(DecimalAmount.parse("0.2")).toString()).toBe("0.3"));
  it("rejects non-decimal input", () => expect(() => DecimalAmount.parse("1e3")).toThrow(RangeError));
  it("validates basic value objects", () => { expect(assetSymbol("BTC")).toBe("BTC"); expect(() => UtcTimestamp.parse("2026-01-01")).toThrow(RangeError); });
});
