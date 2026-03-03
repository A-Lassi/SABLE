import * as admin from 'firebase-admin';

/**
 * Memory + Firestore caching layer for API responses.
 *
 * - In-memory LRU cache with 5-minute TTL for repeat queries within a function execution
 * - Firestore cache with 24-hour TTL for cross-execution caching
 */

const memoryCache = new Map<string, { data: any; expiresAt: number }>();
const MEMORY_TTL_MS = 5 * 60 * 1000; // 5 minutes
const FIRESTORE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export function getFromMemory(key: string): any | null {
  const entry = memoryCache.get(key);
  if (entry && entry.expiresAt > Date.now()) {
    return entry.data;
  }
  memoryCache.delete(key);
  return null;
}

export function setInMemory(key: string, data: any): void {
  memoryCache.set(key, {
    data,
    expiresAt: Date.now() + MEMORY_TTL_MS,
  });
}

export async function getFromFirestore(key: string): Promise<any | null> {
  const db = admin.firestore();
  const doc = await db.collection('_cache').doc(key).get();
  if (!doc.exists) return null;

  const entry = doc.data();
  if (entry && entry.expiresAt.toMillis() > Date.now()) {
    return entry.data;
  }

  // Expired, clean up
  await doc.ref.delete();
  return null;
}

export async function setInFirestore(key: string, data: any): Promise<void> {
  const db = admin.firestore();
  await db.collection('_cache').doc(key).set({
    data,
    expiresAt: admin.firestore.Timestamp.fromMillis(Date.now() + FIRESTORE_TTL_MS),
  });
}
