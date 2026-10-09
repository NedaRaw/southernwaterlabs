import { Link } from 'react-router-dom';
import {
  Droplets, Building2, MapPin, ChevronLeft, ChevronRight, Network, ArrowLeft, ArrowRight,
  UserPlus, FileText, MessageSquare, FlaskConical, ShieldCheck,
  Target, Eye, Award
} from 'lucide-react';
import { getLocalizedCenters } from '@/data/laboratories';
import { siteStats } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';
import HeroSection from '@/components/HeroSection';
import NewsCarousel from '@/components/NewsCarousel';
import { siteMedia } from '@/data/siteMedia';

export default function Home() {
  const { lang, t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const centers = getLocalizedCenters(lang);

  return (
    <div>
      {/* Hero Section with Framer Motion Animation Sequence & Controlled Viewport Height */}
      <HeroSection />

      {/* Quick Services Strip - Sleek, Uncluttered, Hairline Separators */}
      <section className="bg-white dark:bg-[#111827] border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x rtl:sm:divide-x-reverse divide-slate-100 dark:divide-slate-800/80">
            {[
              { to: '/register', icon: UserPlus, title: t('quick.register'), desc: t('quick.register.desc') },
              { to: '/survey', icon: FileText, title: t('quick.survey'), desc: t('quick.survey.desc') },
              { to: '/enquiry', icon: MessageSquare, title: t('quick.enquiry'), desc: t('quick.enquiry.desc') },
              { to: '/laboratories', icon: Building2, title: t('quick.labs'), desc: t('quick.labs.desc') },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.to}
                  className="group p-4 sm:p-5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-3.5"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-0.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-xs sm:text-sm">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section - Editorial Split Layout with Real Laboratory Photography */}
      <section className="py-14 sm:py-18 bg-[#F8FAFC] dark:bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Visual Photography Frame */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200/80 dark:border-slate-800 bg-slate-900">
                <img
                  src={siteMedia.aboutSection}
                  alt={t('brand.name')}
                  className="w-full h-72 sm:h-84 lg:h-96 object-cover hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-5">
                  <div className="text-white">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white text-[11px] font-medium mb-1.5 backdrop-blur-xs">
                      <Award className="w-3 h-3" />
                      <span>ISO/IEC 17025:2017</span>
                    </div>
                    <p className="text-xs text-slate-200 max-w-sm font-normal leading-relaxed">
                      {t('home.isoBannerSub')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Refined Stat Anchor */}
              <div className={`absolute -bottom-3 ${dir === 'rtl' ? '-left-2' : '-right-2'} bg-[#0F1E36] text-white p-3.5 sm:p-4 rounded-xl shadow-lg hidden sm:flex items-center gap-3 border border-white/15`}>
                <div className="text-xl sm:text-2xl font-bold font-mono text-blue-300">
                  {siteStats.centralCenters}
                </div>
                <div className="text-xs text-slate-200 leading-snug">
                  {t('about.stat.centers')}
                  <br />
                  <span className="text-blue-300 font-medium text-[11px]">{t('brand.subtitle')}</span>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-2.5">
                <Droplets className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                <span>{t('about.badge')}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white leading-snug mb-3">
                {t('about.title')}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                {t('about.desc')}
              </p>

              {/* Metric Counter Strip - Unboxed, High Legibility, Tabular Figures */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
                {[
                  { value: siteStats.labTests, label: t('about.stat.tests') },
                  { value: siteStats.samples, label: t('about.stat.samples') },
                  { value: siteStats.centralCenters, label: t('about.stat.centers') },
                  { value: siteStats.branches, label: t('about.stat.branches') },
                ].map((stat, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 text-center shadow-2xs">
                    <p className="text-lg sm:text-xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">{stat.value}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold text-xs sm:text-sm hover:gap-2 transition-all"
              >
                <span>{t('about.readmore')}</span>
                <Arrow className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Panoramic Photographic Visual Break with Real Water Testing Photography */}
      <section className="relative overflow-hidden py-12 sm:py-16 bg-[#0A1324] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={siteMedia.panoramicBand || siteMedia.waterTestingPan}
            alt="Water Testing Laboratory Panorama"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A1324] via-[#0A1324]/85 to-[#102A43]/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            <div className="lg:col-span-8 space-y-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/25">
                <ShieldCheck className="w-3.5 h-3.5" />
                {t('home.standardsBannerBadge')}
              </span>
              <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug">
                {t('home.standardsBannerTitle')}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300/90 max-w-2xl leading-relaxed">
                {t('home.standardsBannerDesc')}
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-wrap lg:justify-end gap-3">
              <Link
                to="/services"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap"
              >
                <span>{t('services.all')}</span>
                <Arrow className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/25 text-white font-semibold text-xs sm:text-sm transition-all border border-white/25 backdrop-blur-md shadow-xs hover:shadow-md whitespace-nowrap"
              >
                <UserPlus className="w-4 h-4 shrink-0 text-blue-200" />
                <span>{t('cs.register')}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Network - Enhanced with Authentic Facility Photos */}
      <section className="py-14 sm:py-18 bg-white dark:bg-[#111827]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-2.5">
              <Network className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{t('network.badge')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
              {t('network.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              {t('network.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {centers.map((center) => {
              const facilityPhoto = siteMedia.facilities[center.id as keyof typeof siteMedia.facilities] || siteMedia.aboutSection;
              return (
                <div
                  key={center.id}
                  className="group bg-white dark:bg-[#172033] rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:shadow-md hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <Link to={`/laboratories/${center.id}`} className="block relative h-44 overflow-hidden bg-slate-900">
                    <img
                      src={facilityPhoto}
                      alt={center.name}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent flex flex-col justify-between p-3.5">
                      <div className="flex justify-end">
                        <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] font-medium">
                          {center.type === 'Central_center' ? t('network.independent') : t('network.central')}
                        </span>
                      </div>
                      <div className="text-white">
                        <h3 className="text-sm sm:text-base font-semibold leading-snug">{center.name}</h3>
                        <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
                          <span className="truncate">{center.region}</span>
                        </p>
                      </div>
                    </div>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {center.branches.length > 0 ? (
                        <>
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{t('network.branches')}</span>
                            <span className="text-[10px] text-slate-400">({center.branches.length})</span>
                          </div>
                          {/* Horizontal scroll container with scrollbar-thin so branches never clip */}
                          <div className="overflow-x-auto pb-1 flex sm:flex-col gap-1.5 scrollbar-thin">
                            {center.branches.map((branch) => (
                              <Link
                                key={branch.id}
                                to={`/laboratories/${center.id}/${branch.id}`}
                                className="inline-flex sm:flex items-center justify-between gap-2 p-1.5 rounded-md bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs font-normal text-slate-700 dark:text-slate-300 transition-colors shrink-0 whitespace-nowrap"
                              >
                                <span className="truncate">{branch.name}</span>
                                <Chevron className="w-3 h-3 text-slate-400 shrink-0" />
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="py-3 text-center text-xs text-slate-400">
                          {t('network.independent')}
                        </div>
                      )}
                    </div>

                    <Link
                      to={`/laboratories/${center.id}`}
                      className="mt-3.5 inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-lg bg-slate-100 hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors"
                    >
                      <span>{t('network.details')}</span>
                      <Arrow className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Showcase - Editorial Split Layout, Not Card Clones */}
      <section className="py-14 sm:py-18 bg-[#F8FAFC] dark:bg-[#0B1220]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Visual Side: Laboratory Testing in action */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200/80 dark:border-slate-800 bg-slate-900 relative">
                <img
                  src={siteMedia.studyLab || siteMedia.waterTestingPan}
                  alt="Laboratory Testing & Quality Assurance"
                  className="w-full h-72 sm:h-84 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 text-white">
                  <span className="text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-1">
                    {t('services.title')}
                  </span>
                  <h3 className="text-base sm:text-lg font-semibold leading-snug mb-1">
                    {t('home.precisionAnalyses')}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t('home.complianceSaudi')}
                  </p>
                </div>
              </div>
            </div>

            {/* List Side: Clean Distinctive Capabilities */}
            <div className="lg:col-span-7">
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium mb-2">
                  <FlaskConical className="w-3.5 h-3.5" />
                  <span>{t('home.capabilitiesTitle')}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                  {t('home.capabilitiesHeading')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                  {t('home.capabilitiesDesc')}
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: FlaskConical, title: t('services.title'), desc: t('services.desc') },
                  { icon: ShieldCheck, title: t('aboutPage.quality'), desc: t('aboutPage.qualityDesc') },
                  { icon: Target, title: t('misc.accuracyTitle'), desc: t('misc.accuracyDesc') },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="p-4 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 flex items-start gap-4 hover:border-blue-500/40 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-0.5">{item.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap"
                >
                  <span>{t('services.all')}</span>
                  <Arrow className="w-4 h-4 shrink-0" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Carousel */}
      <NewsCarousel />

      {/* Customer Services CTA - Clean Institutional Atmosphere */}
      <section className="relative overflow-hidden py-14 sm:py-18 bg-[#0A1324] border-t border-slate-800 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={siteMedia.darkBlueTexture || siteMedia.downloadSampling}
            alt="Atmospheric Background"
            className="w-full h-full object-cover opacity-15 mix-blend-screen"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-medium mb-2.5 border border-white/15">
              <Eye className="w-3.5 h-3.5" />
              <span>{t('cta.badge')}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">{t('cta.title')}</h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto">{t('cta.desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { to: '/register', icon: UserPlus, title: t('cs.register'), desc: t('cta.register.desc') },
              { to: '/survey', icon: FileText, title: t('quick.survey'), desc: t('cta.survey.desc') },
              { to: '/enquiry', icon: MessageSquare, title: t('quick.enquiry'), desc: t('cta.enquiry.desc') },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.to}
                  className="group p-5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center mb-3 text-blue-300">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-blue-200 text-xs font-medium group-hover:gap-1.5 transition-all">
                    <span>{t('cta.start')}</span>
                    <Arrow className="w-3 h-3" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
