import { RotateCcw, X, Check } from 'lucide-react';
import { cn } from '../../lib/cn';

interface CardActionsProps {
  onPass: () => void;
  onApply: () => void;
  onUndo: () => void;
  canUndo: boolean;
  disabled: boolean;
}

export function CardActions({ onPass, onApply, onUndo, canUndo, disabled }: CardActionsProps) {
  return (
    <div className="flex items-center justify-center gap-5 mt-6">
      <button
        onClick={onUndo}
        disabled={!canUndo || disabled}
        className={cn(
          'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
          canUndo && !disabled
            ? 'border-amber-400 text-amber-500 hover:bg-amber-50 active:scale-95'
            : 'border-slate-200 text-slate-300 cursor-not-allowed'
        )}
        title="Undo"
      >
        <RotateCcw className="w-5 h-5" />
      </button>

      <button
        onClick={onPass}
        disabled={disabled}
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all',
          !disabled
            ? 'border-red-400 text-red-500 hover:bg-red-50 active:scale-95'
            : 'border-slate-200 text-slate-300 cursor-not-allowed'
        )}
        title="Pass"
      >
        <X className="w-7 h-7" />
      </button>

      <button
        onClick={onApply}
        disabled={disabled}
        className={cn(
          'w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all',
          !disabled
            ? 'border-green-400 text-green-500 hover:bg-green-50 active:scale-95'
            : 'border-slate-200 text-slate-300 cursor-not-allowed'
        )}
        title="Apply"
      >
        <Check className="w-7 h-7" />
      </button>
    </div>
  );
}
