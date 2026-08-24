// @vitest-environment node
import { afterAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { cleanupEnvironment, getTestEnvironment, resetFoundation } from './helpers';

const mutation = '11111111-1111-4111-8111-111111111111';

describe('Foundation configuration controls', () => {
  beforeEach(resetFoundation);
  afterAll(cleanupEnvironment);

  it('allows CM settings update only with atomic audit companion', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-cm').firestore();
    const batch = writeBatch(db);
    batch.update(doc(db, 'projects/P136/systemSettings/core'), {
      budgetWarningThresholdBp: 9200,
      version: 2,
      updatedAt: serverTimestamp(),
      updatedByUid: 'u-cm',
      lastMutationId: mutation,
    });
    batch.set(doc(db, `projects/P136/auditEvents/${mutation}`), {
      projectId: 'P136', mutationId: mutation, actorUid: 'u-cm', occurredAt: serverTimestamp(), reason: 'Synthetic threshold test',
      entityType: 'systemSettings', entityId: 'core', actionCode: 'SYSTEM_SETTINGS_UPDATED',
      beforeVersion: 1, afterVersion: 2, changedFields: ['budgetWarningThresholdBp'], relatedIds: {},
    });
    await assertSucceeds(batch.commit());
  });

  it('denies sequential/missing-audit CM settings update', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-cm').firestore();
    await assertFails(updateDoc(doc(db, 'projects/P136/systemSettings/core'), {
      budgetWarningThresholdBp: 9200, version: 2, updatedAt: serverTimestamp(), updatedByUid: 'u-cm', lastMutationId: mutation,
    }));
  });

  it('denies Senior QS settings update', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-sq').firestore();
    await assertFails(updateDoc(doc(db, 'projects/P136/systemSettings/core'), {
      budgetWarningThresholdBp: 9200, version: 2, updatedAt: serverTimestamp(), updatedByUid: 'u-sq', lastMutationId: mutation,
    }));
  });

  it('denies enabled-module changes outside release control', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-cm').firestore();
    await assertFails(updateDoc(doc(db, 'projects/P136/systemSettings/core'), {
      enabledModules: ['FOUNDATION', 'MASTER_DATA'], version: 2, updatedAt: serverTimestamp(), updatedByUid: 'u-cm', lastMutationId: mutation,
    }));
  });
});
