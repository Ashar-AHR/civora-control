export interface SequenceReservationRequest {
  counterKey: string;
  targetCollection: string;
  targetId: string;
  mutationId: string;
}

export interface SequenceReservationResult {
  reservedNumber: number;
  formattedNumber: string;
  reservationState: 'RESERVED';
}

export function formatSequence(prefix: string, number: number, width = 3): string {
  if (!Number.isInteger(number) || number < 1) throw new RangeError('Sequence number must be positive.');
  if (!Number.isInteger(width) || width < 1 || width > 10) throw new RangeError('Invalid sequence width.');
  return `${prefix}-${String(number).padStart(width, '0')}`;
}
