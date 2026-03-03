import { useState, useCallback } from 'react';
import { tailorResume } from '../services/resumeService';
import { useStore } from '../store';
import type { ResumeTailorResponse } from '../types';

export function useResumeTailor() {
  const [isTailoring, setIsTailoring] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateApplicationStatus, updateApplicationResume } = useStore();

  const tailor = useCallback(
    async (applicationId: string, jobId: string, jobDescription: string) => {
      setIsTailoring(true);
      setError(null);

      try {
        const result: ResumeTailorResponse = await tailorResume({
          masterResumeText: user?.masterResumeText ?? null,
          jobId,
          jobDescription,
        });

        if (result.success) {
          updateApplicationResume(applicationId, result.tailoredResume);

          const applyMode = user?.applyMode ?? 'control';
          if (applyMode === 'automatic') {
            updateApplicationStatus(applicationId, 'submitted');
          } else {
            updateApplicationStatus(applicationId, 'pending_review');
          }

          return result;
        } else {
          throw new Error('Tailoring failed');
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Tailoring failed';
        setError(msg);
        return null;
      } finally {
        setIsTailoring(false);
      }
    },
    [user, updateApplicationResume, updateApplicationStatus]
  );

  return { tailor, isTailoring, error };
}
