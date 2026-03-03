import { create } from 'zustand';
import { createJobSlice, type JobSlice } from './jobSlice';
import { createApplicationSlice, type ApplicationSlice } from './applicationSlice';
import { createUserSlice, type UserSlice } from './userSlice';
import { createUISlice, type UISlice } from './uiSlice';

export type AppStore = JobSlice & ApplicationSlice & UserSlice & UISlice;

export const useStore = create<AppStore>()((...a) => ({
  ...createJobSlice(...a),
  ...createApplicationSlice(...a),
  ...createUserSlice(...a),
  ...createUISlice(...a),
}));
