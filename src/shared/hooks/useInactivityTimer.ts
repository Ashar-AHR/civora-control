import { useCallback, useEffect, useRef, useState } from 'react';

export const SESSION_WARNING_MS = 25 * 60 * 1000;
export const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export function useInactivityTimer(enabled: boolean, onTimeout: () => void) {
  const [warningVisible, setWarningVisible] = useState(false);
  const warningTimer = useRef<number | undefined>(undefined);
  const timeoutTimer = useRef<number | undefined>(undefined);

  const clearTimers = useCallback(() => {
    if (warningTimer.current !== undefined) window.clearTimeout(warningTimer.current);
    if (timeoutTimer.current !== undefined) window.clearTimeout(timeoutTimer.current);
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    setWarningVisible(false);
    if (!enabled) return;
    warningTimer.current = window.setTimeout(() => setWarningVisible(true), SESSION_WARNING_MS);
    timeoutTimer.current = window.setTimeout(onTimeout, SESSION_TIMEOUT_MS);
  }, [clearTimers, enabled, onTimeout]);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }
    const events = ['pointerdown', 'keydown', 'touchstart', 'route-activity'] as const;
    events.forEach((event) => window.addEventListener(event, reset, { passive: true }));
    clearTimers();
    warningTimer.current = window.setTimeout(() => setWarningVisible(true), SESSION_WARNING_MS);
    timeoutTimer.current = window.setTimeout(onTimeout, SESSION_TIMEOUT_MS);
    return () => {
      events.forEach((event) => window.removeEventListener(event, reset));
      clearTimers();
    };
  }, [clearTimers, enabled, onTimeout, reset]);

  return { warningVisible, continueSession: reset };
}
