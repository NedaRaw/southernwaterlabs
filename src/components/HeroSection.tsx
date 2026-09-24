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

  // Subtle Ambient Water Glow
  const pulseGlow = {
    animate: {
      scale: [1, 1.06, 1],
      opacity: [0.35, 0.55, 0.35],
      transition: {
        duration: 6.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <section className="relative min-h-[660px] lg:min-h-[740px] bg-navy-950 overflow-hidden flex items-center pt-24 pb-16 lg:py-28 select-none">
      {/* Background Water/Laboratory Photography with Deep Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src={siteMedia.heroBackground}
          alt="Water Quality Laboratory"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />
        {/* Deep Multi-Layer Gradients for Institutional Contrast */}
        <div
          className={`absolute inset-0 ${
            dir === 'rtl' ? 'bg-gradient-to-l' : 'bg-gradient-to-r'
          } from-navy-950 via-navy-950/95 to-navy-900/80`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-navy-950/70" />
      </div>

      {/* Ambient Scientific Light Glows */}
      <motion.div
        variants={pulseGlow}
        animate="animate"
        className="absolute top-1/4 start-1/4 w-[460px] h-[460px] rounded-full bg-water-500/15 blur-[130px] pointer-events-none"
      />
      <motion.div
        variants={pulseGlow}
        animate="animate"
        className="absolute bottom-10 end-10 w-[520px] h-[520px] rounded-full bg-aqua-500/15 blur-[150px] pointer-events-none"
      />

      {/* Decorative Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Text Content Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 xl:col-span-7"
          >
            {/* Institutional Badge */}
            <motion.div variants={slideUpFadeVariants} className="inline-flex items-center gap-2 mb-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-water-500/15 text-water-200 text-xs sm:text-sm font-semibold border border-water-400/30 backdrop-blur-md shadow-inner">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-aqua-300" />
                </span>
                <Droplets className="w-4 h-4 text-aqua-300 shrink-0" />
                <span className="tracking-wide">{t('hero.badge')}</span>
              </div>
            </motion.div>

            {/* Main Title - Enhanced Typography */}
            <motion.h1
              variants={slideUpFadeVariants}
              className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white leading-[1.18] tracking-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
            >
              {t('hero.title')}
            </motion.h1>

            {/* Subtitle / Core Message - Enhanced Gradient Typography */}
            <motion.div variants={slideUpFadeVariants} className="mb-6">
              <p className="text-xl sm:text-2xl md:text-[26px] font-extrabold bg-gradient-to-r from-water-300 via-aqua-200 to-white bg-clip-text text-transparent leading-snug">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            {/* Institutional Description - Enhanced Legibility */}
            <motion.p
              variants={slideUpFadeVariants}
              className="text-base sm:text-lg text-slate-200/90 leading-relaxed max-w-2xl mb-8 font-normal"
            >
              {t('hero.desc')}
            </motion.p>

            {/* Action Buttons with Framer Motion hover & tap states */}
            <motion.div
              variants={slideUpFadeVariants}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Link
                  to="/register"
                  className="relative group inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-water-500 via-water-600 to-navy-800 text-white font-bold text-sm sm:text-base shadow-xl shadow-water-600/30 hover:shadow-water-500/50 transition-all border border-water-300/40 overflow-hidden"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
                  <UserPlus className="w-5 h-5 text-aqua-200" />
                  <span>{t('hero.register')}</span>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <Link
                  to="/laboratories"
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/25 transition-all hover:border-water-400/50"
                >
                  <span>{t('hero.explore')}</span>
                  <Arrow
                    className={`w-4 h-4 text-water-300 transition-transform ${
                      dir === 'rtl' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'
                    }`}
                  />
                </Link>
              </motion.div>
            </motion.div>

            {/* Quality & Trust Markers Bar */}
            <motion.div
              variants={slideUpFadeVariants}
              className="pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-3 gap-4"
            >
              <div className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-medium">
                <div className="w-6 h-6 rounded-lg bg-water-500/20 flex items-center justify-center shrink-0 border border-water-400/30">
                  <ShieldCheck className="w-3.5 h-3.5 text-aqua-300" />
                </div>
                <span>{t('hero.metric.iso')}</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-medium">
                <div className="w-6 h-6 rounded-lg bg-water-500/20 flex items-center justify-center shrink-0 border border-water-400/30">
                  <Activity className="w-3.5 h-3.5 text-aqua-300" />
                </div>
                <span>{t('hero.metric.monitoring')}</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm font-medium col-span-2 sm:col-span-1">
                <div className="w-6 h-6 rounded-lg bg-water-500/20 flex items-center justify-center shrink-0 border border-water-400/30">
                  <Layers className="w-3.5 h-3.5 text-aqua-300" />
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
