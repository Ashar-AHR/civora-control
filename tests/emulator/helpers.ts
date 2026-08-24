import { readFile } from 'node:fs/promises';
import { initializeTestEnvironment, type RulesTestEnvironment } from '@firebase/rules-unit-testing';
import { seedFoundation } from '../../firebase/emulator/foundationSeed';

let environment: RulesTestEnvironment;

export async function getTestEnvironment(): Promise<RulesTestEnvironment> {
  if (!environment) {
    environment = await initializeTestEnvironment({
      projectId: 'civora-control',
      firestore: {
        host: '127.0.0.1',
        port: 8080,
        rules: await readFile(new URL('../../firestore.rules', import.meta.url), 'utf8'),
      },
    });
    await environment.withSecurityRulesDisabled(async (context) => seedFoundation(context.firestore()));
  }
  return environment;
}

export async function resetFoundation(): Promise<void> {
  const testEnvironment = await getTestEnvironment();
  await testEnvironment.clearFirestore();
  await testEnvironment.withSecurityRulesDisabled(async (context) => seedFoundation(context.firestore()));
}

export async function cleanupEnvironment(): Promise<void> {
  if (environment) await environment.cleanup();
}
