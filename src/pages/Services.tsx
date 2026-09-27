import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, UserPlus, MessageSquare, ShieldCheck, Truck } from 'lucide-react';
import { services, getLocalizedService } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';
import { siteMedia } from '@/data/siteMedia';

export default function Services() {
  const { lang, t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.services') }]} />

        {/* Hero Visual Banner - Clean Institutional Style */}
        <div className="mt-4 mb-12 relative rounded-2xl overflow-hidden bg-[#0A1324] text-white shadow-lg border border-slate-800">
          <div className="absolute inset-0 z-0">
            <img
              src={siteMedia.panoramicBand || siteMedia.waterTestingPan}
              alt="Laboratory Services"
              className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-102"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A1324] via-[#0A1324]/90 to-[#102A43]/75" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-medium mb-3 border border-blue-400/25">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'منظومة الفحص المعتمدة' : 'Accredited Testing Framework'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-tight mb-2">
              {t('services.title')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed font-normal">
              {t('services.desc')}
            </p>
          </div>
        </div>

        {/* Services Editorial Grid - Disciplined Typography, Single Elevation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {services.map((rawService) => {
            const service = getLocalizedService(rawService, lang);
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="p-6 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white mb-2">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{service.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <Link
                    to="/enquiry"
                    className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:gap-2 transition-all"
                  >
                    <span>{t('services.more')}</span>
                    <Arrow className="w-3.5 h-3.5" />
                  </Link>
                  <span className="text-[10px] text-slate-400 font-mono">ISO 17025</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Split Mobile Field Laboratory Feature Section */}
        <div className="rounded-2xl overflow-hidden bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 lg:p-10 mb-12 shadow-2xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 text-xs font-medium">
                <Truck className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'المختبرات الميدانية المتنقلة' : 'Mobile Field Laboratories'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white leading-snug">
                {lang === 'ar'
                  ? 'أسطول التدخل السريع والفحص الميداني الفوري لمصادر المياه'
                  : 'Rapid Response Fleet & Immediate On-Site Potability Verification'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'مركبات مجهزة بأحدث أدوات القياس الفوري للطوارئ والمواسم، قادرة على الانتقال السريع إلى السدود ومحطات الضخ وخزانات التوزيع لتقييم جودة المياه وإجراء الفحوصات العاجلة.'
                  : 'Custom-fitted specialized mobile units equipped with real-time test instrumentation for emergency response, field monitoring, and rapid potability screening across Southern sector facilities.'}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm transition-colors shadow-2xs"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{t('cs.register')}</span>
                </Link>
                <Link
                  to="/enquiry"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-xs sm:text-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{t('cs.enquiry')}</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700 bg-slate-900">
                <img
                  src={siteMedia.mobileLabCar || siteMedia.fieldAction}
                  alt="Mobile Laboratory Vehicle"
                  className="w-full h-64 sm:h-72 object-contain bg-slate-950/40 p-4"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
