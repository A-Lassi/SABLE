import type { Application } from '../../types';
import { APPLICATION_STATUS_CONFIG } from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';
import { cn } from '../../lib/cn';

interface ApplicationCardProps {
  application: Application;
  onSelect: (id: string) => void;
}

export function ApplicationCard({ application, onSelect }: ApplicationCardProps) {
  const statusConfig = APPLICATION_STATUS_CONFIG[application.status];

  return (
    <button
      onClick={() => onSelect(application.id)}
      className="w-full text-left bg-white rounded-xl border border-slate-100 p-4 hover:border-slate-200 hover:shadow-sm transition-all active:scale-[0.99]"
    >
      <div className="flex items-start gap-3">
        <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5 shrink-0', statusConfig.color)} />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">
            {application.jobSnapshot.title}
          </h3>
          <p className="text-sm text-slate-500 truncate">{application.jobSnapshot.company}</p>
          <div className="flex items-center justify-between mt-2">
            <span className={cn('text-xs font-medium', statusConfig.textColor)}>
              {statusConfig.label}
            </span>
            <span className="text-xs text-slate-400">
              {formatRelativeTime(application.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
