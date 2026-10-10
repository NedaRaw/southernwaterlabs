import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  UserPlus,
  Search,
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
  Sun,
  Moon,
  Truck,
  Sparkles,
  Network,
  FileCheck,
} from 'lucide-react';
import { useLang, type Lang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import SearchModal from '@/components/SearchModal';
import nwcLogo from '@/assets/images/nwc-logo.png';

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
  const [searchOpen, setSearchOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState<
    'labs' | 'services' | 'mobile' | 'lang' | null
  >(null);

  // Individual central lab branch dropdown open/close states
  const [expandedLabs, setExpandedLabs] = useState<Record<string, boolean>>({});
  const [mobileExpandedLabs, setMobileExpandedLabs] = useState<Record<string, boolean>>({});

  const toggleLabBranches = (labId: string) => {
    setExpandedLabs((prev) => ({
      ...prev,
      [labId]: !prev[labId],
    }));
  };

  const toggleMobileLabBranches = (labId: string) => {
    setMobileExpandedLabs((prev) => ({
      ...prev,
      [labId]: !prev[labId],
    }));
  };

  // Mobile accordion state
  const [mobileExpanded, setMobileExpanded] = useState<{
    labs: boolean;
    services: boolean;
    mobile: boolean;
  }>({
    labs: true,
    services: false,
    mobile: false,
  });

  // Container refs for click-outside detection
  const navRef = useRef<HTMLElement>(null);
  const labsRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
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

    window.addEventListener('scroll', handleScroll, { passive: true });
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
    setExpandedLabs({});
    setMobileExpandedLabs({});
  }, [location.pathname, location.hash]);

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
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
        return;
      }
      if (e.key === 'Escape') {
        if (searchOpen) {
          setSearchOpen(false);
          return;
        }
        if (openDropdown !== null) {
          setOpenDropdown(null);
          setExpandedLabs({});
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
  }, [searchOpen, openDropdown, menuOpen]);

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
  // CENTRAL LABORATORIES & HIERARCHICAL BRANCHES
  // 4 CENTRAL LABS + ASSOCIATED REGIONAL BRANCHES
  // ============================================================

  const labItems = useMemo(
    () => [
      {
        id: 'asir',
        name: t('nav.asir'),
        region:
          lang === 'ar'
            ? 'منطقة عسير'
            : lang === 'fr'
              ? 'Région d’Asir'
              : 'Asir Region',
        path: '/laboratories/asir',
        branches: [
          {
            id: 'bisha',
            name: lang === 'ar' ? 'بيشة' : 'Bisha',
            fullName:
              lang === 'ar'
                ? 'مختبر فرع بيشة'
                : lang === 'fr'
                  ? 'Agence de Bisha'
                  : 'Bisha Branch Laboratory',
            path: '/laboratories/asir/bisha',
            desc:
              lang === 'ar'
                ? 'محافظة بيشة'
                : lang === 'fr'
                  ? 'Gouvernorat de Bisha'
                  : 'Bisha Governorate',
          },
          {
            id: 'mahayel',
            name: lang === 'ar' ? 'محايل' : lang === 'fr' ? 'Muhayil' : 'Muhayil',
            fullName:
              lang === 'ar'
                ? 'مختبر فرع محايل'
                : lang === 'fr'
                  ? 'Agence de Muhayil'
                  : 'Muhayil Branch Laboratory',
            path: '/laboratories/asir/mahayel',
            desc:
              lang === 'ar'
                ? 'محافظة محايل عسير'
                : lang === 'fr'
                  ? 'Gouvernorat de Muhayil'
                  : 'Muhayil Governorate',
          },
        ],
      },
      {
        id: 'najran',
        name: t('nav.najran'),
        region:
          lang === 'ar'
            ? 'منطقة نجران'
            : lang === 'fr'
              ? 'Région de Najran'
              : 'Najran Region',
        path: '/laboratories/najran',
        branches: [
          {
            id: 'sharurah',
            name: lang === 'ar' ? 'شرورة' : 'Sharurah',
            fullName:
              lang === 'ar'
                ? 'مختبر فرع شرورة'
                : lang === 'fr'
                  ? 'Agence de Sharurah'
                  : 'Sharurah Branch Laboratory',
            path: '/laboratories/najran/sharurah',
            desc:
              lang === 'ar'
                ? 'محافظة شرورة'
                : lang === 'fr'
                  ? 'Gouvernorat de Sharurah'
                  : 'Sharurah Governorate',
          },
        ],
      },
      {
        id: 'al-baha',
        name: t('nav.baha'),
        region:
          lang === 'ar'
            ? 'منطقة الباحة'
            : lang === 'fr'
              ? 'Région d’Al-Baha'
              : 'Al-Baha Region',
        path: '/laboratories/al-baha',
        branches: [
          {
            id: 'qalwah',
            name: lang === 'ar' ? 'قلوة' : lang === 'fr' ? 'Qalwa' : 'Qalwa',
            fullName:
              lang === 'ar'
                ? 'مختبر فرع قلوة'
                : lang === 'fr'
                  ? 'Agence de Qalwa'
                  : 'Qalwa Branch Laboratory',
            path: '/laboratories/al-baha/qalwah',
            desc:
              lang === 'ar'
                ? 'محافظة قلوة وتهامة'
                : lang === 'fr'
                  ? 'Gouvernorat de Qalwa'
                  : 'Qalwa Governorate',
          },
        ],
      },
      {
        id: 'jazan',
        name: t('nav.jazan'),
        region:
          lang === 'ar'
            ? 'منطقة جازان'
            : lang === 'fr'
              ? 'Région de Jazan'
              : 'Jazan Region',
        path: '/laboratories/jazan',
        branches: [
          {
            id: 'al-darb',
            name: lang === 'ar' ? 'الدرب' : 'Al-Darb',
            fullName:
              lang === 'ar'
                ? 'مختبر فرع الدرب'
                : lang === 'fr'
                  ? 'Agence d’Al-Darb'
                  : 'Al-Darb Branch Laboratory',
            path: '/laboratories/jazan/al-darb',
            desc:
              lang === 'ar'
                ? 'محافظة الدرب والساحل'
                : lang === 'fr'
                  ? 'Gouvernorat d’Al-Darb'
                  : 'Al-Darb Governorate',
          },
          {
            id: 'farasan',
            name: lang === 'ar' ? 'فرسان' : 'Farasan',
            fullName:
              lang === 'ar'
                ? 'مختبر فرع فرسان'
                : lang === 'fr'
                  ? 'Agence de Farasan'
                  : 'Farasan Islands Branch Laboratory',
            path: '/laboratories/jazan/farasan',
            desc:
              lang === 'ar'
                ? 'جزر وأرخبيل فرسان'
                : lang === 'fr'
                  ? 'Archipel de Farasan'
                  : 'Farasan Archipelago',
          },
        ],
      },
    ],
    [lang, t]
  );

  // ============================================================
  // MOBILE LABORATORY UNITS
  // 4 CENTRAL UNITS
  // ============================================================

  const mobileUnitItems = useMemo(
    () => [
      {
        id: 'asir',
        name:
          lang === 'ar'
            ? 'وحدة المختبر المركزي بعسير'
            : lang === 'fr'
              ? 'Unité Mobile du Laboratoire Central d’Asir'
              : 'Asir Central Mobile Unit',
        region: lang === 'ar' ? 'عسير' : 'Asir',
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
        region: lang === 'ar' ? 'نجران' : 'Najran',
        path: '/mobile-laboratories#mobile-najran',
      },
      {
        id: 'al-baha',
        name:
          lang === 'ar'
            ? 'وحدة المختبر المركزي بالباحة'
            : lang === 'fr'
              ? 'Unité Mobile du Laboratoire Central d’Al-Baha'
              : 'Al-Baha Central Mobile Unit',
        region: lang === 'ar' ? 'الباحة' : 'Al-Baha',
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
        region: lang === 'ar' ? 'جازان' : 'Jazan',
        path: '/mobile-laboratories#mobile-jazan',
      },
    ],
    [lang]
  );

  // ============================================================
  // SERVICES (REORGANIZED 7 ACCREDITED SERVICES)
  // ============================================================

  const serviceItems = useMemo(
    () => [
      {
        key: 'svc.drinking',
        title: t('svc.drinking'),
        desc:
          lang === 'ar'
            ? 'مياه الشرب والآبار ومحطات التحلية'
            : lang === 'fr'
              ? 'Eau potable, puits & dessalement'
              : 'Drinking, wells & desalination plants',
        icon: Waves,
        path: '/services/water-treatment',
        badge: lang === 'ar' ? 'معتمد' : lang === 'fr' ? 'Agréé' : 'Accredited',
      },
      {
        key: 'svc.chemical',
        title: t('svc.chemical'),
        desc:
          lang === 'ar'
            ? 'العناصر الكيميائية والمعادن الثقيلة'
            : lang === 'fr'
              ? 'Éléments chimiques & métaux lourds'
              : 'Chemical elements & heavy metals',
        icon: FlaskConical,
        path: '/services/chemical',
        badge: lang === 'ar' ? 'معتمد' : lang === 'fr' ? 'Agréé' : 'Accredited',
      },
      {
        key: 'svc.physical',
        title: t('svc.physical'),
        desc:
          lang === 'ar'
            ? 'العكارة، التوصيلية والخواص الميدانية'
            : lang === 'fr'
              ? 'Turbidité, conductivité & pH'
              : 'Turbidity, conductivity & field specs',
        icon: Activity,
        path: '/services/chemical',
        badge: lang === 'ar' ? 'معتمد' : lang === 'fr' ? 'Agréé' : 'Accredited',
      },
      {
        key: 'svc.microbiological',
        title: t('svc.microbiological'),
        desc:
          lang === 'ar'
            ? 'الفحوصات البكتيرية والميكروبيولوجية'
            : lang === 'fr'
              ? 'Analyses bactériennes & microbiennes'
              : 'Bacterial & microbiological safety',
        icon: ShieldAlert,
        path: '/services/microbiological',
        badge: lang === 'ar' ? 'معتمد' : lang === 'fr' ? 'Agréé' : 'Accredited',
      },
      {
        key: 'svc.samples',
        title: t('svc.samples'),
        desc:
          lang === 'ar'
            ? 'سحب العينات الميدانية والتوثيق'
            : lang === 'fr'
              ? 'Échantillonnage de terrain certifié'
              : 'Field sampling & certified chains',
        icon: CheckCircle2,
        path: '/services/field-sampling',
        badge: lang === 'ar' ? 'ميداني' : lang === 'fr' ? 'Terrain' : 'Field',
      },
      {
        key: 'svc.specialized',
        title: t('svc.specialized'),
        desc:
          lang === 'ar'
            ? 'الاستشارات المخبرية وضبط الجودة'
            : lang === 'fr'
              ? 'Conseil technique & management qualité'
              : 'Technical consultation & QA audits',
        icon: Building2,
        path: '/services/consultation',
        badge: lang === 'ar' ? 'استشاري' : lang === 'fr' ? 'Conseil' : 'Advisory',
      },
      {
        key: 'svc.monitoring',
        title: t('svc.monitoring'),
        desc:
          lang === 'ar'
            ? 'برامج الرصد المستمر لشبكات وخزانات المياه بالقطاع الجنوبي'
            : lang === 'fr'
              ? 'Surveillance continue des réseaux et réservoirs d’eau'
              : 'Continuous monitoring of southern sector water networks & reservoirs',
        icon: Waves,
        path: '/services/quality-monitoring',
        badge: lang === 'ar' ? 'رصد دوري' : lang === 'fr' ? 'Continu' : '24/7',
        featured: true,
      },
    ],
    [lang, t]
  );

  const currentLangObj =
    languages.find((l) => l.code === lang) || languages[0];

  // ============================================================
  // HOVER HANDLERS
  // ============================================================

  const handleMouseEnter = (
    dropdownKey: 'labs' | 'services' | 'mobile' | 'lang'
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
    }, 220);
  };

  // ============================================================
  // DROPDOWN CLICK HANDLER
  // ============================================================

  const handleButtonClick = (
    e: React.MouseEvent,
    dropdownKey: 'labs' | 'services' | 'mobile' | 'lang'
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    const timeSinceHover = Date.now() - hoverTimeRef.current;
    if (openDropdown === dropdownKey && timeSinceHover < 350) {
      return;
    }

    setOpenDropdown((prev) => (prev === dropdownKey ? null : dropdownKey));
  };

  // ============================================================
  // KEYBOARD NAVIGATION
  // ============================================================

  const handleDropdownKeyDown = (
    e: React.KeyboardEvent,
    dropdownKey: 'labs' | 'services' | 'mobile' | 'lang'
  ) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setOpenDropdown(openDropdown === dropdownKey ? null : dropdownKey);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOpenDropdown(null);
    }
  };

  // ============================================================
  // MOBILE ACCORDION
  // ============================================================

  const toggleMobileSection = (key: 'labs' | 'services' | 'mobile') => {
    setMobileExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Dynamic typography helper per language
  const navTextClasses = useMemo(() => {
    if (lang === 'ar') {
      return 'text-[12px] xl:text-[12.5px] 2xl:text-[13.5px] font-medium leading-normal';
    }
    if (lang === 'fr') {
      return 'text-[11px] xl:text-[11.5px] 2xl:text-[12.5px] font-medium tracking-tight';
    }
    return 'text-[11.5px] xl:text-[12px] 2xl:text-[13px] font-medium tracking-normal';
  }, [lang]);

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
          PRIMARY FIXED TWO-LEVEL HEADER
      ====================================================== */}
      <header
        ref={navRef}
        role="banner"
        dir={dir}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
      >
        {/* ====================================================
            TOP BAR: INSTITUTIONAL IDENTITY & UTILITY CONTROLS
        ==================================================== */}
        <div
          className={`relative z-20 bg-white dark:bg-[#111827] border-b border-[#E2E8F0] dark:border-[#1E293B] transition-all duration-200 ${menuOpen
              ? 'shadow-md'
              : scrolled
                ? 'h-[58px] xl:h-[62px] shadow-sm backdrop-blur-md bg-white/98 dark:bg-[#111827]/98'
                : 'h-[62px] xl:h-[68px] shadow-2xs'
            }`}
        >
          <div className="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6 xl:px-8 h-full">
            <div className="flex items-center justify-between h-full gap-3 sm:gap-4">
              {/* 1. OFFICIAL INSTITUTIONAL IDENTITY & LOGO */}
              <Link
                to="/"
                className="flex items-center gap-2.5 sm:gap-3 shrink-0 rounded-xl py-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 transition-opacity hover:opacity-95 max-w-[280px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[460px]"
                aria-label={`${t('brand.name')} - ${t('nav.home')}`}
                onClick={() => {
                  setOpenDropdown(null);
                  setMenuOpen(false);
                }}
              >
                {/* Official NWC Logo with preserved original proportions */}
                <div className="shrink-0 flex items-center justify-center">
                  <div className="bg-white px-2 py-1 rounded-xl border border-slate-200/90 dark:border-white/20 shadow-2xs flex items-center justify-center ring-1 ring-slate-100 dark:ring-white/10">
                    <img
                      src={nwcLogo}
                      alt="National Water Company Logo"
                      className="h-9 sm:h-10 md:h-11 w-auto object-contain drop-shadow-2xs transition-transform duration-200 hover:scale-[1.02]"
                      loading="eager"
                    />
                  </div>
                </div>

                {/* Institutional Calligraphic & Official Typography */}
                <div className="flex flex-col text-start justify-center min-w-0">
                  <span className="text-[10px] sm:text-[10.5px] font-medium text-[#64748B] dark:text-[#94A3B8] leading-tight hidden sm:block truncate mt-0.5">
                    {lang === 'ar'
                      ? 'شركة المياه الوطنية | National Water Company'
                      : lang === 'fr'
                        ? 'Société Nationale des Eaux | NWC'
                        : 'National Water Company | Water Quality Assurance'}
                  </span>
                  <span className="text-[11.5px] sm:text-[12px] md:text-[12.5px] xl:text-[13px] font-bold text-[#1E3A5F] dark:text-[#F8FAFC] leading-snug tracking-tight">
                    {lang === 'ar'
                      ? 'المختبرات المركزية لمياه الشرب والخدمات البيئية بالقطاع الجنوبي'
                      : lang === 'fr'
                        ? 'Laboratoires Centraux des Eaux du Secteur Sud'
                        : 'Southern Sector Central Water Laboratories'}
                  </span>

                </div>
              </Link>

              {/* 2. SEARCH CONTROL (INSPIRED BY LAHAK REFERENCE) */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setMenuOpen(false);
                  setOpenDropdown(null);
                }}
                aria-label={
                  lang === 'ar'
                    ? 'البحث في الموقع والمختبرات والتحاليل'
                    : lang === 'fr'
                      ? 'Rechercher sur le site'
                      : 'Search the site'
                }
                className="hidden md:flex items-center justify-between gap-3 px-3.5 py-1.5 xl:py-2 rounded-xl text-xs bg-slate-50 dark:bg-[#1E293B]/80 hover:bg-slate-100 dark:hover:bg-[#1E293B] border border-slate-200 dark:border-slate-700/80 hover:border-blue-400 dark:hover:border-blue-500/60 text-slate-500 dark:text-slate-400 transition-all shadow-2xs group cursor-pointer w-44 lg:w-72 xl:w-88 max-w-sm focus:outline-none focus:ring-2 focus:ring-blue-600/40 shrink"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shrink-0" />
                  <span className="truncate text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300">
                    {lang === 'ar'
                      ? 'ابحث عن فحص مياه، مختبر، أو خدمة...'
                      : lang === 'fr'
                        ? 'Rechercher une analyse, labo...'
                        : 'Search tests, labs, or services...'}
                  </span>
                </div>
                <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs shrink-0">
                  ⌘K
                </kbd>
              </button>

              {/* 3. DESKTOP UTILITIES (LANGUAGE, THEME, EMPLOYEE LOGIN) */}
              <div className="hidden xl:flex items-center gap-2 shrink-0">
                {/* LANGUAGE SELECTOR */}
                <div
                  ref={langRef}
                  className="relative shrink-0"
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
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-blue-50 dark:hover:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#151D2F] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shadow-2xs cursor-pointer"
                  >
                    <Globe aria-hidden="true" className="w-3.5 h-3.5 text-[#1E3A5F] dark:text-[#60A5FA] shrink-0 opacity-80" />
                    <span>{currentLangObj.label}</span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`w-3 h-3 transition-transform duration-200 text-current opacity-70 ${openDropdown === 'lang' ? 'rotate-180 text-[#1D4ED8] dark:text-[#60A5FA]' : ''
                        }`}
                    />
                  </button>

                  {openDropdown === 'lang' && (
                    <div
                      id="lang-selector-listbox"
                      role="listbox"
                      aria-labelledby="lang-selector-button"
                      className="absolute end-0 top-full mt-1.5 w-36 bg-white dark:bg-[#151D2F] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] py-1 z-50 animate-fade-in focus:outline-none pointer-events-auto"
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
                          className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-start transition-colors focus:outline-none cursor-pointer ${lang === l.code
                              ? 'bg-blue-50 dark:bg-blue-950/60 text-[#1D4ED8] dark:text-[#93C5FD] font-semibold'
                              : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <Globe aria-hidden="true" className="w-3 h-3 text-current opacity-70" />
                            <span>{l.label}</span>
                          </span>
                          {lang === l.code && (
                            <Check aria-hidden="true" className="w-3.5 h-3.5 text-[#1D4ED8] dark:text-[#93C5FD]" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* THEME TOGGLE */}
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
                  className="flex items-center justify-center w-8 h-8 rounded-xl text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-blue-50 dark:hover:bg-[#1E293B] border border-[#CBD5E1] dark:border-[#334155] bg-white dark:bg-[#151D2F] transition-all duration-150 active:scale-95 focus:outline-none focus-visible:ring-2 focus:ring-blue-600 shadow-2xs cursor-pointer group"
                >
                  {theme === 'dark' ? (
                    <Sun aria-hidden="true" className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
                  ) : (
                    <Moon aria-hidden="true" className="w-3.5 h-3.5 text-slate-700 dark:text-slate-200 group-hover:-rotate-12 transition-transform" />
                  )}
                </button>

                {/* EMPLOYEE LOGIN (CONNECTED TO AUTH / ADMIN SYSTEM) */}
                <Link
                  to="/admin"
                  className={`flex items-center gap-2 px-3.5 py-1.5 xl:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 shadow-2xs border ${isActive('/admin')
                      ? 'bg-[#1E3A5F] text-white border-[#1E3A5F] dark:bg-blue-600 dark:border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-[#1E3A5F] hover:bg-[#152B47] text-white border-transparent dark:bg-blue-600 dark:hover:bg-blue-500'
                    } active:scale-95 shrink-0`}
                >
                  <LogIn aria-hidden="true" className="w-3.5 h-3.5 text-white shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'دخول الموظفين'
                      : lang === 'fr'
                        ? 'Espace Employés'
                        : 'Employee Login'}
                  </span>
                </Link>
              </div>

              {/* 4. MOBILE HEADER CONTROLS (< xl) */}
              <div className="flex xl:hidden items-center gap-1.5">
                {/* SEARCH BUTTON */}
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(true);
                    setMenuOpen(false);
                    setOpenDropdown(null);
                  }}
                  aria-label={
                    lang === 'ar'
                      ? 'البحث في الموقع'
                      : lang === 'fr'
                        ? 'Rechercher sur le site'
                        : 'Search the site'
                  }
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-[#334155] dark:text-[#F8FAFC] bg-white dark:bg-[#151D2F] border border-[#E2E8F0] dark:border-[#334155] transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <Search aria-hidden="true" className="w-3.5 h-3.5" />
                </button>

                {/* THEME TOGGLE */}
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label="Toggle Theme"
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-[#334155] dark:text-[#F8FAFC] bg-white dark:bg-[#151D2F] border border-[#E2E8F0] dark:border-[#334155] transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs"
                >
                  {theme === 'dark' ? (
                    <Sun aria-hidden="true" className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Moon aria-hidden="true" className="w-3.5 h-3.5 text-[#334155]" />
                  )}
                </button>

                {/* MOBILE LANGUAGE */}
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
                    className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-[#334155] dark:text-[#F8FAFC] bg-white dark:bg-[#151D2F] border border-[#E2E8F0] dark:border-[#334155] cursor-pointer shadow-2xs"
                  >
                    <Globe aria-hidden="true" className="w-3 h-3 text-[#0F4C81] dark:text-[#60A5FA]" />
                    <span>{lang.toUpperCase()}</span>
                    <ChevronDown aria-hidden="true" className="w-2.5 h-2.5 text-slate-400" />
                  </button>

                  {openDropdown === 'lang' && (
                    <div className="absolute end-0 top-full mt-1.5 w-32 bg-white dark:bg-[#151D2F] rounded-xl shadow-xl border border-[#E2E8F0] dark:border-[#334155] py-1 z-50 animate-fade-in">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLang(l.code);
                            setOpenDropdown(null);
                          }}
                          className={`w-full text-xs text-start px-2.5 py-1.5 flex items-center justify-between cursor-pointer ${lang === l.code
                              ? 'font-semibold text-[#0F4C81] dark:text-[#93C5FD] bg-blue-50 dark:bg-blue-950/60'
                              : 'text-[#334155] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-slate-800/60'
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

                {/* HAMBURGER TOGGLE */}
                <button
                  ref={mobileToggleRef}
                  type="button"
                  id="mobile-menu-button"
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                  aria-controls="mobile-navigation-drawer"
                  aria-label={
                    menuOpen
                      ? lang === 'ar'
                        ? 'إغلاق القائمة الرئيسية'
                        : 'Fermer le menu'
                      : lang === 'ar'
                        ? 'فتح القائمة الرئيسية'
                        : 'Ouvrir le menu'
                  }
                  onClick={() => {
                    setOpenDropdown(null);
                    setMenuOpen(!menuOpen);
                  }}
                  className="p-1.5 rounded-lg text-[#1E293B] dark:text-[#F8FAFC] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 cursor-pointer"
                >
                  {menuOpen ? (
                    <X aria-hidden="true" className="w-5 h-5" />
                  ) : (
                    <Menu aria-hidden="true" className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* ==================================================
                MOBILE NAVIGATION DRAWER (< xl)
            ================================================== */}
            {menuOpen && (
              <div
                ref={mobileMenuRef}
                id="mobile-navigation-drawer"
                role="dialog"
                aria-modal="true"
                dir={dir}
                aria-label={
                  lang === 'ar'
                    ? 'قائمة التنقل للأجهزة الذكية'
                    : 'Menu de navigation mobile'
                }
                className="xl:hidden mt-2 pb-6 border-t border-[#E2E8F0] dark:border-[#334155] pt-3 flex flex-col gap-2 animate-fade-in max-h-[82vh] overflow-y-auto"
              >
                {/* QUICK EMPLOYEE & VISITOR BUTTONS */}
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <Link
                    to="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1E3A5F] hover:bg-[#152B47] dark:bg-blue-600 dark:hover:bg-blue-700 shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>
                      {lang === 'ar'
                        ? 'دخول الموظفين'
                        : lang === 'fr'
                          ? 'Espace Employés'
                          : 'Employee Login'}
                    </span>
                  </Link>

                  <Link
                    to="/portal"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold text-blue-900 dark:text-blue-200 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 shadow-2xs"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>
                      {lang === 'ar'
                        ? 'بوابة الزوار والتقارير'
                        : lang === 'fr'
                          ? 'Portail Visiteurs'
                          : 'Visitor Portal'}
                    </span>
                  </Link>
                </div>

                {/* MOBILE NAV LINKS (ALL UPPER NAVIGATION SECTIONS) */}
                <nav
                  aria-label="Mobile Navigation"
                  className="flex flex-col gap-1 text-start"
                >
                  {/* HOME */}
                  <Link
                    to="/"
                    aria-current={isActive('/') && location.pathname === '/' ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${isActive('/') && location.pathname === '/'
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#151D2F]'
                      }`}
                  >
                    {t('nav.home')}
                  </Link>

                  {/* LABORATORIES ACCORDION */}
                  <div className="rounded-xl bg-slate-50/80 dark:bg-[#151D2F] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleMobileSection('labs')}
                      aria-expanded={mobileExpanded.labs}
                      className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-blue-50/60 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Building2 aria-hidden="true" className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                        <span>{t('nav.labs')}</span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-3.5 h-3.5 text-current transition-transform duration-200 ${mobileExpanded.labs ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]' : ''
                          }`}
                      />
                    </button>

                    {mobileExpanded.labs && (
                      <div className="px-2 pb-2.5 pt-1 space-y-1.5 border-t border-[#E2E8F0] dark:border-[#334155] animate-fade-in">
                        {labItems.map((lab) => {
                          const isExpanded = !!mobileExpandedLabs[lab.id];
                          return (
                            <div
                              key={lab.id}
                              className={`rounded-lg border transition-all overflow-hidden ${isExpanded
                                  ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/60'
                                  : 'bg-white dark:bg-[#1E293B] border-slate-200/80 dark:border-slate-700/60'
                                }`}
                            >
                              <div className="flex items-center justify-between p-2 gap-1">
                                <Link
                                  to={lab.path}
                                  onClick={() => setMenuOpen(false)}
                                  className="flex items-center gap-2 min-w-0 flex-1 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#1D4ED8] dark:hover:text-[#93C5FD]"
                                >
                                  <Building2 className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                                  <div className="min-w-0 text-start">
                                    <p className="truncate">{lab.name}</p>
                                    <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-normal truncate">
                                      {lab.region} • {lab.branches.length}{' '}
                                      {lang === 'ar'
                                        ? lab.branches.length > 1
                                          ? 'فروع'
                                          : 'فرع'
                                        : lab.branches.length > 1
                                          ? 'branches'
                                          : 'branch'}
                                    </p>
                                  </div>
                                </Link>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleMobileLabBranches(lab.id);
                                  }}
                                  aria-expanded={isExpanded}
                                  aria-label={
                                    isExpanded
                                      ? lang === 'ar'
                                        ? `إغلاق فروع ${lab.name}`
                                        : `Hide branches of ${lab.name}`
                                      : lang === 'ar'
                                        ? `عرض فروع ${lab.name}`
                                        : `Show branches of ${lab.name}`
                                  }
                                  className={`p-1.5 rounded-md border text-xs transition-colors shrink-0 ms-1 cursor-pointer ${isExpanded
                                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-2xs'
                                      : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                  <ChevronDown
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                                      }`}
                                  />
                                </button>
                              </div>

                              {isExpanded && (
                                <div className="px-2 pb-2 pt-1 space-y-1 bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 animate-fade-in">
                                  <div className="flex items-center justify-between px-1 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <Network className="w-3 h-3 text-[#2563EB] dark:text-[#60A5FA]" />
                                      <span>
                                        {lang === 'ar'
                                          ? 'الفروع التابعة:'
                                          : lang === 'fr'
                                            ? 'Agences rattachées :'
                                            : 'Branches:'}
                                      </span>
                                    </span>
                                    <Link
                                      to={lab.path}
                                      onClick={() => setMenuOpen(false)}
                                      className="text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                                    >
                                      {lang === 'ar' ? 'المختبر الرئيسي' : 'Central lab'}
                                    </Link>
                                  </div>
                                  {lab.branches.map((branch) => (
                                    <Link
                                      key={branch.id}
                                      to={branch.path}
                                      onClick={() => setMenuOpen(false)}
                                      className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-slate-800 text-xs font-medium text-slate-800 dark:text-slate-200 hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] transition-colors border border-slate-100 dark:border-slate-700/60"
                                    >
                                      <span className="flex items-center gap-1.5 min-w-0">
                                        <Network className="w-3 h-3 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                                        <span className="truncate">{branch.fullName}</span>
                                      </span>
                                      <Arrow className="w-3 h-3 text-slate-400 shrink-0" />
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}

                        <Link
                          to="/laboratories"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between p-2 mt-1 rounded-lg text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        >
                          <span>{t('nav.allLabs')}</span>
                          <Arrow aria-hidden="true" className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* LABORATORY SERVICES ACCORDION */}
                  <div className="rounded-xl bg-slate-50/80 dark:bg-[#151D2F] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleMobileSection('services')}
                      aria-expanded={mobileExpanded.services}
                      className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-blue-50/60 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <FlaskConical aria-hidden="true" className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                        <span>
                          {lang === 'ar'
                            ? 'الخدمات المخبرية'
                            : lang === 'fr'
                              ? 'Services de Laboratoire'
                              : 'Laboratory Services'}
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-3.5 h-3.5 text-current transition-transform duration-200 ${mobileExpanded.services ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]' : ''
                          }`}
                      />
                    </button>

                    {mobileExpanded.services && (
                      <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-[#E2E8F0] dark:border-[#334155] animate-fade-in">
                        {serviceItems.map((svc) => {
                          const Icon = svc.icon;
                          return (
                            <Link
                              key={svc.key}
                              to={svc.path}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-white dark:hover:bg-[#1E293B] transition-colors"
                            >
                              <span className="flex items-center gap-2 min-w-0">
                                <Icon className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                                <span className="truncate">{svc.title}</span>
                              </span>
                              <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] shrink-0 ms-2">
                                {svc.badge}
                              </span>
                            </Link>
                          );
                        })}

                        <Link
                          to="/services"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between p-2 mt-1 rounded-lg text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        >
                          <span>{t('nav.allServices')}</span>
                          <Arrow aria-hidden="true" className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* MOBILE LAB UNITS ACCORDION */}
                  <div className="rounded-xl bg-slate-50/80 dark:bg-[#151D2F] border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleMobileSection('mobile')}
                      aria-expanded={mobileExpanded.mobile}
                      className="w-full flex items-center justify-between p-2.5 text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:bg-blue-50/60 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Truck aria-hidden="true" className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA] rtl:-scale-x-100" />
                        <span>{t('nav.mobileLabs')}</span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`w-3.5 h-3.5 text-current transition-transform duration-200 ${mobileExpanded.mobile ? 'rotate-180 text-[#1D4ED8] dark:text-[#93C5FD]' : ''
                          }`}
                      />
                    </button>

                    {mobileExpanded.mobile && (
                      <div className="px-2.5 pb-2.5 pt-1 space-y-1 border-t border-[#E2E8F0] dark:border-[#334155] animate-fade-in">
                        {mobileUnitItems.map((unit) => (
                          <Link
                            key={unit.id}
                            to={unit.path}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg text-xs font-medium text-[#0F172A] dark:text-[#F8FAFC] hover:bg-white dark:hover:bg-[#1E293B] transition-colors"
                          >
                            <span className="truncate">{unit.name}</span>
                            <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] shrink-0 ms-2">
                              {unit.region}
                            </span>
                          </Link>
                        ))}

                        <Link
                          to="/mobile-laboratories"
                          onClick={() => setMenuOpen(false)}
                          className="flex items-center justify-between p-2 mt-1 rounded-lg text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                        >
                          <span className="flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 rtl:-scale-x-100" />
                            <span>
                              {lang === 'ar'
                                ? 'كافة الوحدات المتنقلة'
                                : lang === 'fr'
                                  ? 'Toutes les unités mobiles'
                                  : 'All Mobile Units'}
                            </span>
                          </span>
                          <Arrow aria-hidden="true" className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* VISITOR REGISTRATION */}
                  <Link
                    to="/register"
                    aria-current={isActive('/register') ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive('/register')
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#151D2F]'
                      }`}
                  >
                    <UserPlus className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                    <span>
                      {lang === 'ar'
                        ? 'تسجيل الزوار'
                        : lang === 'fr'
                          ? 'Enregistrement des Visiteurs'
                          : 'Visitor Registration'}
                    </span>
                  </Link>

                  {/* CUSTOMER SATISFACTION SURVEY */}
                  <Link
                    to="/survey"
                    aria-current={isActive('/survey') ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive('/survey')
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#151D2F]'
                      }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                    <span>
                      {lang === 'ar'
                        ? 'استبيان رضا المستفيدين'
                        : lang === 'fr'
                          ? 'Enquête de Satisfaction'
                          : 'Customer Satisfaction Survey'}
                    </span>
                  </Link>

                  {/* SEND AN ENQUIRY */}
                  <Link
                    to="/enquiry"
                    aria-current={isActive('/enquiry') ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive('/enquiry')
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#151D2F]'
                      }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
                    <span>
                      {lang === 'ar'
                        ? 'إرسال استفسار'
                        : lang === 'fr'
                          ? 'Envoyer une Demande'
                          : 'Send an Enquiry'}
                    </span>
                  </Link>

                  {/* CONTACT */}
                  <Link
                    to="/contact"
                    aria-current={isActive('/contact') ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive('/contact')
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#151D2F]'
                      }`}
                  >
                    <span>{t('nav.contact')}</span>
                  </Link>

                  {/* NEWS */}
                  <Link
                    to="/news"
                    aria-current={isActive('/news') ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive('/news')
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#151D2F]'
                      }`}
                  >
                    {t('nav.news')}
                  </Link>

                  {/* ABOUT */}
                  <Link
                    to="/about"
                    aria-current={isActive('/about') ? 'page' : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${isActive('/about')
                        ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1D4ED8] dark:text-[#93C5FD]'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] hover:bg-slate-50 dark:hover:bg-[#151D2F]'
                      }`}
                  >
                    {t('nav.about')}
                  </Link>
                </nav>
              </div>
            )}
          </div>
        </div>


        {/* ====================================================
            BOTTOM BAR: MAIN SERVICES NAVIGATION (DESKTOP)
        ==================================================== */}
        <div className="hidden xl:block relative z-10 bg-[#F8FAFC] dark:bg-[#0A1120] border-b border-[#E2E8F0] dark:border-[#1E293B] shadow-2xs">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between text-xs">
            {/* Primary Services Navigation */}
            <nav
              aria-label={
                lang === 'ar'
                  ? 'شريط الخدمات والتنقل الرئيسي'
                  : lang === 'fr'
                    ? 'Navigation des services'
                    : 'Services navigation'
              }
              className={`flex items-center gap-1 xl:gap-1.5 2xl:gap-2 ${navTextClasses}`}
            >
              {/* 1. HOME */}
              <Link
                to="/"
                aria-current={
                  isActive('/') && location.pathname === '/' ? 'page' : undefined
                }
                onClick={() => setOpenDropdown(null)}
                className={`relative px-2.5 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 ${isActive('/') && location.pathname === '/'
                    ? 'text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] shadow-2xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#1E3A5F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
              >
                <span>{t('nav.home')}</span>
              </Link>

              {/* 2. LABORATORIES DROPDOWN */}
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
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap cursor-pointer group ${isActive('/laboratories') || openDropdown === 'labs'
                      ? 'text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] shadow-2xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                      : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#1E3A5F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <Building2
                    aria-hidden="true"
                    className="w-3.5 h-3.5 shrink-0 text-current opacity-85"
                  />
                  <span>{t('nav.labs')}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3 h-3 transition-transform duration-200 text-current opacity-70 group-hover:opacity-100 ${openDropdown === 'labs' ? 'rotate-180 text-[#1E3A5F] dark:text-[#93C5FD]' : ''
                      }`}
                  />
                </button>

                {openDropdown === 'labs' && (
                  <div
                    id="nav-labs-menu"
                    role="menu"
                    aria-labelledby="nav-labs-button"
                    className="absolute start-0 top-full mt-1.5 w-80 sm:w-[360px] md:w-[390px] max-w-[94vw] z-50 animate-fade-in focus:outline-none pointer-events-auto"
                  >
                    <div className="bg-white dark:bg-[#151D2F] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-[#334155] p-2.5 backdrop-blur-xl max-h-[82vh] overflow-y-auto">
                      <div className="flex items-center justify-between px-2.5 py-2 border-b border-[#E2E8F0] dark:border-[#334155] mb-1.5">
                        <p className="text-[11px] font-bold text-[#1E3A5F] dark:text-[#93C5FD] uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>
                            {lang === 'ar'
                              ? 'المختبرات المركزية والفروع'
                              : lang === 'fr'
                                ? 'Laboratoires Centraux & Agences'
                                : 'Central Laboratories & Branches'}
                          </span>
                        </p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA]">
                          4 {lang === 'ar' ? 'مناطق' : 'Régions'}
                        </span>
                      </div>

                      <div className="space-y-1.5" role="none">
                        {labItems.map((lab) => {
                          const isExpanded = !!expandedLabs[lab.id];
                          return (
                            <div
                              key={lab.id}
                              className={`rounded-xl border transition-all overflow-hidden ${isExpanded
                                  ? 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 shadow-xs'
                                  : 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/40 border-transparent hover:border-slate-200/80 dark:hover:border-slate-700/60'
                                }`}
                            >
                              <div className="flex items-center justify-between p-1.5 sm:p-2 gap-1.5">
                                <Link
                                  to={lab.path}
                                  role="menuitem"
                                  onClick={() => setOpenDropdown(null)}
                                  className="flex items-center gap-2.5 min-w-0 flex-1 p-1 rounded-lg hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                  title={`${lab.name} - ${lab.region}`}
                                >
                                  <div
                                    className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] group-hover:bg-[#2563EB] group-hover:text-white transition-colors shrink-0"
                                    aria-hidden="true"
                                  >
                                    <Building2 className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0 text-start">
                                    <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] truncate">
                                      {lab.name}
                                    </p>
                                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate flex items-center gap-1.5">
                                      <span>{lab.region}</span>
                                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                                        • {lab.branches.length}{' '}
                                        {lang === 'ar'
                                          ? lab.branches.length > 1
                                            ? 'فروع'
                                            : 'فرع'
                                          : lab.branches.length > 1
                                            ? 'branches'
                                            : 'branch'}
                                      </span>
                                    </p>
                                  </div>
                                </Link>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleLabBranches(lab.id);
                                  }}
                                  aria-expanded={isExpanded}
                                  aria-controls={`nav-branches-${lab.id}`}
                                  aria-label={
                                    isExpanded
                                      ? lang === 'ar'
                                        ? `إغلاق قائمة فروع ${lab.name}`
                                        : lang === 'fr'
                                          ? `Masquer les agences de ${lab.name}`
                                          : `Hide branches of ${lab.name}`
                                      : lang === 'ar'
                                        ? `عرض فروع ${lab.name}`
                                        : lang === 'fr'
                                          ? `Afficher les agences de ${lab.name}`
                                          : `Show branches of ${lab.name}`
                                  }
                                  title={
                                    isExpanded
                                      ? lang === 'ar'
                                        ? 'إغلاق قائمة الفروع'
                                        : 'Hide branches'
                                      : lang === 'ar'
                                        ? 'عرض الفروع التابعة'
                                        : 'Show branches'
                                  }
                                  className={`p-1.5 sm:p-2 rounded-lg border transition-all cursor-pointer shrink-0 ms-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 flex items-center justify-center ${isExpanded
                                      ? 'bg-[#2563EB] text-white border-[#2563EB] shadow-2xs'
                                      : 'bg-white dark:bg-[#1E293B] text-slate-500 dark:text-slate-400 hover:text-[#1D4ED8] dark:hover:text-[#93C5FD] hover:bg-blue-50 dark:hover:bg-blue-950/60 border-[#E2E8F0] dark:border-[#334155] shadow-2xs'
                                    }`}
                                >
                                  <ChevronDown
                                    aria-hidden="true"
                                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
                                      }`}
                                  />
                                </button>
                              </div>

                              {isExpanded && (
                                <div
                                  id={`nav-branches-${lab.id}`}
                                  role="group"
                                  aria-label={
                                    lang === 'ar'
                                      ? `فروع ${lab.name}`
                                      : `Branches of ${lab.name}`
                                  }
                                  className="px-2.5 pb-2.5 pt-1 space-y-1 bg-white/95 dark:bg-[#111827]/90 border-t border-slate-200/80 dark:border-slate-800 animate-fade-in"
                                >
                                  <div className="flex items-center justify-between px-1 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                                    <span className="flex items-center gap-1">
                                      <Network className="w-3 h-3 text-[#2563EB] dark:text-[#60A5FA]" />
                                      <span>
                                        {lang === 'ar'
                                          ? 'الفروع التابعة للمختبر:'
                                          : lang === 'fr'
                                            ? 'Agences rattachées :'
                                            : 'Associated branches:'}
                                      </span>
                                    </span>
                                    <Link
                                      to={lab.path}
                                      onClick={() => setOpenDropdown(null)}
                                      className="text-[#2563EB] dark:text-[#60A5FA] hover:underline flex items-center gap-0.5 text-[10px]"
                                    >
                                      <span>
                                        {lang === 'ar'
                                          ? 'المختبر الرئيسي'
                                          : lang === 'fr'
                                            ? 'Labo central'
                                            : 'Central lab'}
                                      </span>
                                      <Arrow className="w-2.5 h-2.5" />
                                    </Link>
                                  </div>

                                  <div className="space-y-1" role="none">
                                    {lab.branches.map((branch) => (
                                      <Link
                                        key={branch.id}
                                        to={branch.path}
                                        role="menuitem"
                                        onClick={() => setOpenDropdown(null)}
                                        className="flex items-center justify-between p-2 rounded-lg bg-slate-50/90 dark:bg-[#1E293B]/80 hover:bg-blue-50 dark:hover:bg-blue-950/60 transition-colors group/branch border border-slate-100 dark:border-slate-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                      >
                                        <div className="flex items-center gap-2 min-w-0">
                                          <div className="w-6 h-6 rounded-md bg-blue-100/80 dark:bg-blue-900/40 text-[#2563EB] dark:text-[#60A5FA] flex items-center justify-center shrink-0 group-hover/branch:bg-[#2563EB] group-hover/branch:text-white transition-colors">
                                            <Network className="w-3 h-3" />
                                          </div>
                                          <div className="min-w-0 text-start">
                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover/branch:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] truncate">
                                              {branch.fullName}
                                            </p>
                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                              {branch.desc}
                                            </p>
                                          </div>
                                        </div>
                                        <Arrow className="w-3 h-3 text-slate-400 group-hover/branch:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] shrink-0 opacity-60 group-hover/branch:opacity-100" />
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]" role="none">
                        <Link
                          to="/laboratories"
                          role="menuitem"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <span>{t('nav.allLabs')}</span>
                          <Arrow aria-hidden="true" className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 3. LABORATORY SERVICES DROPDOWN */}
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
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap cursor-pointer group ${isActive('/services') || openDropdown === 'services'
                      ? 'text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] shadow-2xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                      : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#1E3A5F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <FlaskConical
                    aria-hidden="true"
                    className="w-3.5 h-3.5 shrink-0 text-current opacity-85"
                  />
                  <span>
                    {lang === 'ar'
                      ? 'الخدمات المخبرية'
                      : lang === 'fr'
                        ? 'Services de Laboratoire'
                        : 'Laboratory Services'}
                  </span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3 h-3 transition-transform duration-200 text-current opacity-70 group-hover:opacity-100 ${openDropdown === 'services' ? 'rotate-180 text-[#1E3A5F] dark:text-[#93C5FD]' : ''
                      }`}
                  />
                </button>

                {openDropdown === 'services' && (
                  <div
                    id="nav-services-menu"
                    role="menu"
                    aria-labelledby="nav-services-button"
                    className="absolute start-0 top-full mt-1.5 w-[540px] sm:w-[580px] xl:w-[620px] max-w-[90vw] z-50 animate-fade-in focus:outline-none pointer-events-auto"
                  >
                    <div className="bg-white dark:bg-[#151D2F] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-[#334155] p-3 sm:p-3.5 backdrop-blur-xl">
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#E2E8F0] dark:border-[#334155]">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                            <FlaskConical className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                              {t('services.title')}
                            </p>
                            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                              {lang === 'ar'
                                ? 'فحوصات وتحاليل معتمدة لضمان جودة مياه الشرب'
                                : lang === 'fr'
                                  ? 'Analyses et contrôles certifiés pour la qualité de l’eau'
                                  : 'Certified analytical testing for drinking water safety'}
                            </p>
                          </div>
                        </div>

                        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA] shrink-0 border border-blue-200/40 dark:border-blue-800/40">
                          <Sparkles className="w-3 h-3" />
                          <span>
                            {lang === 'ar'
                              ? '7 مجالات معتمدة'
                              : lang === 'fr'
                                ? '7 Domaines Agréés'
                                : '7 Accredited Areas'}
                          </span>
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="none">
                        {serviceItems
                          .filter((s) => !s.featured)
                          .map((svc) => {
                            const Icon = svc.icon;
                            return (
                              <Link
                                key={svc.key}
                                to={svc.path}
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center gap-2.5 p-2 rounded-xl border border-transparent hover:border-blue-200 dark:hover:border-blue-800/50 hover:bg-blue-50/70 dark:hover:bg-blue-950/30 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-start"
                              >
                                <div
                                  className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] group-hover:bg-[#2563EB] group-hover:text-white transition-colors shrink-0 shadow-2xs"
                                  aria-hidden="true"
                                >
                                  <Icon className="w-4 h-4" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] truncate">
                                    {svc.title}
                                  </p>
                                  <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] truncate">
                                    {svc.desc}
                                  </p>
                                </div>
                                <Arrow
                                  aria-hidden="true"
                                  className="w-3 h-3 text-current opacity-0 group-hover:opacity-100 group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] shrink-0 transition-opacity"
                                />
                              </Link>
                            );
                          })}
                      </div>

                      {serviceItems.find((s) => s.featured) && (
                        <div className="mt-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]">
                          {(() => {
                            const featuredSvc = serviceItems.find((s) => s.featured)!;
                            const Icon = featuredSvc.icon;
                            return (
                              <Link
                                to={featuredSvc.path}
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                                className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-gradient-to-r from-blue-50/90 via-slate-50 to-blue-50/70 dark:from-blue-950/40 dark:via-slate-800/50 dark:to-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 hover:border-blue-400 dark:hover:border-blue-700 transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-start"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-8 h-8 rounded-lg bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                      <p className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD]">
                                        {featuredSvc.title}
                                      </p>
                                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white">
                                        {featuredSvc.badge}
                                      </span>
                                    </div>
                                    <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] truncate mt-0.5">
                                      {featuredSvc.desc}
                                    </p>
                                  </div>
                                </div>
                                <Arrow
                                  aria-hidden="true"
                                  className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform shrink-0"
                                />
                              </Link>
                            );
                          })()}
                        </div>
                      )}

                      <div className="mt-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]" role="none">
                        <Link
                          to="/services"
                          role="menuitem"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <span>{t('nav.allServices')}</span>
                          <Arrow aria-hidden="true" className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. MOBILE LABORATORIES DROPDOWN */}
              <div
                ref={mobileRef}
                className="relative shrink-0"
                onMouseEnter={() => handleMouseEnter('mobile')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  id="nav-mobile-laboratories-button"
                  aria-haspopup="true"
                  aria-expanded={openDropdown === 'mobile'}
                  aria-controls="nav-mobile-laboratories-menu"
                  onClick={(e) => handleButtonClick(e, 'mobile')}
                  onKeyDown={(e) => handleDropdownKeyDown(e, 'mobile')}
                  className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap cursor-pointer group ${isActive('/mobile-laboratories') || openDropdown === 'mobile'
                      ? 'text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] shadow-2xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                      : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#1E3A5F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                    }`}
                >
                  <Truck
                    aria-hidden="true"
                    className="w-3.5 h-3.5 shrink-0 text-current opacity-85 rtl:-scale-x-100"
                  />
                  <span>{t('nav.mobileLabs')}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={`w-3 h-3 transition-transform duration-200 text-current opacity-70 group-hover:opacity-100 ${openDropdown === 'mobile' ? 'rotate-180 text-[#1E3A5F] dark:text-[#93C5FD]' : ''
                      }`}
                  />
                </button>

                {openDropdown === 'mobile' && (
                  <div
                    id="nav-mobile-laboratories-menu"
                    role="menu"
                    aria-labelledby="nav-mobile-laboratories-button"
                    className="absolute start-0 top-full mt-1.5 w-80 sm:w-88 z-50 animate-fade-in focus:outline-none pointer-events-auto"
                  >
                    <div className="bg-white dark:bg-[#151D2F] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-[#334155] p-2.5 backdrop-blur-xl">
                      <div className="flex items-center justify-between px-2.5 py-2 border-b border-[#E2E8F0] dark:border-[#334155] mb-1.5">
                        <p className="text-[11px] font-bold text-[#1E3A5F] dark:text-[#93C5FD] uppercase tracking-wider flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 rtl:-scale-x-100" />
                          <span>
                            {lang === 'ar'
                              ? 'الوحدات المتنقلة للمختبرات المركزية'
                              : lang === 'fr'
                                ? 'Unités Mobiles des Laboratoires'
                                : 'Central Mobile Lab Units'}
                          </span>
                        </p>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#60A5FA]">
                          4 {lang === 'ar' ? 'وحدات' : 'Unités'}
                        </span>
                      </div>

                      <div className="space-y-1" role="none">
                        {mobileUnitItems.map((unit) => (
                          <Link
                            key={unit.id}
                            to={unit.path}
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/80 dark:hover:bg-blue-950/40 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 text-start"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] group-hover:bg-[#2563EB] group-hover:text-white transition-colors shrink-0"
                                aria-hidden="true"
                              >
                                <Truck className="w-4 h-4 rtl:-scale-x-100" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] truncate">
                                  {unit.name}
                                </p>
                                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                                  {unit.region}
                                </p>
                              </div>
                            </div>
                            <Arrow
                              aria-hidden="true"
                              className="w-3.5 h-3.5 text-current opacity-50 group-hover:opacity-100 group-hover:text-[#1D4ED8] dark:group-hover:text-[#93C5FD] shrink-0"
                            />
                          </Link>
                        ))}
                      </div>

                      <div className="mt-2 pt-2 border-t border-[#E2E8F0] dark:border-[#334155]" role="none">
                        <Link
                          to="/mobile-laboratories"
                          role="menuitem"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#1E293B] hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold text-[#1E3A5F] dark:text-[#93C5FD] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                        >
                          <span className="flex items-center gap-2">
                            <Truck className="w-3.5 h-3.5 rtl:-scale-x-100" />
                            <span>
                              {lang === 'ar'
                                ? 'كافة الوحدات المتنقلة'
                                : lang === 'fr'
                                  ? 'Toutes les unités mobiles'
                                  : 'All Mobile Units'}
                            </span>
                          </span>
                          <Arrow aria-hidden="true" className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. VISITOR REGISTRATION */}
              <Link
                to="/register"
                aria-current={isActive('/register') ? 'page' : undefined}
                onClick={() => setOpenDropdown(null)}
                className={`relative px-2.5 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 ${isActive('/register')
                    ? 'text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] shadow-2xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#1E3A5F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
              >
                <span>
                  {lang === 'ar'
                    ? 'تسجيل الزوار'
                    : lang === 'fr'
                      ? 'Enregistrement des Visiteurs'
                      : 'Visitor Registration'}
                </span>
              </Link>

              {/* 6. CUSTOMER SATISFACTION SURVEY */}
              <Link
                to="/survey"
                aria-current={isActive('/survey') ? 'page' : undefined}
                onClick={() => setOpenDropdown(null)}
                className={`relative px-2.5 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 ${isActive('/survey')
                    ? 'text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] shadow-2xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#1E3A5F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
              >
                <span>
                  {lang === 'ar'
                    ? 'استبيان رضا المستفيدين'
                    : lang === 'fr'
                      ? 'Enquête de Satisfaction'
                      : 'Satisfaction Survey'}
                </span>
              </Link>

              {/* 7. SEND AN ENQUIRY */}
              <Link
                to="/enquiry"
                aria-current={isActive('/enquiry') ? 'page' : undefined}
                onClick={() => setOpenDropdown(null)}
                className={`relative px-2.5 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 ${isActive('/enquiry')
                    ? 'text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] shadow-2xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#1E3A5F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
              >
                <span>
                  {lang === 'ar'
                    ? 'إرسال استفسار'
                    : lang === 'fr'
                      ? 'Envoyer une Demande'
                      : 'Send an Enquiry'}
                </span>
              </Link>

              {/* 8. CONTACT */}
              <Link
                to="/contact"
                aria-current={isActive('/contact') ? 'page' : undefined}
                onClick={() => setOpenDropdown(null)}
                className={`relative px-2.5 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 whitespace-nowrap shrink-0 ${isActive('/contact')
                    ? 'text-[#1E3A5F] dark:text-[#93C5FD] bg-white dark:bg-[#1E293B] shadow-2xs font-bold border border-slate-200/60 dark:border-slate-700/60'
                    : 'text-[#334155] dark:text-[#CBD5E1] hover:text-[#1E3A5F] dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-800/60'
                  }`}
              >
                <span>{t('nav.contact')}</span>
              </Link>
            </nav>

            {/* Upper Trailing Controls: Quick Links to Portal, News, About */}
            <div className="flex items-center gap-1.5 xl:gap-2 text-[11px] shrink-0">
              <Link
                to="/about"
                onClick={() => setOpenDropdown(null)}
                className={`px-2 py-0.5 rounded transition-colors ${isActive('/about')
                    ? 'font-bold text-[#1E3A5F] dark:text-[#93C5FD]'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E3A5F] dark:hover:text-white'
                  }`}
              >
                <span>{t('nav.about')}</span>
              </Link>

              <span className="text-slate-300 dark:text-slate-700">|</span>

              <Link
                to="/news"
                onClick={() => setOpenDropdown(null)}
                className={`px-2 py-0.5 rounded transition-colors ${isActive('/news')
                    ? 'font-bold text-[#1E3A5F] dark:text-[#93C5FD]'
                    : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#1E3A5F] dark:hover:text-white'
                  }`}
              >
                <span>{t('nav.news')}</span>
              </Link>

              <span className="text-slate-300 dark:text-slate-700">|</span>

              <Link
                to="/portal"
                onClick={() => setOpenDropdown(null)}
                className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold transition-all border ${isActive('/portal') || isActive('/visitor-dashboard')
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/70 dark:border-blue-900/60 hover:bg-blue-100/80 dark:hover:bg-blue-900/40'
                  }`}
              >
                <FileCheck className="w-3 h-3 shrink-0" />
                <span>
                  {lang === 'ar'
                    ? 'بوابة الزوار والتقارير'
                    : lang === 'fr'
                      ? 'Portail Visiteurs'
                      : 'Visitor Portal'}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* SEARCH MODAL */}
      {searchOpen && (
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}
    </>
  );
}
