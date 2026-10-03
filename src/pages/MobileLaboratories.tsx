import { useState, useEffect, useCallback } from 'react';

import { Link } from 'react-router-dom';

import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Droplets,
  FlaskConical,
  Award,
  ChevronRight,
  UserPlus,
  MessageSquare,
  Building2,
  Sparkles,
  Info,
  Compass,
  FileCheck,
  ArrowDown,
  ArrowUp,
} from 'lucide-react';

import { useLang } from '@/lib/i18n';

import Breadcrumb from '@/components/Breadcrumb';

import { ALL_MOBILE_UNITS } from '@/data/mobileUnits';
import { mobileLaboratoriesData } from '@/data/mobileLaboratoriesGallery';
import { MobileLabAlbum } from '@/components/MobileLabAlbum';

/* -------------------------------------------------------------------------- */
/* Operational Workflow Steps                                                 */
/* -------------------------------------------------------------------------- */

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: Compass,
    title: {
      ar: 'تخطيط المهمة وتحديد المسار',
      en: 'Mission Planning & Dispatch',
      fr: 'Planification de la Mission',
    },
    desc: {
      ar: 'جدولة البلاغ أو المسح الدوري عبر نظام إدارة المختبرات وتحديد النقاط الجغرافية وخطة التحليل.',
      en: 'Assignment scheduling through LIMS, geospatial route mapping, and analytical parameter definition.',
      fr: 'Planification via le système LIMS, cartographie de l\'itinéraire et paramétrage des analyses requises.',
    },
  },
  {
    step: '02',
    icon: Truck,
    title: {
      ar: 'الانتقال الميداني والتمركز السريع',
      en: 'Rapid Field Deployment',
      fr: 'Déploiement Rapide sur le Terrain',
    },
    desc: {
      ar: 'انتقال الوحدة المتنقلة بكامل تجهيزاتها وطاقمها المتخصص إلى موقع المصدر أو المحطة أو الشبكة.',
      en: 'Immediate mobilization of the self-contained mobile lab and certified technical crew to the water site.',
      fr: 'Mobilisation immédiate de l\'unité autonome et de son équipage certifié sur le site d\'intervention.',
    },
  },
  {
    step: '03',
    icon: FlaskConical,
    title: {
      ar: 'سحب العينات وإجراء الفحوصات الفورية',
      en: 'Sampling & On-Site Testing',
      fr: 'Échantillonnage & Analyses Immédiates',
    },
    desc: {
      ar: 'أخذ العينات المعقمة طبقاً لـ ISO 5667 وإجراء القياسات الفيزيوكيميائية والميكروبيولوجية على الفور.',
      en: 'Sterile ISO 5667 sample collection and instant execution of physicochemical and bacterial tests.',
      fr: 'Prélèvement stérile conforme ISO 5667 et exécution instantanée des examens physico-chimiques et bactériologiques.',
    },
  },
  {
    step: '04',
    icon: FileCheck,
    title: {
      ar: 'إصدار التقارير المعتمدة وضبط الجودة',
      en: 'Certified Reporting & QA Sync',
      fr: 'Rapport Certifié & Synchronisation',
    },
    desc: {
      ar: 'توثيق النتائج رقمياً وإصدار مؤشر المطابقة الفوري وربطه بقاعدة بيانات المختبرات المركزية.',
      en: 'Digital result certification, immediate conformity verification, and telemetry sync with central labs.',
      fr: 'Certification numérique immédiate de conformité et synchronisation directe avec la base centrale.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Mobile Services Catalog                                                    */
/* -------------------------------------------------------------------------- */

const SERVICES_CATALOG = [
  {
    icon: Activity,
    title: { ar: 'التحاليل السريعة لمياه الشرب', en: 'Rapid Drinking-Water Potability Testing', fr: 'Analyses Rapides de Potabilité' },
    desc: {
      ar: 'إجراء الفحوصات الفورية لمصادر المياه والشبكات في دقائق معدودة وإصدار مؤشرات المطابقة للمواصفات السعودية SASO.',
      en: 'Instantaneous testing of water sources and municipal grids with rapid compliance indicators under SASO standards.',
      fr: 'Analyses immédiates des sources et réseaux en quelques minutes avec conformité aux normes saoudiennes SASO.',
    },
  },
  {
    icon: Droplets,
    title: { ar: 'سحب العينات الميدانية المعقمة', en: 'Certified Sterile Field Water Sampling', fr: 'Prélèvement d\'Échantillons Stériles' },
    desc: {
      ar: 'سحب العينات طبقاً لمعايير ISO 5667 الدولية مع الحفظ بالتبريد الآمن وتوثيق سلسلة الحيازة الرقمية المشفرة.',
      en: 'Standardized sample collection under ISO 5667 with certified cold-chain preservation and digital custody tracking.',
      fr: 'Prélèvements conformes à l\'ISO 5667 avec maintien rigoureux de la chaîne du froid et traçabilité numérique.',
    },
  },
  {
    icon: FlaskConical,
    title: { ar: 'القياسات الفيزيائية والكيميائية الفورية', en: 'In-Situ Physicochemical Analysis', fr: 'Mesures Physico-Chimiques In Situ' },
    desc: {
      ar: 'تحديد مستويات الرقم الهيدروجيني (pH)، العكارة (NTU)، الأملاح الذائبة (TDS)، التوصيلية الكهربائية، والكلور المتبقي.',
      en: 'Direct field quantification of pH, turbidity (NTU), Total Dissolved Solids, conductivity, and residual chlorine.',
      fr: 'Mesures en direct du pH, turbidité (NTU), solides dissous (TDS), conductivité et chlore résiduel.',
    },
  },
  {
    icon: ShieldCheck,
    title: { ar: 'الكشف الميكروبيولوجي السريع', en: 'Rapid Field Microbiological Screening', fr: 'Dépistage Microbiologique Rapide' },
    desc: {
      ar: 'الكشف الميداني الأولي عن البكتيريا القولونية والإشريكية القولونية باستخدام تقنيات الحضانة المدمجة والأشعة فوق البنفسجية.',
      en: 'Onboard screening for total coliforms and E. coli utilizing portable incubators and UV fluorescence confirmation.',
      fr: 'Recherche in situ des coliformes totaux et d\'E. coli par incubateur embarqué et lecture sous rayonnement UV.',
    },
  },
  {
    icon: Award,
    title: { ar: 'مراقبة السدود والخزانات التجميعية', en: 'Surface Dams & Strategic Storage Auditing', fr: 'Surveillance des Barrages et Réservoirs' },
    desc: {
      ar: 'إجراء المسوحات الدورية لخزانات التوزيع الاستراتيجية ومحطات الضخ وخطوط النقل للتأكد من سلامة المياه المعالجة.',
      en: 'Routine audits of strategic storage reservoirs, pumping stations, and bulk transmission lines.',
      fr: 'Audits programmés des réservoirs de distribution, stations de pompage et conduites maîtresses.',
    },
  },
  {
    icon: Building2,
    title: { ar: 'دعم الطوارئ والمواسم السياحية', en: 'Emergency & Peak Demand Field Support', fr: 'Support d\'Urgence et Périodes de Pointe' },
    desc: {
      ar: 'التدخل السريع أثناء حالات الأمطار ومواسم السيول والذروة السياحية بمرتفعات القطاع الجنوبي لدعم أمن الإمدادات.',
      en: 'Rapid deployment during rainfall seasons, emergency incidents, and tourist peaks across the southern highlands.',
      fr: 'Intervention d\'urgence lors des épisodes pluvieux et pics touristiques sur les hauteurs du Secteur Sud.',
    },
  },
];

/* -------------------------------------------------------------------------- */
/* Regional Filter Definitions                                                */
/* -------------------------------------------------------------------------- */

const REGION_FILTER_TABS = [
  { key: 'all' as const, count: 4, label: { ar: 'كافة المختبرات المركزية (4)', en: 'All Central Labs (4)', fr: 'Tous les Labos Centraux (4)' } },
  { key: 'asir' as const, count: 1, label: { ar: 'المختبر المركزي بعسير', en: 'Asir Central', fr: 'Asir Central' } },
  { key: 'jazan' as const, count: 1, label: { ar: 'المختبر المركزي بجازان', en: 'Jazan Central', fr: 'Jazan Central' } },
  { key: 'baha' as const, count: 1, label: { ar: 'المختبر المركزي بالباحة', en: 'Al-Baha Central', fr: 'Al-Baha Central' } },
  { key: 'najran' as const, count: 1, label: { ar: 'المختبر المركزي بنجران', en: 'Najran Central', fr: 'Najran Central' } },
];

const LAB_SECTIONS_KEYS: ('asir' | 'jazan' | 'alBaha' | 'najran')[] = ['asir', 'jazan', 'alBaha', 'najran'];

/* -------------------------------------------------------------------------- */
/* Component Implementation                                                   */
/* -------------------------------------------------------------------------- */
export default function MobileLaboratories() {
  const { lang, dir, t } = useLang();
  const [fleetRegionFilter, setFleetRegionFilter] = useState<'all' | 'asir' | 'baha' | 'jazan' | 'najran'>('all');
  const [detailRegionFilter, setDetailRegionFilter] = useState<'all' | 'asir' | 'baha' | 'jazan' | 'najran'>('all');

  const scrollToSection = useCallback((targetId: string) => {
    // Resolve branch anchor aliases to their owning Central Laboratory:
    let resolvedId = targetId;
    if (targetId === 'mobile-sharurah') resolvedId = 'mobile-najran';
    else if (targetId === 'mobile-bisha' || targetId === 'mobile-muhayil') resolvedId = 'mobile-asir';
    else if (targetId === 'mobile-qalwa') resolvedId = 'mobile-baha';
    else if (targetId === 'mobile-al-darb' || targetId === 'mobile-farasan') resolvedId = 'mobile-jazan';

    // If the target is a unit in ALL_MOBILE_UNITS, ensure it is visible if a filter is active
    const unit = ALL_MOBILE_UNITS.find(
      (u) =>
        u.anchorId === resolvedId ||
        u.anchorId === targetId ||
        u.id === targetId ||
        u.aliasAnchorIds?.includes(targetId) ||
        `mobile-${u.parentRegionId}` === resolvedId
    );
    if (unit && detailRegionFilter !== 'all' && detailRegionFilter !== unit.parentRegionId) {
      setDetailRegionFilter('all');
    }

    setTimeout(() => {
      const el = document.getElementById(resolvedId) || document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('ring-4', 'ring-blue-500/70', 'ring-offset-4', 'dark:ring-offset-slate-900', 'transition-all', 'duration-500');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-blue-500/70', 'ring-offset-4', 'dark:ring-offset-slate-900');
        }, 2500);
        try {
          window.history.replaceState(null, '', `#${resolvedId}`);
        } catch {
          // Safe fallback in sandboxed frame
        }
      }
    }, 60);
  }, [detailRegionFilter]);

  useEffect(() => {
    if (window.location.hash) {
      const rawTarget = window.location.hash.replace('#', '');
      let resolvedId = rawTarget;
      if (rawTarget === 'mobile-sharurah') resolvedId = 'mobile-najran';
      else if (rawTarget === 'mobile-bisha' || rawTarget === 'mobile-muhayil') resolvedId = 'mobile-asir';
      else if (rawTarget === 'mobile-qalwa') resolvedId = 'mobile-baha';
      else if (rawTarget === 'mobile-al-darb' || rawTarget === 'mobile-farasan') resolvedId = 'mobile-jazan';

      const timer = setTimeout(() => {
        const el = document.getElementById(resolvedId) || document.getElementById(rawTarget);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          el.classList.add('ring-4', 'ring-blue-500/70', 'ring-offset-4', 'dark:ring-offset-slate-900', 'transition-all', 'duration-500');
          setTimeout(() => {
            el.classList.remove('ring-4', 'ring-blue-500/70', 'ring-offset-4', 'dark:ring-offset-slate-900');
          }, 2500);
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <Breadcrumb
          items={[
            {
              label:
                lang === 'ar'
                  ? 'المختبرات المتنقلة'
                  : lang === 'fr'
                    ? 'Laboratoires Mobiles'
                    : 'Mobile Laboratories',
            },
          ]}
        />

        {/* ============================================================
            1. HERO BANNER
        ============================================================= */}
        <section className="mt-6 mb-16 relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-slate-800 text-white shadow-xl p-8 sm:p-12">
          <div className="absolute top-0 end-0 -mt-16 -me-16 w-80 h-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 start-0 -mb-16 -ms-16 w-80 h-80 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/30 border border-blue-400/50 text-white text-xs font-bold mb-4 backdrop-blur-md shadow-md">
              <Truck className="w-4 h-4 text-blue-300" />
              <span>
                {lang === 'ar'
                  ? 'الوحدات المتنقلة للمختبرات المركزية لمياه الشرب والخدمات البيئية بالقطاع الجنوبي'
                  : lang === 'fr'
                    ? 'Unités Mobiles des Laboratoires Centraux d’Eau Potable et de Services Environnementaux'
                    : 'Mobile Laboratory Units of the Central Laboratories for Drinking Water and Environmental Services'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white mb-4">
              {lang === 'ar'
                ? 'الوحدات المتنقلة للمختبرات المركزية لمياه الشرب والخدمات البيئية بالقطاع الجنوبي'
                : lang === 'fr'
                  ? 'Unités Mobiles des Laboratoires Centraux d’Eau Potable et de Services Environnementaux'
                  : 'Mobile Laboratory Units of Central Laboratories for Drinking Water & Environmental Services'}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8 max-w-3xl">
              {lang === 'ar'
                ? 'منظومة متكاملة من وحدات الفحص الميداني المتنقلة التابعة للمختبرات المركزية المجهزة بأحدث تقنيات التحليل الفوري لمياه الشرب ومصادر الإمداد، للاستجابة السريعة وتغطية مختلف التضاريس الجبلية والساحلية والصحراوية بمناطق عسير، جازان، الباحة، ونجران.'
                : lang === 'fr'
                  ? 'Une flotte spécialisée d’unités mobiles rattachées aux laboratoires centraux, équipées des technologies de pointe pour le contrôle direct de l’eau potable et des services environnementaux en Asir, Jazan, Al-Baha et Najran.'
                  : 'An integrated fleet of high-readiness mobile water testing units engineered for rapid field deployment and real-time potability assurance across diverse highland, coastal, and desert terrains of Asir, Jazan, Al-Baha, and Najran.'}
            </p>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-white">04</div>
                <div className="text-xs text-slate-300 font-bold mt-1">
                  {lang === 'ar' ? 'مختبرات مركزية مجهزة' : lang === 'fr' ? 'Labos Centraux Équipés' : 'Central Mobile Units'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">100%</div>
                <div className="text-xs text-slate-300 font-bold mt-1">
                  {lang === 'ar' ? 'جاهزية وتدخل سريع' : lang === 'fr' ? 'Disponibilité Rapide' : 'Field Readiness'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">SASO</div>
                <div className="text-xs text-slate-300 font-bold mt-1">
                  {lang === 'ar' ? 'معايير جودة معتمدة' : lang === 'fr' ? 'Normes Certifiées' : 'Certified Standards'}
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">24/7</div>
                <div className="text-xs text-slate-300 font-bold mt-1">
                  {lang === 'ar' ? 'دعم الطوارئ والمواسم' : lang === 'fr' ? 'Intervention Continue' : 'Emergency & Seasonal'}
                </div>
              </div>
            </div>

            {/* Quick Interactive Jump Navigation */}
            <div className="mt-8 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-white font-extrabold mb-3">
                <ArrowDown className="w-3.5 h-3.5 text-blue-400 animate-bounce" />
                <span>
                  {lang === 'ar'
                    ? 'الانتقال المباشر للمختبرات المركزية وألبومات الصور (Smooth Scroll):'
                    : lang === 'fr'
                      ? 'Accès direct aux laboratoires et albums photos (Défilement fluide) :'
                      : 'Direct Smooth Scroll to Central Laboratory Albums:'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'mobile-asir', label: { ar: 'المختبر المركزي بعسير (وفروع بيشة ومحايل)', en: 'Asir Central (Bisha & Muhayil)', fr: 'Asir Central (Bisha & Muhayil)' } },
                  { id: 'mobile-jazan', label: { ar: 'المختبر المركزي بجازان (والدرب وفرسان)', en: 'Jazan Central (Al-Darb & Farasan)', fr: 'Jazan Central (Al-Darb & Farasan)' } },
                  { id: 'mobile-baha', label: { ar: 'المختبر المركزي بالباحة (وقلوة وتهامة)', en: 'Al-Baha Central (Qalwah)', fr: 'Al-Baha Central (Qalwah)' } },
                  { id: 'mobile-najran', label: { ar: 'المختبر المركزي بنجران (وشرورة والوديعة)', en: 'Najran Central (Sharurah & Wadiah)', fr: 'Najran Central (Sharurah & Wadiah)' } },
                ].map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => scrollToSection(unit.id)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-blue-600 text-white text-xs font-bold transition-all border border-white/15 hover:border-blue-400 active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{unit.label[lang] || unit.label.en}</span>
                    <ArrowDown className="w-3 h-3 text-blue-300" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            2. REGIONAL MOBILE LABORATORIES (EXECUTIVE FLEET DIRECTORY)
        ============================================================= */}
        <section id="fleet-overview" className="mb-16 scroll-mt-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar'
                    ? 'وحدات المختبرات المركزية المتنقلة'
                    : lang === 'fr'
                      ? 'Unités Mobiles des Labos Centraux'
                      : 'Central Labs Mobile Fleet'}
                </span>
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'أسطول المختبرات المتنقلة التابعة للمختبرات المركزية'
                  : lang === 'fr'
                    ? 'Flotte des Unités Mobiles des Laboratoires Centraux'
                    : 'Central Laboratories Mobile Fleet'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                {lang === 'ar'
                  ? 'تتبع الوحدات المتنقلة للمختبرات المركزية الأربعة وتنتقل لتغطية كافة المحافظات والفروع التابعة بكل منطقة.'
                  : lang === 'fr'
                    ? 'Les unités mobiles appartiennent aux 4 laboratoires centraux et se déploient pour couvrir toutes les branches et gouvernorats.'
                    : 'The mobile testing units belong to the 4 Central Laboratories, deploying across all surrounding branches and sectors.'}
              </p>
            </div>

            {/* Region Filter Switcher */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shrink-0">
              {REGION_FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setFleetRegionFilter(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    fleetRegionFilter === tab.key
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{tab.label[lang] || tab.label.en}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {ALL_MOBILE_UNITS.filter(
              (lab) => fleetRegionFilter === 'all' || lab.parentRegionId === fleetRegionFilter
            ).map((lab) => (
              <div
                key={lab.anchorId}
                onClick={() => scrollToSection(lab.anchorId)}
                className="group rounded-2xl bg-white dark:bg-[#161f31] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Compact Clickable Image with Smooth Scroll Hover Cues */}
                  <div
                    className="relative h-44 overflow-hidden bg-slate-900"
                    title={
                      lang === 'ar'
                        ? `انقر للتمرير إلى تفاصيل ${lab.name.ar}`
                        : lang === 'fr'
                          ? `Cliquer pour défiler vers les détails de ${lab.name.fr}`
                          : `Click to smooth scroll to ${lab.name.en} details`
                    }
                  >
                    <img
                      src={lab.image}
                      alt={lab.name[lang] || lab.name.en}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                    {/* Smooth scroll indicator on hover */}
                    <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                      <span className="px-3 py-1.5 rounded-full bg-blue-600/95 text-white text-xs font-bold shadow-xl backdrop-blur-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <ArrowDown className="w-3.5 h-3.5 text-blue-200" />
                        <span>
                          {lang === 'ar'
                            ? 'انقر للتفاصيل الميدانية ↓'
                            : lang === 'fr'
                              ? 'Cliquer pour voir la fiche ↓'
                              : 'Click for detailed specs ↓'}
                        </span>
                      </span>
                    </div>

                    {/* Authenticity & Region Badge */}
                    <div className="absolute top-2.5 start-2.5 end-2.5 flex items-center justify-between gap-1.5">
                      {lab.isRealPhoto ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/95 text-white shadow-xs border border-emerald-400/40 backdrop-blur-md">
                          <CheckCircle2 className="w-3 h-3 text-emerald-200 shrink-0" />
                          <span className="truncate max-w-[130px]">
                            {lab.realPhotoLabel?.[lang] || lab.realPhotoLabel?.en || 'Photo réelle'}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-900/90 text-amber-300 border border-amber-400/40 backdrop-blur-md shadow-xs">
                          <Info className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>
                            {lang === 'ar'
                              ? 'تصور توضيحي'
                              : lang === 'fr'
                                ? 'Illustratif'
                                : 'Illustrative'}
                          </span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/90 text-white backdrop-blur-md shadow-xs shrink-0">
                        {lab.region[lang] || lab.region.en}
                      </span>
                    </div>

                    {/* Livery Badge Inscribed On Image */}
                    <div className="absolute bottom-2 start-2 end-2 text-white">
                      <div className="p-2 rounded-xl bg-slate-950/90 backdrop-blur-md border border-white/20 shadow-md flex flex-col gap-0.5">
                        <div className="text-[10px] font-extrabold text-white truncate flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-xs" />
                          <span className="truncate">{lab.vehicleLabel.clusterAr}</span>
                        </div>
                        <div className="text-[9px] font-bold text-slate-300 truncate">
                          {lab.vehicleLabel.clusterEn}
                        </div>
                        <div className="text-[11px] font-black text-amber-300 truncate pt-0.5 border-t border-white/10 flex items-center justify-between">
                          <span>{lab.vehicleLabel.labAr}</span>
                          <span className="px-1.5 py-0.5 rounded bg-blue-600/90 text-white text-[9px] font-extrabold font-mono">
                            #{lab.anchorId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body Details (Concise, High Density) */}
                  <div className="p-3.5 space-y-2.5">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold mb-1 border border-emerald-200 dark:border-emerald-800/40">
                        {lab.centralLabBadge[lang] || lab.centralLabBadge.en}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {lab.name[lang] || lab.name.en}
                      </h3>
                    </div>

                    {/* Covered Branches Snippet */}
                    <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                      <div className="flex items-center gap-1 font-semibold text-blue-700 dark:text-blue-300 text-[10px]">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span>{lang === 'ar' ? 'الفروع والمحافظات المخدومة:' : 'Serviced Branches:'}</span>
                      </div>
                      <p className="line-clamp-2 leading-relaxed text-[10px] text-slate-500 dark:text-slate-400">
                        {lab.coveredBranches[lang] || lab.coveredBranches.en}
                      </p>
                    </div>

                    {/* Specs Preview Micro-Chips */}
                    <div className="space-y-1 pt-0.5">
                      {lab.specs.slice(0, 2).map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-600 dark:text-slate-300 truncate"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{spec[lang] || spec.en}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action (Smooth Scroll Trigger) */}
                <div className="px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400 group-hover:underline text-[11px]">
                    <span>{lang === 'ar' ? 'عرض المواصفات الكاملة' : lang === 'fr' ? 'Fiche complète' : 'View specs'}</span>
                    <ArrowDown className="w-3 h-3 transform group-hover:translate-y-0.5 transition-transform" />
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    #{lab.anchorId}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* ============================================================
            DEDICATED CENTRAL LABORATORY SECTIONS & IMAGE ALBUMS
            (ASIR -> JAZAN -> AL-BAHA -> NAJRAN)
        ============================================================= */}
        <div className="space-y-20 mb-20">
          {LAB_SECTIONS_KEYS.filter((key) => {
            if (detailRegionFilter === 'all') return true;
            if (detailRegionFilter === 'asir') return key === 'asir';
            if (detailRegionFilter === 'jazan') return key === 'jazan';
            if (detailRegionFilter === 'baha') return key === 'alBaha';
            if (detailRegionFilter === 'najran') return key === 'najran';
            return true;
          }).map((labKey) => {
            const lab = mobileLaboratoriesData[labKey];
            return (
              <section
                key={lab.id}
                id={lab.anchorId}
                className="scroll-mt-28 sm:scroll-mt-32 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#161f31] border border-slate-200/90 dark:border-slate-800 shadow-md transition-all duration-300 space-y-8"
              >
                {/* 1. Header Bar: Regional Badge + Anchor ID + Action Return */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-600 text-white shadow-xs">
                      {lab.region[lang] || lab.region.en}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                      {lang === 'ar' ? 'وحدة ميدانية معتمدة' : lang === 'fr' ? 'Unité Mobile Certifiée' : 'Certified Mobile Unit'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500">
                      #{lab.anchorId}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollToSection('fleet-overview')}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
                      title={lang === 'ar' ? 'العودة لقائمة الأسطول' : 'Back to fleet overview'}
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      <span>{lang === 'ar' ? 'قائمة الأسطول ↑' : lang === 'fr' ? 'Retour flotte ↑' : 'Fleet overview ↑'}</span>
                    </button>
                  </div>
                </div>

                {/* 2. Official Titles & Introductory Role Text */}
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                    {lab.titleArabic}
                  </h3>
                  <h4 className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                    {lang === 'fr' ? lab.titleFrench : lab.titleEnglish}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal pt-1">
                    {lab.introText[lang] || lab.introText.en}
                  </p>
                </div>

                {/* 3. Five Core Operational Role Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 pt-1">
                  {/* Field Sampling */}
                  <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-blue-900 dark:text-blue-200">
                      <Droplets className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{lang === 'ar' ? 'سحب العينات الميدانية' : lang === 'fr' ? 'Prélèvements de terrain' : 'Field Sampling'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lab.roles.sampling[lang] || lab.roles.sampling.en}
                    </p>
                  </div>

                  {/* Water Quality Monitoring */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{lang === 'ar' ? 'مراقبة جودة المياه' : lang === 'fr' ? 'Contrôle qualité' : 'Quality Monitoring'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lab.roles.monitoring[lang] || lab.roles.monitoring.en}
                    </p>
                  </div>

                  {/* Environmental Analysis */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
                      <Compass className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                      <span>{lang === 'ar' ? 'التحاليل والخدمات البيئية' : lang === 'fr' ? 'Analyses environnementales' : 'Environmental Analysis'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lab.roles.environmental[lang] || lab.roles.environmental.en}
                    </p>
                  </div>

                  {/* On-Site Measurements */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
                      <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>{lang === 'ar' ? 'القياسات والتحاليل الفورية' : lang === 'fr' ? 'Mesures instantanées' : 'On-Site Measurements'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lab.roles.measurements[lang] || lab.roles.measurements.en}
                    </p>
                  </div>

                  {/* Supporting Regional Branches */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-slate-900 dark:text-white">
                      <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>{lang === 'ar' ? 'إسناد فروع المنطقة' : lang === 'fr' ? 'Appui aux branches' : 'Branch Lab Support'}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                      {lab.roles.support[lang] || lab.roles.support.en}
                    </p>
                  </div>
                </div>

                {/* 4. THE DEDICATED COMPLETE IMAGE ALBUM */}
                <div>
                  <MobileLabAlbum
                    images={lab.images}
                    labTitle={{ ar: lab.titleArabic, en: lab.titleEnglish, fr: lab.titleFrench }}
                    regionName={lab.region}
                    albumId={lab.id}
                  />
                </div>

                {/* 5. Serviced Branches Banner */}
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 flex items-start gap-3 text-xs">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div className="leading-relaxed">
                    <span className="font-extrabold text-slate-900 dark:text-white me-2">
                      {lang === 'ar'
                        ? 'الفروع والمحافظات المخدومة التابعة للمختبر المركزي:'
                        : lang === 'fr'
                          ? 'Branches et gouvernorats couverts par le laboratoire central :'
                          : 'Branches & administrative sectors serviced by the central lab:'}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      {lab.coveredBranches[lang] || lab.coveredBranches.en}
                    </span>
                  </div>
                </div>

                {/* 6. Technical Specifications & Calibrated Equipment Micro-Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Vehicle Specs */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{lang === 'ar' ? 'المواصفات الفنية وتجهيزات المركبة:' : 'Vehicle Specifications:'}</span>
                    </h5>
                    <div className="space-y-2">
                      {lab.technicalSpecs.map((spec, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{spec[lang] || spec.en}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calibrated Equipment */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                      <FlaskConical className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>{lang === 'ar' ? 'الأجهزة والتقنيات التحليلية المعتمدة:' : 'Analytical Instruments:'}</span>
                    </h5>
                    <div className="space-y-2">
                      {lab.equipment.map((eq, eIdx) => (
                        <div
                          key={eIdx}
                          className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300"
                        >
                          <Activity className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{eq[lang] || eq.en}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7. Action Bar */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-colors shadow-xs"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'طلب فحص ميداني / حجز زيارة' : 'Book Field Audit'}</span>
                    </Link>
                    <Link
                      to="/enquiry"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'استفسار فني مباشر' : 'Technical Enquiry'}</span>
                    </Link>
                  </div>

                  <button
                    type="button"
                    onClick={() => scrollToSection('fleet-overview')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'أعلى الصفحة ↑' : 'Scroll to top ↑'}</span>
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        {/* ============================================================
            4. WORKFLOW DE TERRAIN EN 4 ÉTAPES DU SITE DE RÉFÉRENCE
        ============================================================= */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'آلية العمل والتشغيل الميداني' : lang === 'fr' ? 'Méthodologie Opérationnelle' : 'Field Operational Workflow'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'ar'
                ? 'مراحل التدخل والفحص الميداني للوحدات المتنقلة'
                : lang === 'fr'
                  ? 'Étapes d\'Intervention et de Contrôle sur le Terrain'
                  : 'Field Deployment & Quality Assurance Workflow'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'مسار معياري موثق يضمن سرعة الاستجابة الميدانية ومطابقة النتائج لأعلى اشتراطات الجودة'
                : lang === 'fr'
                  ? 'Un processus standardisé garantissant réactivité et conformité absolue aux normes de qualité'
                  : 'A rigorous four-stage procedure ensuring rapid mobilization and reliable compliance verification'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="relative p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-2xl font-black text-slate-200 dark:text-slate-800 font-mono">
                        {step.step}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      {step.title[lang] || step.title.en}
                    </h3>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      {step.desc[lang] || step.desc.en}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                    <span>{lang === 'ar' ? `المرحلة ${step.step}` : `Stage ${step.step}`}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            5. SERVICES MOBILES DU SITE DE RÉFÉRENCE
        ============================================================= */}
        <section className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'القدرات والخدمات الميدانية' : lang === 'fr' ? 'Services de Terrain' : 'Mobile Analytical Services'}</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'ar'
                ? 'خدمات التحليل الميداني والمراقبة الفورية لمياه الشرب'
                : lang === 'fr'
                  ? 'Services d\'Analyse Immédiate & Surveillance de Terrain'
                  : 'On-Site Water Analysis & Field Surveillance Services'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {lang === 'ar'
                ? 'حزمة متكاملة من الفحوصات الفيزيوكيميائية والجرثومية المعايرة مخبرياً'
                : lang === 'fr'
                  ? 'Gamme complète d\'examens physico-chimiques et bactériologiques étalonnés'
                  : 'A comprehensive suite of certified in-situ water testing and quality auditing'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES_CATALOG.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-2">
                      {svc.title[lang] || svc.title.en}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                      {svc.desc[lang] || svc.desc.en}
                    </p>
                  </div>

                  <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'فحص فوري' : 'Real-time test'}</span>
                    </span>
                    <span>ISO/IEC 17025</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            6. CALL TO ACTION INSTITUTIONNEL
        ============================================================= */}
        <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-950 text-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 end-0 -mt-10 -me-10 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-xl sm:text-3xl font-extrabold mb-3">
              {lang === 'ar'
                ? 'هل تحتاج إلى فحص ميداني فوري أو سحب عينات معتمدة؟'
                : lang === 'fr'
                  ? 'Besoin d\'un contrôle immédiat ou de prélèvements certifiés ?'
                  : 'Need Immediate On-Site Inspection or Certified Sampling?'}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed mb-6">
              {lang === 'ar'
                ? 'يمكن للجهات الحكومية والخاصة والمحطات المائية حجز زيارة المختبر المتنقل أو الاستعلام عن خدمات الفحص الميداني وجودة مياه الشرب بالقطاع الجنوبي.'
                : lang === 'fr'
                  ? 'Les entités publiques, privées et exploitants de réseaux peuvent réserver l\'intervention d\'une unité mobile ou adresser une demande d\'audit.'
                  : 'Government bodies, private operators, and water plants can schedule a mobile unit field audit or submit an immediate technical enquiry.'}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-blue-900 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-blue-900" />
                <span>{lang === 'ar' ? 'طلب فحص ميداني / حجز زيارة' : 'Book Mobile Field Audit'}</span>
              </Link>
              <Link
                to="/enquiry"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700/60 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all border border-blue-400/30 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('cs.enquiry')}</span>
              </Link>
            </div>
          </div>
        </section>

              </div>
    </div>
  );
}
