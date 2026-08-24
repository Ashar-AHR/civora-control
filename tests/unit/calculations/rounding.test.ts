import { describe, expect, it } from 'vitest';
import { divideRoundHalfUp, moneyFromQuantity, moneyFromRate, percentageBp } from '../../../src/calculations/rounding';
import { fromFirestoreInteger, toFirestoreInteger } from '../../../src/calculations/integer';

describe('CALC-1.0.0 integer helpers', () => {
  it('rounds positive and negative exact halves away from zero', () => {
    expect(divideRoundHalfUp(5n, 2n)).toBe(3n);
    expect(divideRoundHalfUp(-5n, 2n)).toBe(-3n);
  });

  it('calculates money from basis points to the nearest halala', () => {
    expect(moneyFromRate(815_000_00n, 1500)).toBe(122_250_00n);
  });

  it('calculates six-decimal quantities without floating point', () => {
    expect(moneyFromQuantity(25_500_000n, 25_000n)).toBe(637_500n);
  });

  it('omits a zero-denominator percentage', () => {
    expect(percentageBp(100n, 0n)).toBeUndefined();
  });

  it('rejects unsafe Firestore integer conversion', () => {
    expect(() => toFirestoreInteger(BigInt(Number.MAX_SAFE_INTEGER) + 1n)).toThrow(RangeError);
    expect(fromFirestoreInteger(123)).toBe(123n);
  });
});
