import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Menu, X, ChevronDown, UserPlus, FileText, MessageSquare,
  Globe, Check, Building2, FlaskConical, ChevronLeft, ChevronRight,
  ShieldAlert, Activity, CheckCircle2, Waves, LogIn, Users
} from 'lucide-react';
import { useLang, type Lang } from '@/lib/i18n';
import LabLogo from '@/components/LabLogo';

const languages: { code: Lang; label: string; native: string }[] = [
  { code: 'ar', label: 'العربية', native: 'العربية' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'Français', native: 'Français' },
];

export default function Header() {
  const location = useLocation();
  const { lang, setLang, t, dir } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'labs' | 'services' | 'cs' | 'lang' | null>(null);

  // Mobile accordion state
  const [mobileExpanded, setMobileExpanded] = useState<{ labs: boolean; services: boolean; cs: boolean }>({
    labs: true,
    services: false,
    cs: false,
  });

  // Container refs for click-outside detection
  const navRef = useRef<HTMLElement>(null);
  const labsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const csRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  // Hover grace period timer
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverTimeRef = useRef<number>(0);

  const Arrow = dir === 'rtl' ? ChevronLeft : ChevronRight;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Click outside detection for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!openDropdown) return;

      let currentRef: HTMLDivElement | null = null;
      if (openDropdown === 'labs') currentRef = labsRef.current;
      else if (openDropdown === 'services') currentRef = servicesRef.current;
      else if (openDropdown === 'cs') currentRef = csRef.current;
      else if (openDropdown === 'lang') {
        // May be desktop or mobile lang selector
        if (langRef.current?.contains(target) || mobileLangRef.current?.contains(target)) {
          return;
        }
        setOpenDropdown(null);
        return;
      }

      if (currentRef && !currentRef.contains(target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Global Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (openDropdown !== null) {
          setOpenDropdown(null);
        } else if (menuOpen) {
          setMenuOpen(false);
          mobileToggleRef.current?.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openDropdown, menuOpen]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const labItems = [
    { id: 'asir', name: t('nav.asir'), region: lang === 'ar' ? 'عسير' : 'Asir', path: '/laboratories/asir' },
    { id: 'najran', name: t('nav.najran'), region: lang === 'ar' ? 'نجران' : 'Najran', path: '/laboratories/najran' },
    { id: 'al-baha', name: t('nav.baha'), region: lang === 'ar' ? 'الباحة' : 'Al-Baha', path: '/laboratories/al-baha' },
    { id: 'jazan', name: t('nav.jazan'), region: lang === 'ar' ? 'جازان' : 'Jazan', path: '/laboratories/jazan' },
  ];

  const serviceItems = [
    { key: 'svc.drinking', icon: Waves, path: '/services' },
    { key: 'svc.chemical', icon: FlaskConical, path: '/services' },
    { key: 'svc.physical', icon: Activity, path: '/services' },
    { key: 'svc.microbiological', icon: ShieldAlert, path: '/services' },
    { key: 'svc.samples', icon: CheckCircle2, path: '/services' },
    { key: 'svc.specialized', icon: Building2, path: '/services' },
    { key: 'svc.monitoring', icon: Waves, path: '/services' },
  ];

  // Visitor Services: Registration, Survey, and Enquiry
  const customerServices = [
    { to: '/register', label: t('cs.register'), icon: UserPlus, desc: t('quick.register.desc') },
    { to: '/survey', label: t('cs.survey'), icon: FileText, desc: t('quick.survey.desc') },
    { to: '/enquiry', label: t('cs.enquiry'), icon: MessageSquare, desc: t('quick.enquiry.desc') },
  ];

  const currentLangObj = languages.find((l) => l.code === lang) || languages[0];

  // Hover handlers with debounce
  const handleMouseEnter = (dropdownKey: 'labs' | 'services' | 'cs' | 'lang') => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    hoverTimeRef.current = Date.now();
    setOpenDropdown(dropdownKey);
  };

  const handleMouseLeave = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
    }
    leaveTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Authoritative click handler that toggles or opens
  const handleButtonClick = (e: React.MouseEvent, dropdownKey: 'labs' | 'services' | 'cs' | 'lang') => {
    e.preventDefault();
    e.stopPropagation();
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    const timeSinceHover = Date.now() - hoverTimeRef.current;
    // If the user just hovered within 350ms and clicked to "open", keep it open!
    if (openDropdown === dropdownKey && timeSinceHover < 350) {
      return;
    }

    setOpenDropdown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  // Keyboard navigation handler for dropdown buttons
  const handleDropdownKeyDown = (e: React.KeyboardEvent, dropdownKey: 'labs' | 'services' | 'cs' | 'lang') => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpenDropdown(null);
    }
  };

  // Mobile accordion toggle
  const toggleMobileSection = (key: 'labs' | 'services' | 'cs') => {
    setMobileExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      {/* Skip to Main Content Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:px-3.5 focus:py-2 focus:bg-cyan-700 focus:text-white focus:font-semibold focus:text-xs focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        {lang === 'ar' ? 'الانتقال إلى المحتوى الرئيسي' : lang === 'fr' ? 'Passer au contenu principal' : 'Skip to main content'}
      </a>

      <header
        ref={navRef}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          menuOpen
            ? 'bg-white shadow-xl h-auto border-b border-slate-200'
            : scrolled
              ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 h-[70px] sm:h-[72px] md:h-[74px] lg:h-[76px]'
              : 'bg-white border-b border-slate-100 h-[72px] sm:h-[76px] md:h-[78px] lg:h-[80px]'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6 h-full">
          <div className="flex items-center justify-between h-full gap-2 sm:gap-3">

            {/* RTL: Right / LTR: Left -> [Official Logo + Official Website Name] */}
            <Link
              to="/"
              className="flex items-center shrink-0 rounded-lg py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 max-w-[280px] sm:max-w-xs md:max-w-md 2xl:max-w-none"
              aria-label={`${t('brand.name')} - ${t('nav.home')}`}
              onClick={() => {
                setOpenDropdown(null);
                setMenuOpen(false);
              }}
            >
              <LabLogo size="md" showSubtitle={false} />
            </Link>

            {/* Desktop Navigation & Actions Container */}
            <div className="hidden xl:flex items-center gap-1 2xl:gap-2 min-w-0 shrink">
              {/* Desktop Navigation Links — NOTE: No overflow-x-auto to prevent clipping absolute dropdowns */}
              <nav
                aria-label={lang === 'ar' ? 'التنقل الرئيسي' : 'Main Navigation'}
                className="flex items-center gap-0.5 2xl:gap-1 text-[13px] 2xl:text-[14px] py-1"
              >
                {/* 1. الرئيسية */}
                <Link
                  to="/"
                  aria-current={isActive('/') && location.pathname === '/' ? 'page' : undefined}
                  onClick={() => setOpenDropdown(null)}
                  className={`relative px-2 2xl:px-2.5 py-1.5 font-semibold transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 whitespace-nowrap shrink-0 ${
                    isActive('/') && location.pathname === '/'
                      ? 'text-cyan-700 bg-cyan-50/50'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.home')}
                  {isActive('/') && location.pathname === '/' && (
                    <span aria-hidden="true" className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-600 rounded-full animate-fade-in" />
                  )}
                </Link>

                {/* 2. عن المختبرات */}
                <Link
                  to="/about"
                  aria-current={isActive('/about') ? 'page' : undefined}
                  onClick={() => setOpenDropdown(null)}
                  className={`relative px-2 2xl:px-2.5 py-1.5 font-semibold transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 whitespace-nowrap shrink-0 ${
                    isActive('/about')
                      ? 'text-cyan-700 bg-cyan-50/50'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.about')}
                  {isActive('/about') && (
                    <span aria-hidden="true" className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-600 rounded-full animate-fade-in" />
                  )}
                </Link>

                {/* 3. المختبرات (Dropdown Menu) */}
                <div
                  ref={labsRef}
                  className="relative shrink-0"
                  onMouseEnter={() => handleMouseEnter('labs')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    id="nav-labs-button"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === 'labs'}
                    aria-controls="nav-labs-menu"
                    onClick={(e) => handleButtonClick(e, 'labs')}
                    onKeyDown={(e) => handleDropdownKeyDown(e, 'labs')}
                    className={`relative flex items-center gap-1 px-2 2xl:px-2.5 py-1.5 font-semibold transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 whitespace-nowrap cursor-pointer ${
                      isActive('/laboratories') || openDropdown === 'labs'
                        ? 'text-cyan-700 bg-cyan-50/60'
                        : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 aria-hidden="true" className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span>{t('nav.labs')}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === 'labs' ? 'rotate-180 text-cyan-600' : 'text-slate-400'
                      }`}
                    />
                    {isActive('/laboratories') && (
                      <span aria-hidden="true" className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-600 rounded-full animate-fade-in" />
                    )}
                  </button>

                  {openDropdown === 'labs' && (
                    <div
                      id="nav-labs-menu"
                      role="menu"
                      aria-labelledby="nav-labs-button"
                      className="absolute start-0 top-full mt-1.5 w-72 z-50 animate-fade-in focus:outline-none pointer-events-auto"
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2">
                        <div className="p-2 border-b border-slate-100 mb-1" role="presentation">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {t('hero.metric.regions')}
                          </p>
                        </div>
                        <div className="space-y-1" role="none">
                          {labItems.map((lab) => (
                            <Link
                              key={lab.id}
                              to={lab.path}
                              role="menuitem"
                              onClick={() => setOpenDropdown(null)}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-cyan-50/70 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                            >
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center text-slate-700 group-hover:bg-cyan-600 group-hover:text-white transition-colors" aria-hidden="true">
                                  <Building2 className="w-3.5 h-3.5" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-800 group-hover:text-cyan-800">
                                    {lab.name}
                                  </p>
                                  <p className="text-[10px] text-slate-400">{lab.region}</p>
                                </div>
                              </div>
                              <Arrow aria-hidden="true" className="w-3.5 h-3.5 text-slate-300 group-hover:text-cyan-600" />
                            </Link>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100" role="none">
                          <Link
                            to="/laboratories"
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-slate-50 hover:bg-cyan-50 text-xs font-semibold text-cyan-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                          >
                            <span>{t('nav.allLabs')}</span>
                            <Arrow aria-hidden="true" className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. الخدمات (Dropdown Menu) */}
                <div
                  ref={servicesRef}
                  className="relative shrink-0"
                  onMouseEnter={() => handleMouseEnter('services')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    id="nav-services-button"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === 'services'}
                    aria-controls="nav-services-menu"
                    onClick={(e) => handleButtonClick(e, 'services')}
                    onKeyDown={(e) => handleDropdownKeyDown(e, 'services')}
                    className={`relative flex items-center gap-1 px-2 2xl:px-2.5 py-1.5 font-semibold transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 whitespace-nowrap cursor-pointer ${
                      isActive('/services') || openDropdown === 'services'
                        ? 'text-cyan-700 bg-cyan-50/60'
                        : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                    }`}
                  >
                    <FlaskConical aria-hidden="true" className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span>{t('nav.services')}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === 'services' ? 'rotate-180 text-cyan-600' : 'text-slate-400'
                      }`}
                    />
                    {isActive('/services') && (
                      <span aria-hidden="true" className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-600 rounded-full animate-fade-in" />
                    )}
                  </button>

                  {openDropdown === 'services' && (
                    <div
                      id="nav-services-menu"
                      role="menu"
                      aria-labelledby="nav-services-button"
                      className="absolute start-0 top-full mt-1.5 w-80 z-50 animate-fade-in focus:outline-none pointer-events-auto"
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2">
                        <div className="p-2 border-b border-slate-100 mb-1" role="presentation">
                          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            {t('services.title')}
                          </p>
                        </div>
                        <div className="space-y-1" role="none">
                          {serviceItems.map((svc, i) => {
                            const Icon = svc.icon;
                            return (
                              <Link
                                key={i}
                                to={svc.path}
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-cyan-50/70 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                              >
                                <div className="w-7 h-7 rounded-md bg-cyan-50 flex items-center justify-center text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white transition-colors" aria-hidden="true">
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs font-semibold text-slate-700 group-hover:text-cyan-800">
                                  {t(svc.key)}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100" role="none">
                          <Link
                            to="/services"
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-slate-50 hover:bg-cyan-50 text-xs font-semibold text-cyan-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                          >
                            <span>{t('nav.allServices')}</span>
                            <Arrow aria-hidden="true" className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 5. خدمات الزوار (Dropdown Menu) */}
                <div
                  ref={csRef}
                  className="relative shrink-0"
                  onMouseEnter={() => handleMouseEnter('cs')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    id="nav-cs-button"
                    aria-haspopup="true"
                    aria-expanded={openDropdown === 'cs'}
                    aria-controls="nav-cs-menu"
                    onClick={(e) => handleButtonClick(e, 'cs')}
                    onKeyDown={(e) => handleDropdownKeyDown(e, 'cs')}
                    className={`relative flex items-center gap-1 px-2 2xl:px-2.5 py-1.5 font-semibold transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 whitespace-nowrap cursor-pointer ${
                      isActive('/register') || isActive('/survey') || isActive('/enquiry') || openDropdown === 'cs'
                        ? 'text-cyan-700 bg-cyan-50/60'
                        : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                    }`}
                  >
                    <Users aria-hidden="true" className="w-3.5 h-3.5 opacity-70 shrink-0" />
                    <span>{t('cs.title')}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        openDropdown === 'cs' ? 'rotate-180 text-cyan-600' : 'text-slate-400'
                      }`}
                    />
                    {(isActive('/register') || isActive('/survey') || isActive('/enquiry')) && (
                      <span aria-hidden="true" className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-600 rounded-full animate-fade-in" />
                    )}
                  </button>

                  {openDropdown === 'cs' && (
                    <div
                      id="nav-cs-menu"
                      role="menu"
                      aria-labelledby="nav-cs-button"
                      className="absolute start-0 top-full mt-1.5 w-72 z-50 animate-fade-in focus:outline-none pointer-events-auto"
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-2">
                        <div className="space-y-1" role="none">
                          {customerServices.map((svc) => {
                            const Icon = svc.icon;
                            return (
                              <Link
                                key={svc.to}
                                to={svc.to}
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-cyan-50/70 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                              >
                                <div className="w-8 h-8 rounded-lg bg-cyan-100/70 flex items-center justify-center text-cyan-700 group-hover:bg-cyan-600 group-hover:text-white transition-colors shrink-0 mt-0.5" aria-hidden="true">
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-slate-800 group-hover:text-cyan-800">
                                    {svc.label}
                                  </p>
                                  <p className="text-[11px] text-slate-400 line-clamp-1">{svc.desc}</p>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 6. الأخبار */}
                <Link
                  to="/news"
                  aria-current={isActive('/news') ? 'page' : undefined}
                  onClick={() => setOpenDropdown(null)}
                  className={`relative px-2 2xl:px-2.5 py-1.5 font-semibold transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 whitespace-nowrap shrink-0 ${
                    isActive('/news')
                      ? 'text-cyan-700 bg-cyan-50/50'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.news')}
                  {isActive('/news') && (
                    <span aria-hidden="true" className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-600 rounded-full animate-fade-in" />
                  )}
                </Link>

                {/* 7. تواصل معنا */}
                <Link
                  to="/contact"
                  aria-current={isActive('/contact') ? 'page' : undefined}
                  onClick={() => setOpenDropdown(null)}
                  className={`relative px-2 2xl:px-2.5 py-1.5 font-semibold transition-colors rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 whitespace-nowrap shrink-0 ${
                    isActive('/contact')
                      ? 'text-cyan-700 bg-cyan-50/50'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.contact')}
                  {isActive('/contact') && (
                    <span aria-hidden="true" className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-600 rounded-full animate-fade-in" />
                  )}
                </Link>

                {/* 8. بوابة الموظفين */}
                <Link
                  to="/admin"
                  aria-current={isActive('/admin') ? 'page' : undefined}
                  onClick={() => setOpenDropdown(null)}
                  className={`relative px-2 2xl:px-2.5 py-1.5 font-semibold transition-colors flex items-center gap-1.5 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 whitespace-nowrap shrink-0 ${
                    isActive('/admin')
                      ? 'text-cyan-700 bg-cyan-50/50'
                      : 'text-slate-700 hover:text-cyan-700 hover:bg-slate-50'
                  }`}
                >
                  <LogIn aria-hidden="true" className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  <span>{t('nav.admin')}</span>
                  {isActive('/admin') && (
                    <span aria-hidden="true" className="absolute bottom-0 left-2 right-2 h-[2px] bg-cyan-600 rounded-full animate-fade-in" />
                  )}
                </Link>
              </nav>

              {/* 9. Language Selector: Clean & Compact */}
              <div
                ref={langRef}
                className="relative shrink-0 ms-1 2xl:ms-2"
                onMouseEnter={() => handleMouseEnter('lang')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  id="lang-selector-button"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === 'lang'}
                  aria-controls="lang-selector-listbox"
                  aria-label={`Language: ${currentLangObj.label}`}
                  onClick={(e) => handleButtonClick(e, 'lang')}
                  onKeyDown={(e) => handleDropdownKeyDown(e, 'lang')}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-cyan-800 hover:bg-slate-100 border border-slate-200 bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 whitespace-nowrap shadow-xs cursor-pointer"
                >
                  <Globe aria-hidden="true" className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>{currentLangObj.label}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === 'lang' ? 'rotate-180 text-cyan-600' : 'text-slate-400'
                    }`}
                  />
                </button>

                {openDropdown === 'lang' && (
                  <div
                    id="lang-selector-listbox"
                    role="listbox"
                    aria-labelledby="lang-selector-button"
                    className="absolute end-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1 z-50 animate-fade-in focus:outline-none pointer-events-auto"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        role="option"
                        aria-selected={lang === l.code}
                        onClick={() => {
                          setLang(l.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-start transition-colors focus:outline-none focus:bg-cyan-100/70 cursor-pointer ${
                          lang === l.code
                            ? 'bg-cyan-50 text-cyan-800 font-semibold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Globe aria-hidden="true" className="w-3 h-3 text-cyan-600 opacity-60" />
                          <span>{l.label}</span>
                        </span>
                        {lang === l.code && <Check aria-hidden="true" className="w-3.5 h-3.5 text-cyan-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Controls: Compact Language Selector + Hamburger */}
            <div className="flex xl:hidden items-center gap-1.5">
              {/* Compact Mobile Language Switcher (🌐 العربية ▾) */}
              <div ref={mobileLangRef} className="relative">
                <button
                  type="button"
                  id="mobile-lang-btn"
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown === 'lang'}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdown(openDropdown === 'lang' ? null : 'lang');
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 cursor-pointer"
                >
                  <Globe aria-hidden="true" className="w-3 h-3 text-cyan-600" />
                  <span>{currentLangObj.label}</span>
                  <ChevronDown aria-hidden="true" className="w-2.5 h-2.5 text-slate-400" />
                </button>

                {openDropdown === 'lang' && (
                  <div className="absolute end-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-slate-100 py-1 z-50 animate-fade-in">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLang(l.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-xs text-start px-2.5 py-1.5 flex items-center justify-between cursor-pointer ${
                          lang === l.code ? 'font-semibold text-cyan-800 bg-cyan-50' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{l.label}</span>
                        {lang === l.code && <Check className="w-3 h-3 text-cyan-700" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle Button */}
              <button
                ref={mobileToggleRef}
                type="button"
                id="mobile-menu-button"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation-drawer"
                aria-label={menuOpen ? 'إغلاق القائمة الرئيسية' : 'فتح القائمة الرئيسية'}
                onClick={() => {
                  setOpenDropdown(null);
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 cursor-pointer"
              >
                {menuOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {menuOpen && (
            <div
              ref={mobileMenuRef}
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={lang === 'ar' ? 'قائمة التنقل للأجهزة الذكية' : 'Mobile Navigation Menu'}
              className="xl:hidden mt-2 pb-6 border-t border-slate-100 pt-3 flex flex-col gap-1.5 animate-fade-in max-h-[82vh] overflow-y-auto"
            >
              {/* Compact Language Selection in Drawer */}
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 mb-1">
                <p className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Globe aria-hidden="true" className="w-3 h-3 text-cyan-600" /> Language / اللغة
                </p>
                <div role="group" className="grid grid-cols-3 gap-1.5">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      aria-pressed={lang === l.code}
                      onClick={() => setLang(l.code)}
                      className={`py-1.5 px-1 text-xs font-semibold rounded-md text-center transition-colors flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 cursor-pointer ${
                        lang === l.code
                          ? 'bg-cyan-700 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Globe aria-hidden="true" className="w-3 h-3 opacity-60" />
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Direct Links and Expandable Sections */}
              <nav aria-label={lang === 'ar' ? 'روابط التنقل للأجهزة الذكية' : 'Mobile Nav Links'} className="flex flex-col gap-1">
                {/* 1. الرئيسية */}
                <Link
                  to="/"
                  aria-current={isActive('/') && location.pathname === '/' ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                    isActive('/') && location.pathname === '/'
                      ? 'bg-cyan-50 text-cyan-800'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.home')}
                </Link>

                {/* 2. عن المختبرات */}
                <Link
                  to="/about"
                  aria-current={isActive('/about') ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                    isActive('/about') ? 'bg-cyan-50 text-cyan-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.about')}
                </Link>

                {/* 3. المختبرات (Mobile Accordion Dropdown) */}
                <div className="rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection('labs')}
                    aria-expanded={mobileExpanded.labs}
                    className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                  >
                    <span className="flex items-center gap-1.5">
                      <Building2 aria-hidden="true" className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{t('nav.labs')}</span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        mobileExpanded.labs ? 'rotate-180 text-cyan-600' : ''
                      }`}
                    />
                  </button>
                  {mobileExpanded.labs && (
                    <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-slate-100 animate-fade-in">
                      {labItems.map((lab) => (
                        <Link
                          key={lab.id}
                          to={lab.path}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                        >
                          <span>{lab.name}</span>
                          <span className="text-[10px] text-slate-400">{lab.region}</span>
                        </Link>
                      ))}
                      <Link
                        to="/laboratories"
                        onClick={() => setMenuOpen(false)}
                        className="block px-2.5 py-1.5 rounded-md text-xs font-semibold text-cyan-700 hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                      >
                        {t('nav.allLabs')} ←
                      </Link>
                    </div>
                  )}
                </div>

                {/* 4. الخدمات (Mobile Accordion Dropdown) */}
                <div className="rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection('services')}
                    aria-expanded={mobileExpanded.services}
                    className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                  >
                    <span className="flex items-center gap-1.5">
                      <FlaskConical aria-hidden="true" className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{t('nav.services')}</span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        mobileExpanded.services ? 'rotate-180 text-cyan-600' : ''
                      }`}
                    />
                  </button>
                  {mobileExpanded.services && (
                    <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-slate-100 animate-fade-in">
                      {serviceItems.map((svc, i) => (
                        <Link
                          key={i}
                          to={svc.path}
                          onClick={() => setMenuOpen(false)}
                          className="block px-2.5 py-1 rounded-md text-xs font-medium text-slate-700 hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                        >
                          {t(svc.key)}
                        </Link>
                      ))}
                      <Link
                        to="/services"
                        onClick={() => setMenuOpen(false)}
                        className="block px-2.5 py-1.5 rounded-md text-xs font-semibold text-cyan-700 hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                      >
                        {t('nav.allServices')} ←
                      </Link>
                    </div>
                  )}
                </div>

                {/* 5. خدمات الزوار (Mobile Accordion Dropdown) */}
                <div className="rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleMobileSection('cs')}
                    aria-expanded={mobileExpanded.cs}
                    className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                  >
                    <span className="flex items-center gap-1.5">
                      <Users aria-hidden="true" className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{t('cs.title')}</span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                        mobileExpanded.cs ? 'rotate-180 text-cyan-600' : ''
                      }`}
                    />
                  </button>
                  {mobileExpanded.cs && (
                    <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-slate-100 animate-fade-in">
                      {customerServices.map((svc) => (
                        <Link
                          key={svc.to}
                          to={svc.to}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs font-semibold text-slate-700 hover:bg-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600"
                        >
                          <svc.icon aria-hidden="true" className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                          <span>{svc.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* 6. الأخبار */}
                <Link
                  to="/news"
                  aria-current={isActive('/news') ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                    isActive('/news') ? 'bg-cyan-50 text-cyan-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.news')}
                </Link>

                {/* 7. تواصل معنا */}
                <Link
                  to="/contact"
                  aria-current={isActive('/contact') ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                    isActive('/contact') ? 'bg-cyan-50 text-cyan-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.contact')}
                </Link>

                {/* 8. بوابة الموظفين */}
                <Link
                  to="/admin"
                  aria-current={isActive('/admin') ? 'page' : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 ${
                    isActive('/admin') ? 'bg-cyan-50 text-cyan-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <LogIn aria-hidden="true" className="w-4 h-4 text-cyan-600" />
                  <span>{t('nav.admin')}</span>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
