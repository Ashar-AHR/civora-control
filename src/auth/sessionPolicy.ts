export const SESSION_POLICY = Object.freeze({
  warningAfterMinutes: 25,
  signOutAfterMinutes: 30,
  foregroundRevalidateAfterMinutes: 5,
  persistence: 'browser-session' as const,
});

export function shouldRevalidate(lastValidatedAt: number, now = Date.now()): boolean {
  return now - lastValidatedAt >= SESSION_POLICY.foregroundRevalidateAfterMinutes * 60 * 1000;
}
