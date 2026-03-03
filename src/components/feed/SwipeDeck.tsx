import { useState, useRef, useCallback } from 'react';
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion';
import { JobCard } from './JobCard';
import { CardActions } from './CardActions';
import { EmptyState } from './EmptyState';
import { useSwipe } from '../../hooks/useSwipe';
import { Loader } from '../common/Loader';
import { Modal } from '../common/Modal';
import type { Job } from '../../types';
import { formatSalary, formatLocation } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { MapPin, Building2, Home, ExternalLink } from 'lucide-react';

const SWIPE_THRESHOLD = 120;
const VELOCITY_THRESHOLD = 500;

export function SwipeDeck() {
  const {
    currentJob,
    nextJob,
    isDeckEmpty,
    isLoadingJobs,
    canUndo,
    onSwipeLeft,
    onSwipeRight,
    onUndo,
  } = useSwipe();

  const [detailJob, setDetailJob] = useState<Job | null>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-15, 0, 15]);
  const leftOpacity = useTransform(x, [-150, -50, 0], [1, 0.5, 0]);
  const rightOpacity = useTransform(x, [0, 50, 150], [0, 0.5, 1]);
  const isAnimating = useRef(false);

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      if (isAnimating.current) return;

      const offset = info.offset.x;
      const velocity = info.velocity.x;

      if (Math.abs(offset) > SWIPE_THRESHOLD || Math.abs(velocity) > VELOCITY_THRESHOLD) {
        const direction = offset > 0 ? 1 : -1;
        isAnimating.current = true;

        animate(x, direction * 500, {
          duration: 0.3,
          onComplete: () => {
            if (direction > 0) {
              onSwipeRight();
            } else {
              onSwipeLeft();
            }
            x.set(0);
            isAnimating.current = false;
          },
        });
      } else {
        animate(x, 0, { type: 'spring', stiffness: 500, damping: 30 });
      }
    },
    [x, onSwipeLeft, onSwipeRight]
  );

  const handleButtonPass = useCallback(() => {
    if (isAnimating.current || !currentJob) return;
    isAnimating.current = true;
    animate(x, -500, {
      duration: 0.3,
      onComplete: () => {
        onSwipeLeft();
        x.set(0);
        isAnimating.current = false;
      },
    });
  }, [x, onSwipeLeft, currentJob]);

  const handleButtonApply = useCallback(() => {
    if (isAnimating.current || !currentJob) return;
    isAnimating.current = true;
    animate(x, 500, {
      duration: 0.3,
      onComplete: () => {
        onSwipeRight();
        x.set(0);
        isAnimating.current = false;
      },
    });
  }, [x, onSwipeRight, currentJob]);

  if (isLoadingJobs) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader text="Loading jobs..." size={32} />
      </div>
    );
  }

  if (isDeckEmpty) {
    return <EmptyState />;
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4 relative">
      <div className="relative w-full max-w-sm h-[480px]">
        {nextJob && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full scale-95 opacity-70 -translate-y-2">
              <JobCard job={nextJob} />
            </div>
          </div>
        )}

        {currentJob && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-10"
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
          >
            <motion.div
              className="absolute inset-0 rounded-2xl bg-red-500/20 flex items-center justify-center z-20 pointer-events-none"
              style={{ opacity: leftOpacity }}
            >
              <span className="text-red-600 font-bold text-2xl rotate-12 border-4 border-red-600 rounded-xl px-4 py-1">
                PASS
              </span>
            </motion.div>

            <motion.div
              className="absolute inset-0 rounded-2xl bg-green-500/20 flex items-center justify-center z-20 pointer-events-none"
              style={{ opacity: rightOpacity }}
            >
              <span className="text-green-600 font-bold text-2xl -rotate-12 border-4 border-green-600 rounded-xl px-4 py-1">
                APPLY
              </span>
            </motion.div>

            <JobCard
              job={currentJob}
              onTap={() => setDetailJob(currentJob)}
              className="h-full"
            />
          </motion.div>
        )}
      </div>

      <CardActions
        onPass={handleButtonPass}
        onApply={handleButtonApply}
        onUndo={onUndo}
        canUndo={canUndo}
        disabled={!currentJob}
      />

      <Modal
        isOpen={detailJob !== null}
        onClose={() => setDetailJob(null)}
        title="Job Details"
      >
        {detailJob && (
          <div className="flex flex-col gap-4">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{detailJob.title}</h3>
              <div className="flex items-center gap-1.5 mt-1 text-slate-600">
                <Building2 className="w-4 h-4" />
                <span>{detailJob.company}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">
                  {formatLocation(
                    detailJob.location.city,
                    detailJob.location.state,
                    detailJob.location.isRemote
                  )}
                </span>
                {detailJob.location.isRemote && <Home className="w-3.5 h-3.5 text-green-600" />}
              </div>
            </div>

            <div className="text-2xl font-bold text-slate-900">
              {formatSalary(
                detailJob.salary.min,
                detailJob.salary.max,
                detailJob.salary.currency,
                detailJob.salary.period
              )}
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge label={detailJob.type} color="bg-blue-100 text-blue-700" />
              <Badge label={detailJob.level} color="bg-purple-100 text-purple-700" />
              {detailJob.tags.map((tag) => (
                <Badge key={tag} label={tag} color="bg-slate-100 text-slate-600" />
              ))}
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
              <div className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                {detailJob.description}
              </div>
            </div>

            <a
              href={detailJob.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-blue-600 text-sm font-medium hover:underline"
            >
              View on Adzuna <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </Modal>
    </div>
  );
}
