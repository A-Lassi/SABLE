import type { StateCreator } from 'zustand';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface UISlice {
  isSettingsOpen: boolean;
  isJobDetailOpen: boolean;
  activeJobDetailId: string | null;
  toasts: Toast[];
  isLoading: boolean;

  openSettings: () => void;
  closeSettings: () => void;
  openJobDetail: (jobId: string) => void;
  closeJobDetail: () => void;
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
}

let toastCounter = 0;

export const createUISlice: StateCreator<UISlice, [], [], UISlice> = (set) => ({
  isSettingsOpen: false,
  isJobDetailOpen: false,
  activeJobDetailId: null,
  toasts: [],
  isLoading: false,

  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false }),

  openJobDetail: (jobId) =>
    set({ isJobDetailOpen: true, activeJobDetailId: jobId }),
  closeJobDetail: () =>
    set({ isJobDetailOpen: false, activeJobDetailId: null }),

  addToast: (message, type = 'info') => {
    const id = `toast-${++toastCounter}`;
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setIsLoading: (loading) => set({ isLoading: loading }),
});
