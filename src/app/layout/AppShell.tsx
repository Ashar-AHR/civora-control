import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { useInactivityTimer } from '../../shared/hooks/useInactivityTimer';
import { SessionWarning } from '../../shared/components/SessionWarning';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { status, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const endSession = useCallback(async () => {
    await signOut();
    void navigate('/sign-in', { replace: true });
  }, [navigate, signOut]);

  const { warningVisible, continueSession } = useInactivityTimer(status === 'authorized', () => void endSession());

  // Route changes are approved user activity.
  useEffect(() => {
    window.dispatchEvent(new Event('route-activity'));
  }, [location.pathname]);

  return (
    <div className="app-shell">
      <TopBar onOpenMenu={() => setMenuOpen(true)} />
      <div className="shell-grid">
        <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        {menuOpen && <button className="sidebar-scrim" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
        <main className="page-content"><Outlet /></main>
      </div>
      {warningVisible && <SessionWarning onContinue={continueSession} onSignOut={() => void endSession()} />}
    </div>
  );
}
