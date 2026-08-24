import { useAuth } from '../../auth/AuthProvider';

export function TopBar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { identity } = useAuth();
  const initials = identity?.displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase() ?? 'CC';
  const roleLabel = identity?.role === 'commercial_manager' ? 'Commercial Manager' : 'Senior QS';
  return (
    <header className="topbar">
      <button className="icon-button" type="button" aria-label="Open navigation" onClick={onOpenMenu}>☰</button>
      <strong>Commercial Management System</strong>
      <button className="global-search" type="button" disabled title="Available after a searchable module is released">
        <span>⌕ Search released records</span><kbd>Ctrl K</kbd>
      </button>
      <span className="role-chip">{roleLabel}</span>
      <span className="avatar" title={identity?.displayName}>{initials}</span>
    </header>
  );
}
