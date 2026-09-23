import { Link } from 'react-router-dom';
import {
  Droplets, Building2, MapPin, ChevronLeft, Network, ArrowLeft,
  UserPlus, FileText, MessageSquare, FlaskConical, ShieldCheck,
  Target, Eye, Calendar,
} from 'lucide-react';
import { laboratoryCenters } from '@/data/laboratories';
import { newsItems, siteStats } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';

export default function Home() {
  const { t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowLeft;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[600px] min-h-[500px] overflow-hidden">
        <img
          src="https://images.pexels.com/photos/8533087/pexels-photo-8533087.jpeg?auto=compress&cs=tinysrgb&w=1920"
          alt={t('brand.name')}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-navy-950/90 via-navy-900/80 to-navy-900/60" />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-6 backdrop-blur-sm border border-white/20 animate-fade-in">
              <Droplets className="w-4 h-4" />
              {t('hero.badge')}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up">
              {t('hero.title')}
            </h1>
            <p className="text-xl sm:text-2xl font-bold text-navy-100 mb-4 animate-fade-in-up stagger-1">
              {t('hero.subtitle')}
            </p>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-xl animate-fade-in-up stagger-2">
              {t('hero.desc')}
            </p>
            <div className="flex flex-wrap items-center gap-4 animate-fade-in-up stagger-3">
              <Link to="/register" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-white text-navy-800 font-bold text-sm hover:bg-navy-50 transition-colors shadow-lg">
                <UserPlus className="w-5 h-5" />
                {t('hero.register')}
              </Link>
              <Link to="/laboratories" className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-lg bg-navy-700 text-white font-bold text-sm hover:bg-navy-600 transition-colors border border-navy-600">
                {t('hero.explore')}
                <Arrow className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 -mb-px">
            {[
              { to: '/register', icon: UserPlus, title: t('quick.register'), desc: t('quick.register.desc') },
              { to: '/survey', icon: FileText, title: t('quick.survey'), desc: t('quick.survey.desc') },
              { to: '/enquiry', icon: MessageSquare, title: t('quick.enquiry'), desc: t('quick.enquiry.desc') },
              { to: '/laboratories', icon: Building2, title: t('quick.labs'), desc: t('quick.labs.desc') },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link key={i} to={item.to} className="group bg-white p-6 hover:bg-navy-50 transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-12 h-12 rounded-xl bg-navy-100 flex items-center justify-center mb-4 group-hover:bg-navy-800 transition-colors">
                    <Icon className="w-6 h-6 text-navy-700 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-navy-700 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img src="https://images.pexels.com/photos/4033019/pexels-photo-4033019.jpeg?auto=compress&cs=tinysrgb&w=1200" alt={t('brand.name')} className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
              <div className="absolute -bottom-6 -left-6 bg-navy-800 text-white p-6 rounded-xl shadow-xl hidden sm:block">
                <p className="text-3xl font-extrabold">{siteStats.centralCenters}</p>
                <p className="text-sm text-navy-200">{t('about.stat.centers')}</p>
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-100 text-navy-700 text-sm font-medium mb-4">
                <Droplets className="w-4 h-4" />
                {t('about.badge')}
              </div>
              <h2 className="section-title mb-4">{t('about.title')}</h2>
              <p className="text-slate-600 leading-relaxed mb-8">{t('about.desc')}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { value: siteStats.labTests, label: t('about.stat.tests') },
                  { value: siteStats.samples, label: t('about.stat.samples') },
                  { value: siteStats.centralCenters, label: t('about.stat.centers') },
                  { value: siteStats.branches, label: t('about.stat.branches') },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-white border border-slate-100">
                    <p className="text-2xl font-extrabold text-navy-700">{stat.value}</p>
                    <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <Link to="/about" className="mt-6 inline-flex items-center gap-2 text-navy-700 font-bold text-sm hover:gap-3 transition-all">
                {t('about.readmore')}
                <Arrow className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Network */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-100 text-navy-700 text-sm font-medium mb-4">
              <Network className="w-4 h-4" />
              {t('network.badge')}
            </div>
            <h2 className="section-title mb-3">{t('network.title')}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">{t('network.desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {laboratoryCenters.map((center, index) => (
              <div key={center.id} className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-navy-300 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${index * 0.08}s` }}>
                <Link to={`/laboratories/${center.id}`} className="block">
                  <div className={`p-6 ${center.type === 'regional_center' ? 'bg-slate-100' : 'bg-navy-800'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold ${center.type === 'regional_center' ? 'bg-slate-200 text-slate-600' : 'bg-white/15 text-white'}`}>
                        {center.type === 'regional_center' ? t('network.independent') : t('network.central')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${center.type === 'regional_center' ? 'bg-slate-600' : 'bg-white/15'}`}>
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-lg font-extrabold ${center.type === 'regional_center' ? 'text-slate-800' : 'text-white'}`}>{center.name}</h3>
                        <div className={`flex items-center gap-1 mt-0.5 ${center.type === 'regional_center' ? 'text-slate-500' : 'text-navy-200'}`}>
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-sm">{center.region}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-6">
                  {center.branches.length > 0 ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-1 h-4 rounded-full bg-navy-600" />
                        <h4 className="text-sm font-bold text-slate-600">{t('network.branches')}</h4>
                        <span className="text-xs text-slate-400">({center.branches.length})</span>
                      </div>
                      <div className="space-y-2">
                        {center.branches.map((branch) => (
                          <Link key={branch.id} to={`/laboratories/${center.id}/${branch.id}`} className="group/branch flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100 hover:border-navy-300 hover:bg-navy-50 transition-all">
                            <div className="w-8 h-8 rounded-lg bg-navy-100 flex items-center justify-center">
                              <Network className="w-4 h-4 text-navy-600" />
                            </div>
                            <span className="text-sm font-bold text-slate-700 group-hover/branch:text-navy-700">{branch.name}</span>
                            <ChevronLeft className="w-4 h-4 text-slate-300 group-hover/branch:text-navy-500 mr-auto" />
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-600">{t('network.noBranches')}</p>
                        <p className="text-xs text-slate-400">{t('network.independent')}</p>
                      </div>
                    </div>
                  )}
                  <Link to={`/laboratories/${center.id}`} className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-navy-50 text-navy-700 text-sm font-bold border border-navy-100 hover:bg-navy-100 transition-colors">
                    {t('network.details')}
                    <Arrow className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">{t('services.title')}</h2>
            <p className="section-subtitle max-w-2xl mx-auto">{t('services.desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FlaskConical, titleKey: 'services.title', desc: t('services.desc') },
              { icon: ShieldCheck, title: t('aboutPage.quality'), desc: t('aboutPage.qualityDesc') },
              { icon: Target, title: dir === 'rtl' ? 'دقة وموثوقية' : 'Accuracy & Reliability', desc: dir === 'rtl' ? 'فريق متخصص وأجهزة حديثة لضمان دقة النتائج' : 'Specialized team and modern equipment to ensure accurate results' },
            ].map((item, i) => {
              const Icon = item.icon;
              const title = item.title || item.titleKey;
              return (
                <div key={i} className="p-8 rounded-xl bg-white border border-slate-100 hover:shadow-lg hover:border-navy-200 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-14 h-14 rounded-xl bg-navy-100 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-navy-700" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-navy-800 text-white font-bold text-sm hover:bg-navy-700 transition-colors">
              {t('services.all')}
              <Arrow className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-3">{t('news.title')}</h2>
            <p className="section-subtitle">{t('news.desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newsItems.map((news, i) => (
              <div key={news.id} className="group rounded-xl bg-white border border-slate-200 overflow-hidden hover:shadow-lg hover:border-navy-200 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-48 bg-navy-100 overflow-hidden">
                  <img src={news.image || `https://images.pexels.com/photos/8533087/pexels-photo-8533087.jpeg?auto=compress&cs=tinysrgb&w=600`} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded bg-navy-100 text-navy-700 text-xs font-bold">{news.category}</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400"><Calendar className="w-3.5 h-3.5" />{news.date}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-2 group-hover:text-navy-700 transition-colors">{news.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{news.description}</p>
                  <Link to="/news" className="inline-flex items-center gap-1 text-navy-700 text-sm font-bold hover:gap-2 transition-all">
                    {t('news.readmore')}
                    <Arrow className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Services CTA */}
      <section className="py-20 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium mb-4 border border-white/20">
              <Eye className="w-4 h-4" />
              {t('cta.badge')}
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-3">{t('cta.title')}</h2>
            <p className="text-navy-200 max-w-2xl mx-auto">{t('cta.desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { to: '/register', icon: UserPlus, title: t('cs.register'), desc: t('cta.register.desc') },
              { to: '/survey', icon: FileText, title: t('quick.survey'), desc: t('cta.survey.desc') },
              { to: '/enquiry', icon: MessageSquare, title: t('quick.enquiry'), desc: t('cta.enquiry.desc') },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <Link key={i} to={item.to} className="group p-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-navy-200 leading-relaxed mb-4">{item.desc}</p>
                  <span className="inline-flex items-center gap-1 text-white text-sm font-bold group-hover:gap-2 transition-all">
                    {t('cta.start')}
                    <Arrow className="w-4 h-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
