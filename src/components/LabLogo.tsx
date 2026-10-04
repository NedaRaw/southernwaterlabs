import { useLang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import logoEmblemLight from '@/assets/images/nwc-logo.png';
import logoEmblemWhite from '@/assets/images/nwc-logo.png';

interface LabLogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'white';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function LabLogo({
  className = '',
  variant = 'full',
  size = 'md',
  showSubtitle = false,
}: LabLogoProps) {
  const { lang, dir } = useLang();
  let isDarkMode = false;
  try {
    const themeCtx = useTheme();
    isDarkMode = themeCtx.theme === 'dark';
  } catch {
    // Safe fallback if used outside context
  }
  if (!isDarkMode && typeof document !== 'undefined') {
    isDarkMode = document.documentElement.classList.contains('dark');
  }

  const isWhite = variant === 'white';
  const isMarkOnly = variant === 'mark';

  // Exact official institutional names requested:
  // Arabic: "المختبرات المركزية لمياه الشرب بالقطاع الجنوبي"
  // English: "Southern Sector Laboratory for Drinking Water and Environmental Services"
  // French: "Laboratoires Centraux des Eaux du Secteur Sud"
  const officialTitle = {
    ar: 'المختبرات المركزية لمياه الشرب والخدمات البيئية بالقطاع الجنوبي',
    en: 'Southern Sector Central Laboratories for Drinking Water and Environmental Services',
    fr: 'Laboratoires Centraux du Secteur Sud pour les Eaux Potables et les Services Environnementaux',
  }[lang] || 'المختبرات المركزية لمياه الشرب والخدمات البيئية بالقطاع الجنوبي';

  const officialSubtitle = {
    ar: 'منظومة مراقبة جودة المياه ومختبرات الفحص والتحليل',
    en: 'Water Quality Surveillance & Testing Laboratories',
    fr: 'Réseau de Contrôle et d\'Analyses de Qualité de l\'Eau',
  }[lang];

  // Pick the tailored emblem asset:
  // For dark blue/navy backgrounds or dark mode, use the luminous white emblem
  // For light backgrounds (header, etc.), use the clean water emblem
  const logoSrc = isWhite || isDarkMode ? logoEmblemWhite : logoEmblemLight;

  // Proportional height classes
  const imageSizeClasses = {
    sm: 'h-8 sm:h-9 md:h-10 w-auto',
    md: 'h-9 sm:h-10 md:h-11 w-auto',
    lg: 'h-11 sm:h-12 md:h-14 w-auto',
  }[size];

  // Proportional font sizes based on size prop - refined & balanced
  const titleSizeClasses = {
    sm: 'text-xs sm:text-[12.5px] md:text-[13px] font-semibold leading-snug line-clamp-1 sm:line-clamp-2 max-w-[220px] sm:max-w-xs md:max-w-[280px]',
    md: 'text-xs sm:text-sm font-semibold leading-snug',
    lg: 'text-sm sm:text-base font-semibold leading-snug',
  }[size];

  if (isMarkOnly) {
    return (
      <div className={`inline-flex items-center shrink-0 ${className}`}>
        <img
          src={logoSrc}
          alt={officialTitle}
          className={`${imageSizeClasses} object-contain transition-transform duration-200`}
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 sm:gap-2.5 select-none transition-all duration-200 group ${className}`}
      dir={dir}
    >
      {/* Official Laboratory Logo Emblem */}
      <div className="shrink-0 flex items-center justify-center">
        <img
          src={logoSrc}
          alt={officialTitle}
          className={`${imageSizeClasses} object-contain transition-transform duration-200 group-hover:scale-[1.02] drop-shadow-sm`}
          loading="eager"
        />
      </div>

      {/* Official Laboratory Typography */}
      <div className="flex flex-col text-start justify-center min-w-0">
        <span
          className={`tracking-tight whitespace-normal ${titleSizeClasses} ${
            isWhite ? '!text-white' : 'text-[#0F172A] dark:text-[#F8FAFC]'
          }`}
        >
          {officialTitle}
        </span>

        {showSubtitle && (
          <span
            className={`font-medium ${
              size === 'sm' ? 'text-[10px]' : 'text-[11px]'
            } ${
              isWhite ? '!text-sky-200' : 'text-slate-500 dark:text-slate-400'
            } leading-tight hidden lg:block truncate mt-0.5`}
          >
            {officialSubtitle}
          </span>
        )}
      </div>
    </div>
  );
}
