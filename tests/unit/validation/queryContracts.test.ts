import { describe, expect, it } from 'vitest';
import { createQueryContract } from '../../../src/data/queryContracts';
import { pageFromItems } from '../../../src/data/pagination';

describe('bounded query contracts', () => {
  it('accepts only approved limits', () => {
    expect(createQueryContract('Q-010', { uid: 'u-sq' }, 20).limit).toBe(20);
    expect(() => createQueryContract('BAD', {}, 21)).toThrow(RangeError);
  });

  it('produces a stable document-id cursor only when more rows exist', () => {
    expect(pageFromItems([{ id: 'a' }, { id: 'b' }], 1).nextCursor).toBe('a');
    expect(pageFromItems([{ id: 'a' }], 1).nextCursor).toBeUndefined();
  });
});
