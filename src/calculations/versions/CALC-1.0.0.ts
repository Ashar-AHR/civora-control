import { moneyFromRate } from '../rounding';

export const calculationVersion = 'CALC-1.0.0' as const;

export interface IpcSummaryInput {
  grossCertifiedMinor: bigint;
  advanceRecoveryMinor: bigint;
  otherRecoveryMinor: bigint;
  otherDeductionMinor: bigint;
  retentionReleaseMinor: bigint;
  vatRateBp: number;
  retentionRateBp: number;
}

export interface IpcSummaryResult {
  totalRecoveriesMinor: bigint;
  netCertifiedMinor: bigint;
  vatMinor: bigint;
  retentionWithheldMinor: bigint;
  finalPayableMinor: bigint;
}

export function calculateIpcSummary(input: IpcSummaryInput): IpcSummaryResult {
  const totalRecoveriesMinor = input.advanceRecoveryMinor + input.otherRecoveryMinor;
  const netCertifiedMinor =
    input.grossCertifiedMinor - totalRecoveriesMinor - input.otherDeductionMinor + input.retentionReleaseMinor;
  const vatMinor = moneyFromRate(netCertifiedMinor, input.vatRateBp);
  const retentionWithheldMinor = moneyFromRate(input.grossCertifiedMinor, input.retentionRateBp);
  return {
    totalRecoveriesMinor,
    netCertifiedMinor,
    vatMinor,
    retentionWithheldMinor,
    finalPayableMinor: netCertifiedMinor + vatMinor - retentionWithheldMinor,
  };
}

export function paidOnBehalfExposure(grossWorkValueExcludingVatMinor: bigint): bigint {
  if (grossWorkValueExcludingVatMinor < 0n) throw new RangeError('Recoverable exposure cannot be negative.');
  return grossWorkValueExcludingVatMinor;
}
