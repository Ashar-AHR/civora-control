import { environment } from './environment';

export const release = Object.freeze({
  productName: 'Civora Control',
  publicTitle: 'Civora Control',
  protectedTitle: 'Commercial Management System',
  tag: environment.releaseTag,
  schemaVersion: 1,
  calculationVersion: 'CALC-1.0.0',
});
