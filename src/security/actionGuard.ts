import type { ApprovedRole } from '../domain/identity';
import type { ModuleCode } from '../domain/project';
import { hasModule, hasPermission, type Permission } from './permissions';

export function authorizeAction(input: {
  role: ApprovedRole;
  permission: Permission;
  module: ModuleCode;
  enabledModules: readonly ModuleCode[];
}): boolean {
  return hasPermission(input.role, input.permission) && hasModule(input.enabledModules, input.module);
}
