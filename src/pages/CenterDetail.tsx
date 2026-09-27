import { useParams, Link, Navigate } from 'react-router-dom';
import { Building2, MapPin, Clock, Phone, Globe, ArrowLeft, ArrowRight, Network, ChevronLeft, ChevronRight, Info, UserPlus, ShieldCheck } from 'lucide-react';
import { getCenterById } from '@/data/laboratories';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import InfoSection from '@/components/InfoSection';
import ContactCard from '@/components/ContactCard';
import NajranLabDetail from '@/pages/NajranLabDetail';
import { siteMedia } from '@/data/siteMedia';

export default function CenterDetail() {
  const { centerId } = useParams<{ centerId: string }>();
  const { lang, t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;

  if (centerId === 'najran') {
    return <NajranLabDetail />;
  }

  const center = centerId ? getCenterById(centerId, lang) : undefined;
  if (!center) return <Navigate to="/laboratories" replace />;

  const facilityPhoto = (centerId && siteMedia.facilities[centerId as keyof typeof siteMedia.facilities]) || siteMedia.aboutSection;

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.labs'), to: '/laboratories' }, { label: center.name }]} />

        {/* Hero Banner with Authentic Facility Photography */}
        <div className="mt-4 relative overflow-hidden rounded-2xl bg-[#0A1324] text-white p-6 sm:p-10 lg:p-12 shadow-lg border border-slate-800">
          <div className="absolute inset-0 z-0">
            <img
              src={facilityPhoto}
              alt={center.name}
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1324] via-[#0A1324]/90 to-[#102A43]/75" />
          </div>

          <div className="relative z-10 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium border border-blue-400/25 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {center.type === 'regional_center' ? t('network.independent') : t('network.central')}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-normal flex items-center gap-1 border border-white/20">
                <MapPin className="w-3 h-3 text-blue-400" />
                {center.region}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-10 h-10 rounded-lg bg-blue-600/90 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Building2 className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight">{center.name}</h1>
            </div>
            <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">{center.about}</p>
          </div>
        </div>

        {/* Location & Quick Contact Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-5">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">{t('detail.location')}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{center.location}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">{t('detail.hours')}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">{center.workingHours}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Phone className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">{t('detail.phone')}</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate" dir="ltr">{center.contact.phone}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Info className="w-4 h-4" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white">{t('detail.about')}</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{center.about}</p>
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <InfoSection title={t('detail.capabilities')} items={center.capabilities} variant="capability" />
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <InfoSection title={t('detail.services')} items={center.services} variant="service" />
            </div>
            <div className="p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <InfoSection title={t('detail.analyses')} items={center.analyses} variant="analysis" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Phone className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t('detail.contact')}</h2>
              </div>
              <ContactCard contact={center.contact} />
              <a
                href={center.contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-500 transition-colors shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{t('detail.map')}</span>
              </a>
              <Link
                to="/register"
                className="mt-2.5 flex items-center justify-center gap-1.5 w-full py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium text-xs border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{t('detail.registerVisit')}</span>
              </Link>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Network className="w-4 h-4" />
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-white">{t('detail.branches')}</h2>
              </div>
              {center.branches.length > 0 ? (
                <div className="space-y-2.5">
                  {center.branches.map((branch) => (
                    <Link
                      key={branch.id}
                      to={`/laboratories/${center.id}/${branch.id}`}
                      className="group/branch flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                        <Network className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover/branch:text-blue-600 truncate">{branch.name}</h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 shrink-0" />
                          <span className="truncate">{branch.location}</span>
                        </p>
                      </div>
                      <Chevron className="w-3 h-3 text-slate-400 group-hover/branch:text-blue-500 shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-6">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2">
                    <Building2 className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('network.noBranches')}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{t('network.independent')}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Link
            to="/laboratories"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white dark:bg-[#172033] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:border-blue-300 hover:text-blue-600 transition-all shadow-2xs"
          >
            <Arrow className="w-3.5 h-3.5" />
            <span>{t('detail.backToLabs')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
