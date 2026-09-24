import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, MapPin, ChevronLeft, ChevronRight, Pause, Play,
  Sparkles, CheckCircle2, ShieldCheck, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import { siteMedia } from '@/data/siteMedia';

export interface FacilitySlide {
  id: string;
  name: { ar: string; en: string; fr: string };
  region: { ar: string; en: string; fr: string };
  badge: { ar: string; en: string; fr: string };
  description: { ar: string; en: string; fr: string };
  stats: { label: { ar: string; en: string; fr: string }; val: string };
  image: string;
  link: string;
}

export const facilitySlides: FacilitySlide[] = [
  {
    id: 'asir-central',
    name: {
      ar: 'مختبر عسير المركزي',
      en: 'Asir Central Laboratory',
      fr: 'Laboratoire Central d\'Asir',
    },
    region: {
      ar: 'أبها - منطقة عسير • المملكة العربية السعودية',
      en: 'Abha - Asir Region • KSA',
      fr: 'Abha - Région d\'Asir • Arabie Saoudite',
    },
    badge: {
      ar: 'المختبر المرجعي الإقليمي',
      en: 'Regional Reference Laboratory',
      fr: 'Laboratoire Régional de Référence',
    },
    description: {
      ar: 'أحدث التجهيزات الطيفية والكروماتوغرافية لفحص مياه الشرب ومحطات التنقية والسدود.',
      en: 'Advanced spectroscopic and chromatographic facilities for potable water and reservoir quality assurance.',
      fr: 'Équipements spectrométriques avancés pour le contrôle de l\'eau potable et des barrages.',
    },
    stats: {
      label: { ar: 'دقة التحليل القياسي', en: 'Analytical Precision', fr: 'Précision d\'Analyse' },
      val: '99.98%',
    },
    image: siteMedia.facilities.asir,
    link: '/laboratories/asir',
  },
  {
    id: 'najran-central',
    name: {
      ar: 'مختبر نجران المركزي',
      en: 'Najran Central Laboratory',
      fr: 'Laboratoire Central de Najran',
    },
    region: {
      ar: 'نجران • المملكة العربية السعودية',
      en: 'Najran • KSA',
      fr: 'Najran • Arabie Saoudite',
    },
    badge: {
      ar: 'المنظومة المخبرية المعتمدة',
      en: 'Accredited Testing Unit',
      fr: 'Unité d\'Analyse Accréditée',
    },
    description: {
      ar: 'وحدة متكاملة للتحاليل الكيميائية والميكروبيولوجية لمياه الآبار وشبكات التوزيع العامة.',
      en: 'Integrated chemical and microbiological testing facilities for well water and municipal distribution networks.',
      fr: 'Dispositif complet de tests chimiques et microbiologiques pour les forages et réseaux.',
    },
    stats: {
      label: { ar: 'مطابقة المعايير SASO', en: 'SASO Compliance', fr: 'Conformité SASO' },
      val: '100%',
    },
    image: siteMedia.facilities.najran,
    link: '/laboratories/najran',
  },
  {
    id: 'jazan-central',
    name: {
      ar: 'مختبر جازان المركزي',
      en: 'Jazan Central Laboratory',
      fr: 'Laboratoire Central de Jazan',
    },
    region: {
      ar: 'جازان • المملكة العربية السعودية',
      en: 'Jazan • KSA',
      fr: 'Jazan • Arabie Saoudite',
    },
    badge: {
      ar: 'مراقبة جودة مياه التحلية والسدود',
      en: 'Desalination & Dams Control',
      fr: 'Surveillance Eau Dessalée & Barrages',
    },
    description: {
      ar: 'رقابة فورية ومستمرة على جودة مياه محطات التحلية الساحلية ومشاريع الإمداد الكبرى.',
      en: 'Real-time surveillance of coastal desalination plants and strategic regional transmission lines.',
      fr: 'Surveillance en temps réel des usines de dessalement et des adductions majeures.',
    },
    stats: {
      label: { ar: 'الفحوصات اليومية', en: 'Daily Testing Capacity', fr: 'Capacité Quotidienne' },
      val: '+350 عينة',
    },
    image: siteMedia.facilities.jazan,
    link: '/laboratories/jazan',
  },
  {
    id: 'baha-central',
    name: {
      ar: 'مختبر الباحة المركزي',
      en: 'Al-Baha Central Laboratory',
      fr: 'Laboratoire Central d\'Al-Baha',
    },
    region: {
      ar: 'الباحة • المملكة العربية السعودية',
      en: 'Al-Baha • KSA',
      fr: 'Al-Baha • Arabie Saoudite',
    },
    badge: {
      ar: 'مختبر الجودة والسلامة البيئية',
      en: 'Environmental Quality Lab',
      fr: 'Laboratoire Qualité & Environnement',
    },
    description: {
      ar: 'مراقبة دقيقة للأحواض المائية ومصادر المياه الجوفية السطحية والعميقة بالمرتفعات.',
      en: 'Precision monitoring of surface reservoirs, highland aquifers, and mountainous catchment basins.',
      fr: 'Contrôle de haute précision des bassins versants et aquifères de montagne.',
    },
    stats: {
      label: { ar: 'تغطية الفروع الميدانية', en: 'Field Branch Coverage', fr: 'Couverture Territoriale' },
      val: '5 فروع',
    },
    image: siteMedia.facilities.baha,
    link: '/laboratories/baha',
  },
];

