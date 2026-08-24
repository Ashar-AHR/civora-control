import { describe, expect, it } from 'vitest';
import { canOpenRoute } from '../../../src/app/routePolicy';

describe('module and role route policy', () => {
  it('allows both roles into Foundation Home', () => {
    expect(canOpenRoute({ role: 'senior_qs', allowedRoles: ['commercial_manager', 'senior_qs'], module: 'FOUNDATION', enabledModules: ['FOUNDATION'] })).toBe(true);
  });

  it('denies Senior QS CM-only configuration', () => {
    expect(canOpenRoute({ role: 'senior_qs', allowedRoles: ['commercial_manager'], module: 'FOUNDATION', enabledModules: ['FOUNDATION'] })).toBe(false);
  });

  it('denies an unreleased module even to CM', () => {
    expect(canOpenRoute({ role: 'commercial_manager', allowedRoles: ['commercial_manager', 'senior_qs'], module: 'MASTER_DATA', enabledModules: ['FOUNDATION'] })).toBe(false);
  });
});
