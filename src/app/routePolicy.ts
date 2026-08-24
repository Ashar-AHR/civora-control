import type { ApprovedRole } from '../domain/identity';
import type { ModuleCode } from '../domain/project';
import { hasModule } from '../security/permissions';

export function canOpenRoute(input: {
  role: ApprovedRole;
  allowedRoles: readonly ApprovedRole[];
  module: ModuleCode;
  enabledModules: readonly ModuleCode[];
}): boolean {
  return input.allowedRoles.includes(input.role) && hasModule(input.enabledModules, input.module);
}
