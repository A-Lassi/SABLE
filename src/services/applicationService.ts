import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Application, ApplicationStatus } from '../types';

const USE_MOCK = true; // TODO: Set to false when Firebase is connected

function getUserApplicationsRef(uid: string) {
  return collection(db, 'users', uid, 'applications');
}

export async function fetchApplications(uid: string): Promise<Application[]> {
  if (USE_MOCK) return []; // Store will use mock data directly

  const q = query(getUserApplicationsRef(uid), orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    createdAt: (d.data().createdAt as Timestamp).toDate(),
    updatedAt: (d.data().updatedAt as Timestamp).toDate(),
    submittedAt: d.data().submittedAt ? (d.data().submittedAt as Timestamp).toDate() : null,
  })) as Application[];
}

export async function createApplication(uid: string, application: Application): Promise<void> {
  if (USE_MOCK) return;

  const docRef = doc(getUserApplicationsRef(uid), application.id);
  await setDoc(docRef, {
    ...application,
    createdAt: Timestamp.fromDate(application.createdAt),
    updatedAt: Timestamp.fromDate(application.updatedAt),
  });
}

export async function updateApplicationStatus(
  uid: string,
  applicationId: string,
  status: ApplicationStatus
): Promise<void> {
  if (USE_MOCK) return;

  const docRef = doc(getUserApplicationsRef(uid), applicationId);
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
    ...(status === 'submitted' ? { submittedAt: Timestamp.now() } : {}),
  });
}

export async function updateApplicationNotes(
  uid: string,
  applicationId: string,
  notes: string
): Promise<void> {
  if (USE_MOCK) return;

  const docRef = doc(getUserApplicationsRef(uid), applicationId);
  await updateDoc(docRef, { notes, updatedAt: Timestamp.now() });
}

export async function updateApplicationResume(
  uid: string,
  applicationId: string,
  resumeText: string,
  version: number
): Promise<void> {
  if (USE_MOCK) return;

  const docRef = doc(getUserApplicationsRef(uid), applicationId);
  await updateDoc(docRef, {
    'resumeDraft.text': resumeText,
    'resumeDraft.version': version,
    updatedAt: Timestamp.now(),
  });
}

export async function approveApplicationResume(
  uid: string,
  applicationId: string
): Promise<void> {
  if (USE_MOCK) return;

  const docRef = doc(getUserApplicationsRef(uid), applicationId);
  await updateDoc(docRef, {
    'resumeDraft.isApproved': true,
    'resumeDraft.approvedAt': Timestamp.now(),
    status: 'ready',
    updatedAt: Timestamp.now(),
  });
}
