import { cn } from '../../lib/cn';

interface BadgeProps {
  label: string;
  color?: string;
  className?: string;
}

export function Badge({ label, color = 'bg-slate-100 text-slate-700', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        color,
        className
      )}
    >
      {label}
    </span>
  );
}
