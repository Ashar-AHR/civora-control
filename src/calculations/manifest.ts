import type { ControlMessage } from '../domain/controls';

export interface CalculationManifest {
  calculationVersion: 'CALC-1.0.0';
  sourceCount: number;
  sourceHighWaterMarks: Readonly<Record<string, number>>;
  roundingCarryMinor: bigint;
}

export interface CalculationResult<T> {
  value: T;
  calculationVersion: 'CALC-1.0.0';
  warnings: readonly ControlMessage[];
  manifest: CalculationManifest;
}
