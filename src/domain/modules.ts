import type { ApprovedRole } from './identity';
import type { ModuleCode } from './project';

export interface NavigationItem {
  label: string;
  path: string;
  module: ModuleCode;
  roles: readonly ApprovedRole[];
}

export interface NavigationGroup {
  label: string;
  items: readonly NavigationItem[];
}

const both: readonly ApprovedRole[] = ['commercial_manager', 'senior_qs'];

export const navigationGroups: readonly NavigationGroup[] = [
  { label: 'Workspace', items: [{ label: 'Home', path: '/', module: 'FOUNDATION', roles: both }] },
  {
    label: 'Commercial modules',
    items: [
      { label: 'Master Data', path: '/master-data', module: 'MASTER_DATA', roles: both },
      { label: 'Contracts', path: '/contracts', module: 'CONTRACTS', roles: both },
      { label: 'Contractor Payments', path: '/payments', module: 'CONTRACTOR_PAYMENTS', roles: both },
      { label: 'Cost Control', path: '/cost-control', module: 'COST_CONTROL', roles: both },
      { label: 'Revenue & CVR', path: '/revenue-cvr', module: 'REVENUE', roles: both },
    ],
  },
  {
    label: 'Control',
    items: [
      {
        label: 'System Configuration',
        path: '/system-configuration',
        module: 'FOUNDATION',
        roles: ['commercial_manager'],
      },
    ],
  },
];
