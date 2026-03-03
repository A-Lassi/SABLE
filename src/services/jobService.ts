import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Job, JobFilter } from '../types';
import { MOCK_JOBS } from '../mocks/jobs';

const JOBS_COLLECTION = 'jobs';
const USE_MOCK = true; // TODO: Set to false when Firebase is connected

export async function fetchJobs(
  filters: Partial<JobFilter>,
  excludeIds: string[],
  pageSize = 20
): Promise<Job[]> {
  if (USE_MOCK) {
    return filterMockJobs(filters, excludeIds).slice(0, pageSize);
  }

  const constraints = [
    where('isActive', '==', true),
    orderBy('postedAt', 'desc'),
    limit(pageSize),
  ];

  const q = query(collection(db, JOBS_COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((d) => ({ id: d.id, ...d.data() } as Job))
    .filter((job) => !excludeIds.includes(job.id));
}

export async function fetchJobById(jobId: string): Promise<Job | null> {
  if (USE_MOCK) {
    return MOCK_JOBS.find((j) => j.id === jobId) ?? null;
  }

  const docRef = doc(db, JOBS_COLLECTION, jobId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Job;
}

function filterMockJobs(filters: Partial<JobFilter>, excludeIds: string[]): Job[] {
  let jobs = MOCK_JOBS.filter((j) => !excludeIds.includes(j.id));

  if (filters.remoteOnly) {
    jobs = jobs.filter((j) => j.location.isRemote);
  }
  if (filters.jobTypes && filters.jobTypes.length > 0) {
    jobs = jobs.filter((j) => filters.jobTypes!.includes(j.type));
  }
  if (filters.levels && filters.levels.length > 0) {
    jobs = jobs.filter((j) => filters.levels!.includes(j.level));
  }
  if (filters.salaryMin !== undefined && filters.salaryMin !== null) {
    jobs = jobs.filter((j) => j.salary.max === null || j.salary.max >= filters.salaryMin!);
  }
  if (filters.salaryMax !== undefined && filters.salaryMax !== null) {
    jobs = jobs.filter((j) => j.salary.min === null || j.salary.min <= filters.salaryMax!);
  }
  if (filters.excludeCompanies && filters.excludeCompanies.length > 0) {
    const excluded = filters.excludeCompanies.map((c) => c.toLowerCase());
    jobs = jobs.filter((j) => !excluded.includes(j.company.toLowerCase()));
  }
  if (filters.keywords && filters.keywords.length > 0) {
    jobs = jobs.filter((j) => {
      const text = `${j.title} ${j.description} ${j.tags.join(' ')}`.toLowerCase();
      return filters.keywords!.some((kw) => text.includes(kw.toLowerCase()));
    });
  }

  return jobs;
}
