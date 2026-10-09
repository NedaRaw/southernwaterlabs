import { Link } from 'react-router-dom';
import {
  Target,
  Eye,
  ShieldCheck,
  Users,
  FlaskConical,
  Network,
  Award,
  CheckCircle2,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { siteMedia } from '@/data/siteMedia';
import { siteStats } from '@/data/siteConfig';
import nwcLogo from '@/assets/images/nwc-logo.png';

export default function About() {
  const { t, lang, dir } = useLang();

  return (
    <div
      dir={dir}
      className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.about') }]} />

        {/* Hero Visual Banner - Elegant Institutional Split with Official NWC Logo Frame */}
        <section className="mt-4 mb-12 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A5F] via-[#152B47] to-[#0A1324] p-6 sm:p-10 lg:p-12 text-white shadow-lg ring-1 ring-white/10">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="absolute inset-0 z-0 pointer-events-none">
            <img
              src={siteMedia.downloadSampling || siteMedia.waterTestingPan}
              alt="Central Water Laboratories"
              className="w-full h-full object-cover object-center opacity-20 mix-blend-luminosity scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A5F]/95 via-[#152B47]/90 to-[#0A1324]/95" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left/Right Text Content (Child 1: on Right in RTL, on Left in LTR) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Badges strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-400/25">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>ISO/IEC 17025:2017</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-400/25">
                  <Award className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'معتمد من مركز الاعتماد السعودي (SAC)'
                      : lang === 'fr'
                        ? "Accrédité par le Centre Saoudien d'Accréditation (SAC)"
                        : 'Accredited by Saudi Accreditation Center (SAC)'}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/25">
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'شركة المياه الوطنية — NWC'
                      : lang === 'fr'
                        ? 'Compagnie Nationale des Eaux — NWC'
                        : 'National Water Company — NWC'}
                  </span>
                </span>
              </div>

              {/* Main Official Title */}
              <div>
                <p className="text-xs sm:text-sm font-semibold text-blue-300 uppercase tracking-wider mb-1">
                  {lang === 'ar'
                    ? 'منظومة مختبرات القطاع الجنوبي'
                    : lang === 'fr'
                      ? 'Réseau des Laboratoires du Secteur Sud'
                      : 'Southern Sector Laboratories Network'}
                </p>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight">
                  {t('aboutPage.title')}
                </h1>
                <p className="text-xs sm:text-sm font-normal text-emerald-300 mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{t('brand.tagline')}</span>
                </p>
              </div>

              {/* Institutional description */}
              <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">
                {t('aboutPage.desc')}
              </p>

              {/* Quick Action Navigation links */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/laboratories"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-600/40"
                >
                  <Building2 className="w-4 h-4" />
                  <span>{t('nav.allLabs')}</span>
                </Link>
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-all duration-200 ring-1 ring-white/20"
                >
                  <FlaskConical className="w-4 h-4" />
                  <span>{t('nav.allServices')}</span>
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
                      alt={t('brand.name')}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                </div>

                {/* Institutional identification below logo */}
                <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-700 text-center">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 block tracking-wide leading-snug">
                    {lang === 'ar'
                      ? 'شركة المياه الوطنية'
                      : lang === 'fr'
                        ? 'Compagnie Nationale des Eaux'
                        : 'National Water Company'}
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

        {/* Mission & Vision - Editorial Split Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('aboutPage.mission')}</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{t('aboutPage.missionDesc')}</p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('aboutPage.vision')}</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{t('aboutPage.visionDesc')}</p>
          </div>
        </div>

        {/* Split Photographic Quality Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12 bg-white dark:bg-[#172033] rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-2xs overflow-hidden">
          <div className="lg:col-span-6 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('aboutPage.qualityBadge')}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug">
              {t('aboutPage.scientificTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('aboutPage.scientificDesc')}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('aboutPage.feature.microbiology')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('aboutPage.feature.chemical')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('aboutPage.feature.mobile')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('aboutPage.feature.monitoring')}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-900">
              <img
                src={siteMedia.leadChemist || siteMedia.aboutSection}
                alt="Laboratory Chemist"
                className="w-full h-64 sm:h-72 object-cover object-top hover:scale-102 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Institutional Values */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white mb-1.5">{t('aboutPage.values')}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('aboutPage.valuesSubtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: t('aboutPage.quality'), desc: t('aboutPage.qualityDesc') },
              { icon: Award, title: t('aboutPage.excellence'), desc: t('aboutPage.excellenceDesc') },
              { icon: Users, title: t('aboutPage.service'), desc: t('aboutPage.serviceDesc') },
              { icon: FlaskConical, title: t('aboutPage.innovation'), desc: t('aboutPage.innovationDesc') },
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="p-5 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 transition-all">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-3 text-blue-600 dark:text-blue-400">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 text-xs sm:text-sm">{value.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Organizational Structure - With Horizontal Scroll for wide layout */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Network className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">{t('aboutPage.structure')}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {t('aboutPage.structureSubtitle')}
              </p>
            </div>
          </div>

          {/* Organizational Chart Image Container with Horizontal Scroll Support */}
          {siteMedia.orgStructureCent && (
            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-thin">
              <div className="min-w-[640px] flex justify-center">
                <img
                  src={siteMedia.orgStructureCent}
                  alt="Organizational Structure"
                  className="max-h-[380px] w-auto object-contain rounded-lg"
                />
              </div>
            </div>
          )}

          {/* Key Metrics Strip - Tabular & Unboxed */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-300 mb-0.5">{siteStats.centralCenters}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">{t('aboutPage.centralCenters')}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-300 mb-0.5">{siteStats.branches}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">{t('aboutPage.affiliatedBranches')}</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-center">
              <p className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-blue-700 dark:text-blue-300 mb-0.5">{siteStats.regions}</p>
              <p className="text-xs text-slate-600 dark:text-slate-300">{t('aboutPage.coveredRegions')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
