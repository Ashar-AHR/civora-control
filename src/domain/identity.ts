import { z } from 'zod';

export const APPROVED_ROLES = ['commercial_manager', 'senior_qs'] as const;
export type ApprovedRole = (typeof APPROVED_ROLES)[number];

export const erpIdentitySchema = z
  .object({
    displayName: z.string().trim().min(1).max(120),
    emailLower: z.string().trim().toLowerCase().email(),
    role: z.enum(APPROVED_ROLES),
    active: z.boolean(),
    projectIds: z.tuple([z.literal('P136')]),
    createdAt: z.unknown(),
    updatedAt: z.unknown(),
    updatedByUid: z.string().min(1),
    version: z.number().int().positive(),
  })
  .strict();

export interface ErpIdentity extends z.infer<typeof erpIdentitySchema> {
  uid: string;
}

export function parseIdentity(uid: string, value: unknown): ErpIdentity {
  return { uid, ...erpIdentitySchema.parse(value) };
}

export function isCommercialManager(identity: ErpIdentity): boolean {
  return identity.role === 'commercial_manager';
}
