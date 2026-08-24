import { getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase.client';
import { ErpError } from '../../domain/errors';
import { parseIdentity, type ErpIdentity } from '../../domain/identity';
import { paths } from '../paths';

export async function getIdentity(uid: string): Promise<ErpIdentity> {
  const snapshot = await getDoc(paths.user(db, uid));
  if (!snapshot.exists()) throw new ErpError('ACCESS_PROFILE_MISSING');
  const identity = parseIdentity(uid, snapshot.data());
  if (!identity.active) throw new ErpError('ACCESS_INACTIVE');
  if (identity.projectIds.length !== 1 || identity.projectIds[0] !== 'P136') {
    throw new ErpError('ACCESS_PROJECT_DENIED');
  }
  return identity;
}
