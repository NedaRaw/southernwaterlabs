import { Droplets, Calendar } from 'lucide-react';
import { newsItems, getLocalizedNews } from '@/data/siteConfig';
import { siteMedia } from '@/data/siteMedia';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

export default function News() {
  const { lang, t } = useLang();

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.news') }]} />

        <div className="mt-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-100 text-navy-700 text-sm font-medium mb-4">
            <Droplets className="w-4 h-4" />
            {t('news.title')}
          </div>
          <h1 className="section-title mb-3">{t('news.title')}</h1>
          <p className="section-subtitle">{t('news.desc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsItems.map((rawNews, i) => {
            const news = getLocalizedNews(rawNews, lang);
            return (
              <div
                key={news.id}
                className="group rounded-xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg hover:border-navy-300 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="h-48 bg-navy-100 overflow-hidden">
                  <img
                    src={news.image || siteMedia.newsDefault}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded bg-navy-100 text-navy-700 text-xs font-bold">{news.category}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5" />
                      {news.date}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 group-hover:text-navy-700 transition-colors">{news.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{news.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
