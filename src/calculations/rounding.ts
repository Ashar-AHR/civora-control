export function divideRoundHalfUp(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) throw new RangeError('Denominator cannot be zero.');
  const sign = (numerator < 0n) !== (denominator < 0n) ? -1n : 1n;
  const absoluteNumerator = numerator < 0n ? -numerator : numerator;
  const absoluteDenominator = denominator < 0n ? -denominator : denominator;
  const quotient = absoluteNumerator / absoluteDenominator;
  const remainder = absoluteNumerator % absoluteDenominator;
  const rounded = remainder * 2n >= absoluteDenominator ? quotient + 1n : quotient;
  return sign * rounded;
}

export function moneyFromRate(baseMinor: bigint, rateBp: number): bigint {
  return divideRoundHalfUp(baseMinor * BigInt(rateBp), 10_000n);
}

export function moneyFromQuantity(quantityMicro: bigint, rateMinor: bigint): bigint {
  return divideRoundHalfUp(quantityMicro * rateMinor, 1_000_000n);
}

export function percentageBp(numeratorMinor: bigint, denominatorMinor: bigint): number | undefined {
  if (denominatorMinor === 0n) return undefined;
  const result = divideRoundHalfUp(numeratorMinor * 10_000n, denominatorMinor);
  const numeric = Number(result);
  if (!Number.isSafeInteger(numeric)) throw new RangeError('Percentage exceeds safe integer range.');
  return numeric;
}
