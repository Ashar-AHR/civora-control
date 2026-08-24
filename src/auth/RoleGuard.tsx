import { Navigate, Outlet } from 'react-router-dom';
import type { ApprovedRole } from '../domain/identity';
import { useAuth } from './AuthProvider';

export function RoleGuard({ roles }: { roles: readonly ApprovedRole[] }) {
  const { identity } = useAuth();
  return identity && roles.includes(identity.role) ? <Outlet /> : <Navigate to="/access-denied" replace />;
}
