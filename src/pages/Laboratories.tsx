import { Link } from 'react-router-dom';
import { Building2, MapPin, ChevronLeft, ChevronRight, Network, ShieldCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { getLocalizedCenters } from '@/data/laboratories';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { siteMedia } from '@/data/siteMedia';

export default function Laboratories() {
  const { lang, t, dir } = useLang();
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const centers = getLocalizedCenters(lang);

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.labs') }]} />

        {/* Hero Banner for Laboratories Directory - Controlled Height, Elegant Photography */}
        <div className="mt-4 mb-10 relative rounded-2xl overflow-hidden bg-[#0A1324] text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-800">
          <div className="absolute inset-0 z-0">
            <img
              src={siteMedia.downloadSampling || siteMedia.waterTestingPan}
              alt="Laboratories Network"
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1324] via-[#0A1324]/90 to-[#102A43]/75" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium mb-3 border border-blue-400/25">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ISO/IEC 17025:2017</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight mb-2">
              {t('labs.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal max-w-2xl">
              {t('labs.desc')}
            </p>
          </div>
        </div>

        {/* Centers Grid */}
        <div className="space-y-6">
          {centers.map((center) => {
            const facilityPhoto = siteMedia.facilities[center.id as keyof typeof siteMedia.facilities] || siteMedia.aboutSection;
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
                          {center.type === 'regional_center' ? t('network.independent') : t('network.central')}
                        </span>
                      </div>
                      <div className="text-white">
                        <div className="w-9 h-9 rounded-lg bg-blue-600/90 text-white flex items-center justify-center mb-2 shadow-2xs">
                          <Building2 className="w-4.5 h-4.5" />
                        </div>
                        <h2 className="text-base sm:text-lg font-semibold leading-snug">{center.name}</h2>
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
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{t('network.branches')}</span>
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
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shadow-2xs"
                      >
                        <span>{t('labs.viewCenter')}</span>
                        <Arrow className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
