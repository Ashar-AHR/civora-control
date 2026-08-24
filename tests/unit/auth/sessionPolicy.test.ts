import { describe, expect, it } from 'vitest';
import { SESSION_POLICY, shouldRevalidate } from '../../../src/auth/sessionPolicy';

describe('approved session policy', () => {
  it('retains the approved warning and sign-out timings', () => {
    expect(SESSION_POLICY.warningAfterMinutes).toBe(25);
    expect(SESSION_POLICY.signOutAfterMinutes).toBe(30);
    expect(SESSION_POLICY.persistence).toBe('browser-session');
  });

  it('revalidates after five foreground minutes', () => {
    expect(shouldRevalidate(0, 5 * 60 * 1000)).toBe(true);
    expect(shouldRevalidate(0, 4 * 60 * 1000)).toBe(false);
  });
});
