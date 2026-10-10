import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Network,
  ShieldCheck,
  Award,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  UserPlus,
  Send,
  ClipboardList,
  Eye,
  X,
  Camera,
  Layers,
  FlaskConical,
} from 'lucide-react';
import { getLocalizedCenters } from '@/data/laboratories';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { siteMedia } from '@/data/siteMedia';
import nwcLogo from '@/assets/images/nwc-logo.png';
import nwcCorporateImg from '@/assets/images/nwc.jpg';
import nwcLabTestingImg from '@/assets/images/nwc-lab1.jpg';
import nwcLabAgilentImg from '@/assets/images/nwc-lab2.jpg';

interface ShowcaseImage {
  src: string;
  badge: { ar: string; en: string; fr: string };
  title: { ar: string; en: string; fr: string };
  desc: { ar: string; en: string; fr: string };
}

export default function Laboratories() {
  const { lang, t, dir } = useLang();
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const centers = getLocalizedCenters(lang);

  const [selectedImage, setSelectedImage] = useState<ShowcaseImage | null>(null);

  // Keyboard accessibility for modal
  useEffect(() => {
    if (!selectedImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  // Showcase gallery of the 3 requested NWC images
  const showcaseImages: ShowcaseImage[] = [
    {
      src: nwcCorporateImg,
      badge: {
        ar: 'المنشأة والشعار المؤسسي',
        en: 'Corporate Identity & Facility',
        fr: 'Identité Institutionnelle & Siège',
      },
      title: {
        ar: 'شركة المياه الوطنية — الإدارة العامة للمختبرات والخدمات البيئية بالقطاع الجنوبي',
        en: 'National Water Company — Southern Sector Central Laboratories Administration',
        fr: 'Compagnie Nationale des Eaux — Direction des Laboratoires Centraux du Secteur Sud',
      },
      desc: {
        ar: 'الهوية المؤسسية المعتمدة لشركة المياه الوطنية الرائدة في تشغيل وإدارة المختبرات المائية والبيئية وفق أعلى المعايير العالمية.',
        en: 'The certified institutional identity of National Water Company leading water and environmental lab operations across the Kingdom.',
        fr: 'L’identité institutionnelle certifiée de la National Water Company, leader de la gestion des laboratoires d’eau et environnementaux.',
      },
    },
    {
      src: nwcLabTestingImg,
      badge: {
        ar: 'الفحوصات والتحاليل المخبرية',
        en: 'Laboratory Water Testing',
        fr: 'Analyses & Contrôle Qualité',
      },
      title: {
        ar: 'محطة الفحوصات الدقيقة ومراقبة جودة مياه الشرب',
        en: 'Precision Analytical Testing & Potable Water Quality Station',
        fr: 'Station d’analyses de précision et contrôle de conformité de l’eau potable',
      },
      desc: {
        ar: 'كوادر وطنية متخصصة وأجهزة فحص معيارية معتمدة لإجراء التحاليل الفيزيائية والكيميائية والميكروبيولوجية على مدار الساعة.',
        en: 'Specialized scientific personnel and standardized equipment performing physical, chemical, and microbiological water tests 24/7.',
        fr: 'Personnel scientifique hautement qualifié et équipements étalonnés assurant le contrôle physico-chimique et microbiologique continu.',
      },
    },
    {
      src: nwcLabAgilentImg,
      badge: {
        ar: 'التقنيات التحليلية المتقدمة',
        en: 'Advanced Instrumental Analysis',
        fr: 'Instrumentation Analytique Avancée',
      },
      title: {
        ar: 'منظومة الأجهزة التحليلية والكروماتوغرافية المتطورة (Agilent Technologies)',
        en: 'Advanced Analytical & Chromatographic Systems (Agilent Technologies)',
        fr: 'Systèmes analytiques et chromatographiques de pointe (Agilent Technologies)',
      },
      desc: {
        ar: 'تجهيزات مخبرية عالية الدقة والتقنية للكشف عن العناصر النزرة، المركبات الدقيقة، وضمان مطابقة المواصفات القياسية السعودية والخليجية.',
        en: 'State-of-the-art analytical instrumentation for ultra-trace element detection and full compliance with SASO & GSO standards.',
        fr: 'Instruments de pointe pour la détection des éléments traces et la conformité absolue aux normes SASO et GSO.',
      },
    },
  ];

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.labs') }]} />

        {/* ============================================================ */}
        {/* 01: INSTITUTIONAL HERO SECTION WITH OFFICIAL LOGO & DETAILS  */}
        {/* Harmonized with Asir, Najran, Jazan, and Al-Baha pages        */}
        {/* ============================================================ */}
        <section className="mt-4 mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A5F] via-[#152B47] to-[#0A1324] p-6 sm:p-10 lg:p-12 text-white shadow-lg ring-1 ring-white/10">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left/Right Text Content (Child 1: on Right in RTL, on Left in LTR) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-400/25">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'معتمد وفق المواصفة القياسية ISO/IEC 17025:2017'
                      : lang === 'fr'
                        ? 'Accrédité selon la norme ISO/IEC 17025:2017'
                        : 'Accredited ISO/IEC 17025:2017'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-400/25">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'اعتماد المركز السعودي للاعتماد (SAC)'
                      : lang === 'fr'
                        ? 'Centre Saoudien d’Accréditation (SAC)'
                        : 'Saudi Accreditation Center (SAC)'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/25">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'شركة المياه الوطنية — القطاع الجنوبي'
                      : lang === 'fr'
                        ? 'Compagnie Nationale des Eaux — Secteur Sud'
                        : 'National Water Company — Southern Sector'}
                  </span>
                </span>
              </div>

              {/* Main Official Title */}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-blue-300 uppercase tracking-wider mb-1">
                  {lang === 'ar'
                    ? 'شركة المياه الوطنية — الإدارة العامة للمختبرات والخدمات البيئية بالقطاع الجنوبي'
                    : lang === 'fr'
                      ? 'Compagnie Nationale des Eaux — Direction des Laboratoires du Secteur Sud'
                      : 'National Water Company — Southern Sector Environmental & Water Laboratories'}
                </p>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight">
                  {t('labs.title')}
                </h1>
                <p className="text-xs sm:text-sm font-normal text-emerald-300 mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'خبراء مختصون في أحدث التقنيات والمعايير الدولية في مجال تحليل مياه الشرب والخدمات البيئية'
                      : lang === 'fr'
                        ? 'Experts spécialisés dans les technologies de pointe et les normes internationales'
                        : 'Specialized experts in cutting-edge technologies and international water testing standards'}
                  </span>
                </p>
              </div>

              {/* Institutional description */}
              <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                {t('labs.desc')}
              </p>

              {/* Quick Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-600/40"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'تسجيل زيارة للمختبر'
                      : lang === 'fr'
                        ? 'Réserver une Visite'
                        : 'Register Lab Visit'}
                  </span>
                </Link>
                <Link
                  to="/survey"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all duration-200 ring-1 ring-white/20"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'استبيان رضا العملاء'
                      : lang === 'fr'
                        ? 'Enquête de Satisfaction'
                        : 'Customer Survey'}
                  </span>
                </Link>
                <Link
                  to="/enquiry"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all duration-200 ring-1 ring-white/20"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'إرسال استفسار'
                      : lang === 'fr'
                        ? 'Envoyer une Demande'
                        : 'Send Enquiry'}
                  </span>
                </Link>
                <Link
                  to="/mobile-laboratories"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 font-medium text-xs sm:text-sm transition-all duration-200 ring-1 ring-teal-400/30"
                >
                  <FlaskConical className="w-4 h-4 text-teal-300" />
                  <span>
                    {lang === 'ar'
                      ? 'المختبرات المتنقلة'
                      : lang === 'fr'
                        ? 'Unités Mobiles'
                        : 'Mobile Laboratories'}
                  </span>
                </Link>
              </div>
            </div>

            {/* Logo Emblem Container (Child 2: on Left in RTL, on Right in LTR) */}
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700/80 shadow-lg max-w-xs w-full text-center">
                {/* Institutional circular emblem frame */}
                <div className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto flex items-center justify-center">
                  {/* Outer institutional ring */}
                  <div className="absolute inset-0 rounded-full border border-blue-700/25 dark:border-blue-400/25" />

                  {/* Inner accreditation ring */}
                  <div className="absolute inset-2 rounded-full border border-amber-500/35 dark:border-amber-400/30" />

                  {/* Subtle inner white field */}
                  <div className="absolute inset-4 rounded-full bg-white dark:bg-slate-900 shadow-sm" />

                  {/* Official NWC Logo */}
                  <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center p-2">
                    <img
                      src={nwcLogo}
                      alt={
                        lang === 'ar'
                          ? 'شركة المياه الوطنية'
                          : lang === 'fr'
                            ? 'Compagnie Nationale des Eaux'
                            : 'National Water Company'
                      }
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* Institutional identification below logo inside the frame */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block tracking-wide leading-snug">
                    {lang === 'ar'
                      ? 'المختبرات المركزية والفروع التابعة'
                      : lang === 'fr'
                        ? 'Laboratoires Centraux et Agences Affiliées'
                        : 'Central Laboratories & Affiliated Branches'}
                  </span>

                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium block mt-1">
                    {lang === 'ar'
                      ? 'منظومة المختبرات المركزية — القطاع الجنوبي'
                      : lang === 'fr'
                        ? 'Réseau des Laboratoires Centraux — Secteur Sud'
                        : 'Central Laboratories System — Southern Sector'}
                  </span>

                  {/* Accreditation */}
                  <div className="mt-2 flex items-center justify-center gap-2">
                    <span className="h-px w-5 bg-amber-500/50" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 tracking-[0.12em]">
                      ISO/IEC 17025:2017 &bull; SAC
                    </span>
                    <span className="h-px w-5 bg-amber-500/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 02: OFFICIAL PHOTOGRAPHIC SHOWCASE (nwc.jpg, nwc-lab1, nwc-lab2) */}
        {/* High-quality laboratory and institutional facilities gallery  */}
        {/* ============================================================ */}
        <section className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
                <Camera className="w-3.5 h-3.5" />
                <span>
                  {lang === 'ar'
                    ? 'المعرض المصور للمنشآت والتقنيات'
                    : lang === 'fr'
                      ? 'Galerie des Installations & Équipements'
                      : 'Photographic Showcase: Facilities & Technologies'}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {lang === 'ar'
                  ? 'منشآت وتجهيزات منظومة المختبرات المعتمدة'
                  : lang === 'fr'
                    ? 'Installations & Équipements de Pointe des Laboratoires'
                    : 'Accredited Central Laboratory Facilities & Instrumentation'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {lang === 'ar'
                  ? 'صور رسمية توثق البيئة المخبرية المتقدمة والأجهزة التحليلية الحديثة في شركة المياه الوطنية'
                  : lang === 'fr'
                    ? 'Photographies officielles illustrant l’environnement analytique et les technologies de pointe'
                    : 'Official imagery documenting the advanced testing environment and state-of-the-art analytical equipment'}
              </p>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 hidden sm:flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar'
                  ? 'اضغط على أي صورة لتكبيرها'
                  : lang === 'fr'
                    ? 'Cliquez pour agrandir'
                    : 'Click any photo to enlarge'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {showcaseImages.map((imgItem, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(imgItem)}
                className="group cursor-pointer bg-white dark:bg-[#172033] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-500/50 transition-all duration-300 flex flex-col"
              >
                {/* Image frame */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={imgItem.src}
                    alt={imgItem.title[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Badge top-end */}
                  <div className="absolute top-3 end-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium border border-white/15">
                      <Layers className="w-3 h-3 text-blue-300" />
                      <span>{imgItem.badge[lang]}</span>
                    </span>
                  </div>

                  {/* Enlarge prompt bottom */}
                  <div className="absolute bottom-3 end-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-semibold shadow-md">
                      <Eye className="w-3 h-3" />
                      <span>
                        {lang === 'ar'
                          ? 'تكبير'
                          : lang === 'fr'
                            ? 'Agrandir'
                            : 'Enlarge'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Content description */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {imgItem.title[lang]}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {imgItem.desc[lang]}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                    <span>
                      {lang === 'ar'
                        ? 'عرض التفاصيل'
                        : lang === 'fr'
                          ? 'Voir les détails'
                          : 'View Full Resolution'}
                    </span>
                    <Chevron className="w-3.5 h-3.5 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 03: REGIONAL CENTERS & AFFILIATED BRANCHES DIRECTORY         */}
        {/* ============================================================ */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              {lang === 'ar'
                ? 'المختبرات المركزية الأربعة بالقطاع الجنوبي'
                : lang === 'fr'
                  ? 'Les 4 Laboratoires Centraux du Secteur Sud'
                  : 'The 4 Central Laboratories of the Southern Sector'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {lang === 'ar'
                ? 'عسير • نجران • الباحة • جازان والفروع التابعة بكل منطقة'
                : lang === 'fr'
                  ? 'Asir • Najran • Al-Baha • Jazan et les agences affiliées'
                  : 'Asir • Najran • Al-Baha • Jazan and regional affiliated branches'}
            </p>
          </div>
        </div>

        {/* Centers Grid */}
        <div className="space-y-6">
          {centers.map((center) => {
            const facilityPhoto =
              siteMedia.facilities[center.id as keyof typeof siteMedia.facilities] ||
              siteMedia.aboutSection;
            return (
              <div
                key={center.id}
                className="bg-white dark:bg-[#172033] rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-md hover:border-blue-500/40 transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  {/* Photo & Identity Column */}
                  <Link
                    to={`/laboratories/${center.id}`}
                    className="lg:col-span-5 relative h-56 lg:h-auto overflow-hidden bg-slate-900 group"
                  >
                    <img
                      src={facilityPhoto}
                      alt={center.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20 flex flex-col justify-between p-5">
                      <div className="flex justify-end">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[11px] font-medium">
                          {center.type === 'Central_center'
                            ? t('network.independent')
                            : t('network.central')}
                        </span>
                      </div>
                      <div className="text-white">
                        <div className="w-9 h-9 rounded-lg bg-blue-600/90 text-white flex items-center justify-center mb-2 shadow-2xs">
                          <Building2 className="w-4.5 h-4.5" />
                        </div>
                        <h2 className="text-base sm:text-lg font-semibold leading-snug">
                          {center.name}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>{center.region}</span>
                        </div>
                        <div className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-300 group-hover:text-white transition-colors">
                          <span>{t('labs.viewCenter')}</span>
                          <Chevron className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Branches & Details Column */}
                  <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                        {center.about}
                      </p>

                      {center.branches.length > 0 ? (
                        <>
                          <div className="flex items-center gap-2 mb-2.5">
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {t('network.branches')}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[11px] font-semibold">
                              {center.branches.length}
                            </span>
                          </div>
                          {/* Horizontal scroll container with scrollbar-thin so branches never clip */}
                          <div className="overflow-x-auto pb-1 flex sm:grid sm:grid-cols-2 gap-2 scrollbar-thin">
                            {center.branches.map((branch) => (
                              <Link
                                key={branch.id}
                                to={`/laboratories/${center.id}/${branch.id}`}
                                className="group/branch flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all shrink-0 whitespace-nowrap sm:whitespace-normal"
                              >
                                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                                  <Network className="w-3.5 h-3.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover/branch:text-blue-600 dark:group-hover/branch:text-blue-400 truncate">
                                    {branch.name}
                                  </h4>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {branch.location}
                                  </p>
                                </div>
                                <Chevron className="w-3 h-3 text-slate-400 group-hover/branch:text-blue-500 shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="py-4 text-center text-xs text-slate-400">
                          {t('network.independent')}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {center.workingHours}
                      </div>
                      <Link
                        to={`/laboratories/${center.id}`}
                        className="inline-flex items-center gap-2 px-4.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs transition-all shadow-xs hover:shadow-md whitespace-nowrap"
                      >
                        <span>{t('labs.viewCenter')}</span>
                        <Arrow className="w-3.5 h-3.5 shrink-0" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 04: HIGH-RESOLUTION LIGHTBOX MODAL FOR IMAGES               */}
      {/* ============================================================ */}
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 text-white rounded-2xl overflow-hidden shadow-2xl border border-slate-700/80"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                  {selectedImage.badge[lang]}
                </span>
                <span className="text-xs text-slate-400">
                  {lang === 'ar'
                    ? 'شركة المياه الوطنية — القطاع الجنوبي'
                    : lang === 'fr'
                      ? 'National Water Company — Secteur Sud'
                      : 'National Water Company — Southern Sector'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image */}
            <div className="relative max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedImage.src}
                alt={selectedImage.title[lang]}
                className="max-h-[70vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            {/* Modal Caption */}
            <div className="p-5 bg-slate-900 border-t border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-white mb-1.5">
                {selectedImage.title[lang]}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {selectedImage.desc[lang]}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
