// @vitest-environment node
import { afterAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';
import { cleanupEnvironment, getTestEnvironment, resetFoundation } from './helpers';

describe('Foundation authentication and P136 isolation', () => {
  beforeEach(resetFoundation);
  afterAll(cleanupEnvironment);

  it('AUTH-001 denies unauthenticated project reads', async () => {
    const env = await getTestEnvironment();
    await assertFails(getDoc(doc(env.unauthenticatedContext().firestore(), 'projects', 'P136')));
  });

  it.each(['u-no-profile', 'u-inactive', 'u-other', 'u-qs'])('denies invalid profile %s', async (uid) => {
    const env = await getTestEnvironment();
    await assertFails(getDoc(doc(env.authenticatedContext(uid).firestore(), 'projects', 'P136')));
  });

  it.each(['u-cm', 'u-sq'])('AUTH-006 allows approved profile %s', async (uid) => {
    const env = await getTestEnvironment();
    await assertSucceeds(getDoc(doc(env.authenticatedContext(uid).firestore(), 'projects', 'P136')));
  });

  it('AUTH-007 denies outside-project paths', async () => {
    const env = await getTestEnvironment();
    await assertFails(getDoc(doc(env.authenticatedContext('u-cm').firestore(), 'projects', 'OTHER')));
  });

  it('AUTH-010 denies browser user writes', async () => {
    const env = await getTestEnvironment();
    await assertFails(setDoc(doc(env.authenticatedContext('u-cm').firestore(), 'users', 'new-user'), { active: true }));
  });

  it('AUTH-011 denies Senior QS access to another profile', async () => {
    const env = await getTestEnvironment();
    await assertFails(getDoc(doc(env.authenticatedContext('u-sq').firestore(), 'users', 'u-cm')));
  });

  it('AUTH-012 allows bounded CM exact-membership list', async () => {
    const env = await getTestEnvironment();
    const usersQuery = query(
      collection(env.authenticatedContext('u-cm').firestore(), 'users'),
      where('projectIds', '==', ['P136']),
      limit(100),
    );
    await assertSucceeds(getDocs(usersQuery));
  });
});
