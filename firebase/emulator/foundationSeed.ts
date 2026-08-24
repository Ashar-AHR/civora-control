interface SeedDocument {
  set(data: Record<string, unknown>): Promise<unknown>;
}

export interface SeedFirestore {
  doc(path: string): SeedDocument;
}

const baseTime = new Date('2026-08-24T00:00:00.000Z');
const mutationId = '00000000-0000-4000-8000-000000000001';

export async function seedFoundation(db: SeedFirestore): Promise<void> {
  const users = [
    ['u-cm', 'Synthetic Commercial Manager', 'cm@example.invalid', 'commercial_manager', true, ['P136']],
    ['u-sq', 'Synthetic Senior QS', 'senior-qs@example.invalid', 'senior_qs', true, ['P136']],
    ['u-inactive', 'Inactive User', 'inactive@example.invalid', 'commercial_manager', false, ['P136']],
    ['u-other', 'Other Project User', 'other@example.invalid', 'commercial_manager', true, ['OTHER']],
    ['u-qs', 'Unapproved Role', 'qs@example.invalid', 'qs', true, ['P136']],
  ] as const;

  await Promise.all(users.map(async ([uid, displayName, emailLower, role, active, projectIds]) => {
    await db.doc(`users/${uid}`).set({
      displayName, emailLower, role, active, projectIds, createdAt: baseTime, updatedAt: baseTime,
      updatedByUid: 'technical-owner', version: 1,
    });
  }));

  await db.doc('projects/P136').set({
    projectId: 'P136', projectName: 'Synthetic Protected Project', currencyCode: 'SAR', vatRateBp: 1500,
    schemaVersion: 1, calculationVersion: 'CALC-1.0.0', active: true, createdAt: baseTime, updatedAt: baseTime,
    updatedByUid: 'technical-owner', version: 1, lastMutationId: mutationId,
  });

  await db.doc('projects/P136/systemSettings/core').set({
    projectId: 'P136', schemaVersion: 1, calculationVersion: 'CALC-1.0.0', vatRateBp: 1500,
    budgetWarningThresholdBp: 9000, enabledModules: ['FOUNDATION'], searchPrefixLimit: 20,
    externalReferenceLimit: 250, version: 1, updatedAt: baseTime, updatedByUid: 'technical-owner',
    lastMutationId: mutationId,
  });

  await db.doc('projects/P136/sequenceCounters/ipc-p').set({
    projectId: 'P136', counterKey: 'ipc-p', nextNumber: 1, targetReservationId: '', version: 1,
    updatedAt: baseTime, updatedByUid: 'technical-owner', lastMutationId: mutationId,
  });

  await db.doc('projects/P136/workItems/own-open').set({
    projectId: 'P136', workItemType: 'SYNTHETIC_REVIEW', entityType: 'synthetic', entityId: 'SYN-001',
    assignedToUid: 'u-sq', requiredRole: 'senior_qs', status: 'OPEN', priority: 1, sourceEntityVersion: 1,
    createdAt: baseTime, createdByUid: 'technical-owner', lastMutationId: mutationId,
  });
}
