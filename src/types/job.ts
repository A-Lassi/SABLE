export interface JobLocation {
  city: string;
  state: string;
  country: string;
  isRemote: boolean;
}

export interface JobSalary {
  min: number | null;
  max: number | null;
  currency: string;
  period: 'yearly' | 'monthly' | 'hourly';
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'temporary';
export type JobLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';

export interface Job {
  id: string;
  sourceId: string;
  title: string;
  company: string;
  location: JobLocation;
  description: string;
  descriptionSnippet: string;
  salary: JobSalary;
  type: JobType;
  level: JobLevel;
  category: string;
  tags: string[];
  applyUrl: string;
  sourceUrl: string;
  postedAt: Date;
  fetchedAt: Date;
  expiresAt: Date | null;
  isActive: boolean;
}

export interface JobFilter {
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
