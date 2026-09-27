import { Calendar } from 'lucide-react';
import { newsItems, getLocalizedNews } from '@/data/siteConfig';
import { siteMedia } from '@/data/siteMedia';
import { useLang } from '@/lib/i18n';
import Breadcrumb from '@/components/Breadcrumb';

export default function News() {
  const { lang, t } = useLang();

  return (
    <div className="pt-16 sm:pt-20 pb-20 bg-[#F8FAFC] dark:bg-[#0B1220] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={[{ label: t('nav.news') }]} />

        <div className="mt-4 mb-10 max-w-2xl">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-white leading-tight mb-2">
            {t('news.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t('news.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {newsItems.map((rawNews, i) => {
            const news = getLocalizedNews(rawNews, lang);
            return (
              <div
                key={news.id}
                className="group rounded-2xl bg-white dark:bg-[#172033] border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-2xs hover:shadow-md hover:border-blue-500/40 transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="h-44 bg-slate-900 overflow-hidden relative">
                  <img
                    src={news.image || siteMedia.newsDefault}
                    alt={news.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 start-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-medium border border-white/10">
                      {news.category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2 text-[11px] text-slate-400 font-mono">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{news.date}</span>
                  </div>
                  <h2 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm sm:text-base leading-snug">
                    {news.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {news.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
