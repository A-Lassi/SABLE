import { useEffect } from 'react';
import { useStore } from '../store';
import type { Application, Job } from '../types';

export function useApplications() {
  const {
    applications,
    selectedApplicationId,
    statusFilter,
    addApplication,
    updateApplicationStatus,
    updateApplicationNotes,
    updateApplicationResume,
    approveResume,
    setSelectedApplication,
    setStatusFilter,
    loadMockApplications,
    getFilteredApplications,
    getPendingReviewCount,
  } = useStore();

  useEffect(() => {
    if (applications.length === 0) {
      loadMockApplications();
    }
  }, [applications.length, loadMockApplications]);

  const selectedApplication = selectedApplicationId
    ? applications.find((a) => a.id === selectedApplicationId) ?? null
    : null;

  const createApplicationFromSwipe = (job: Job): Application => {
    const app: Application = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobSnapshot: {
        title: job.title,
        company: job.company,
        location: {
          city: job.location.city,
          state: job.location.state,
          isRemote: job.location.isRemote,
        },
        salary: {
          min: job.salary.min,
          max: job.salary.max,
          currency: job.salary.currency,
          period: job.salary.period,
        },
        type: job.type,
        level: job.level,
      },
      status: 'tailoring',
      createdAt: new Date(),
      updatedAt: new Date(),
      resumeDraft: {
        text: '',
        isApproved: false,
        approvedAt: null,
        version: 0,
      },
      submittedAt: null,
      notes: '',
    };
    addApplication(app);
    return app;
  };

  return {
    applications: getFilteredApplications(),
    allApplications: applications,
    selectedApplication,
    statusFilter,
    pendingReviewCount: getPendingReviewCount(),
    createApplicationFromSwipe,
    updateStatus: updateApplicationStatus,
    updateNotes: updateApplicationNotes,
    updateResume: updateApplicationResume,
    approveResume,
    selectApplication: setSelectedApplication,
    setStatusFilter,
  };
}
