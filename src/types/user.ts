import type { JobType, JobLevel } from './job';

export type ApplyMode = 'automatic' | 'control';

export interface UserPreferences {
  roles: string[];
  locations: string[];
  remoteOnly: boolean;
  jobTypes: JobType[];
  levels: JobLevel[];
  salaryMin: number | null;
  salaryMax: number | null;
  excludeCompanies: string[];
  keywords: string[];
}

export interface UserStats {
  totalSwiped: number;
  totalApplied: number;
  totalSaved: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  createdAt: Date;
  masterResumeUrl: string | null;
  masterResumeText: string | null;
  preferences: UserPreferences;
  applyMode: ApplyMode;
  stats: UserStats;
}
