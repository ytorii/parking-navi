import { useCallback, useEffect, useRef, useState } from 'react';

interface UseCarouselOptions {
  totalSlides: number;
  autoPlayMs?: number;
}

export function useCarousel({ totalSlides, autoPlayMs }: UseCarouselOptions) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const pauseRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = () => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startTimer = useCallback(() => {
    if (!autoPlayMs) return;
    clearTimer();
    intervalRef.current = setInterval(() => {
      if (!pauseRef.current) {
        setCurrentIndex((prev) => (prev + 1) % totalSlides);
      }
    }, autoPlayMs);
  }, [autoPlayMs, totalSlides]);

  useEffect(() => {
    if (autoPlayMs) {
      startTimer();
      return clearTimer;
    }
  }, [autoPlayMs, startTimer]);

  const goTo = (index: number) => setCurrentIndex(index);
  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % totalSlides);

  return { currentIndex, goTo, goPrev, goNext, pauseRef };
}
