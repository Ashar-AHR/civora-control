import type { ApprovedRole } from '../domain/identity';
import type { ModuleCode } from '../domain/project';

export type Permission =
  | 'foundation:enter'
  | 'system-config:read'
  | 'system-config:update'
  | 'team-inbox:read'
  | 'backup-center:read';

const permissions: Record<ApprovedRole, readonly Permission[]> = {
  commercial_manager: [
    'foundation:enter',
    'system-config:read',
    'system-config:update',
    'team-inbox:read',
    'backup-center:read',
  ],
  senior_qs: ['foundation:enter'],
};

export function hasPermission(role: ApprovedRole, permission: Permission): boolean {
  return permissions[role].includes(permission);
}

export function hasModule(enabledModules: readonly ModuleCode[], module: ModuleCode): boolean {
  return enabledModules.includes(module);
}
