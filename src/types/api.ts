export interface ResumeExtractRequest {
  file: File;
}

export interface ResumeExtractResponse {
  success: boolean;
  text: string;
  wordCount: number;
  detectedSections: string[];
}

export interface ResumeTailorRequest {
  masterResumeText: string | null;
  jobId: string;
  jobDescription: string | null;
}

export interface ResumeTailorChange {
  section: string;
  type: 'reworded' | 'reordered' | 'removed' | 'added';
  description: string;
}

export interface ResumeTailorResponse {
  success: boolean;
  tailoredResume: string;
  changes: ResumeTailorChange[];
}

export interface ApplicationSubmitRequest {
  applicationId: string;
  method: 'redirect';
}

export interface ApplicationSubmitResponse {
  success: boolean;
  applyUrl: string;
}
