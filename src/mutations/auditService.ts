import { doc, serverTimestamp, type Transaction } from 'firebase/firestore';
import { db } from '../config/firebase.client';
import type { AuditEnvelope, MutationContext } from '../domain/controls';
import { paths } from '../data/paths';

export function writeAuditCompanion(
  transaction: Transaction,
  mutation: MutationContext,
  envelope: AuditEnvelope,
): void {
  transaction.set(doc(paths.auditEvents(db), mutation.mutationId), {
    projectId: 'P136',
    mutationId: mutation.mutationId,
    actorUid: mutation.actorUid,
    occurredAt: serverTimestamp(),
    reason: mutation.reason ?? '',
    ...envelope,
  });
}
