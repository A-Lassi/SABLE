import * as admin from 'firebase-admin';
import { normalizeJob } from './normalizeJob';

const db = admin.firestore();
const JOBS_COLLECTION = 'jobs';

/**
 * Writes normalized jobs to Firestore, deduplicating by sourceId.
 *
 * TODO: Connect to real Adzuna data pipeline
 */
export async function writeJobsToPool(adzunaResults: Record<string, any>[]): Promise<number> {
  const batch = db.batch();
  let newCount = 0;

  for (const result of adzunaResults) {
    const normalized = normalizeJob(result);
    const sourceId = normalized.sourceId;

    // Check for duplicates
    const existing = await db
      .collection(JOBS_COLLECTION)
      .where('sourceId', '==', sourceId)
      .limit(1)
      .get();

    if (existing.empty) {
      const docRef = db.collection(JOBS_COLLECTION).doc();
      batch.set(docRef, normalized);
      newCount++;
    }
  }

  if (newCount > 0) {
    await batch.commit();
  }

  return newCount;
}

/**
 * Marks expired jobs as inactive.
 */
export async function deactivateExpiredJobs(): Promise<number> {
  const now = admin.firestore.Timestamp.now();
  const expired = await db
    .collection(JOBS_COLLECTION)
    .where('isActive', '==', true)
    .where('expiresAt', '<=', now)
    .get();

  const batch = db.batch();
  expired.docs.forEach((doc) => {
    batch.update(doc.ref, { isActive: false });
  });

  if (!expired.empty) {
    await batch.commit();
  }

  return expired.size;
}
