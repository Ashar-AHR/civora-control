import { z } from 'zod';

const booleanString = z.enum(['true', 'false']).transform((value) => value === 'true');

const environmentSchema = z.object({
  apiKey: z.string().min(1),
  authDomain: z.string().min(1),
  projectId: z.literal('civora-control'),
  storageBucket: z.string().min(1),
  messagingSenderId: z.string().min(1),
  appId: z.string().min(1),
  useEmulators: booleanString,
  releaseTag: z.string().min(1),
});

const isDevelopment = import.meta.env.DEV;

export const environment = environmentSchema.parse({
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || (isDevelopment ? 'emulator-api-key' : 'configuration-required-before-release'),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'civora-control.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'civora-control',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'civora-control.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '10807507804',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:10807507804:web:607d7db8701cf374f85f99',
  useEmulators: import.meta.env.VITE_USE_FIREBASE_EMULATORS || (isDevelopment ? 'true' : 'false'),
  releaseTag: import.meta.env.VITE_RELEASE_TAG || 'development',
});

if (import.meta.env.PROD && environment.useEmulators) {
  throw new Error('Production cannot use Firebase emulators.');
}
