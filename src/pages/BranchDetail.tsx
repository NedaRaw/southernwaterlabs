import { useParams, Link, Navigate } from 'react-router-dom';
import {
  Network,
  MapPin,
  Clock,
  Phone,
  ArrowLeft,
  ArrowRight,
  Building2,
  ChevronLeft,
  ChevronRight,
  Navigation,
  UserPlus,
  ShieldCheck,
  Award,
  Sparkles,
  ClipboardList,
  Send,
} from 'lucide-react';
import { getBranchById, getCenterById } from '@/data/laboratories';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import InfoSection from '@/components/InfoSection';
import ContactCard from '@/components/ContactCard';
import nwcLogo from '@/assets/images/nwc-logo.png';

export default function BranchDetail() {
  const { centerId, branchId } = useParams<{ centerId: string; branchId: string }>();
  const { lang, t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const center = centerId ? getCenterById(centerId, lang) : undefined;
  const branch = centerId && branchId ? getBranchById(centerId, branchId, lang) : undefined;
  if (!center || !branch) return <Navigate to="/laboratories" replace />;

  return (
    <div
      dir={dir}
      className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('nav.labs'), to: '/laboratories' },
            { label: center.name, to: `/laboratories/${center.id}` },
            { label: branch.name },
          ]}
        />

        {/* ======================================================
            01: Institutional Hero Section (Najran Reference Model)
        ====================================================== */}
        <section className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A5F] via-[#152B47] to-[#0A1324] p-6 sm:p-10 lg:p-12 text-white shadow-lg ring-1 ring-white/10">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left/Right Text Content (on Right in RTL, on Left in LTR) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/25">
                  <Network className="w-3.5 h-3.5 shrink-0" />
                  {t('branch.subBranch')}
                </span>
                <Link
                  to={`/laboratories/${center.id}`}
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-400/25 hover:bg-emerald-500/30 transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{center.name}</span>
                </Link>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-400/25">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'معايير الجودة المعتمدة'
                      : lang === 'fr'
                        ? 'Normes Qualité Agréées'
                        : 'Accredited Quality Standards'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200 text-xs font-medium border border-white/20">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  {lang === 'ar'
                    ? 'شركة المياه الوطنية — NWC'
                    : lang === 'fr'
                      ? 'Compagnie Nationale des Eaux — NWC'
                      : 'National Water Company — NWC'}
                </span>
              </div>

              {/* Main Official Title */}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-blue-300 uppercase tracking-wider mb-1">
                  {lang === 'ar'
                    ? `منظومة مختبرات القطاع الجنوبي — ${center.region}`
                    : lang === 'fr'
                      ? `Réseau des Laboratoires du Secteur Sud — ${center.region}`
                      : `Southern Sector Laboratories System — ${center.region}`}
                </p>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight">
                  {branch.name}
                </h1>
                <p className="text-xs sm:text-sm font-normal text-emerald-300 mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? `خدمات الفحص والتحليل المخبري وضبط الجودة — ${branch.location}`
                      : lang === 'fr'
                        ? `Analyses d’eau et contrôle qualité — ${branch.location}`
                        : `Water Analysis & Quality Control Services — ${branch.location}`}
                  </span>
                </p>
              </div>

              {/* Institutional description */}
              <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                {branch.about}
              </p>

              {/* Quick Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to={`/register?laboratory=${encodeURIComponent(center.id)}&branch=${encodeURIComponent(branch.id)}`}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-600/40"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('detail.registerVisit')}</span>
                </Link>
                <Link
                  to={`/survey?laboratory=${encodeURIComponent(center.id)}`}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all duration-200 ring-1 ring-white/20"
                >
                  <ClipboardList className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'استبيان رضا العملاء'
                      : lang === 'fr'
                        ? 'Enquête de satisfaction'
                        : 'Customer Survey'}
                  </span>
                </Link>
                <Link
                  to={`/enquiry?laboratory=${encodeURIComponent(center.id)}`}
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all duration-200 ring-1 ring-white/20"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {lang === 'ar'
                      ? 'إرسال استفسار'
                      : lang === 'fr'
                        ? 'Envoyer une demande'
                        : 'Send Enquiry'}
                  </span>
                </Link>
                <a
                  href={branch.contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all duration-200 ring-1 ring-white/20"
                >
                  <Navigation className="w-4 h-4 text-blue-300" />
                  <span>{t('detail.map')}</span>
                </a>
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
                      alt={branch.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* Institutional identification below logo */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                  {/* Branch official name */}
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block tracking-wide leading-snug">
                    {branch.name}
                  </span>

                  {/* Parent central laboratory name */}
                  <Link
                    to={`/laboratories/${center.id}`}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium block mt-1 transition-colors"
                  >
                    {center.name}
                  </Link>

                  {/* ISO/IEC 17025:2017 information only where applicable and verified */}
                  <div className="mt-2 flex items-center justify-center gap-1.5 flex-wrap">
                    <span className="h-px w-4 bg-amber-500/50" />
                    <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 dark:text-slate-400 tracking-[0.05em]">
                      {lang === 'ar'
                        ? 'المنظومة المخبرية التابعة لـ ISO/IEC 17025:2017'
                        : lang === 'fr'
                          ? 'Réseau Affilié ISO/IEC 17025:2017'
                          : 'Affiliated to ISO/IEC 17025:2017 Network'}
                    </span>
                    <span className="h-px w-4 bg-amber-500/50" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 p-5 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t('detail.location')}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">{branch.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-5 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t('detail.hours')}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">{branch.contact.workingHours}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-5 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t('detail.phone')}</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5" dir="ltr">{branch.contact.phone}</p>
            </div>
          </div>
        </div>

        <Link
          to={`/laboratories/${center.id}`}
          className="mt-6 flex items-center gap-4 p-5 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all shadow-2xs group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">{t('branch.parentCenter')}</p>
            <p className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mt-0.5 transition-colors">{center.name}</p>
          </div>
          <Chevron className="w-5 h-5 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <InfoSection title={t('detail.capabilities')} items={branch.capabilities} variant="capability" />
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <InfoSection title={t('detail.services')} items={branch.services} variant="service" />
            </div>
            <div className="p-6 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <InfoSection title={t('detail.analyses')} items={branch.analyses} variant="analysis" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{t('detail.contact')}</h2>
              </div>
              <ContactCard contact={branch.contact} />
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">{t('branch.quickActions')}</h3>
              <div className="space-y-3">
                <a
                  href={branch.contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap cursor-pointer"
                >
                  <Navigation className="w-4 h-4 shrink-0" />
                  <span>{t('detail.map')}</span>
                </a>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2.5 w-full py-3 px-5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-sm border border-slate-200 dark:border-slate-700 transition-all shadow-xs hover:shadow-md whitespace-nowrap cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 shrink-0" />
                  <span>{t('detail.registerVisit')}</span>
                </Link>
              </div>
            </div>

            {center.branches.length > 1 && (
              <div className="p-6 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">{t('branch.otherBranches')}</h3>
                <div className="space-y-2">
                  {center.branches
                    .filter((b) => b.id !== branch.id)
                    .map((sibling) => (
                      <Link
                        key={sibling.id}
                        to={`/laboratories/${center.id}/${sibling.id}`}
                        className="group/sibling flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                          <Network className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover/sibling:text-blue-600 dark:group-hover/sibling:text-blue-400 flex-1 transition-colors">
                          {sibling.name}
                        </span>
                        <Chevron className="w-4 h-4 text-slate-400 group-hover/sibling:text-blue-500 transition-colors" />
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to={`/laboratories/${center.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-2xs whitespace-nowrap"
          >
            <Arrow className="w-4 h-4 shrink-0" />
            <span>{t('branch.backToCenter')} {center.name}</span>
          </Link>
          <Link
            to="/laboratories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs sm:text-sm hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-2xs whitespace-nowrap"
          >
            <Arrow className="w-4 h-4 shrink-0" />
            <span>{t('detail.backToLabs')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
