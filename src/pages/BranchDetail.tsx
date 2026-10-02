import { useParams, Link, Navigate } from 'react-router-dom';
import { Network, MapPin, Clock, Phone, ArrowLeft, ArrowRight, Building2, ChevronLeft, ChevronRight, Navigation, UserPlus } from 'lucide-react';
import { getBranchById, getCenterById } from '@/data/laboratories';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import InfoSection from '@/components/InfoSection';
import ContactCard from '@/components/ContactCard';

export default function BranchDetail() {
  const { centerId, branchId } = useParams<{ centerId: string; branchId: string }>();
  const { lang, t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;

  const center = centerId ? getCenterById(centerId, lang) : undefined;
  const branch = centerId && branchId ? getBranchById(centerId, branchId, lang) : undefined;
  if (!center || !branch) return <Navigate to="/laboratories" replace />;

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb
          items={[
            { label: t('nav.labs'), to: '/laboratories' },
            { label: center.name, to: `/laboratories/${center.id}` },
            { label: branch.name },
          ]}
        />

        <div className="mt-4 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1E3A5F] to-[#0A1324] p-6 sm:p-10 text-white shadow-lg border border-slate-800">
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs font-medium flex items-center gap-1 border border-white/20">
                <Network className="w-3 h-3 text-blue-300" />
                {t('branch.subBranch')}
              </span>
              <Link
                to={`/laboratories/${center.id}`}
                className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs font-medium flex items-center gap-1 hover:bg-white/25 transition-colors border border-white/20"
              >
                <Building2 className="w-3 h-3 text-blue-300" />
                {center.name}
              </Link>
            </div>
            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/90 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <Network className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">{branch.name}</h1>
                <p className="text-slate-300 text-xs mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {branch.location}
                </p>
              </div>
            </div>
            <p className="text-slate-200/90 text-xs sm:text-sm leading-relaxed max-w-2xl font-normal">{branch.about}</p>
          </div>
        </div>

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
