import type { MutationContext } from '../domain/controls';

export function createMutationContext(actorUid: string, reason?: string): MutationContext {
  return {
    mutationId: crypto.randomUUID(),
    actorUid,
    projectId: 'P136',
    ...(reason?.trim() ? { reason: reason.trim() } : {}),
  };
}
