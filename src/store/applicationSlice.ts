import type { StateCreator } from 'zustand';
import type { Application, ApplicationStatus } from '../types';
import { MOCK_APPLICATIONS } from '../mocks/applications';

export interface ApplicationSlice {
  applications: Application[];
  selectedApplicationId: string | null;
  statusFilter: ApplicationStatus | 'all';

  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  updateApplicationStatus: (id: string, status: ApplicationStatus) => void;
  updateApplicationNotes: (id: string, notes: string) => void;
  updateApplicationResume: (id: string, text: string) => void;
  approveResume: (id: string) => void;
  setSelectedApplication: (id: string | null) => void;
  setStatusFilter: (status: ApplicationStatus | 'all') => void;
  loadMockApplications: () => void;
  getFilteredApplications: () => Application[];
  getPendingReviewCount: () => number;
}

export const createApplicationSlice: StateCreator<ApplicationSlice, [], [], ApplicationSlice> = (
  set,
  get
) => ({
  applications: [],
  selectedApplicationId: null,
  statusFilter: 'all',

  setApplications: (apps) => set({ applications: apps }),

  addApplication: (app) =>
    set((state) => ({ applications: [app, ...state.applications] })),

  updateApplicationStatus: (id, status) =>
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
              updatedAt: new Date(),
              ...(status === 'submitted' ? { submittedAt: new Date() } : {}),
            }
          : a
      ),
    })),

  updateApplicationNotes: (id, notes) =>
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id ? { ...a, notes, updatedAt: new Date() } : a
      ),
    })),

  updateApplicationResume: (id, text) =>
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              resumeDraft: {
                ...a.resumeDraft,
                text,
                version: a.resumeDraft.version + 1,
              },
              updatedAt: new Date(),
            }
          : a
      ),
    })),

  approveResume: (id) =>
    set((state) => ({
      applications: state.applications.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'ready' as ApplicationStatus,
              resumeDraft: {
                ...a.resumeDraft,
                isApproved: true,
                approvedAt: new Date(),
              },
              updatedAt: new Date(),
            }
          : a
      ),
    })),

  setSelectedApplication: (id) => set({ selectedApplicationId: id }),

  setStatusFilter: (status) => set({ statusFilter: status }),

  loadMockApplications: () => set({ applications: MOCK_APPLICATIONS }),

  getFilteredApplications: () => {
    const { applications, statusFilter } = get();
    if (statusFilter === 'all') return applications;
    return applications.filter((a) => a.status === statusFilter);
  },

  getPendingReviewCount: () => {
    const { applications } = get();
    return applications.filter((a) => a.status === 'pending_review').length;
  },
});
