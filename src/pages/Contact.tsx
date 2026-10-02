import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, MessageSquare, ArrowLeft, ArrowRight } from 'lucide-react';
import { contactConfig } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

export default function Contact() {
  const { lang, t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const address = contactConfig.addressI18n[lang] || contactConfig.address;
  const hours = contactConfig.workingHoursI18n[lang] || contactConfig.workingHours;

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.contact') }]} />

        <div className="mt-4 mb-10 max-w-2xl">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-white leading-tight mb-2">
            {t('contact.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            {t('contact.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 space-y-3.5">
            {[
              { icon: Phone, label: t('contact.phone'), value: contactConfig.phone, dir: 'ltr' },
              { icon: Mail, label: t('contact.email'), value: contactConfig.email, dir: 'ltr' },
              { icon: MapPin, label: t('contact.address'), value: address },
              { icon: Clock, label: t('contact.hours'), value: hours },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-blue-500/40 transition-all">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wide mb-0.5">{item.label}</p>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200" dir={item.dir as 'ltr' | undefined}>{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-5 p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-center">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('contact.sendMsg')}</h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">{t('contact.toEnquiry')}</p>
            <Link to="/enquiry" className="flex items-center justify-center gap-2.5 w-full py-3 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow-md whitespace-nowrap">
              <span>{t('contact.gotoEnquiry')}</span>
              <Arrow className="w-4 h-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
