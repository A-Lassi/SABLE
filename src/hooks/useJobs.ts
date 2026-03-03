import { useEffect, useCallback } from 'react';
import { useStore } from '../store';

export function useJobs() {
  const {
    deck,
    currentIndex,
    filters,
    isLoadingJobs,
    lastSwipedJob,
    loadInitialDeck,
    swipeCard,
    undoLastSwipe,
    setIsLoadingJobs,
  } = useStore();

  useEffect(() => {
    setIsLoadingJobs(true);
    loadInitialDeck();
  }, [loadInitialDeck, setIsLoadingJobs]);

  const currentJob = currentIndex < deck.length ? deck[currentIndex] : null;
  const nextJob = currentIndex + 1 < deck.length ? deck[currentIndex + 1] : null;
  const remainingCount = deck.length - currentIndex;

  const handleSwipeLeft = useCallback(() => {
    return swipeCard('pass');
  }, [swipeCard]);

  const handleSwipeRight = useCallback(() => {
    return swipeCard('apply');
  }, [swipeCard]);

  const handleUndo = useCallback(() => {
    undoLastSwipe();
  }, [undoLastSwipe]);

  return {
    currentJob,
    nextJob,
    remainingCount,
    isLoadingJobs,
    lastSwipedJob,
    filters,
    handleSwipeLeft,
    handleSwipeRight,
    handleUndo,
    canUndo: currentIndex > 0,
    isDeckEmpty: currentIndex >= deck.length,
  };
}
