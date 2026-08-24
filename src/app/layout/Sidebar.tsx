import { NavLink } from 'react-router-dom';
import { useAuth } from '../../auth/AuthProvider';
import { navigationGroups } from '../../domain/modules';
import { canOpenRoute } from '../routePolicy';

export function Sidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const { identity, project } = useAuth();
  if (!identity || !project) return null;
  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`} aria-label="Primary navigation">
      <div className="project-card">
        <strong>{project.projectName}</strong>
        <span>P136 • SAR • Protected</span>
      </div>
      {navigationGroups.map((group) => {
        const items = group.items.filter((item) => canOpenRoute({
          role: identity.role,
          allowedRoles: item.roles,
          module: item.module,
          enabledModules: project.settings.enabledModules,
        }));
        if (items.length === 0) return null;
        return (
          <section key={group.label}>
            <h2>{group.label}</h2>
            {items.map((item) => (
              <NavLink key={item.path} to={item.path} onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </section>
        );
      })}
      <div className="sidebar-footer">Civora Control<br />Foundation • v0.1.0</div>
    </aside>
  );
}
