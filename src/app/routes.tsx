import { Briefcase, FolderOpen } from 'lucide-react';

export const TAB_ROUTES = [
  {
    path: '/',
    label: 'Feed',
    icon: Briefcase,
  },
  {
    path: '/applications',
    label: 'Applications',
    icon: FolderOpen,
  },
] as const;
