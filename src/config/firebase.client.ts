import { getApp, getApps, initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore, memoryLocalCache, initializeFirestore } from 'firebase/firestore';
import { environment } from './environment';

const firebaseConfig = {
  apiKey: environment.apiKey,
  authDomain: environment.authDomain,
  projectId: environment.projectId,
  storageBucket: environment.storageBucket,
  messagingSenderId: environment.messagingSenderId,
  appId: environment.appId,
};

const appAlreadyExists = getApps().length > 0;
export const firebaseApp = appAlreadyExists ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const db = appAlreadyExists
  ? getFirestore(firebaseApp)
  : initializeFirestore(firebaseApp, { localCache: memoryLocalCache() });

let emulatorsConnected = false;

export async function initializeFirebaseClient(): Promise<void> {
  await setPersistence(auth, browserSessionPersistence);
  if (environment.useEmulators && !emulatorsConnected) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    emulatorsConnected = true;
  }
}
