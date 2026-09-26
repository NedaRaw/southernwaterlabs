import { useLang } from '@/lib/i18n';
import { useTheme } from '@/lib/theme';
import logoEmblemLight from '@/assets/images/southern_water_labs_emblem.png';
import logoEmblemWhite from '@/assets/images/southern_water_labs_emblem_white.png';

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

  const isWhite = variant === 'white';
  const isMarkOnly = variant === 'mark';

  // Exact official institutional names requested:
  // Arabic: "المختبرات المركزية للمياه بالقطاع الجنوبي"
  // English: "Southern Sector Central Water Laboratories"
  // French: "Laboratoires Centraux des Eaux du Secteur Sud"
  const officialTitle = {
    ar: 'المختبرات المركزية للمياه بالقطاع الجنوبي',
    en: 'Southern Sector Central Water Laboratories',
    fr: 'Laboratoires Centraux des Eaux du Secteur Sud',
  }[lang] || 'المختبرات المركزية للمياه بالقطاع الجنوبي';

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
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-9 sm:h-10 md:h-11 w-auto',
    lg: 'h-11 sm:h-12 md:h-14 w-auto',
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
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none transition-all duration-200 group ${className}`}
      dir={dir}
    >
      {/* Official Laboratory Logo Emblem (Sharp, clear, suited for background color) */}
      <div className="shrink-0 flex items-center justify-center">
        <img
          src={logoSrc}
          alt={officialTitle}
          className={`${imageSizeClasses} object-contain transition-transform duration-200 group-hover:scale-[1.02] drop-shadow-sm`}
          loading="eager"
        />
      </div>

      {/* Official Laboratory Typography with clean, non-colliding layout */}
      <div className="flex flex-col text-start justify-center min-w-0">
        <span
          className={`font-semibold tracking-tight leading-snug whitespace-normal ${
            lang === 'ar'
              ? 'text-[15px] sm:text-[17px] md:text-[18px] lg:text-[19px]'
              : 'text-[14px] sm:text-[16px] md:text-[17px]'
          } ${
            isWhite ? '!text-white' : 'text-slate-900 dark:text-[#F8FAFC]'
          }`}
        >
          {officialTitle}
        </span>

        {showSubtitle && (
          <span
            className={`font-medium ${
              size === 'sm' ? 'text-[10px]' : 'text-[11px]'
            } ${
              isWhite ? '!text-sky-200' : 'text-slate-500'
            } leading-tight hidden lg:block truncate mt-0.5`}
          >
            {officialSubtitle}
          </span>
        )}
      </div>
    </div>
  );
}
