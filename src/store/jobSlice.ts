import type { StateCreator } from 'zustand';
import type { Job, JobFilter, SwipeRecord } from '../types';
import { DEFAULT_PREFERENCES } from '../utils/constants';
import { MOCK_JOBS } from '../mocks/jobs';

export interface JobSlice {
  deck: Job[];
  currentIndex: number;
  swipeHistory: SwipeRecord[];
  filters: JobFilter;
  isLoadingJobs: boolean;
  lastSwipedJob: Job | null;

  setDeck: (jobs: Job[]) => void;
  addToDeck: (jobs: Job[]) => void;
  swipeCard: (action: 'pass' | 'apply') => Job | null;
  undoLastSwipe: () => void;
  setFilters: (filters: Partial<JobFilter>) => void;
  resetDeck: () => void;
  loadInitialDeck: () => void;
  setIsLoadingJobs: (loading: boolean) => void;
}

export const createJobSlice: StateCreator<JobSlice, [], [], JobSlice> = (set, get) => ({
  deck: [],
  currentIndex: 0,
  swipeHistory: [],
  filters: DEFAULT_PREFERENCES as JobFilter,
  isLoadingJobs: false,
  lastSwipedJob: null,

  setDeck: (jobs) => set({ deck: jobs, currentIndex: 0 }),

  addToDeck: (jobs) =>
    set((state) => ({ deck: [...state.deck, ...jobs] })),

  swipeCard: (action) => {
    const { deck, currentIndex, swipeHistory } = get();
    if (currentIndex >= deck.length) return null;

    const job = deck[currentIndex];
    const record: SwipeRecord = {
      jobId: job.id,
      action,
      swipedAt: new Date(),
    };

    set({
      currentIndex: currentIndex + 1,
      swipeHistory: [...swipeHistory, record],
      lastSwipedJob: job,
    });

    return job;
  },

  undoLastSwipe: () => {
    const { currentIndex, swipeHistory } = get();
    if (currentIndex <= 0 || swipeHistory.length === 0) return;

    set({
      currentIndex: currentIndex - 1,
      swipeHistory: swipeHistory.slice(0, -1),
      lastSwipedJob: null,
    });
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetDeck: () => set({ deck: [], currentIndex: 0 }),

  loadInitialDeck: () => {
    const { swipeHistory } = get();
    const seenIds = new Set(swipeHistory.map((r) => r.jobId));
    const filtered = MOCK_JOBS.filter((j) => !seenIds.has(j.id));
    set({ deck: filtered, currentIndex: 0, isLoadingJobs: false });
  },

  setIsLoadingJobs: (loading) => set({ isLoadingJobs: loading }),
});
