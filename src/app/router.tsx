import { Navigate, Route, Routes } from 'react-router-dom';
import { SessionGuard } from '../auth/SessionGuard';
import { RoleGuard } from '../auth/RoleGuard';
import { AccessDeniedPage } from '../auth/pages/AccessDeniedPage';
import { ResetPasswordPage } from '../auth/pages/ResetPasswordPage';
import { SignInPage } from '../auth/pages/SignInPage';
import { AppShell } from './layout/AppShell';
import { HomePage } from './pages/HomePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SystemConfigurationPage } from './pages/SystemConfigurationPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route element={<SessionGuard />}>
        <Route element={<AppShell />}>
          <Route index element={<HomePage />} />
          <Route element={<RoleGuard roles={['commercial_manager']} />}>
            <Route path="system-configuration" element={<SystemConfigurationPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/sign-in" replace />} />
    </Routes>
  );
}
