import LabLogo from '@/components/LabLogo';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'icon-only' | 'white';
  showSubtitle?: boolean;
}

export default function Logo({
  className = '',
  variant = 'full',
  showSubtitle = true,
}: LogoProps) {
  const logoVariant = variant === 'icon-only' ? 'mark' : variant === 'white' ? 'white' : 'full';
  const logoSize = variant === 'compact' ? 'sm' : 'md';

  return (
    <LabLogo
      className={className}
      variant={logoVariant}
      size={logoSize}
      showSubtitle={showSubtitle}
    />
  );
}
