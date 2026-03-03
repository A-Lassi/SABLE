import * as admin from 'firebase-admin';

/**
 * Soft daily usage cap for Adzuna API calls.
 *
 * Default: 250 calls/day (configurable via ADZUNA_DAILY_CAP env var)
 */

const DAILY_CAP = Number(process.env.ADZUNA_DAILY_CAP) || 250;

export async function checkRateLimit(): Promise<boolean> {
  const db = admin.firestore();
  const configRef = db.collection('systemConfig').doc('adzuna');
  const doc = await configRef.get();

  if (!doc.exists) return true;

  const data = doc.data();
  if (!data) return true;

  const today = new Date().toISOString().split('T')[0];
  const lastFetchDate = data.lastFetchAt?.toDate?.()?.toISOString?.()?.split('T')[0];

  // Reset counter if it's a new day
  if (lastFetchDate !== today) {
    await configRef.update({ dailyApiCalls: 0, dailyCapReached: false });
    return true;
  }

  return (data.dailyApiCalls || 0) < DAILY_CAP;
}

export async function incrementApiCalls(count: number = 1): Promise<void> {
  const db = admin.firestore();
  const configRef = db.collection('systemConfig').doc('adzuna');

  await configRef.update({
    dailyApiCalls: admin.firestore.FieldValue.increment(count),
  });

  // Check if cap reached
  const doc = await configRef.get();
  const data = doc.data();
  if (data && (data.dailyApiCalls || 0) >= DAILY_CAP) {
    await configRef.update({ dailyCapReached: true });
  }
}
