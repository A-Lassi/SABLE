import { useApplications } from '../../hooks/useApplications';
import { ApplicationCard } from './ApplicationCard';
import type { ApplicationStatus } from '../../types';
import { Inbox } from 'lucide-react';

const STATUS_OPTIONS: { value: ApplicationStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'tailoring', label: 'Tailoring' },
  { value: 'pending_review', label: 'Needs Review' },
  { value: 'ready', label: 'Ready' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
];

export function ApplicationList() {
  const { applications, statusFilter, setStatusFilter, selectApplication } = useApplications();

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-2 pb-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ApplicationStatus | 'all')}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
            <Inbox className="w-12 h-12 text-slate-300" />
            <p className="text-slate-500 text-sm">
              {statusFilter === 'all'
                ? 'No applications yet. Swipe right on a job to apply!'
                : 'No applications with this status.'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {applications.map((app) => (
              <ApplicationCard
                key={app.id}
                application={app}
                onSelect={selectApplication}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
