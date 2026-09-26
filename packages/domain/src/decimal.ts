/** Exact base-10 decimal. It deliberately has no Number conversion API. */
export class DecimalAmount {
  readonly coefficient: bigint;
  readonly scale: number;

  private constructor(coefficient: bigint, scale: number) {
    let normalizedCoefficient = coefficient;
    let normalizedScale = scale;
    while (normalizedScale > 0 && normalizedCoefficient % 10n === 0n) {
      normalizedCoefficient /= 10n;
      normalizedScale -= 1;
    }
    this.coefficient = normalizedCoefficient;
    this.scale = normalizedScale;
  }

  static parse(input: string): DecimalAmount {
    const value = input.trim();
    const match = /^([+-]?)(\d+)(?:\.(\d+))?$/.exec(value);
    if (!match) throw new RangeError(`Invalid decimal: ${input}`);
    const sign = match[1] === "-" ? -1n : 1n;
    const integer = match[2] ?? "0";
    const fraction = match[3] ?? "";
    return new DecimalAmount(sign * BigInt(`${integer}${fraction}`), fraction.length);
  }

  static readonly zero = new DecimalAmount(0n, 0);
  static readonly one = new DecimalAmount(1n, 0);

  add(other: DecimalAmount): DecimalAmount {
    const scale = Math.max(this.scale, other.scale);
    return new DecimalAmount(this.toScale(scale) + other.toScale(scale), scale);
  }
  subtract(other: DecimalAmount): DecimalAmount { return this.add(other.negate()); }
  multiply(other: DecimalAmount): DecimalAmount {
    return new DecimalAmount(this.coefficient * other.coefficient, this.scale + other.scale);
  }
  negate(): DecimalAmount { return new DecimalAmount(-this.coefficient, this.scale); }
  abs(): DecimalAmount { return this.coefficient < 0n ? this.negate() : this; }
  compare(other: DecimalAmount): -1 | 0 | 1 {
    const scale = Math.max(this.scale, other.scale);
    const left = this.toScale(scale); const right = other.toScale(scale);
    return left < right ? -1 : left > right ? 1 : 0;
  }
  isNegative(): boolean { return this.coefficient < 0n; }
  isZero(): boolean { return this.coefficient === 0n; }
  toString(): string {
    const negative = this.coefficient < 0n;
    const digits = (negative ? -this.coefficient : this.coefficient).toString();
    if (this.scale === 0) return `${negative ? "-" : ""}${digits}`;
    const padded = digits.padStart(this.scale + 1, "0");
    return `${negative ? "-" : ""}${padded.slice(0, -this.scale)}.${padded.slice(-this.scale)}`;
  }
  private toScale(scale: number): bigint { return this.coefficient * 10n ** BigInt(scale - this.scale); }
}
