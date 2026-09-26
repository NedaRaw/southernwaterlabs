import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { contactConfig } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

export default function Contact() {
  const { lang, t } = useLang();
  const address = contactConfig.addressI18n[lang] || contactConfig.address;
  const hours = contactConfig.workingHoursI18n[lang] || contactConfig.workingHours;

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.contact') }]} />

        <div className="mt-4 mb-10 max-w-2xl">
          <h1 className="section-title mb-2">{t('contact.title')}</h1>
          <p className="section-subtitle max-w-2xl">{t('contact.desc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            {[
              { icon: Phone, label: t('contact.phone'), value: contactConfig.phone, dir: 'ltr' },
              { icon: Mail, label: t('contact.email'), value: contactConfig.email, dir: 'ltr' },
              { icon: MapPin, label: t('contact.address'), value: address },
              { icon: Clock, label: t('contact.hours'), value: hours },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-4 p-5 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-navy-50 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-navy-700" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-0.5">{item.label}</p>
                    <p className="text-sm sm:text-base font-semibold text-slate-800" dir={item.dir as 'ltr' | undefined}>{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-slate-800 mb-3">{t('contact.sendMsg')}</h2>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">{t('contact.toEnquiry')}</p>
            <Link to="/enquiry" className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-navy-800 text-white font-semibold text-sm hover:bg-navy-700 transition-colors shadow-sm">
              {t('contact.gotoEnquiry')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
