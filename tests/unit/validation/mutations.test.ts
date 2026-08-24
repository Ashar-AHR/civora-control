import { describe, expect, it } from 'vitest';
import { createMutationContext } from '../../../src/mutations/mutationContext';
import { formatSequence } from '../../../src/mutations/sequenceService';
import { nextVersion } from '../../../src/mutations/versionService';
import { uniqueKeyDocumentId } from '../../../src/mutations/uniqueKeyService';

describe('shared mutation controls', () => {
  it('creates non-reused UUID mutation contexts', () => {
    const first = createMutationContext('u-cm');
    const second = createMutationContext('u-cm');
    expect(first.mutationId).not.toBe(second.mutationId);
  });

  it('increments versions by exactly one', () => {
    expect(nextVersion(1)).toBe(2);
    expect(() => nextVersion(0)).toThrow();
  });

  it('formats non-reusable sequence identities', () => {
    expect(formatSequence('IPC-P', 1)).toBe('IPC-P-001');
    expect(uniqueKeyDocumentId('ipc-p', '001')).toBe('IPC-P__001');
  });
});
