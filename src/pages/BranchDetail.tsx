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
          <div className="flex items-center gap-3 p-5 rounded-xl bg-white border border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-navy-100 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-navy-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('detail.location')}</p>
              <p className="text-sm font-bold text-slate-700">{branch.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-5 rounded-xl bg-white border border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-navy-100 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-navy-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('detail.hours')}</p>
              <p className="text-sm font-bold text-slate-700">{branch.contact.workingHours}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-5 rounded-xl bg-white border border-slate-100">
            <div className="w-11 h-11 rounded-xl bg-navy-100 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-navy-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">{t('detail.phone')}</p>
              <p className="text-sm font-bold text-slate-700" dir="ltr">{branch.contact.phone}</p>
            </div>
          </div>
        </div>

        <Link
          to={`/laboratories/${center.id}`}
          className="mt-6 flex items-center gap-4 p-5 rounded-xl bg-navy-50 border border-navy-100 hover:border-navy-300 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-navy-800 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400">{t('branch.parentCenter')}</p>
            <p className="text-base font-bold text-slate-700 group-hover:text-navy-600">{center.name}</p>
          </div>
          <Chevron className="w-5 h-5 text-slate-300 group-hover:text-navy-500" />
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="p-6 rounded-xl bg-white border border-slate-100">
              <InfoSection title={t('detail.capabilities')} items={branch.capabilities} variant="capability" />
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-100">
              <InfoSection title={t('detail.services')} items={branch.services} variant="service" />
            </div>
            <div className="p-6 rounded-xl bg-white border border-slate-100">
              <InfoSection title={t('detail.analyses')} items={branch.analyses} variant="analysis" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-slate-100">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-navy-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{t('detail.contact')}</h2>
              </div>
              <ContactCard contact={branch.contact} />
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-100">
              <h3 className="text-base font-bold text-slate-700 mb-4">{t('branch.quickActions')}</h3>
              <div className="space-y-3">
                <a
                  href={branch.contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors shadow-sm"
                >
                  <Navigation className="w-4 h-4" />
                  {t('detail.map')}
                </a>
                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-white text-navy-700 font-bold text-sm border-2 border-navy-200 hover:bg-navy-50 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  {t('detail.registerVisit')}
                </Link>
              </div>
            </div>

            {center.branches.length > 1 && (
              <div className="p-6 rounded-xl bg-white border border-slate-100">
                <h3 className="text-base font-bold text-slate-700 mb-4">{t('branch.otherBranches')}</h3>
                <div className="space-y-2">
                  {center.branches
                    .filter((b) => b.id !== branch.id)
                    .map((sibling) => (
                      <Link
                        key={sibling.id}
                        to={`/laboratories/${center.id}/${sibling.id}`}
                        className="group/sibling flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:border-navy-300 hover:bg-navy-50 transition-all"
                      >
                        <div className="w-9 h-9 rounded-lg bg-navy-100 flex items-center justify-center">
                          <Network className="w-4 h-4 text-navy-600" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 group-hover/sibling:text-navy-700 flex-1">
                          {sibling.name}
                        </span>
                        <Chevron className="w-4 h-4 text-slate-300 group-hover/sibling:text-navy-500" />
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
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-navy-300 hover:text-navy-600 transition-all"
          >
            <Arrow className="w-4 h-4" />
            {t('branch.backToCenter')} {center.name}
          </Link>
          <Link
            to="/laboratories"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-white border border-slate-200 text-slate-600 font-bold text-sm hover:border-navy-300 hover:text-navy-600 transition-all"
          >
            <Arrow className="w-4 h-4" />
            {t('detail.backToLabs')}
          </Link>
        </div>
      </div>
    </div>
  );
}
