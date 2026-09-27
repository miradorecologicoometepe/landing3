import React from 'react';

interface HotelLogoProps {
  variant?: 'full' | 'submark' | 'icon' | 'horizontal';
  mode?: 'color' | 'white' | 'teal' | 'monochrome';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  height?: number;
  logoUrl?: string;
}

export const HotelLogo: React.FC<HotelLogoProps> = ({
  variant = 'full',
  mode = 'color',
  className = '',
  size = 'md',
  height,
  logoUrl,
}) => {
  if (logoUrl && /^https:\/\//i.test(logoUrl)) {
    const whiteOnDark = mode === 'white';
    return <img
      src={logoUrl}
      alt="Hotel Mirador Ecológico Ometepe"
      className={`object-contain max-w-full ${whiteOnDark ? 'brightness-0 invert' : ''} ${className}`}
      style={{ height: height || (variant === 'horizontal' ? 44 : 120), maxWidth: variant === 'horizontal' ? 240 : 360 }}
    />;
  }

  // Do not render a legacy/fallback brand while the published logo is loading.
  // This prevents the old logo from flashing briefly on refresh.
  return (
    <div
      aria-label="Hotel Mirador Ecológico Ometepe"
      className={`shrink-0 ${className}`}
      style={{
        height: height || (variant === 'horizontal' ? 44 : 120),
        width: variant === 'horizontal' ? 180 : 220,
        maxWidth: '100%',
      }}
    />
  );
};
