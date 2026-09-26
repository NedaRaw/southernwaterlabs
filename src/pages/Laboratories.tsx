import { Link } from 'react-router-dom';
import { Building2, MapPin, ChevronLeft, ChevronRight, Network } from 'lucide-react';
import { getLocalizedCenters } from '@/data/laboratories';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

export default function Laboratories() {
  const { lang, t, dir } = useLang();
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const centers = getLocalizedCenters(lang);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.labs') }]} />

        <div className="mt-4 mb-10">
          <h1 className="section-title mb-2">{t('labs.title')}</h1>
          <p className="section-subtitle max-w-2xl">{t('labs.desc')}</p>
        </div>

        <div className="space-y-6">
          {centers.map((center, index) => (
            <div key={center.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <Link to={`/laboratories/${center.id}`} className={`relative p-8 ${center.type === 'regional_center' ? 'bg-slate-100' : 'bg-navy-800'}`}>
                  <div className="absolute top-4 end-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${center.type === 'regional_center' ? 'bg-slate-200 text-slate-600' : 'bg-white/15 text-white'}`}>
                      {center.type === 'regional_center' ? t('network.independent') : t('network.central')}
                    </span>
                  </div>
                  <div className="mt-8">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${center.type === 'regional_center' ? 'bg-slate-600' : 'bg-white/15'}`}>
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <h2 className={`text-xl font-semibold mb-2 ${center.type === 'regional_center' ? 'text-slate-800' : 'text-white'}`}>{center.name}</h2>
                    <div className={`flex items-center gap-1.5 ${center.type === 'regional_center' ? 'text-slate-500' : 'text-navy-200'}`}>
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{center.region}</span>
                    </div>
                  </div>
                  <div className={`mt-6 flex items-center gap-2 text-sm font-semibold ${center.type === 'regional_center' ? 'text-slate-600' : 'text-white'}`}>
                    {t('labs.viewCenter')}
                    <Chevron className="w-4 h-4" />
                  </div>
                </Link>

                <div className="lg:col-span-2 p-8">
                  {center.branches.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-5">
                        <div className="w-1 h-6 rounded-full bg-navy-600" />
                        <h3 className="text-lg font-bold text-slate-700">{t('network.branches')}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-navy-100 text-navy-700 text-xs font-bold">{center.branches.length}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {center.branches.map((branch) => (
                          <Link key={branch.id} to={`/laboratories/${center.id}/${branch.id}`} className="group/branch flex items-center gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-navy-300 hover:bg-navy-50 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-navy-100 flex items-center justify-center">
                              <Network className="w-5 h-5 text-navy-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-700 group-hover/branch:text-navy-700">{branch.name}</h4>
                              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {branch.location}
                              </p>
                            </div>
                            <Chevron className="w-4 h-4 text-slate-300 group-hover/branch:text-navy-500" />
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-8">
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-600 mb-1">{t('network.noBranches')}</h3>
                      <p className="text-sm text-slate-400">{t('network.independent')}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
