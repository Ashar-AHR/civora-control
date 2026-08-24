export type ControlSeverity = 'information' | 'warning' | 'blocking';

export interface ControlMessage {
  code: string;
  severity: ControlSeverity;
  message: string;
  field?: string;
}

export interface MutationContext {
  mutationId: string;
  actorUid: string;
  projectId: 'P136';
  reason?: string;
}

export interface AuditEnvelope {
  entityType: string;
  entityId: string;
  actionCode: string;
  beforeVersion: number;
  afterVersion: number;
  changedFields: readonly string[];
  relatedIds: Readonly<Record<string, string>>;
}

export interface VersionedWrite<T> {
  beforeVersion: number;
  afterVersion: number;
  before: T;
  after: T;
  mutation: MutationContext;
}
