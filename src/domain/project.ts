import { z } from 'zod';

export const PROJECT_ID = 'P136' as const;
export const CALCULATION_VERSION = 'CALC-1.0.0' as const;

export const moduleCodeSchema = z.enum([
  'FOUNDATION',
  'MASTER_DATA',
  'CONTRACTS',
  'CONTRACT_BOQ',
  'CONTRACTOR_PAYMENTS',
  'RECOVERIES',
  'COST_CONTROL',
  'VARIATIONS',
  'FORECAST',
  'REVENUE',
  'CVR',
  'FINAL_ACCOUNT',
]);

export type ModuleCode = z.infer<typeof moduleCodeSchema>;

export const projectDocumentSchema = z
  .object({
    projectId: z.literal(PROJECT_ID),
    projectName: z.string().trim().min(1).max(160),
    currencyCode: z.literal('SAR'),
    vatRateBp: z.number().int().min(0).max(10_000),
    schemaVersion: z.number().int().positive(),
    calculationVersion: z.literal(CALCULATION_VERSION),
    active: z.literal(true),
    createdAt: z.unknown(),
    updatedAt: z.unknown(),
    updatedByUid: z.string().min(1),
    version: z.number().int().positive(),
    lastMutationId: z.string().uuid(),
  })
  .strict();

export const systemSettingsSchema = z
  .object({
    projectId: z.literal(PROJECT_ID),
    schemaVersion: z.number().int().positive(),
    calculationVersion: z.literal(CALCULATION_VERSION),
    vatRateBp: z.number().int().min(0).max(10_000),
    budgetWarningThresholdBp: z.number().int().min(0).max(10_000),
    enabledModules: z.array(moduleCodeSchema).min(1).refine((modules) => modules.includes('FOUNDATION')),
    searchPrefixLimit: z.number().int().min(1).max(20),
    externalReferenceLimit: z.number().int().min(1).max(500),
    version: z.number().int().positive(),
    updatedAt: z.unknown(),
    updatedByUid: z.string().min(1),
    lastMutationId: z.string().uuid(),
  })
  .strict();

export type ProjectDocument = z.infer<typeof projectDocumentSchema>;
export type SystemSettings = z.infer<typeof systemSettingsSchema>;

export interface ProjectContext extends ProjectDocument {
  settings: SystemSettings;
}
