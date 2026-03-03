import type { StateCreator } from 'zustand';
import type { UserProfile, UserPreferences, ApplyMode } from '../types';
import { DEFAULT_PREFERENCES } from '../utils/constants';

export interface UserSlice {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;

  setUser: (user: UserProfile | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsOnboarded: (value: boolean) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  setApplyMode: (mode: ApplyMode) => void;
  setMasterResume: (url: string | null, text: string | null) => void;
  incrementStat: (stat: 'totalSwiped' | 'totalApplied' | 'totalSaved') => void;
  loginWithMock: () => void;
}

export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  isOnboarded: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),

  setIsAuthenticated: (value) => set({ isAuthenticated: value }),

  setIsOnboarded: (value) => set({ isOnboarded: value }),

  updatePreferences: (prefs) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          preferences: { ...state.user.preferences, ...prefs },
        },
      };
    }),

  setApplyMode: (mode) =>
    set((state) => {
      if (!state.user) return state;
      return { user: { ...state.user, applyMode: mode } };
    }),

  setMasterResume: (url, text) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          masterResumeUrl: url,
          masterResumeText: text,
        },
      };
    }),

  incrementStat: (stat) =>
    set((state) => {
      if (!state.user) return state;
      return {
        user: {
          ...state.user,
          stats: {
            ...state.user.stats,
            [stat]: state.user.stats[stat] + 1,
          },
        },
      };
    }),

  loginWithMock: () =>
    set({
      user: {
        uid: 'mock-user-1',
        email: 'demo@sable.app',
        displayName: 'Demo User',
        createdAt: new Date(),
        masterResumeUrl: null,
        masterResumeText: null,
        preferences: DEFAULT_PREFERENCES as UserPreferences,
        applyMode: 'control',
        stats: { totalSwiped: 0, totalApplied: 0, totalSaved: 0 },
      },
      isAuthenticated: true,
      isOnboarded: true,
    }),
});
