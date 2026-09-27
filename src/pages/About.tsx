import { Target, Eye, ShieldCheck, Users, FlaskConical, Network, Award, CheckCircle2 } from 'lucide-react';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { siteMedia } from '@/data/siteMedia';
import { siteStats } from '@/data/siteConfig';

export default function About() {
  const { lang, t } = useLang();

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.about') }]} />

        {/* Hero Visual Banner - Elegant Institutional Split */}
        <div className="mt-4 mb-12 relative rounded-2xl overflow-hidden bg-[#0A1324] text-white shadow-lg border border-slate-800">
          <div className="absolute inset-0 z-0">
            <img
              src={siteMedia.downloadSampling || siteMedia.waterTestingPan}
              alt="Central Water Laboratories"
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1324] via-[#0A1324]/90 to-[#102A43]/75" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium mb-3 border border-blue-400/25">
              <Award className="w-3.5 h-3.5" />
              <span>ISO/IEC 17025:2017</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight mb-3">
              {t('aboutPage.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
              {t('aboutPage.desc')}
            </p>
          </div>
        </div>

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
              <span>{lang === 'ar' ? 'معايير الجودة والاعتماد' : 'Quality & Accreditation Standards'}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug">
              {lang === 'ar'
                ? 'كوادر علمية مؤهلة وتجهيزات تقنية بمواصفات مرجعية'
                : 'Certified Scientific Experts & State-of-the-Art Analytical Equipment'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'تضم المختبرات المركزية بالقطاع الجنوبي نخبة من الكيميائيين والبيولوجيين المختصين في مراقبة جودة المياه، مع تطبيق أنظمة ضبط وتوكيد الجودة المستمرة وضمان الامتثال الدقيق للمقاييس الوطنية والدولية.'
                : 'Southern Sector central laboratories employ elite chemists and microbiologists specialized in water quality surveillance, adhering to rigorous QA/QC protocols and national drinking water standards.'}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'ar' ? 'فحص جرثومي معتمد' : 'Microbiological Testing'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'ar' ? 'تحاليل كيميائية متقدمة' : 'Advanced Chemical Analysis'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'ar' ? 'مختبرات ميدانية متنقلة' : 'Mobile Field Laboratories'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{lang === 'ar' ? 'رصد على مدار الساعة' : 'Round-the-clock Monitoring'}</span>
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
              {lang === 'ar' ? 'المبادئ والقيم المؤسسية التي تحكم جودة أعمالنا المخبرية' : 'Institutional principles governing our laboratory excellence'}
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
                {lang === 'ar' ? 'الهيكل التنظيمي لمنظومة المختبرات المركزية والفروع التابعة' : 'Organizational structure of central and affiliated laboratories'}
              </p>
            </div>
          </div>

          {/* Organizational Chart Image Container with Horizontal Scroll Support */}
          {siteMedia.orgStructure && (
            <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 overflow-x-auto scrollbar-thin">
              <div className="min-w-[640px] flex justify-center">
                <img
                  src={siteMedia.orgStructure}
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
