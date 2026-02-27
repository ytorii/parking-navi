import { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCarousel } from '@/hooks/useCarousel';

interface ImageCarouselProps {
  imageUrls: string[];
  campName: string;
  className?: string;
}

function PlaceholderImage() {
  return (
    <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200">
      <svg
        viewBox="0 0 80 60"
        className="h-16 w-16 text-stone-300"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M40 5 L70 50 H10 Z" opacity="0.6" />
        <path d="M40 5 L65 45 H15 Z" opacity="0.3" />
        <rect x="32" y="38" width="16" height="12" rx="2" />
        <circle cx="20" cy="48" r="4" opacity="0.4" />
        <circle cx="60" cy="48" r="6" opacity="0.3" />
      </svg>
    </div>
  );
}

export default function ImageCarousel({ imageUrls, campName, className }: ImageCarouselProps) {
  const [errorSet, setErrorSet] = useState<Set<number>>(new Set());

  const validUrls = imageUrls.filter((_, i) => !errorSet.has(i));

  const { currentIndex, goTo, goPrev, goNext } = useCarousel({
    totalSlides: Math.max(validUrls.length, 1),
  });

  if (imageUrls.length === 0 || validUrls.length === 0) {
    return (
      <div className={className}>
        <PlaceholderImage />
      </div>
    );
  }

  const safeIndex = currentIndex < validUrls.length ? currentIndex : 0;

  return (
    <div className={clsx('relative overflow-hidden', className)}>
      <img
        key={validUrls[safeIndex]}
        src={validUrls[safeIndex]}
        alt={`${campName} ${safeIndex + 1}枚目`}
        className="aspect-video w-full object-cover"
        onError={() => {
          const originalIndex = imageUrls.indexOf(validUrls[safeIndex]);
          setErrorSet((prev) => new Set(prev).add(originalIndex));
          goTo(0);
        }}
      />

      {validUrls.length > 1 && (
        <>
          {/* 前へ */}
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label="前の画像"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* 次へ */}
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
            aria-label="次の画像"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          {/* ドット */}
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5" role="tablist" aria-label="画像選択">
            {validUrls.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === safeIndex}
                onClick={() => goTo(i)}
                className={clsx(
                  'rounded-full transition-all duration-200',
                  i === safeIndex
                    ? 'h-2 w-5 bg-white'
                    : 'h-2 w-2 bg-white/50 hover:bg-white/80',
                )}
                aria-label={`${i + 1}枚目の画像`}
              />
            ))}
          </div>

          {/* 枚数カウンター */}
          <div className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
            {safeIndex + 1}/{validUrls.length}
          </div>
        </>
      )}
    </div>
  );
}
