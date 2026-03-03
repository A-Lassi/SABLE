import { Inbox } from 'lucide-react';
import { Button } from '../common/Button';
import { useStore } from '../../store';

export function EmptyState() {
  const openSettings = useStore((s) => s.openSettings);

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center">
        <Inbox className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900">You've seen all matching jobs!</h2>
      <p className="text-sm text-slate-500 max-w-xs">
        Adjust your filters or check back next week when new jobs are fetched.
      </p>
      <Button onClick={openSettings} variant="primary" size="lg">
        Update Filters
      </Button>
    </div>
  );
}
