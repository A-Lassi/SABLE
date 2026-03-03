import { useState, useCallback } from 'react';
import { useJobs } from './useJobs';
import { useApplications } from './useApplications';
import { useResumeTailor } from './useResumeTailor';
import { useStore } from '../store';

export function useSwipe() {
  const {
    currentJob,
    nextJob,
    remainingCount,
    isDeckEmpty,
    isLoadingJobs,
    handleSwipeLeft,
    handleSwipeRight,
    handleUndo,
    canUndo,
  } = useJobs();

  const { createApplicationFromSwipe } = useApplications();
  const { tailor } = useResumeTailor();
  const { addToast, incrementStat, user } = useStore();
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  const onSwipeLeft = useCallback(() => {
    const job = handleSwipeLeft();
    if (job) {
      incrementStat('totalSwiped');
      setSwipeDirection('left');
      setTimeout(() => setSwipeDirection(null), 300);
    }
  }, [handleSwipeLeft, incrementStat]);

  const onSwipeRight = useCallback(() => {
    const job = handleSwipeRight();
    if (job) {
      incrementStat('totalSwiped');
      incrementStat('totalApplied');
      setSwipeDirection('right');
      setTimeout(() => setSwipeDirection(null), 300);

      if (!user?.masterResumeText) {
        addToast('Upload your resume first to get tailored applications!', 'warning');
        const app = createApplicationFromSwipe(job);
        useStore.getState().updateApplicationStatus(app.id, 'pending_review');
        return;
      }

      const app = createApplicationFromSwipe(job);
      addToast('Tailoring resume...', 'info');

      tailor(app.id, job.id, job.description).then((result) => {
        if (result) {
          if (user?.applyMode === 'automatic') {
            addToast(`Applied to ${job.company}!`, 'success');
          } else {
            addToast('Resume tailored! Review it in Applications.', 'success');
          }
        } else {
          addToast('Resume tailoring failed. Tap to retry in Applications.', 'error');
        }
      });
    }
  }, [handleSwipeRight, incrementStat, user, addToast, createApplicationFromSwipe, tailor]);

  const onUndo = useCallback(() => {
    handleUndo();
    addToast('Card restored', 'info');
  }, [handleUndo, addToast]);

  return {
    currentJob,
    nextJob,
    remainingCount,
    isDeckEmpty,
    isLoadingJobs,
    swipeDirection,
    canUndo,
    onSwipeLeft,
    onSwipeRight,
    onUndo,
  };
}
