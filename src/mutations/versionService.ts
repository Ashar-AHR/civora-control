export function nextVersion(currentVersion: number): number {
  if (!Number.isInteger(currentVersion) || currentVersion < 1) throw new RangeError('Invalid entity version.');
  return currentVersion + 1;
}

export function assertExpectedVersion(expected: number, actual: number): void {
  if (expected !== actual) throw new Error('CONFLICT_STALE');
}
