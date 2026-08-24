import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { SessionLoadingPage } from './pages/SessionLoadingPage';

export function SessionGuard() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'initializing') return <SessionLoadingPage />;
  if (status === 'denied') return <Navigate to="/access-denied" replace />;
  if (status !== 'authorized') return <Navigate to="/sign-in" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
