import { describe, expect, it } from 'vitest';
import { parseIdentity } from '../../../src/domain/identity';

const valid = {
  displayName: 'Synthetic Manager', emailLower: 'cm@example.invalid', role: 'commercial_manager', active: true,
  projectIds: ['P136'], createdAt: {}, updatedAt: {}, updatedByUid: 'technical-owner', version: 1,
};

describe('identity authorization schema', () => {
  it('accepts an exact approved role and P136 tuple', () => {
    expect(parseIdentity('u-cm', valid).uid).toBe('u-cm');
  });

  it.each([
    { ...valid, role: 'qs' },
    { ...valid, projectIds: ['P136', 'OTHER'] },
    { ...valid, unknownField: true },
  ])('rejects unapproved identity shape', (value) => {
    expect(() => parseIdentity('u-test', value)).toThrow();
  });
});
