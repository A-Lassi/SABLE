export const APP_NAME = 'SABLE';
export const APP_TAGLINE = 'Swipe And Browse Listings Effortlessly';

export const SWIPE_THRESHOLD = 0.4;
export const SWIPE_VELOCITY_THRESHOLD = 0.5;
export const TAILORING_TIMEOUT_MS = 30000;

export const MAX_RESUME_SIZE_MB = 10;
export const MAX_RESUME_SIZE_BYTES = MAX_RESUME_SIZE_MB * 1024 * 1024;
export const ACCEPTED_RESUME_TYPES = ['.docx', '.doc', '.rtf', '.pdf'];

export const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'temporary'] as const;
export const JOB_LEVELS = ['entry', 'mid', 'senior', 'lead', 'executive'] as const;

export const APPLICATION_STATUS_CONFIG = {
  tailoring: { color: 'bg-gray-400', textColor: 'text-gray-600', label: 'Tailoring', icon: 'loader' },
  pending_review: { color: 'bg-yellow-500', textColor: 'text-yellow-600', label: 'Needs Review', icon: 'alert-circle' },
  ready: { color: 'bg-blue-500', textColor: 'text-blue-600', label: 'Ready', icon: 'check-circle' },
  submitted: { color: 'bg-green-500', textColor: 'text-green-600', label: 'Submitted', icon: 'send' },
  interviewing: { color: 'bg-purple-500', textColor: 'text-purple-600', label: 'Interviewing', icon: 'calendar' },
  offered: { color: 'bg-yellow-400', textColor: 'text-yellow-700', label: 'Offered', icon: 'star' },
  rejected: { color: 'bg-red-500', textColor: 'text-red-600', label: 'Rejected', icon: 'x-circle' },
  withdrawn: { color: 'bg-gray-400', textColor: 'text-gray-500', label: 'Withdrawn', icon: 'minus-circle' },
} as const;

export const DEFAULT_PREFERENCES = {
  roles: [] as string[],
  locations: [] as string[],
  remoteOnly: false,
  jobTypes: [] as string[],
  levels: [] as string[],
  salaryMin: null as number | null,
  salaryMax: null as number | null,
  excludeCompanies: [] as string[],
  keywords: [] as string[],
};

export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'YOUR_APP_ID',
};
