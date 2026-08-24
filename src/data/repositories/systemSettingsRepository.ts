import { serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase.client';
import type { ErpIdentity } from '../../domain/identity';
import type { SystemSettings } from '../../domain/project';
import { writeAuditCompanion } from '../../mutations/auditService';
import { createMutationContext } from '../../mutations/mutationContext';
import { runControlledTransaction } from '../../mutations/transactionRunner';
import { nextVersion } from '../../mutations/versionService';
import { paths } from '../paths';

export interface OrdinarySettingsUpdate {
  budgetWarningThresholdBp: number;
  searchPrefixLimit: number;
  externalReferenceLimit: number;
  reason: string;
}

export async function updateOrdinarySettings(
  identity: ErpIdentity,
  current: SystemSettings,
  input: OrdinarySettingsUpdate,
): Promise<void> {
  if (identity.role !== 'commercial_manager') throw new Error('PERMISSION_DENIED');
  const mutation = createMutationContext(identity.uid, input.reason);
  await runControlledTransaction(async (transaction) => {
    const reference = paths.coreSettings(db);
    const snapshot = await transaction.get(reference);
    if (!snapshot.exists() || snapshot.data().version !== current.version) throw new Error('CONFLICT_STALE');
    const afterVersion = nextVersion(current.version);
    transaction.update(reference, {
      budgetWarningThresholdBp: input.budgetWarningThresholdBp,
      searchPrefixLimit: input.searchPrefixLimit,
      externalReferenceLimit: input.externalReferenceLimit,
      version: afterVersion,
      updatedAt: serverTimestamp(),
      updatedByUid: identity.uid,
      lastMutationId: mutation.mutationId,
    });
    writeAuditCompanion(transaction, mutation, {
      entityType: 'systemSettings',
      entityId: 'core',
      actionCode: 'SYSTEM_SETTINGS_UPDATED',
      beforeVersion: current.version,
      afterVersion,
      changedFields: ['budgetWarningThresholdBp', 'searchPrefixLimit', 'externalReferenceLimit'],
      relatedIds: {},
    });
  });
}
