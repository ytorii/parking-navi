import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, ChevronRight, Flower2, Leaf, Search, Snowflake, Sun } from 'lucide-react';

import { useCarousel } from '@/hooks/useCarousel';
import type { LucideIcon } from 'lucide-react';
import type { Season } from '@/types/camp';

interface Slide {
  season: Season;
  label: string;
  title: string;
  subtitle: string;
  bgFrom: string;
  bgVia: string;
  image: string;
  Icon: LucideIcon;
}

const SLIDES: Slide[] = [
  {
    season: 'spring',
    label: '春',
    title: '桜舞う春のアウトドア',
    subtitle: '花咲く季節に、自然の中でリフレッシュしませんか',
    bgFrom: 'rgba(134,16,67,0.7)',
    bgVia: 'rgba(163,0,76,0.5)',
    image: '/images/hero-spring.jpg',
    Icon: Flower2,
  },
  {
    season: 'summer',
    label: '夏',
    title: '輝く夏の冒険へ',
    subtitle: '川遊び、BBQ、星空観察。夏のアウトドアを満喫しよう',
    bgFrom: 'rgba(6,78,59,0.7)',
    bgVia: 'rgba(5,96,55,0.5)',
    image: '/images/hero-summer.jpg',
    Icon: Sun,
  },
  {
    season: 'autumn',
    label: '秋',
    title: '紅葉に染まる秋キャンプ',
    subtitle: '色づく山々と焚き火を楽しむ、秋ならではの贅沢な時間',
    bgFrom: 'rgba(124,45,18,0.7)',
    bgVia: 'rgba(154,52,18,0.5)',
    image: '/images/hero-autumn.jpg',
    Icon: Leaf,
  },
  {
    season: 'winter',
    label: '冬',
    title: '冬の澄んだ空気の中で',
    subtitle: '雪景色の温泉キャンプ、冬グランピングで特別な体験を',
    bgFrom: 'rgba(12,74,110,0.7)',
    bgVia: 'rgba(7,89,133,0.5)',
    image: '/images/hero-winter.jpg',
    Icon: Snowflake,
  },
];

interface HeroSectionProps {
  searchText: string;
  onSearchChange: (value: string) => void;
}

export default function HeroSection({ searchText, onSearchChange }: HeroSectionProps) {
  const prefersReducedMotion = useReducedMotion();
  const { currentIndex, goTo, goPrev, goNext, pauseRef } = useCarousel({
    totalSlides: SLIDES.length,
    autoPlayMs: prefersReducedMotion ? 0 : 5000,
  });

  const slide = SLIDES[currentIndex];
  const { Icon } = slide;

  return (
    <div
      className="relative h-[420px] w-full overflow-hidden"
      onMouseEnter={() => { pauseRef.current = true; }}
      onMouseLeave={() => { pauseRef.current = false; }}
    >
      {/* Season background — photo + gradient overlay, animates on slide change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: prefersReducedMotion ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.98 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.7, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Left-to-right gradient (season color) */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, ${slide.bgFrom}, ${slide.bgVia}, transparent)`,
            }}
          />
          {/* Bottom-to-top dark overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Text content — positioned at y=197 (≈47% of 420px) */}
      <div className="absolute left-8 top-[197px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -10 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.35, delay: prefersReducedMotion ? 0 : 0.1 }}
            className="opacity-75"
          >
            {/* Season label */}
            <p className="flex items-center gap-1.5 text-[rgba(255,255,255,0.8)] text-sm uppercase tracking-[0.7px]">
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {slide.label} season
            </p>
            {/* Headline */}
            <h2
              className="mt-1 text-[36px] font-medium leading-tight text-white"
              style={{ textShadow: '0px 4px 8px rgba(0,0,0,0.15)' }}
            >
              {slide.title}
            </h2>
            {/* Subtitle */}
            <p className="mt-1 text-[18px] text-[rgba(255,255,255,0.9)]">
              {slide.subtitle}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Search bar — Figma y≈332, near bottom */}
      <div className="absolute bottom-[48px] left-8 w-[min(672px,calc(100%-64px))]">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#99a1af]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="施設名、場所で検索..."
            aria-label="施設名または場所で検索"
            className="h-12 w-full rounded-[14px] bg-[rgba(255,255,255,0.95)] pl-12 pr-4 text-sm text-[#101828] placeholder-[#9ca3af] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1)] focus:outline-none focus:ring-2 focus:ring-[#00a63e]/40"
          />
        </div>
      </div>

      {/* Arrow navigation — y=192 */}
      <button
        type="button"
        onClick={goPrev}
        aria-label="前のスライド"
        className="absolute left-2 top-[192px] flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.2)] text-white backdrop-blur-sm transition hover:bg-[rgba(255,255,255,0.35)]"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={goNext}
        aria-label="次のスライド"
        className="absolute right-2 top-[192px] flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(255,255,255,0.2)] text-white backdrop-blur-sm transition hover:bg-[rgba(255,255,255,0.35)]"
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Dot indicators */}
      <div
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5"
        role="tablist"
        aria-label="スライド選択"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === currentIndex}
            aria-label={`スライド ${i + 1}`}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all ${
              i === currentIndex
                ? 'h-1.5 w-[26px] bg-[rgba(255,255,255,0.82)]'
                : 'h-1.5 w-3 bg-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.6)]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
