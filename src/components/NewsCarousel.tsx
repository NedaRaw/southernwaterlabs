import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, ArrowLeft, ArrowRight, Pause, Play,
  ChevronLeft, ChevronRight, Newspaper,
  Sparkles, Tag
} from 'lucide-react';
import { newsItems, getLocalizedNews } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';

const SLIDE_DURATION = 6000; // 6 seconds per slide

export default function NewsCarousel() {
  const { lang, t, dir } = useLang();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const PrevArrow = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextArrow = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const total = newsItems.length;

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const handleSelect = (index: number) => {
    if (index === currentIndex) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setProgress(0);
  };

  // Auto-slide ticker with smooth progress update
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / SLIDE_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isAutoPlaying, isHovered, handleNext]);

  // Framer motion variants for sliding
  const rtlFactor = dir === 'rtl' ? -1 : 1;

  const slideVariants = {
    enter: (customDirection: number) => ({
      x: customDirection * rtlFactor * 100 + '%',
      opacity: 0,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      x: '0%',
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 },
      },
    },
    exit: (customDirection: number) => ({
      zIndex: 0,
      x: -customDirection * rtlFactor * 100 + '%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.35 },
      },
    }),
  };

  // Handle drag/swipe end
  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number } }) => {
    const swipeThreshold = 50;
    if (dir === 'rtl') {
      if (info.offset.x > swipeThreshold) {
        handleNext();
      } else if (info.offset.x < -swipeThreshold) {
        handlePrev();
      }
    } else {
      if (info.offset.x < -swipeThreshold) {
        handleNext();
      } else if (info.offset.x > swipeThreshold) {
        handlePrev();
      }
    }
  };

  const currentNews = getLocalizedNews(newsItems[currentIndex], lang);

  return (
    <section className="py-14 sm:py-18 bg-[#F1F5F9] dark:bg-[#111827] border-y border-slate-200/80 dark:border-slate-800 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium mb-2 border border-slate-200 dark:border-slate-700">
              <Newspaper className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('news.badge')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
              {t('news.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {t('news.desc')}
            </p>
          </div>

          {/* Controls: Browse All & Carousel Controls */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Play/Pause Button */}
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="p-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-navy-900 border border-slate-200 shadow-sm transition-all"
              title={isAutoPlaying ? t('news.pause') : t('news.play')}
              aria-label={isAutoPlaying ? t('news.pause') : t('news.play')}
            >
              {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Prev / Next Navigation Buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button
                onClick={handlePrev}
                className="p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                title={t('news.prev')}
                aria-label={t('news.prev')}
              >
                <PrevArrow className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-400 px-1.5 font-mono">
                {currentIndex + 1} / {total}
              </span>
              <button
                onClick={handleNext}
                className="p-2 rounded-lg text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                title={t('news.next')}
                aria-label={t('news.next')}
              >
                <NextArrow className="w-4 h-4" />
              </button>
            </div>

            {/* View All News Link */}
            <Link
              to="/news"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs sm:text-sm font-bold shadow-md shadow-navy-950/15 transition-all group"
            >
              <span>{t('news.allNews')}</span>
              <Arrow className={`w-3.5 h-3.5 transition-transform ${dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </Link>
          </div>
        </div>

        {/* Carousel Showcase Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Slide Card Area */}
          <div className="relative h-[480px] sm:h-[520px] lg:h-[460px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-navy-950">
            
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                {/* Background Image with Layered Gradient */}
                <div className="absolute inset-0">
                  <img
                    src={currentNews.image}
                    alt={currentNews.title}
                    className="w-full h-full object-cover object-center scale-100 filter brightness-90"
                  />
                  {/* Directional Gradient Overlays for High Legibility */}
                  <div
                    className={`absolute inset-0 ${
                      dir === 'rtl'
                        ? 'bg-gradient-to-l from-navy-950 via-navy-950/90 sm:via-navy-950/80 to-transparent'
                        : 'bg-gradient-to-r from-navy-950 via-navy-950/90 sm:via-navy-950/80 to-transparent'
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/50 to-transparent" />
                </div>

                {/* Slide Content Overlay */}
                <div className="relative h-full z-10 flex flex-col justify-end p-6 sm:p-10 lg:p-12 max-w-3xl">
                  {/* Category & Date Header */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap items-center gap-3 mb-4"
                  >
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-water-500/25 border border-water-300/40 text-aqua-300 text-xs font-bold backdrop-blur-md">
                      <Tag className="w-3 h-3" />
                      {currentNews.category}
                    </span>

                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-300/90 font-medium bg-black/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      <Calendar className="w-3.5 h-3.5 text-water-400" />
                      {currentNews.date}
                    </span>

                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-amber-300 font-semibold bg-amber-400/15 border border-amber-300/20 px-2.5 py-1 rounded-full">
                      <Sparkles className="w-3 h-3" />
                      {t('news.featured')}
                    </span>
                  </motion.div>

                  {/* Headline */}
                  <motion.h3
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                    className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-snug tracking-tight mb-3 drop-shadow-md"
                  >
                    {currentNews.title}
                  </motion.h3>

                  {/* Description Excerpt */}
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="text-sm sm:text-base text-slate-200/90 leading-relaxed mb-6 line-clamp-3 font-normal max-w-2xl"
                  >
                    {currentNews.description}
                  </motion.p>

                  {/* Read More Link */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45 }}
                  >
                    <Link
                      to="/news"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-water-500 to-water-600 hover:from-water-600 hover:to-water-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-water-600/30 hover:shadow-water-600/50 transition-all border border-water-300/30 group w-fit"
                    >
                      <span>{t('news.readmore')}</span>
                      <Arrow className={`w-4 h-4 transition-transform ${dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Top Right Floating Controls (Prev/Next on Overlay) */}
            <div className="absolute top-5 end-5 z-20 hidden sm:flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-navy-900/70 hover:bg-navy-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                title={t('news.prev')}
                aria-label={t('news.prev')}
              >
                <PrevArrow className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-navy-900/70 hover:bg-navy-900 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                title={t('news.next')}
                aria-label={t('news.next')}
              >
                <NextArrow className="w-5 h-5" />
              </button>
            </div>

            {/* Bottom Progress Bar (Active Auto-slide Indicator) */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/15 z-20">
              <motion.div
                className="h-full bg-gradient-to-r from-water-400 to-aqua-400"
                style={{ width: `${isAutoPlaying ? progress : 100}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </div>

          {/* Interactive Thumbnails Navigation Rail */}
          <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {newsItems.map((rawItem, idx) => {
              const item = getLocalizedNews(rawItem, lang);
              const isActive = idx === currentIndex;
              return (
                <button
                  key={rawItem.id}
                  onClick={() => handleSelect(idx)}
                  className={`text-start p-3 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                    isActive
                      ? 'bg-white border-water-500 shadow-md ring-2 ring-water-400/20'
                      : 'bg-white/70 hover:bg-white border-slate-200/80 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  {/* Subtle Active Indicator Top Bar */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSlideIndicator"
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-water-500 to-aqua-500"
                    />
                  )}

                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold text-water-700 bg-water-50 px-2 py-0.5 rounded-md line-clamp-1">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono ms-auto">
                      0{idx + 1}
                    </span>
                  </div>

                  <p
                    className={`text-xs font-bold line-clamp-2 transition-colors ${
                      isActive ? 'text-navy-950' : 'text-slate-600 group-hover:text-navy-800'
                    }`}
                  >
                    {item.title}
                  </p>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
