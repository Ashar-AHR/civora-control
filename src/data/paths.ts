import { doc, collection, type Firestore } from 'firebase/firestore';

export const PROJECT_PATH = 'projects/P136' as const;

export const paths = {
  user: (db: Firestore, uid: string) => doc(db, 'users', uid),
  project: (db: Firestore) => doc(db, 'projects', 'P136'),
  coreSettings: (db: Firestore) => doc(db, PROJECT_PATH, 'systemSettings', 'core'),
  auditEvents: (db: Firestore) => collection(db, PROJECT_PATH, 'auditEvents'),
  entityVersions: (db: Firestore) => collection(db, PROJECT_PATH, 'entityVersions'),
  sequenceCounters: (db: Firestore) => collection(db, PROJECT_PATH, 'sequenceCounters'),
  uniqueKeys: (db: Firestore) => collection(db, PROJECT_PATH, 'uniqueKeys'),
  workItems: (db: Firestore) => collection(db, PROJECT_PATH, 'workItems'),
};
