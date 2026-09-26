import { Target, Eye, ShieldCheck, Users, FlaskConical, Network, Award } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

export default function About() {
  const { t } = useLang();

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.about') }]} />

        <div className="mt-4 mb-10 max-w-3xl">
          <h1 className="section-title mb-3">{t('aboutPage.title')}</h1>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{t('aboutPage.desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-navy-50 flex items-center justify-center mb-4"><Target className="w-6 h-6 text-navy-700" /></div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">{t('aboutPage.mission')}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{t('aboutPage.missionDesc')}</p>
          </div>
          <div className="p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-lg bg-navy-50 flex items-center justify-center mb-4"><Eye className="w-6 h-6 text-navy-700" /></div>
            <h2 className="text-lg font-semibold text-slate-800 mb-2">{t('aboutPage.vision')}</h2>
            <p className="text-slate-600 text-sm leading-relaxed">{t('aboutPage.visionDesc')}</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl font-semibold text-slate-800 mb-6 text-center">{t('aboutPage.values')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: t('aboutPage.quality'), desc: t('aboutPage.qualityDesc') },
              { icon: Award, title: t('aboutPage.excellence'), desc: t('aboutPage.excellenceDesc') },
              { icon: Users, title: t('aboutPage.service'), desc: t('aboutPage.serviceDesc') },
              { icon: FlaskConical, title: t('aboutPage.innovation'), desc: t('aboutPage.innovationDesc') },
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center mb-3"><Icon className="w-5 h-5 text-navy-700" /></div>
                  <h3 className="font-semibold text-slate-800 mb-1.5 text-sm sm:text-base">{value.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-7 rounded-xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center"><Network className="w-5 h-5 text-navy-700" /></div>
            <h2 className="text-lg font-semibold text-slate-800">{t('aboutPage.structure')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-100 text-center"><p className="text-2xl font-bold text-navy-800 mb-1">5</p><p className="text-xs sm:text-sm text-slate-600">{t('aboutPage.centralCenters')}</p></div>
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-100 text-center"><p className="text-2xl font-bold text-navy-800 mb-1">5</p><p className="text-xs sm:text-sm text-slate-600">{t('aboutPage.affiliatedBranches')}</p></div>
            <div className="p-5 rounded-lg bg-slate-50 border border-slate-100 text-center"><p className="text-2xl font-bold text-navy-800 mb-1">5</p><p className="text-xs sm:text-sm text-slate-600">{t('aboutPage.coveredRegions')}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
