import { Link } from 'react-router-dom';
import {
  Droplets, Building2, MapPin, ChevronLeft, ChevronRight, Network, ArrowLeft, ArrowRight,
  UserPlus, FileText, MessageSquare, FlaskConical, ShieldCheck,
  Target, Eye,
} from 'lucide-react';
import { getLocalizedCenters } from '@/data/laboratories';
import { siteStats } from '@/data/siteConfig';
import { useLang } from '@/lib/i18n';
import HeroSection from '@/components/HeroSection';
import NewsCarousel from '@/components/NewsCarousel';
import { siteMedia } from '@/data/siteMedia';

export default function Home() {
  const { lang, t, dir } = useLang();
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight;
  const Chevron = dir === 'rtl' ? ChevronLeft : ChevronRight;
  const centers = getLocalizedCenters(lang);

  return (
    <div>
      {/* Hero Section with Framer Motion Animation Sequence */}
      <HeroSection />

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
              <img src={siteMedia.aboutSection} alt={t('brand.name')} className="rounded-2xl shadow-xl w-full h-[400px] object-cover" />
              <div className={`absolute -bottom-6 ${dir === 'rtl' ? '-left-6' : '-right-6'} bg-navy-800 text-white p-6 rounded-xl shadow-xl hidden sm:block`}>
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
            {centers.map((center, index) => (
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
                            <span className="text-sm font-bold text-slate-700 group-hover/branch:text-navy-700 flex-1">{branch.name}</span>
                            <Chevron className="w-4 h-4 text-slate-300 group-hover/branch:text-navy-500" />
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
              { icon: FlaskConical, title: t('services.title'), desc: t('services.desc') },
              { icon: ShieldCheck, title: t('aboutPage.quality'), desc: t('aboutPage.qualityDesc') },
              { icon: Target, title: t('misc.accuracyTitle'), desc: t('misc.accuracyDesc') },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="p-8 rounded-xl bg-white border border-slate-100 hover:shadow-lg hover:border-navy-200 transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="w-14 h-14 rounded-xl bg-navy-100 flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-navy-700" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{item.title}</h3>
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

      {/* News Carousel */}
      <NewsCarousel />

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
