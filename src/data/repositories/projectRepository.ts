import { getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.client';
import { ErpError } from '../../domain/errors';
import {
  projectDocumentSchema,
  systemSettingsSchema,
  type ProjectContext,
} from '../../domain/project';
import { paths } from '../paths';

export async function getProjectContext(): Promise<ProjectContext> {
  const [projectSnapshot, settingsSnapshot] = await Promise.all([
    getDoc(paths.project(db)),
    getDoc(paths.coreSettings(db)),
  ]);
  if (!projectSnapshot.exists() || !settingsSnapshot.exists()) throw new ErpError('NOT_FOUND');
  const project = projectDocumentSchema.parse(projectSnapshot.data());
  const settings = systemSettingsSchema.parse(settingsSnapshot.data());
  if (project.schemaVersion !== settings.schemaVersion || project.calculationVersion !== settings.calculationVersion) {
    throw new ErpError('CONFIG_VERSION_MISMATCH');
  }
  return { ...project, settings };
}
