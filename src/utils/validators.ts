import { MAX_RESUME_SIZE_BYTES, ACCEPTED_RESUME_TYPES } from './constants';

export function validateResumeFile(file: File): string | null {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ACCEPTED_RESUME_TYPES.includes(ext)) {
    return `Invalid file type. Accepted: ${ACCEPTED_RESUME_TYPES.join(', ')}`;
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return `File too large. Maximum size: ${MAX_RESUME_SIZE_BYTES / (1024 * 1024)} MB`;
  }
  return null;
}

export function validateSalaryRange(min: number | null, max: number | null): string | null {
  if (min !== null && max !== null && min > max) {
    return 'Minimum salary cannot be greater than maximum';
  }
  if (min !== null && min < 0) return 'Salary cannot be negative';
  if (max !== null && max < 0) return 'Salary cannot be negative';
  return null;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
