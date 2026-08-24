import type { ReactNode } from 'react';
import { HashRouter } from 'react-router-dom';
import { AuthProvider } from '../../auth/AuthProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <HashRouter>
      <AuthProvider>{children}</AuthProvider>
    </HashRouter>
  );
}
