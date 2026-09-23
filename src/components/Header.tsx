import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Droplets, Menu, X, ChevronDown, UserPlus, FileText, MessageSquare, Headphones, Globe } from 'lucide-react';
import { useLang, type Lang } from '@/lib/i18n';

export default function Header() {
  const location = useLocation();
  const { lang, setLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
    setLangOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/laboratories', label: t('nav.labs') },
    { to: '/services', label: t('nav.services') },
    { to: '/news', label: t('nav.news') },
    { to: '/contact', label: t('nav.contact') },
  ];

  const customerServices = [
    { to: '/register', label: t('cs.register'), icon: UserPlus },
    { to: '/survey', label: t('cs.survey'), icon: FileText },
    { to: '/enquiry', label: t('cs.enquiry'), icon: MessageSquare },
  ];

  const languages: { code: Lang; label: string; short: string }[] = [
    { code: 'ar', label: 'العربية', short: 'ع' },
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'fr', label: 'Français', short: 'FR' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-white py-3'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-navy-800 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-navy-800">{t('brand.name')}</h1>
              <p className="text-xs text-slate-400">{t('brand.subtitle')}</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to) ? 'nav-link-active' : ''}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {/* Sélecteur de langue pour Desktop */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                onBlur={() => setTimeout(() => setLangOpen(false), 150)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-navy-700 hover:bg-slate-50 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{languages.find((l) => l.code === lang)?.short || 'EN'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 animate-fade-in z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setLang(l.code);
                        setLangOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                        lang === l.code ? 'bg-navy-50 text-navy-800 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                onBlur={() => setTimeout(() => setServicesOpen(false), 150)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-navy-700 hover:bg-slate-50 transition-colors"
              >
                <Headphones className="w-4 h-4" />
                {t('cs.title')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-in">
                  {customerServices.map((svc) => {
                    const Icon = svc.icon;
                    return (
                      <Link key={svc.to} to={svc.to} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-navy-50 hover:text-navy-700 transition-colors">
                        <Icon className="w-4 h-4" />
                        {svc.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <Link to="/register" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-navy-800 text-white text-sm font-bold hover:bg-navy-700 transition-colors shadow-sm">
              <UserPlus className="w-4 h-4" />
              {t('cs.register')}
            </Link>
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg text-navy-800" aria-label="Menu">
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <nav className="lg:hidden mt-4 pb-4 flex flex-col gap-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className={`nav-link ${isActive(link.to) ? 'nav-link-active' : ''}`}>
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 mt-2 pt-2">
              <p className="px-4 py-1 text-xs font-bold text-slate-400">{t('cs.title')}</p>
              {customerServices.map((svc) => {
                const Icon = svc.icon;
                return (
                  <Link key={svc.to} to={svc.to} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-navy-50 hover:text-navy-700 transition-colors">
                    <Icon className="w-4 h-4" />
                    {svc.label}
                  </Link>
                );
              })}
            </div>

            {/* Sélecteur de langue Mobile */}
            <div className="flex flex-col gap-2 mt-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2 px-4 py-1 text-slate-600 text-sm font-medium">
                <Globe className="w-4 h-4" />
                <div className="flex gap-2">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                        lang === l.code ? 'bg-navy-800 text-white font-bold' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <Link to="/register" className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-navy-800 text-white text-sm font-bold mt-1">
                <UserPlus className="w-4 h-4" />
                {t('cs.register')}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}