const AUTOPLAY_INTERVAL = 5500; // 5.5 seconds per slide

export default function HeroFacilityCarousel() {
  const { lang, dir } = useLang();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  const PrevIcon = dir === 'rtl' ? ChevronRight : ChevronLeft;
  const NextIcon = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  const total = facilitySlides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
    setProgress(0);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
    setProgress(0);
  }, [total]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setProgress(0);
  };

  // Smooth progress bar update & autoplay control
  useEffect(() => {
    if (!isPlaying || isHovered) return;

    const intervalTime = 50;
    const step = (intervalTime / AUTOPLAY_INTERVAL) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, isHovered, nextSlide]);

  const currentSlide = facilitySlides[currentIndex];

  return (
    <div
      className="relative mx-auto max-w-md lg:max-w-none select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Southern Region Water Laboratories Showcase Carousel"
    >
      {/* Outer Atmospheric Aura Glow */}
      <div className="absolute -inset-3 rounded-3xl bg-gradient-to-tr from-cyan-500/25 via-teal-400/20 to-sky-600/30 blur-2xl opacity-70 pointer-events-none" />

      {/* Main Glassmorphic Showcase Container */}
      <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-navy-900/90 backdrop-blur-xl shadow-2xl transition-all duration-300">
        
        {/* Top Header Bar inside the frame */}
        <div className="px-4 sm:px-5 py-3 bg-navy-950/80 border-b border-white/10 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold text-white tracking-wide">
              {lang === 'ar' ? 'منشآت ومختبرات القطاع الجنوبي' : 'Southern Sector Facilities'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-cyan-300 font-bold">
              0{currentIndex + 1} / 0{total}
            </span>

            {/* Play/Pause Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors ms-1"
              title={isPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
              aria-label={isPlaying ? 'Pause auto-slide' : 'Resume auto-slide'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Carousel Visual Frame with Cross-Fade Transitions */}
        <div className="relative h-72 sm:h-80 md:h-96 w-full overflow-hidden bg-navy-950">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentSlide.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <img
                src={currentSlide.image}
                alt={currentSlide.name[lang] || currentSlide.name.ar}
                className="w-full h-full object-cover object-center"
              />

              {/* Multi-tier gradient overlay for readable text */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-navy-950/60 via-transparent to-navy-950/60" />

              {/* Top Floating Badge */}
              <div className="absolute top-4 start-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900/90 backdrop-blur-md border border-cyan-400/30 text-white text-xs font-bold shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                  {currentSlide.badge[lang] || currentSlide.badge.ar}
                </span>
              </div>

              {/* Bottom In-Image Information Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-5 pt-8 bg-gradient-to-t from-navy-950 via-navy-950/90 to-transparent">
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2 className="w-4 h-4 text-cyan-300 shrink-0" />
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {currentSlide.name[lang] || currentSlide.name.ar}
                  </h3>
                </div>

                <div className="flex items-center gap-1.5 text-slate-300 text-xs mb-2">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">{currentSlide.region[lang] || currentSlide.region.ar}</span>
                </div>

                <p className="text-xs text-slate-200/90 line-clamp-2 leading-relaxed mb-3 font-normal">
                  {currentSlide.description[lang] || currentSlide.description.ar}
                </p>

                {/* Micro Action Link to Laboratory Profile */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400">
                      {currentSlide.stats.label[lang] || currentSlide.stats.label.ar}:
                    </span>
                    <span className="text-xs font-black text-cyan-300">
                      {currentSlide.stats.val}
                    </span>
                  </div>

                  <Link
                    to={currentSlide.link}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/15 hover:bg-cyan-600/80 text-white text-xs font-bold transition-all border border-white/20 hover:border-cyan-400/40"
                  >
                    <span>{lang === 'ar' ? 'استعراض المركز' : 'View Center'}</span>
                    <Arrow className="w-3 h-3 text-cyan-200" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Prev/Next Navigation Controls */}
          <div className="absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none z-20">
            <button
              onClick={prevSlide}
              className="pointer-events-auto p-2 rounded-xl bg-navy-950/70 hover:bg-cyan-700/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg"
              aria-label="Previous laboratory"
            >
              <PrevIcon className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="pointer-events-auto p-2 rounded-xl bg-navy-950/70 hover:bg-cyan-700/80 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-110 shadow-lg"
              aria-label="Next laboratory"
            >
              <NextIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Slide Indicators & Progress Bar */}
        <div className="px-4 sm:px-5 py-3.5 bg-gradient-to-b from-navy-900/95 to-navy-950 border-t border-white/10 flex flex-col gap-2.5">
          {/* Linear Progress Bar for Active Slide */}
          <div className="w-full bg-navy-800 rounded-full h-1 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>

          {/* Slide Selection Dots */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {facilitySlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => goToSlide(idx)}
                  className={`relative rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 h-2 bg-gradient-to-r from-cyan-400 to-teal-400 shadow-sm shadow-cyan-400/50'
                      : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>{lang === 'ar' ? 'اعتماد مخبري موحد' : 'Unified Accreditation'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Institutional Seal 1 */}
      <div
        className={`absolute -top-5 ${
          dir === 'rtl' ? '-left-3 sm:-left-5' : '-right-3 sm:-right-5'
        } z-30 hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-xl bg-navy-900/90 backdrop-blur-xl border border-cyan-400/40 shadow-xl`}
      >
        <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0 border border-cyan-400/30">
          <CheckCircle2 className="w-4 h-4 text-cyan-300" />
        </div>
        <span className="text-[11px] font-bold text-white whitespace-nowrap">
          {lang === 'ar' ? 'فحوصات مياه معتمدة' : 'Accredited Water Testing'}
        </span>
      </div>

      {/* Floating Institutional Seal 2 */}
      <div
        className={`absolute -bottom-5 ${
          dir === 'rtl' ? '-right-3 sm:-right-5' : '-left-3 sm:-left-5'
        } z-30 hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-navy-900/90 backdrop-blur-xl border border-teal-400/40 shadow-xl`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
        <span className="text-[11px] font-bold text-slate-200 whitespace-nowrap">
          {lang === 'ar' ? 'مراقبة جودة على مدار الساعة' : '24/7 Quality Surveillance'}
        </span>
      </div>
    </div>
  );
}
