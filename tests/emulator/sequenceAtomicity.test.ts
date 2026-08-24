// @vitest-environment node
import { afterAll, beforeEach, describe, it } from 'vitest';
import { assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { cleanupEnvironment, getTestEnvironment, resetFoundation } from './helpers';

const mutationId = '22222222-2222-4222-8222-222222222222';

describe('Foundation sequence reservation atomicity', () => {
  beforeEach(resetFoundation);
  afterAll(cleanupEnvironment);

  it('allows counter, reservation and audit in one atomic batch', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-cm').firestore();
    const batch = writeBatch(db);
    batch.update(doc(db, 'projects/P136/sequenceCounters/ipc-p'), {
      nextNumber: 2, targetReservationId: 'IPC-P__001', version: 2,
      updatedAt: serverTimestamp(), updatedByUid: 'u-cm', lastMutationId: mutationId,
    });
    batch.set(doc(db, 'projects/P136/uniqueKeys/IPC-P__001'), {
      projectId: 'P136', namespace: 'IPC-P', normalizedKey: '001', targetCollection: 'ipcs', targetId: 'synthetic-draft',
      reservedNumber: 1, counterKey: 'ipc-p', state: 'RESERVED', createdAt: serverTimestamp(), createdByUid: 'u-cm', lastMutationId: mutationId,
    });
    batch.set(doc(db, `projects/P136/auditEvents/${mutationId}`), {
      projectId: 'P136', mutationId, actorUid: 'u-cm', occurredAt: serverTimestamp(), reason: 'Synthetic reservation',
      entityType: 'sequenceCounter', entityId: 'ipc-p', actionCode: 'SEQUENCE_RESERVED',
      beforeVersion: 1, afterVersion: 2, changedFields: ['nextNumber', 'targetReservationId'], relatedIds: {},
    });
    await assertSucceeds(batch.commit());
  });

  it('denies standalone counter increment', async () => {
    const env = await getTestEnvironment();
    const db = env.authenticatedContext('u-cm').firestore();
    await assertFails(updateDoc(doc(db, 'projects/P136/sequenceCounters/ipc-p'), {
      nextNumber: 2, targetReservationId: 'missing', version: 2,
      updatedAt: serverTimestamp(), updatedByUid: 'u-cm', lastMutationId: mutationId,
    }));
  });
});
