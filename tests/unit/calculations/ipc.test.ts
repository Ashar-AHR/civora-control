import { describe, expect, it } from 'vitest';
import { calculateIpcSummary, paidOnBehalfExposure } from '../../../src/calculations/versions/CALC-1.0.0';

describe('CALC-1.0.0 commercial controls', () => {
  it('reconciles the approved worked IPC example', () => {
    const result = calculateIpcSummary({
      grossCertifiedMinor: 100_000_000n,
      advanceRecoveryMinor: 10_000_000n,
      otherRecoveryMinor: 7_500_000n,
      otherDeductionMinor: 1_000_000n,
      retentionReleaseMinor: 0n,
      vatRateBp: 1500,
      retentionRateBp: 1000,
    });
    expect(result.totalRecoveriesMinor).toBe(17_500_000n);
    expect(result.netCertifiedMinor).toBe(81_500_000n);
    expect(result.vatMinor).toBe(12_225_000n);
    expect(result.retentionWithheldMinor).toBe(10_000_000n);
    expect(result.finalPayableMinor).toBe(83_725_000n);
  });

  it('keeps paid-on-behalf VAT outside recoverable exposure', () => {
    expect(paidOnBehalfExposure(25_000_000n)).toBe(25_000_000n);
  });
});
