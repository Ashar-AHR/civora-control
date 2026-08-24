const FIRESTORE_SAFE_MAX = BigInt(Number.MAX_SAFE_INTEGER);
const FIRESTORE_SAFE_MIN = BigInt(Number.MIN_SAFE_INTEGER);

export type MoneyMinor = bigint;
export type QuantityMicro = bigint;
export type RateBp = number;

export function toFirestoreInteger(value: bigint): number {
  if (value > FIRESTORE_SAFE_MAX || value < FIRESTORE_SAFE_MIN) {
    throw new RangeError('Integer exceeds Firestore-safe JavaScript range.');
  }
  return Number(value);
}

export function fromFirestoreInteger(value: number): bigint {
  if (!Number.isSafeInteger(value)) throw new RangeError('Firestore value is not a safe integer.');
  return BigInt(value);
}

export function assertRateBp(value: number): RateBp {
  if (!Number.isInteger(value) || value < 0 || value > 10_000) {
    throw new RangeError('Rate must be an integer from 0 to 10000 basis points.');
  }
  return value;
}
