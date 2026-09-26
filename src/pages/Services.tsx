import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { services, getLocalizedService } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

export default function Services() {
  const { lang, t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.services') }]} />

        <div className="mt-4 mb-10 max-w-2xl">
          <h1 className="section-title mb-2">{t('services.title')}</h1>
          <p className="section-subtitle max-w-2xl">{t('services.desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((rawService, i) => {
            const service = getLocalizedService(rawService, lang);
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="group p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-12 h-12 rounded-lg bg-navy-50 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-navy-700" />
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{service.description}</p>
                <Link to="/contact" className="inline-flex items-center gap-1 text-navy-700 text-xs font-semibold hover:gap-1.5 transition-all">
                  {t('services.more')}
                  <Arrow className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
