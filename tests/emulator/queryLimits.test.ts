// @vitest-environment node
import { afterAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { cleanupEnvironment, getTestEnvironment, resetFoundation } from './helpers';

describe('Foundation bounded queries', () => {
  beforeEach(resetFoundation);
  afterAll(cleanupEnvironment);

  it('allows Senior QS own bounded inbox', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-sq').firestore();
    await assertSucceeds(getDocs(query(collection(db, 'projects/P136/workItems'), where('assignedToUid', '==', 'u-sq'), limit(20))));
  });

  it('denies Senior QS unscoped inbox query', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-sq').firestore();
    await assertFails(getDocs(query(collection(db, 'projects/P136/workItems'), limit(20))));
  });

  it('denies list without a limit', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-cm').firestore();
    await assertFails(getDocs(collection(db, 'projects/P136/workItems')));
  });

  it('denies unreleased business collections', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-cm').firestore();
    await assertFails(getDocs(query(collection(db, 'projects/P136/contracts'), limit(25))));
  });
});
