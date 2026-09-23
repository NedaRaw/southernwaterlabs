import { Link } from 'react-router-dom';
import { Droplets, ArrowLeft } from 'lucide-react';
import { services } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

export default function Services() {
  const { t } = useLang();

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.services') }]} />

        <div className="mt-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-100 text-navy-700 text-sm font-medium mb-4">
            <Droplets className="w-4 h-4" />
            {t('services.title')}
          </div>
          <h1 className="section-title mb-3">{t('services.title')}</h1>
          <p className="section-subtitle max-w-2xl">{t('services.desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <div key={service.id} className="group p-8 rounded-xl bg-white border border-slate-200 hover:shadow-lg hover:border-navy-300 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="w-14 h-14 rounded-xl bg-navy-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-navy-700" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">{service.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-4">{service.description}</p>
                <Link to="/contact" className="inline-flex items-center gap-1 text-navy-700 text-sm font-bold hover:gap-2 transition-all">
                  {t('services.more')}
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
