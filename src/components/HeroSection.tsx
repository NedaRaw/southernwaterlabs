import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Droplets, UserPlus, ArrowLeft, ArrowRight, ShieldCheck,
  Activity, Layers
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import HeroFacilityCarousel from '@/components/HeroFacilityCarousel';
import { siteMedia } from '@/data/siteMedia';

export default function HeroSection() {
  const { t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  // Staggered Container Orchestration
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.1,
      },
    },
  };

  // Smooth Fade-In and Slide-Up Entrance
  const slideUpFadeVariants = {
    hidden: { opacity: 0, y: 32 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.75,
        ease: [0.16, 1, 0.3, 1], // Natural institutional spring-like deceleration
      },
    },
  };

  // Image & Visual Frame Entrance
  const visualVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 36 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.2,
      },
    },
  };

  return (
    <section className="relative min-h-[420px] lg:min-h-[460px] bg-[#0A1324] overflow-hidden flex items-center pt-16 pb-10 lg:pt-18 lg:pb-12 select-none">
      {/* Background Water/Laboratory Photography with Deep Subtle Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={siteMedia.downloadSampling || siteMedia.waterTestingPan}
          alt="Water Quality Laboratory"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-102"
        />
        {/* Deep Multi-Layer Gradients for Institutional Contrast & Legibility */}
        <div
          className={`absolute inset-0 ${
            dir === 'rtl' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'
          } from-[#0A1324] via-[#0A1324]/90 to-[#102A43]/75`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1324] via-transparent to-[#0A1324]/70" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Text Content Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 xl:col-span-7"
          >
            {/* Institutional Subtitle / Badge */}
            <motion.div variants={slideUpFadeVariants} className="inline-flex items-center gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 text-blue-200 text-xs font-medium border border-blue-400/25 backdrop-blur-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-300" />
                </span>
                <Droplets className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span className="tracking-wide">{t('hero.badge')}</span>
              </div>
            </motion.div>

            {/* Main Title - Refined, Proportional Institutional Typography */}
            <motion.h1
              variants={slideUpFadeVariants}
              className="text-xl sm:text-2xl lg:text-[28px] font-semibold text-white leading-snug tracking-tight mb-2 drop-shadow-xs"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Subtitle / Core Message - Clear, Controlled Hierarchy */}
            <motion.div variants={slideUpFadeVariants} className="mb-2.5">
              <p className="text-sm sm:text-base font-normal text-blue-100/90 leading-snug">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            {/* Institutional Description - Enhanced Legibility */}
            <motion.p
              variants={slideUpFadeVariants}
              className="text-xs sm:text-sm text-slate-300/90 leading-relaxed max-w-xl mb-6 font-normal"
            >
              {t('hero.desc')}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              variants={slideUpFadeVariants}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all whitespace-nowrap"
                >
                  <UserPlus className="w-4 h-4 text-white shrink-0" />
                  <span className="leading-snug">{t('hero.register')}</span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Link
                  to="/laboratories"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-semibold text-sm backdrop-blur-md border border-white/25 transition-all shadow-xs hover:shadow-md whitespace-nowrap"
                >
                  <span className="leading-snug">{t('hero.explore')}</span>
                  <Arrow
                    className={`w-4 h-4 text-blue-200 transition-transform shrink-0 ${
                      dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                    }`}
                  />
                </Link>
              </motion.div>
            </motion.div>

            {/* Quality & Trust Markers Bar */}
            <motion.div
              variants={slideUpFadeVariants}
              className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              <div className="flex items-center gap-2 text-slate-300 text-xs font-normal">
                <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/20">
                  <ShieldCheck className="w-3 h-3 text-blue-300" />
                </div>
                <span>{t('hero.metric.iso')}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 text-xs font-normal">
                <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/20">
                  <Activity className="w-3 h-3 text-blue-300" />
                </div>
                <span>{t('hero.metric.monitoring')}</span>
              </div>

              <div className="flex items-center gap-2 text-slate-300 text-xs font-normal col-span-2 sm:col-span-1">
                <div className="w-5 h-5 rounded-md bg-blue-500/20 flex items-center justify-center shrink-0 border border-blue-400/20">
                  <Layers className="w-3 h-3 text-blue-300" />
                </div>
                <span>{t('hero.metric.regions')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Showcase Automated Carousel Column with Framer Motion */}
          <motion.div
            variants={visualVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-5 xl:col-span-5 relative"
          >
            <HeroFacilityCarousel />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
