import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

interface LoaderProps {
  className?: string;
  size?: number;
  text?: string;
}

export function Loader({ className, size = 24, text }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 className="animate-spin text-blue-600" size={size} />
      {text && <p className="text-sm text-slate-500">{text}</p>}
    </div>
  );
}
