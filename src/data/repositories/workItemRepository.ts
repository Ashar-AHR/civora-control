import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from '../../config/firebase.client';
import { PROJECT_PATH } from '../paths';

export interface WorkItemSummary {
  id: string;
  workItemType: string;
  entityType: string;
  entityId: string;
  status: 'OPEN' | 'RETURNED';
}

export function subscribeOwnInbox(
  uid: string,
  onItems: (items: readonly WorkItemSummary[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const inboxQuery = query(
    collection(db, PROJECT_PATH, 'workItems'),
    where('assignedToUid', '==', uid),
    where('status', 'in', ['OPEN', 'RETURNED']),
    orderBy('createdAt', 'desc'),
    limit(20),
  );
  return onSnapshot(
    inboxQuery,
    (snapshot) => {
      onItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as WorkItemSummary));
    },
    onError,
  );
}
