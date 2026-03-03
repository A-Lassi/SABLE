export type ApplicationStatus =
  | 'tailoring'
  | 'pending_review'
  | 'ready'
  | 'submitted'
  | 'interviewing'
  | 'offered'
  | 'rejected'
  | 'withdrawn';

export interface ResumeDraft {
  text: string;
  isApproved: boolean;
  approvedAt: Date | null;
  version: number;
}

export interface Application {
  id: string;
  jobId: string;
  jobSnapshot: {
    title: string;
    company: string;
    location: { city: string; state: string; isRemote: boolean };
    salary: { min: number | null; max: number | null; currency: string; period: string };
    type: string;
    level: string;
  };
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  resumeDraft: ResumeDraft;
  submittedAt: Date | null;
  notes: string;
}

export interface SwipeRecord {
  jobId: string;
  action: 'pass' | 'save' | 'apply';
  swipedAt: Date;
}
