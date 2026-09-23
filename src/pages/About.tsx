import { Droplets, Target, Eye, ShieldCheck, Users, FlaskConical, Network, Award } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

export default function About() {
  const { t } = useLang();

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.about') }]} />

        <div className="mt-6 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-100 text-navy-700 text-sm font-medium mb-4">
            <Droplets className="w-4 h-4" />
            {t('about.badge')}
          </div>
          <h1 className="section-title mb-4">{t('aboutPage.title')}</h1>
          <p className="text-slate-600 max-w-3xl leading-relaxed">{t('aboutPage.desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-14">
          <div className="p-8 rounded-xl bg-white border border-slate-100">
            <div className="w-14 h-14 rounded-xl bg-navy-100 flex items-center justify-center mb-5"><Target className="w-7 h-7 text-navy-700" /></div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">{t('aboutPage.mission')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('aboutPage.missionDesc')}</p>
          </div>
          <div className="p-8 rounded-xl bg-white border border-slate-100">
            <div className="w-14 h-14 rounded-xl bg-navy-100 flex items-center justify-center mb-5"><Eye className="w-7 h-7 text-navy-700" /></div>
            <h2 className="text-xl font-bold text-slate-800 mb-3">{t('aboutPage.vision')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('aboutPage.visionDesc')}</p>
          </div>
        </div>

        <div className="mb-14">
          <h2 className="text-2xl font-extrabold text-slate-800 mb-6 text-center">{t('aboutPage.values')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: ShieldCheck, title: t('aboutPage.quality'), desc: t('aboutPage.qualityDesc') },
              { icon: Award, title: t('aboutPage.excellence'), desc: t('aboutPage.excellenceDesc') },
              { icon: Users, title: t('aboutPage.service'), desc: t('aboutPage.serviceDesc') },
              { icon: FlaskConical, title: t('aboutPage.innovation'), desc: t('aboutPage.innovationDesc') },
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="p-6 rounded-xl bg-white border border-slate-100 hover:shadow-lg transition-all">
                  <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center mb-4"><Icon className="w-6 h-6 text-navy-700" /></div>
                  <h3 className="font-bold text-slate-800 mb-2">{value.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-8 rounded-xl bg-navy-50 border border-navy-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center"><Network className="w-6 h-6 text-navy-700" /></div>
            <h2 className="text-2xl font-extrabold text-slate-800">{t('aboutPage.structure')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-100 text-center"><p className="text-3xl font-extrabold text-navy-700 mb-1">5</p><p className="text-sm text-slate-500">{t('aboutPage.centralCenters')}</p></div>
            <div className="p-5 rounded-xl bg-white border border-slate-100 text-center"><p className="text-3xl font-extrabold text-navy-700 mb-1">5</p><p className="text-sm text-slate-500">{t('aboutPage.affiliatedBranches')}</p></div>
            <div className="p-5 rounded-xl bg-white border border-slate-100 text-center"><p className="text-3xl font-extrabold text-navy-700 mb-1">5</p><p className="text-sm text-slate-500">{t('aboutPage.coveredRegions')}</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}
