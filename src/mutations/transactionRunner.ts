import { runTransaction, type Transaction } from 'firebase/firestore';
import { db } from '../config/firebase.client';

export function runControlledTransaction<T>(operation: (transaction: Transaction) => Promise<T>): Promise<T> {
  return runTransaction(db, operation, { maxAttempts: 3 });
}
