import type { Job } from '../../types';
import { Badge } from '../common/Badge';
import { formatSalary, formatLocation } from '../../utils/formatters';
import { MapPin, Building2, Home } from 'lucide-react';
import { cn } from '../../lib/cn';

interface JobCardProps {
  job: Job;
  onTap?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const levelColors: Record<string, string> = {
  entry: 'bg-green-100 text-green-700',
  mid: 'bg-blue-100 text-blue-700',
  senior: 'bg-purple-100 text-purple-700',
  lead: 'bg-orange-100 text-orange-700',
  executive: 'bg-red-100 text-red-700',
};

const typeColors: Record<string, string> = {
  'full-time': 'bg-blue-100 text-blue-700',
  'part-time': 'bg-teal-100 text-teal-700',
  contract: 'bg-amber-100 text-amber-700',
  internship: 'bg-pink-100 text-pink-700',
  temporary: 'bg-slate-100 text-slate-700',
};

export function JobCard({ job, onTap, className, style }: JobCardProps) {
  return (
    <div
      onClick={onTap}
      style={style}
      className={cn(
        'bg-white rounded-2xl shadow-lg border border-slate-100 p-6 flex flex-col gap-4 cursor-pointer select-none w-full',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {job.company.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-900 leading-tight">{job.title}</h3>
          <div className="flex items-center gap-1.5 mt-1 text-slate-600">
            <Building2 className="w-3.5 h-3.5" />
            <span className="text-sm">{job.company}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-slate-500">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">
          {formatLocation(job.location.city, job.location.state, job.location.isRemote)}
        </span>
        {job.location.isRemote && <Home className="w-3.5 h-3.5 ml-1 text-green-600" />}
      </div>

      <div className="text-xl font-bold text-slate-900">
        {formatSalary(job.salary.min, job.salary.max, job.salary.currency, job.salary.period)}
        {job.salary.period !== 'yearly' && (
          <span className="text-sm font-normal text-slate-400 ml-1">/{job.salary.period.replace('ly', '')}</span>
        )}
      </div>

      <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
        {job.descriptionSnippet}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {job.tags.slice(0, 4).map((tag) => (
          <Badge key={tag} label={tag} color="bg-slate-100 text-slate-600" />
        ))}
        {job.tags.length > 4 && (
          <Badge label={`+${job.tags.length - 4}`} color="bg-slate-50 text-slate-400" />
        )}
      </div>

      <div className="flex gap-2 mt-auto pt-2">
        <Badge label={job.type} color={typeColors[job.type]} />
        <Badge label={job.level} color={levelColors[job.level]} />
      </div>
    </div>
  );
}
