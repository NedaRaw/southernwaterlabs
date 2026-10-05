import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  UserPlus,
  FileText,
  MessageSquare,
  Globe,
  Check,
  Building2,
  FlaskConical,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Waves,
  LogIn,
  Users,
  Sun,
  Moon,
  Truck,
} from 'lucide-react';
import { useLang, type Lang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import LabLogo from '@/components/LabLogo';

const languages: { code: Lang; label: string; native: string }[] = [
  { code: 'ar', label: 'العربية', native: 'العربية' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'fr', label: 'Français', native: 'Français' },
];

export default function Header() {
  const location = useLocation();
  const { lang, setLang, t, dir } = useLang();
  const { theme, toggleTheme } = useTheme();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<
    'labs' | 'services' | 'mobile' | 'cs' | 'lang' | null
  >(null);

  // Mobile accordion state
  const [mobileExpanded, setMobileExpanded] = useState<{
    labs: boolean;
    services: boolean;
    mobile: boolean;
    cs: boolean;
  }>({
    labs: true,
    services: false,
    mobile: false,
    cs: false,
  });

  // Container refs for click-outside detection
  const navRef = useRef<HTMLElement>(null);
  const labsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const csRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  // Hover grace period timer
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverTimeRef = useRef<number>(0);

  const Arrow = dir === 'rtl' ? ChevronLeft : ChevronRight;

  // ============================================================
  // SCROLL
  // ============================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ============================================================
  // CLOSE MENUS ON ROUTE CHANGE
  // ============================================================

  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // ============================================================
  // CLICK OUTSIDE DETECTION
  // ============================================================

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (!openDropdown) return;

      let currentRef: HTMLDivElement | null = null;

      if (openDropdown === 'labs') {
        currentRef = labsRef.current;
      } else if (openDropdown === 'services') {
        currentRef = servicesRef.current;
      } else if (openDropdown === 'mobile') {
        currentRef = mobileRef.current;
      } else if (openDropdown === 'cs') {
        currentRef = csRef.current;
      } else if (openDropdown === 'lang') {
        if (
          langRef.current?.contains(target) ||
          mobileLangRef.current?.contains(target)
        ) {
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

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  // ============================================================
  // ESCAPE KEY
  // ============================================================

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

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openDropdown, menuOpen]);

  // ============================================================
  // CLEANUP TIMERS
  // ============================================================

  useEffect(() => {
    return () => {
      if (leaveTimerRef.current) {
        clearTimeout(leaveTimerRef.current);
      }
    };
  }, []);

  // ============================================================
  // ACTIVE ROUTE
  // ============================================================

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }

    return location.pathname.startsWith(path);
  };

  // ============================================================
  // CENTRAL LABORATORIES
  // ONLY THE 4 CENTRAL LABS
  // ============================================================

  const labItems = [
    {
      id: 'asir',
      name: t('nav.asir'),
      region: lang === 'ar' ? 'عسير' : 'Asir',
      path: '/laboratories/asir',
    },
    {
      id: 'najran',
      name: t('nav.najran'),
      region: lang === 'ar' ? 'نجران' : 'Najran',
      path: '/laboratories/najran',
    },
    {
      id: 'al-baha',
      name: t('nav.baha'),
      region: lang === 'ar' ? 'الباحة' : 'Al-Baha',
      path: '/laboratories/al-baha',
    },
    {
      id: 'jazan',
      name: t('nav.jazan'),
      region: lang === 'ar' ? 'جازان' : 'Jazan',
      path: '/laboratories/jazan',
    },
  ];

  // ============================================================
  // MOBILE LABORATORY UNITS
  // ONLY THE 4 CENTRAL LABORATORIES
  // NO BRANCHES
  // ============================================================

  const mobileUnitItems = [
    {
      id: 'asir',
      name:
        lang === 'ar'
          ? 'وحدة المختبر المركزي بعسير'
          : lang === 'fr'
            ? "Unité Mobile du Laboratoire Central d’Asir"
            : 'Asir Central Mobile Unit',
      region:
        lang === 'ar'
          ? 'عسير'
          : lang === 'fr'
            ? 'Asir'
            : 'Asir',
      path: '/mobile-laboratories#mobile-asir',
    },
    {
      id: 'najran',
      name:
        lang === 'ar'
          ? 'وحدة المختبر المركزي بنجران'
          : lang === 'fr'
            ? 'Unité Mobile du Laboratoire Central de Najran'
            : 'Najran Central Mobile Unit',
      region:
        lang === 'ar'
          ? 'نجران'
          : lang === 'fr'
            ? 'Najran'
            : 'Najran',
      path: '/mobile-laboratories#mobile-najran',
    },
    {
      id: 'al-baha',
      name:
        lang === 'ar'
          ? 'وحدة المختبر المركزي بالباحة'
          : lang === 'fr'
            ? "Unité Mobile du Laboratoire Central d’Al-Baha"
            : 'Al-Baha Central Mobile Unit',
      region:
        lang === 'ar'
          ? 'الباحة'
          : lang === 'fr'
            ? 'Al-Baha'
            : 'Al-Baha',
      path: '/mobile-laboratories#mobile-baha',
    },
    {
      id: 'jazan',
      name:
        lang === 'ar'
          ? 'وحدة المختبر المركزي بجازان'
          : lang === 'fr'
            ? 'Unité Mobile du Laboratoire Central de Jazan'
            : 'Jazan Central Mobile Unit',
      region:
        lang === 'ar'
          ? 'جازان'
          : lang === 'fr'
            ? 'Jazan'
            : 'Jazan',
      path: '/mobile-laboratories#mobile-jazan',
    },
  ];

  // ============================================================
  // SERVICES
  // Mobile Laboratories removed from here
  // because it has its own dedicated dropdown
  // ============================================================

  const serviceItems = [
    {
      key: 'svc.drinking',
      icon: Waves,
      path: '/services/water-treatment',
    },
    {
      key: 'svc.chemical',
      icon: FlaskConical,
      path: '/services/chemical',
    },
    {
      key: 'svc.physical',
      icon: Activity,
      path: '/services/chemical',
    },
    {
      key: 'svc.microbiological',
      icon: ShieldAlert,
      path: '/services/microbiological',
    },
    {
      key: 'svc.samples',
      icon: CheckCircle2,
      path: '/services/field-sampling',
    },
    {
      key: 'svc.specialized',
      icon: Building2,
      path: '/services/consultation',
    },
    {
      key: 'svc.monitoring',
      icon: Waves,
      path: '/services/quality-monitoring',
    },
  ];

  // ============================================================
  // CUSTOMER SERVICES
  // ============================================================

  const customerServices = [
    {
      to: '/register',
      label: t('cs.register'),
      icon: UserPlus,
      desc: t('quick.register.desc'),
    },
    {
      to: '/survey',
      label: t('cs.survey'),
      icon: FileText,
      desc: t('quick.survey.desc'),
    },
    {
      to: '/enquiry',
      label: t('cs.enquiry'),
      icon: MessageSquare,
      desc: t('quick.enquiry.desc'),
    },
  ];

  const currentLangObj =
    languages.find((l) => l.code === lang) || languages[0];

  // ============================================================
  // HOVER HANDLERS
  // ============================================================

  const handleMouseEnter = (
    dropdownKey: 'labs' | 'services' | 'mobile' | 'cs' | 'lang'
  ) => {
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

  // ============================================================
  // DROPDOWN CLICK HANDLER
  // ============================================================

  const handleButtonClick = (
    e: React.MouseEvent,
    dropdownKey: 'labs' | 'services' | 'mobile' | 'cs' | 'lang'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    const timeSinceHover = Date.now() - hoverTimeRef.current;

    if (
      openDropdown === dropdownKey &&
      timeSinceHover < 350
    ) {
      return;
    }

    setOpenDropdown((prev) =>
      prev === dropdownKey ? null : dropdownKey
    );
  };

  // ============================================================
  // KEYBOARD NAVIGATION
  // ============================================================

  const handleDropdownKeyDown = (
    e: React.KeyboardEvent,
    dropdownKey: 'labs' | 'services' | 'mobile' | 'cs' | 'lang'
  ) => {
    if (
      e.key === 'ArrowDown' ||
      e.key === 'Enter' ||
      e.key === ' '
    ) {
      e.preventDefault();

      setOpenDropdown(
        openDropdown === dropdownKey ? null : dropdownKey
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpenDropdown(null);
    }
  };

  // ============================================================
  // MOBILE ACCORDION
  // ============================================================

  const toggleMobileSection = (
    key: 'labs' | 'services' | 'mobile' | 'cs'
  ) => {
    setMobileExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <>
      {/* ======================================================
          SKIP TO MAIN CONTENT
      ====================================================== */}

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[100] focus:px-3.5 focus:py-2 focus:bg-[#0F4C81] focus:text-white focus:font-semibold focus:text-xs focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        {lang === 'ar'
          ? 'الانتقال إلى المحتوى الرئيسي'
          : lang === 'fr'
            ? 'Passer au contenu principal'
            : 'Skip to main content'}
      </a>

      {/* ======================================================
          PRIMARY FIXED HEADER
      ====================================================== */}

      <header
        ref={navRef}
        role="banner"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          menuOpen
            ? 'bg-white dark:bg-[#111827] shadow-md h-auto border-b border-[#E2E8F0] dark:border-[#334155]'
            : scrolled
              ? 'bg-white/98 dark:bg-[#111827]/98 backdrop-blur-md shadow-sm border-b border-[#E2E8F0] dark:border-[#334155] h-[52px] lg:h-[54px]'
              : 'bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#334155] h-[52px] lg:h-[54px]'
        }`}
      >
        <div className="max-w-[1560px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full gap-3 lg:gap-4 xl:gap-6">

            {/* ==================================================
                ZONE 1 - LOGO
            ================================================== */}

            <Link
              to="/"
              className="flex items-center shrink-0 rounded-lg py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-opacity hover:opacity-95"
              aria-label={`${t('brand.name')} - ${t('nav.home')}`}
              onClick={() => {
                setOpenDropdown(null);
                setMenuOpen(false);
              }}
            >
              <LabLogo size="sm" showSubtitle={false} />
            </Link>

            {/* ==================================================
                ZONE 2 - DESKTOP NAVIGATION
            ================================================== */}

            <nav
              aria-label={
                lang === 'ar'
                  ? 'التنقل الرئيسي'
                  : 'Main Navigation'
              }
              className="hidden xl:flex items-center gap-1 2xl:gap-1.5 text-[13px] 2xl:text-[13.5px] py-1"
            >

              {/* ==================================================
                  1. HOME
              ================================================== */}

              <Link
                to="/"
                aria-current={
                  isActive('/') &&
                  location.pathname === '/'
                    ? 'page'
                    : undefined
                }
                onClick={() => setOpenDropdown(null)}
                className={`header-nav-link relative px-2.5 py-1.5 font-medium transition-all rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 ${
                  isActive('/') &&
                  location.pathname === '/'
                    ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] font-semibold'
                    : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.12)]'
                }`}
              >
                {t('nav.home')}

                {isActive('/') &&
                  location.pathname === '/' && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#2563EB] dark:bg-[#60A5FA] rounded-full animate-fade-in"
                    />
                  )}
              </Link>

              {/* ==================================================
                  2. ABOUT
              ================================================== */}

              <Link
                to="/about"
                aria-current={
                  isActive('/about')
                    ? 'page'
                    : undefined
                }
                onClick={() => setOpenDropdown(null)}
                className={`header-nav-link relative px-2.5 py-1.5 font-medium transition-all rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 ${
                  isActive('/about')
                    ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] font-semibold'
                    : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.12)]'
                }`}
              >
                {t('nav.about')}

                {isActive('/about') && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#2563EB] dark:bg-[#60A5FA] rounded-full animate-fade-in"
                  />
                )}
              </Link>

              {/* ==================================================
                  3. LABORATORIES
              ================================================== */}

              <div
                ref={labsRef}
                className="relative shrink-0"
                onMouseEnter={() =>
                  handleMouseEnter('labs')
                }
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  id="nav-labs-button"
                  aria-haspopup="true"
                  aria-expanded={
                    openDropdown === 'labs'
                  }
                  aria-controls="nav-labs-menu"
                  onClick={(e) =>
                    handleButtonClick(e, 'labs')
                  }
                  onKeyDown={(e) =>
                    handleDropdownKeyDown(
                      e,
                      'labs'
                    )
                  }
                  className={`header-nav-link relative flex items-center gap-1.5 px-2.5 py-1.5 font-medium transition-all rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap cursor-pointer group ${
                    isActive('/laboratories') ||
                    openDropdown === 'labs'
                      ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] font-semibold'
                      : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.12)]'
                  }`}
                >
                  <Building2
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0 text-current"
                  />

                  <span>{t('nav.labs')}</span>

                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-current ${
                      openDropdown === 'labs'
                        ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : ''
                    }`}
                  />

                  {isActive('/laboratories') && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#2563EB] dark:bg-[#60A5FA] rounded-full animate-fade-in"
                    />
                  )}
                </button>

                {openDropdown === 'labs' && (
                  <div
                    id="nav-labs-menu"
                    role="menu"
                    aria-labelledby="nav-labs-button"
                    className="absolute start-0 top-full mt-2 w-72 z-50 animate-fade-in focus:outline-none pointer-events-auto"
                  >
                    <div className="bg-white dark:bg-[#172033] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2">

                      <div
                        className="p-2 border-b border-[#E2E8F0] dark:border-[#334155] mb-1"
                        role="presentation"
                      >
                        <p className="text-xs font-semibold text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-wider">
                          {t('hero.metric.regions')}
                        </p>
                      </div>

                      <div
                        className="space-y-1"
                        role="none"
                      >
                        {labItems.map((lab) => (
                          <Link
                            key={lab.id}
                            to={lab.path}
                            role="menuitem"
                            onClick={() =>
                              setOpenDropdown(null)
                            }
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.16)] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          >
                            <div className="flex items-center gap-2.5">
                              <div
                                className="w-7 h-7 rounded-md bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] group-hover:bg-[#2563EB] group-hover:text-white transition-colors"
                                aria-hidden="true"
                              >
                                <Building2 className="w-3.5 h-3.5" />
                              </div>

                              <div>
                                <p className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD]">
                                  {lab.name}
                                </p>

                                <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1]">
                                  {lab.region}
                                </p>
                              </div>
                            </div>

                            <Arrow
                              aria-hidden="true"
                              className="w-3.5 h-3.5 text-current opacity-60 group-hover:opacity-100 group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD]"
                            />
                          </Link>
                        ))}
                      </div>

                      <div
                        className="mt-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]"
                        role="none"
                      >
                        <Link
                          to="/laboratories"
                          role="menuitem"
                          onClick={() =>
                            setOpenDropdown(null)
                          }
                          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-slate-50 dark:bg-[#1E293B] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(37,99,235,0.20)] text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <span>
                            {t('nav.allLabs')}
                          </span>

                          <Arrow
                            aria-hidden="true"
                            className="w-3.5 h-3.5"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================================================
                  4. SERVICES
              ================================================== */}

              <div
                ref={servicesRef}
                className="relative shrink-0"
                onMouseEnter={() =>
                  handleMouseEnter('services')
                }
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  id="nav-services-button"
                  aria-haspopup="true"
                  aria-expanded={
                    openDropdown === 'services'
                  }
                  aria-controls="nav-services-menu"
                  onClick={(e) =>
                    handleButtonClick(
                      e,
                      'services'
                    )
                  }
                  onKeyDown={(e) =>
                    handleDropdownKeyDown(
                      e,
                      'services'
                    )
                  }
                  className={`header-nav-link relative flex items-center gap-1.5 px-2.5 py-1.5 font-medium transition-all rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap cursor-pointer group ${
                    isActive('/services') ||
                    openDropdown === 'services'
                      ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] font-semibold'
                      : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.12)]'
                  }`}
                >
                  <FlaskConical
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0 text-current"
                  />

                  <span>{t('nav.services')}</span>

                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-current ${
                      openDropdown === 'services'
                        ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : ''
                    }`}
                  />

                  {isActive('/services') && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#2563EB] dark:bg-[#60A5FA] rounded-full animate-fade-in"
                    />
                  )}
                </button>

                {openDropdown === 'services' && (
                  <div
                    id="nav-services-menu"
                    role="menu"
                    aria-labelledby="nav-services-button"
                    className="absolute start-0 top-full mt-2 w-80 z-50 animate-fade-in focus:outline-none pointer-events-auto"
                  >
                    <div className="bg-white dark:bg-[#172033] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2">

                      <div
                        className="p-2 border-b border-[#E2E8F0] dark:border-[#334155] mb-1"
                        role="presentation"
                      >
                        <p className="text-xs font-semibold text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-wider">
                          {t('services.title')}
                        </p>
                      </div>

                      <div
                        className="space-y-1"
                        role="none"
                      >
                        {serviceItems.map(
                          (svc, i) => {
                            const Icon = svc.icon;

                            return (
                              <Link
                                key={i}
                                to={svc.path}
                                role="menuitem"
                                onClick={() =>
                                  setOpenDropdown(
                                    null
                                  )
                                }
                                className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.16)] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                              >
                                <div
                                  className="w-7 h-7 rounded-md bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] group-hover:bg-[#2563EB] group-hover:text-white transition-colors"
                                  aria-hidden="true"
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                </div>

                                <span className="text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD]">
                                  {t(svc.key)}
                                </span>
                              </Link>
                            );
                          }
                        )}
                      </div>

                      <div
                        className="mt-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]"
                        role="none"
                      >
                        <Link
                          to="/services"
                          role="menuitem"
                          onClick={() =>
                            setOpenDropdown(null)
                          }
                          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg bg-slate-50 dark:bg-[#1E293B] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(37,99,235,0.20)] text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <span>
                            {t('nav.allServices')}
                          </span>

                          <Arrow
                            aria-hidden="true"
                            className="w-3.5 h-3.5"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================================================
                  4.5. MOBILE LABORATORY UNITS
                  ONLY 4 CENTRAL LABS + ALL MOBILE UNITS
              ================================================== */}

              <div
                ref={mobileRef}
                className="relative shrink-0"
                onMouseEnter={() =>
                  handleMouseEnter('mobile')
                }
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  id="nav-mobile-laboratories-button"
                  aria-haspopup="true"
                  aria-expanded={
                    openDropdown === 'mobile'
                  }
                  aria-controls="nav-mobile-laboratories-menu"
                  aria-label={t(
                    'nav.mobileLabs'
                  )}
                  title={t('nav.mobileLabs')}
                  onClick={(e) =>
                    handleButtonClick(
                      e,
                      'mobile'
                    )
                  }
                  onKeyDown={(e) =>
                    handleDropdownKeyDown(
                      e,
                      'mobile'
                    )
                  }
                  className={`header-nav-link relative flex items-center gap-1.5 px-2.5 py-1.5 font-medium transition-all rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap cursor-pointer group ${
                    isActive(
                      '/mobile-laboratories'
                    ) ||
                    openDropdown === 'mobile'
                      ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] font-semibold'
                      : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.12)]'
                  }`}
                >
                  <Truck
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0 text-current rtl:-scale-x-100"
                  />

                  <span>
                    {t('nav.mobileLabs')}
                  </span>

                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openDropdown === 'mobile'
                        ? 'rotate-180'
                        : ''
                    }`}
                  />

                  {isActive(
                    '/mobile-laboratories'
                  ) && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#2563EB] dark:bg-[#60A5FA] rounded-full animate-fade-in"
                    />
                  )}
                </button>

                {openDropdown === 'mobile' && (
                  <div
                    id="nav-mobile-laboratories-menu"
                    role="menu"
                    aria-labelledby="nav-mobile-laboratories-button"
                    className="absolute start-0 top-full mt-2 w-80 z-50 animate-fade-in focus:outline-none pointer-events-auto"
                  >
                    <div className="bg-white dark:bg-[#172033] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2">

                      {/* Dropdown title */}
                      <div
                        className="p-2 border-b border-[#E2E8F0] dark:border-[#334155] mb-1"
                        role="presentation"
                      >
                        <p className="text-xs font-semibold text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-wider">
                          {lang === 'ar'
                            ? 'الوحدات المتنقلة للمختبرات المركزية'
                            : lang === 'fr'
                              ? 'Unités mobiles des laboratoires centraux'
                              : 'Central Laboratory Mobile Units'}
                        </p>
                      </div>

                      {/* EXACTLY 4 CENTRAL UNITS */}
                      <div
                        className="space-y-1"
                        role="none"
                      >
                        {mobileUnitItems.map(
                          (unit) => (
                            <Link
                              key={unit.id}
                              to={unit.path}
                              role="menuitem"
                              onClick={() =>
                                setOpenDropdown(
                                  null
                                )
                              }
                              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.16)] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">

                                <div
                                  className="w-8 h-8 rounded-md bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] group-hover:bg-[#2563EB] group-hover:text-white transition-colors shrink-0"
                                  aria-hidden="true"
                                >
                                  <Truck className="w-4 h-4" />
                                </div>

                                <div className="min-w-0">
                                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD]">
                                    {unit.name}
                                  </p>

                                  <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
                                    {unit.region}
                                  </p>
                                </div>
                              </div>

                              <Arrow
                                aria-hidden="true"
                                className="w-3.5 h-3.5 text-current opacity-60 group-hover:opacity-100 group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] shrink-0"
                              />
                            </Link>
                          )
                        )}
                      </div>

                      {/* ==================================================
                          ALL MOBILE LABORATORIES
                      ================================================== */}

                      <div
                        className="mt-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]"
                        role="none"
                      >
                        <Link
                          to="/mobile-laboratories"
                          role="menuitem"
                          onClick={() =>
                            setOpenDropdown(null)
                          }
                          className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-[#1E293B] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(37,99,235,0.20)] transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">

                            <div
                              className="w-8 h-8 rounded-md bg-white dark:bg-[#172033] flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] group-hover:bg-[#2563EB] group-hover:text-white transition-colors shrink-0"
                              aria-hidden="true"
                            >
                              <Truck className="w-4 h-4" />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-[#1E3A5F] dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD]">
                                {lang === 'ar'
                                  ? 'كافة الوحدات المتنقلة'
                                  : lang === 'fr'
                                    ? 'Toutes les unités mobiles'
                                    : 'All Mobile Units'}
                              </p>

                              <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
                                {lang === 'ar'
                                  ? 'عرض جميع الوحدات المتنقلة'
                                  : lang === 'fr'
                                    ? 'Voir toutes les unités mobiles'
                                    : 'View all mobile units'}
                              </p>
                            </div>
                          </div>

                          <Arrow
                            aria-hidden="true"
                            className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] shrink-0"
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================================================
                  5. CUSTOMER SERVICES
              ================================================== */}

              <div
                ref={csRef}
                className="relative shrink-0"
                onMouseEnter={() =>
                  handleMouseEnter('cs')
                }
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  id="nav-cs-button"
                  aria-haspopup="true"
                  aria-expanded={
                    openDropdown === 'cs'
                  }
                  aria-controls="nav-cs-menu"
                  onClick={(e) =>
                    handleButtonClick(e, 'cs')
                  }
                  onKeyDown={(e) =>
                    handleDropdownKeyDown(e, 'cs')
                  }
                  className={`header-nav-link relative flex items-center gap-1.5 px-2.5 py-1.5 font-medium transition-all rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap cursor-pointer group ${
                    isActive('/register') ||
                    isActive('/survey') ||
                    isActive('/enquiry') ||
                    openDropdown === 'cs'
                      ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] font-semibold'
                      : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.12)]'
                  }`}
                >
                  <Users
                    aria-hidden="true"
                    className="w-4 h-4 shrink-0 text-current"
                  />

                  <span>{t('cs.title')}</span>

                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-current ${
                      openDropdown === 'cs'
                        ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : ''
                    }`}
                  />

                  {(
                    isActive('/register') ||
                    isActive('/survey') ||
                    isActive('/enquiry')
                  ) && (
                    <span
                      aria-hidden="true"
                      className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#2563EB] dark:bg-[#60A5FA] rounded-full animate-fade-in"
                    />
                  )}
                </button>

                {openDropdown === 'cs' && (
                  <div
                    id="nav-cs-menu"
                    role="menu"
                    aria-labelledby="nav-cs-button"
                    className="absolute start-0 top-full mt-2 w-[420px] sm:w-[460px] z-50 animate-fade-in focus:outline-none pointer-events-auto"
                  >
                    <div className="bg-white dark:bg-[#172033] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] p-2.5">

                      <div
                        className="p-2 border-b border-[#E2E8F0] dark:border-[#334155] mb-1.5"
                        role="presentation"
                      >
                        <p className="text-xs font-semibold text-[#64748B] dark:text-[#CBD5E1] uppercase tracking-wider">
                          {t('cs.title')}
                        </p>
                      </div>

                      <div
                        className="space-y-1.5"
                        role="none"
                      >
                        {customerServices.map(
                          (svc) => {
                            const Icon = svc.icon;

                            return (
                              <Link
                                key={svc.to}
                                to={svc.to}
                                role="menuitem"
                                onClick={() =>
                                  setOpenDropdown(
                                    null
                                  )
                                }
                                className="flex items-start gap-3.5 p-3 rounded-xl hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.16)] transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                              >
                                <div
                                  className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] group-hover:bg-[#2563EB] group-hover:text-white transition-all shrink-0 mt-0.5 shadow-2xs"
                                  aria-hidden="true"
                                >
                                  <Icon className="w-5 h-5" />
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] whitespace-nowrap">
                                    {svc.label}
                                  </p>

                                  <p className="text-xs text-[#64748B] dark:text-[#CBD5E1] mt-1 leading-relaxed font-normal">
                                    {svc.desc}
                                  </p>
                                </div>
                              </Link>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================================================
                  6. NEWS
              ================================================== */}

              <Link
                to="/news"
                aria-current={
                  isActive('/news')
                    ? 'page'
                    : undefined
                }
                onClick={() => setOpenDropdown(null)}
                className={`header-nav-link relative px-2.5 py-1.5 font-medium transition-all rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 ${
                  isActive('/news')
                    ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] font-semibold'
                    : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.12)]'
                }`}
              >
                {t('nav.news')}

                {isActive('/news') && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#2563EB] dark:bg-[#60A5FA] rounded-full animate-fade-in"
                  />
                )}
              </Link>

              {/* ==================================================
                  7. CONTACT
              ================================================== */}

              <Link
                to="/contact"
                aria-current={
                  isActive('/contact')
                    ? 'page'
                    : undefined
                }
                onClick={() => setOpenDropdown(null)}
                className={`header-nav-link relative px-2.5 py-1.5 font-medium transition-all rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 ${
                  isActive('/contact')
                    ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] font-semibold'
                    : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.12)]'
                }`}
              >
                {t('nav.contact')}

                {isActive('/contact') && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-2.5 right-2.5 h-[2.5px] bg-[#2563EB] dark:bg-[#60A5FA] rounded-full animate-fade-in"
                  />
                )}
              </Link>
            </nav>

            {/* ==================================================
                ZONE 3 - DESKTOP CONTROLS
            ================================================== */}

            <div className="hidden xl:flex items-center gap-2 2xl:gap-2.5 shrink-0">

              {/* LANGUAGE */}

              <div
                ref={langRef}
                className="relative shrink-0"
                onMouseEnter={() =>
                  handleMouseEnter('lang')
                }
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  id="lang-selector-button"
                  aria-haspopup="listbox"
                  aria-expanded={
                    openDropdown === 'lang'
                  }
                  aria-controls="lang-selector-listbox"
                  aria-label={`Language: ${currentLangObj.label}`}
                  onClick={(e) =>
                    handleButtonClick(e, 'lang')
                  }
                  onKeyDown={(e) =>
                    handleDropdownKeyDown(
                      e,
                      'lang'
                    )
                  }
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[#263244] border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#172033] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shadow-xs cursor-pointer"
                >
                  <Globe
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-current shrink-0"
                  />

                  <span>
                    {currentLangObj.label}
                  </span>

                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-current ${
                      openDropdown === 'lang'
                        ? 'rotate-180 text-[#1D4ED8] dark:text-[#60A5FA]'
                        : ''
                    }`}
                  />
                </button>

                {openDropdown === 'lang' && (
                  <div
                    id="lang-selector-listbox"
                    role="listbox"
                    aria-labelledby="lang-selector-button"
                    className="absolute end-0 mt-2 w-36 bg-white dark:bg-[#172033] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] py-1 z-50 animate-fade-in focus:outline-none pointer-events-auto"
                  >
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        role="option"
                        aria-selected={
                          lang === l.code
                        }
                        onClick={() => {
                          setLang(l.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-start transition-colors focus:outline-none cursor-pointer ${
                          lang === l.code
                            ? 'bg-[#EFF6FF] dark:bg-[#263244] text-[#1D4ED8] dark:text-[#93C5FD] font-semibold'
                            : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Globe
                            aria-hidden="true"
                            className="w-3 h-3 text-current opacity-75"
                          />

                          <span>{l.label}</span>
                        </span>

                        {lang === l.code && (
                          <Check
                            aria-hidden="true"
                            className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#93C5FD]"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* THEME */}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === 'dark'
                    ? lang === 'ar'
                      ? 'التبديل إلى الوضع النهاري'
                      : lang === 'fr'
                        ? 'Passer au mode clair'
                        : 'Switch to light mode'
                    : lang === 'ar'
                      ? 'التبديل إلى الوضع الليلي'
                      : lang === 'fr'
                        ? 'Passer au mode sombre'
                        : 'Switch to dark mode'
                }
                title={
                  theme === 'dark'
                    ? lang === 'ar'
                      ? 'الوضع النهاري'
                      : 'Light Mode'
                    : lang === 'ar'
                      ? 'الوضع الليلي'
                      : 'Dark Mode'
                }
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[#263244] border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#1E293B] transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus:ring-blue-600 shadow-xs cursor-pointer group"
              >
                {theme === 'dark' ? (
                  <Sun
                    aria-hidden="true"
                    className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform"
                  />
                ) : (
                  <Moon
                    aria-hidden="true"
                    className="w-4 h-4 text-current group-hover:-rotate-12 transition-transform"
                  />
                )}
              </button>

              {/* ADMIN */}

              <Link
                to="/admin"
                className={`header-nav-link flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-xs border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#172033] hover:border-[#93C5FD] active:scale-95 shrink-0 ${
                  isActive('/admin')
                    ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] border-[#2563EB]'
                    : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[rgba(59,130,246,0.12)]'
                }`}
              >
                <LogIn
                  aria-hidden="true"
                  className="w-3.5 h-3.5 text-current shrink-0"
                />

                <span>{t('nav.admin')}</span>
              </Link>
            </div>

            {/* ==================================================
                MOBILE HEADER CONTROLS
            ================================================== */}

            <div className="flex xl:hidden items-center gap-1.5">

              {/* THEME */}

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === 'dark'
                    ? 'Switch to light mode'
                    : 'Switch to dark mode'
                }
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[#334155] dark:text-[#F8FAFC] bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#334155] transition-all duration-200 active:scale-95 cursor-pointer shadow-xs"
              >
                {theme === 'dark' ? (
                  <Sun
                    aria-hidden="true"
                    className="w-4 h-4 text-amber-400"
                  />
                ) : (
                  <Moon
                    aria-hidden="true"
                    className="w-4 h-4 text-[#334155]"
                  />
                )}
              </button>

              {/* MOBILE LANGUAGE */}

              <div
                ref={mobileLangRef}
                className="relative"
              >
                <button
                  type="button"
                  id="mobile-lang-btn"
                  aria-haspopup="listbox"
                  aria-expanded={
                    openDropdown === 'lang'
                  }
                  onClick={(e) => {
                    e.stopPropagation();

                    setOpenDropdown(
                      openDropdown === 'lang'
                        ? null
                        : 'lang'
                    );
                  }}
                  className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-[#334155] dark:text-[#F8FAFC] bg-white dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#334155] cursor-pointer shadow-xs"
                >
                  <Globe
                    aria-hidden="true"
                    className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#60A5FA]"
                  />

                  <span>
                    {currentLangObj.label}
                  </span>

                  <ChevronDown
                    aria-hidden="true"
                    className="w-3 h-3 text-slate-400"
                  />
                </button>

                {openDropdown === 'lang' && (
                  <div className="absolute end-0 mt-2 w-32 bg-white dark:bg-[#172033] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] py-1 z-50 animate-fade-in">
                    {languages.map((l) => (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          setLang(l.code);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-xs text-start px-2.5 py-1.5 flex items-center justify-between cursor-pointer ${
                          lang === l.code
                            ? 'font-semibold text-[#0F4C81] dark:text-[#93C5FD] bg-[#F1F5F9] dark:bg-[#263244]'
                            : 'text-[#334155] dark:text-[#F8FAFC] hover:bg-[#F8FAFC] dark:hover:bg-[#1E293B]'
                        }`}
                      >
                        <span>{l.label}</span>

                        {lang === l.code && (
                          <Check className="w-3.5 h-3.5 text-[#0F4C81] dark:text-[#93C5FD]" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* HAMBURGER */}

              <button
                ref={mobileToggleRef}
                type="button"
                id="mobile-menu-button"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation-drawer"
                aria-label={
                  menuOpen
                    ? 'إغلاق القائمة الرئيسية'
                    : 'فتح القائمة الرئيسية'
                }
                onClick={() => {
                  setOpenDropdown(null);
                  setMenuOpen(!menuOpen);
                }}
                className="p-1.5 rounded-lg text-[#1E293B] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
              >
                {menuOpen ? (
                  <X
                    aria-hidden="true"
                    className="w-5 h-5"
                  />
                ) : (
                  <Menu
                    aria-hidden="true"
                    className="w-5 h-5"
                  />
                )}
              </button>
            </div>
          </div>

          {/* ====================================================
              MOBILE NAVIGATION DRAWER
          ==================================================== */}

          {menuOpen && (
            <div
              ref={mobileMenuRef}
              id="mobile-navigation-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={
                lang === 'ar'
                  ? 'قائمة التنقل للأجهزة الذكية'
                  : 'Mobile Navigation Menu'
              }
              className="xl:hidden mt-2 pb-6 border-t border-[#E2E8F0] dark:border-[#334155] pt-3 flex flex-col gap-1.5 animate-fade-in max-h-[82vh] overflow-y-auto"
            >

              {/* ==================================================
                  MOBILE THEME + LANGUAGE
              ================================================== */}

              <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#172033] rounded-lg border border-[#E2E8F0] dark:border-[#334155] mb-1">

                <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#E2E8F0] dark:border-[#334155]">

                  <span className="text-[11px] font-semibold text-[#64748B] dark:text-[#CBD5E1]">
                    {lang === 'ar'
                      ? 'المظهر / Theme'
                      : 'Theme / المظهر'}
                  </span>

                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-[#1E293B] dark:text-[#F8FAFC] bg-white dark:bg-[#1E293B] border border-[#E2E8F0] dark:border-[#334155] shadow-xs cursor-pointer"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Moon className="w-3.5 h-3.5 text-slate-700" />
                    )}

                    <span>
                      {theme === 'dark'
                        ? lang === 'ar'
                          ? 'داكن'
                          : 'Dark'
                        : lang === 'ar'
                          ? 'نهاري'
                          : 'Light'}
                    </span>
                  </button>
                </div>

                <p className="text-[11px] font-semibold text-[#64748B] dark:text-[#CBD5E1] mb-1.5 flex items-center gap-1.5">
                  <Globe
                    aria-hidden="true"
                    className="w-3 h-3 text-[#0F4C81] dark:text-[#60A5FA]"
                  />

                  Language / اللغة
                </p>

                <div
                  role="group"
                  className="grid grid-cols-3 gap-1.5"
                >
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      type="button"
                      aria-pressed={
                        lang === l.code
                      }
                      onClick={() =>
                        setLang(l.code)
                      }
                      className={`py-1.5 px-1 text-xs font-semibold rounded-md text-center transition-colors flex items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer ${
                        lang === l.code
                          ? 'bg-[#0F4C81] dark:bg-[#2563EB] text-white shadow-xs'
                          : 'bg-white dark:bg-[#1E293B] text-[#1E293B] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#334155]'
                      }`}
                    >
                      <Globe
                        aria-hidden="true"
                        className="w-3 h-3 opacity-70"
                      />

                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ==================================================
                  MOBILE NAV LINKS
              ================================================== */}

              <nav
                aria-label={
                  lang === 'ar'
                    ? 'روابط التنقل للأجهزة الذكية'
                    : 'Mobile Nav Links'
                }
                className="flex flex-col gap-1"
              >

                {/* HOME */}

                <Link
                  to="/"
                  aria-current={
                    isActive('/') &&
                    location.pathname === '/'
                      ? 'page'
                      : undefined
                  }
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isActive('/') &&
                    location.pathname === '/'
                      ? 'bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] text-[#1D4ED8] dark:text-[#93C5FD]'
                      : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#172033]'
                  }`}
                >
                  {t('nav.home')}
                </Link>

                {/* ABOUT */}

                <Link
                  to="/about"
                  aria-current={
                    isActive('/about')
                      ? 'page'
                      : undefined
                  }
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isActive('/about')
                      ? 'bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] text-[#1D4ED8] dark:text-[#93C5FD]'
                      : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#172033]'
                  }`}
                >
                  {t('nav.about')}
                </Link>

                {/* ==================================================
                    LABORATORIES ACCORDION
                ================================================== */}

                <div className="rounded-lg bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileSection(
                        'labs'
                      )
                    }
                    aria-expanded={
                      mobileExpanded.labs
                    }
                    className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <span className="flex items-center gap-1.5">
                      <Building2
                        aria-hidden="true"
                        className="w-3.5 h-3.5 text-current"
                      />

                      <span>
                        {t('nav.labs')}
                      </span>
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-current transition-transform duration-200 ${
                        mobileExpanded.labs
                          ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]'
                          : ''
                      }`}
                    />
                  </button>

                  {mobileExpanded.labs && (
                    <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-[#E2E8F0] dark:border-[#334155] animate-fade-in">

                      {labItems.map((lab) => (
                        <Link
                          key={lab.id}
                          to={lab.path}
                          onClick={() =>
                            setMenuOpen(false)
                          }
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-white dark:hover:bg-[#1E293B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <span>
                            {lab.name}
                          </span>

                          <span className="text-[10px] text-[#64748B] dark:text-[#CBD5E1]">
                            {lab.region}
                          </span>
                        </Link>
                      ))}

                      <Link
                        to="/laboratories"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="block px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] hover:bg-white dark:hover:bg-[#1E293B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        {t('nav.allLabs')} ←
                      </Link>
                    </div>
                  )}
                </div>

                {/* ==================================================
                    SERVICES ACCORDION
                ================================================== */}

                <div className="rounded-lg bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileSection(
                        'services'
                      )
                    }
                    aria-expanded={
                      mobileExpanded.services
                    }
                    className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <span className="flex items-center gap-1.5">
                      <FlaskConical
                        aria-hidden="true"
                        className="w-3.5 h-3.5 text-current"
                      />

                      <span>
                        {t('nav.services')}
                      </span>
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-current transition-transform duration-200 ${
                        mobileExpanded.services
                          ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]'
                          : ''
                      }`}
                    />
                  </button>

                  {mobileExpanded.services && (
                    <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-[#E2E8F0] dark:border-[#334155] animate-fade-in">

                      {serviceItems.map(
                        (svc, i) => (
                          <Link
                            key={i}
                            to={svc.path}
                            onClick={() =>
                              setMenuOpen(false)
                            }
                            className="block px-2.5 py-1 rounded-md text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-white dark:hover:bg-[#1E293B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          >
                            {t(svc.key)}
                          </Link>
                        )
                      )}

                      <Link
                        to="/services"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="block px-2.5 py-1.5 rounded-md text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] hover:bg-white dark:hover:bg-[#1E293B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        {t('nav.allServices')} ←
                      </Link>
                    </div>
                  )}
                </div>

                {/* ==================================================
                    MOBILE LABORATORY UNITS ACCORDION
                    4 CENTRAL UNITS + ALL MOBILE UNITS
                ================================================== */}

                <div className="rounded-lg bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileSection(
                        'mobile'
                      )
                    }
                    aria-expanded={
                      mobileExpanded.mobile
                    }
                    aria-controls="mobile-units-accordion"
                    className={`w-full flex items-center justify-between p-2.5 text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                      isActive(
                        '/mobile-laboratories'
                      )
                        ? 'text-[#1D4ED8] dark:text-[#93C5FD] bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)]'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B]'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">

                      <Truck
                        aria-hidden="true"
                        className="w-4 h-4 text-current rtl:-scale-x-100"
                      />

                      <span>
                        {t('nav.mobileLabs')}
                      </span>
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-current transition-transform duration-200 ${
                        mobileExpanded.mobile
                          ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]'
                          : ''
                      }`}
                    />
                  </button>

                  {mobileExpanded.mobile && (
                    <div
                      id="mobile-units-accordion"
                      className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-[#E2E8F0] dark:border-[#334155] animate-fade-in"
                    >

                      {/* 4 CENTRAL MOBILE UNITS */}

                      {mobileUnitItems.map(
                        (unit) => (
                          <Link
                            key={unit.id}
                            to={unit.path}
                            onClick={() =>
                              setMenuOpen(false)
                            }
                            className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-md text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-white dark:hover:bg-[#1E293B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                          >
                            <div className="flex items-center gap-2 min-w-0">

                              <div
                                className="w-7 h-7 rounded-md bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] shrink-0"
                                aria-hidden="true"
                              >
                                <Truck className="w-3.5 h-3.5" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs font-semibold truncate">
                                  {unit.name}
                                </p>

                                <p className="text-[10px] text-[#64748B] dark:text-[#CBD5E1] mt-0.5">
                                  {unit.region}
                                </p>
                              </div>
                            </div>

                            <Arrow
                              aria-hidden="true"
                              className="w-3.5 h-3.5 opacity-60 shrink-0"
                            />
                          </Link>
                        )
                      )}

                      {/* ==================================================
                          ALL MOBILE LABORATORIES
                      ================================================== */}

                      <Link
                        to="/mobile-laboratories"
                        onClick={() =>
                          setMenuOpen(false)
                        }
                        className="flex items-center justify-between gap-2 px-2.5 py-2 mt-1 rounded-md bg-white dark:bg-[#1E293B] border-t border-[#E2E8F0] dark:border-[#334155] text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] hover:bg-[#EFF6FF] dark:hover:bg-[#172033] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                      >
                        <span className="flex items-center gap-2">
                          <Truck
                            aria-hidden="true"
                            className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]"
                          />

                          <span>
                            {lang === 'ar'
                              ? 'كافة الوحدات المتنقلة'
                              : lang === 'fr'
                                ? 'Toutes les unités mobiles'
                                : 'All Mobile Units'}
                          </span>
                        </span>

                        <Arrow
                          aria-hidden="true"
                          className="w-3.5 h-3.5 opacity-60 shrink-0"
                        />
                      </Link>
                    </div>
                  )}
                </div>

                {/* ==================================================
                    CUSTOMER SERVICES ACCORDION
                ================================================== */}

                <div className="rounded-lg bg-[#F8FAFC] dark:bg-[#172033] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">

                  <button
                    type="button"
                    onClick={() =>
                      toggleMobileSection('cs')
                    }
                    aria-expanded={
                      mobileExpanded.cs
                    }
                    className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#1E293B] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <span className="flex items-center gap-1.5">
                      <Users
                        aria-hidden="true"
                        className="w-3.5 h-3.5 text-current"
                      />

                      <span>
                        {t('cs.title')}
                      </span>
                    </span>

                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3.5 h-3.5 text-current transition-transform duration-200 ${
                        mobileExpanded.cs
                          ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]'
                          : ''
                      }`}
                    />
                  </button>

                  {mobileExpanded.cs && (
                    <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-[#E2E8F0] dark:border-[#334155] animate-fade-in">

                      {customerServices.map(
                        (svc) => {
                          const Icon =
                            svc.icon;

                          return (
                            <Link
                              key={svc.to}
                              to={svc.to}
                              onClick={() =>
                                setMenuOpen(false)
                              }
                              className="flex items-start gap-2.5 p-2 rounded-lg text-[#0F172A] dark:text-[#F8FAFC] hover:bg-white dark:hover:bg-[#1E293B] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                            >
                              <div
                                className="w-7 h-7 rounded-md bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] shrink-0 mt-0.5"
                                aria-hidden="true"
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                                  {svc.label}
                                </p>

                                <p className="text-[11px] text-[#64748B] dark:text-[#CBD5E1] mt-0.5 leading-relaxed font-normal">
                                  {svc.desc}
                                </p>
                              </div>
                            </Link>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>

                {/* ==================================================
                    NEWS
                ================================================== */}

                <Link
                  to="/news"
                  aria-current={
                    isActive('/news')
                      ? 'page'
                      : undefined
                  }
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isActive('/news')
                      ? 'bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] text-[#1D4ED8] dark:text-[#93C5FD]'
                      : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#172033]'
                  }`}
                >
                  {t('nav.news')}
                </Link>

                {/* ==================================================
                    CONTACT
                ================================================== */}

                <Link
                  to="/contact"
                  aria-current={
                    isActive('/contact')
                      ? 'page'
                      : undefined
                  }
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    isActive('/contact')
                      ? 'bg-[#EFF6FF] dark:bg-[rgba(37,99,235,0.20)] text-[#1D4ED8] dark:text-[#93C5FD]'
                      : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-[#EFF6FF] dark:hover:bg-[#172033]'
                  }`}
                >
                  {t('nav.contact')}
                </Link>

                {/* ==================================================
                    ADMIN
                ================================================== */}

                <div className="pt-2 mt-1 border-t border-[#E2E8F0] dark:border-[#334155]">

                  <Link
                    to="/admin"
                    aria-current={
                      isActive('/admin')
                        ? 'page'
                        : undefined
                    }
                    onClick={() =>
                      setMenuOpen(false)
                    }
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0F4C81] hover:bg-[#0C3D68] dark:bg-[#2563EB] dark:hover:bg-[#1D4ED8] transition-colors shadow-xs"
                  >
                    <LogIn
                      aria-hidden="true"
                      className="w-4 h-4 text-white"
                    />

                    <span>
                      {t('nav.admin')}
                    </span>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}