import type { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import type { z } from 'zod';

export function strictConverter<T extends DocumentData>(schema: z.ZodType<T>): FirestoreDataConverter<T> {
  return {
    toFirestore(value) {
      return schema.parse(value);
    },
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions) {
      return schema.parse(snapshot.data(options));
    },
  };
}
