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
    return <img src={logoUrl} alt="Hotel Mirador Ecológico Ometepe" className={`object-contain max-w-full ${className}`} style={{ height: height || (variant === 'horizontal' ? 44 : 120), maxWidth: variant === 'horizontal' ? 240 : 360 }} />;
  }

  // Color configuration according to Brand Board
  // Color Principal: #C2ECE5, #80CEDE, #387378
  // Opuestos Complementarios: #804629, #060795, #F2EE9C

  const mountainColor = 
    mode === 'white' ? '#FFFFFF' :
    mode === 'monochrome' ? '#171717' :
    mode === 'teal' ? '#087f83' :
    '#387378'; // Brand deep teal

  const sunColor = 
    mode === 'white' ? '#FFFFFF' :
    mode === 'monochrome' ? '#171717' :
    mode === 'teal' ? '#087f83' :
    '#F2EE9C'; // Brand sunshine yellow

  const sunRaysColor = 
    mode === 'white' ? '#F2EE9C' :
    mode === 'teal' ? '#387378' :
    '#E5C54F';

  const textColor = 
    mode === 'white' ? '#FFFFFF' :
    mode === 'teal' ? '#387378' :
    '#060795'; // Brand deep cobalt

  const waveColor = 
    mode === 'white' ? '#80CEDE' :
    mode === 'teal' ? '#80CEDE' :
    '#387378';

  const birdColor = 
    mode === 'white' ? '#FFFFFF' :
    mode === 'teal' ? '#387378' :
    '#060795';

  // Submark Circular Badge (matching "SUBMARK LOGO" from Brand Board)
  if (variant === 'submark') {
    return (
      <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
        <svg 
          viewBox="0 0 200 200" 
          className={
            size === 'sm' ? 'w-14 h-14' :
            size === 'md' ? 'w-20 h-20' :
            size === 'lg' ? 'w-28 h-28' :
            'w-36 h-36'
          }
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer circle badge background */}
          <circle cx="100" cy="100" r="94" fill={mode === 'white' ? '#387378' : '#387378'} stroke="#80CEDE" strokeWidth="2.5" />
          <circle cx="100" cy="100" r="88" stroke="#F2EE9C" strokeWidth="1" strokeDasharray="3 3" opacity="0.7" />

          {/* Curved text path */}
          <path id="submarkTextPathTop" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
          <path id="submarkTextPathBottom" d="M 165,108 A 70,70 0 0,1 35,108" fill="none" />

          <text fill="#FFFFFF" fontSize="11" fontWeight="700" letterSpacing="2" className="tracking-widest">
            <textPath href="#submarkTextPathTop" startOffset="50%" textAnchor="middle">
              HOTEL MIRADOR ECOLÓGICO
            </textPath>
          </text>

          <text fill="#F2EE9C" fontSize="11" fontWeight="600" letterSpacing="4">
            <textPath href="#submarkTextPathBottom" startOffset="50%" textAnchor="middle">
              OMETAPE • NICARAGUA
            </textPath>
          </text>

          {/* Center Sun in Submark */}
          <g transform="translate(100, 96)">
            <circle cx="0" cy="0" r="14" fill="#F2EE9C" />
            {/* Rays */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line 
                key={deg}
                x1={Math.cos((deg * Math.PI) / 180) * 16}
                y1={Math.sin((deg * Math.PI) / 180) * 16}
                x2={Math.cos((deg * Math.PI) / 180) * 22}
                y2={Math.sin((deg * Math.PI) / 180) * 22}
                stroke="#F2EE9C"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ))}
          </g>

          {/* Center Volcanoes */}
          <path 
            d="M 45 130 L 80 84 L 110 130 Z" 
            fill="#FFFFFF" 
            opacity="0.95"
          />
          <path 
            d="M 100 130 L 132 94 L 160 130 Z" 
            fill="#C2ECE5" 
            opacity="0.9"
          />

          {/* Birds */}
          <path d="M 68 76 Q 72 73 76 76 Q 80 73 84 76" stroke="#FFFFFF" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M 88 71 Q 91 68 94 71 Q 97 68 100 71" stroke="#FFFFFF" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Waves in submark */}
          <path 
            d="M 40 134 Q 55 131 70 134 T 100 134 T 130 134 T 160 134" 
            stroke="#80CEDE" 
            strokeWidth="1.8" 
            fill="none" 
            strokeLinecap="round"
          />
          <path 
            d="M 50 140 Q 65 137 80 140 T 110 140 T 140 140 T 150 140" 
            stroke="#F2EE9C" 
            strokeWidth="1.2" 
            fill="none" 
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  // Icon Only (Twin Peaks + Sun + Birds)
  if (variant === 'icon') {
    return (
      <svg 
        viewBox="0 0 100 70" 
        className={
          size === 'sm' ? 'w-8 h-6' :
          size === 'md' ? 'w-12 h-9' :
          size === 'lg' ? 'w-16 h-12' :
          'w-24 h-18'
        }
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sun */}
        <circle cx="50" cy="38" r="16" fill={sunColor} />
        {[0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325].map((deg) => (
          <line
            key={deg}
            x1={50 + Math.cos((deg * Math.PI) / 180) * 19}
            y1={38 + Math.sin((deg * Math.PI) / 180) * 19}
            x2={50 + Math.cos((deg * Math.PI) / 180) * 24}
            y2={38 + Math.sin((deg * Math.PI) / 180) * 24}
            stroke={sunRaysColor}
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

        {/* Volcano Concepción & Maderas */}
        <path 
          d="M 12 65 L 38 22 L 68 65 Z" 
          fill={mountainColor} 
          stroke={mode === 'white' ? '#FFFFFF' : '#23494D'} 
          strokeWidth="1.5"
        />
        {/* Ridge shadow / highlight */}
        <path d="M 38 22 L 44 45 L 36 65" stroke={mode === 'white' ? '#C2ECE5' : '#80CEDE'} strokeWidth="1.5" fill="none" />

        <path 
          d="M 52 65 L 75 32 L 95 65 Z" 
          fill={mountainColor} 
          opacity="0.95"
          stroke={mode === 'white' ? '#FFFFFF' : '#23494D'} 
          strokeWidth="1.5"
        />
        <path d="M 75 32 L 78 50 L 72 65" stroke={mode === 'white' ? '#C2ECE5' : '#80CEDE'} strokeWidth="1.5" fill="none" />

        {/* Flying Birds */}
        <path d="M 36 14 Q 40 10 44 14 Q 48 10 52 14" stroke={birdColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M 55 10 Q 58 7 61 10 Q 64 7 67 10" stroke={birdColor} strokeWidth="1.2" fill="none" strokeLinecap="round" />

        {/* Lake Waves */}
        <path d="M 8 67 Q 28 63 48 67 T 88 67" stroke={waveColor} strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // Horizontal layout (Icon on left, typography on right)
  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-3 select-none ${className}`}>
        <div className="shrink-0">
          <svg viewBox="0 0 100 75" className="w-11 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="42" r="16" fill={sunColor} />
            {[15, 45, 75, 105, 135, 165].map((deg) => (
              <line
                key={deg}
                x1={50 + Math.cos((deg * Math.PI) / 180) * 18}
                y1={42 - Math.sin((deg * Math.PI) / 180) * 18}
                x2={50 + Math.cos((deg * Math.PI) / 180) * 23}
                y2={42 - Math.sin((deg * Math.PI) / 180) * 23}
                stroke={sunRaysColor}
                strokeWidth="2"
                strokeLinecap="round"
              />
            ))}
            <path d="M 8 68 L 36 26 L 64 68 Z" fill={mountainColor} />
            <path d="M 36 26 L 40 45 L 34 68" stroke={mode === 'white' ? '#C2ECE5' : '#80CEDE'} strokeWidth="1.5" fill="none" />
            <path d="M 50 68 L 74 35 L 94 68 Z" fill={mountainColor} opacity="0.95" />
            <path d="M 34 16 Q 38 12 42 16 Q 46 12 50 16" stroke={birdColor} strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M 53 12 Q 56 9 59 12 Q 62 9 65 12" stroke={birdColor} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            <path d="M 6 71 Q 28 67 50 71 T 94 71" stroke={waveColor} strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <div className="flex flex-col text-left">
          <span 
            className="text-[10px] uppercase font-bold tracking-[0.25em] leading-none"
            style={{ color: mode === 'white' ? '#C2ECE5' : '#804629' }}
          >
            Hotel
          </span>
          <span 
            className="text-base sm:text-lg font-extrabold tracking-tight leading-tight"
            style={{ color: textColor }}
          >
            Mirador Ecológico
          </span>
          <span 
            className="text-[11px] font-semibold italic tracking-wider -mt-0.5"
            style={{ color: mode === 'white' ? '#F2EE9C' : '#387378' }}
          >
            Ometepe
          </span>
        </div>
      </div>
    );
  }

  // Full Brand Logo (Matching Primary Logo in Brand Board)
  return (
    <div className={`inline-flex flex-col items-center text-center select-none ${className}`}>
      {/* Mountain & Sun Artwork */}
      <svg 
        viewBox="0 0 280 140" 
        className={
          size === 'sm' ? 'w-36 h-18' :
          size === 'md' ? 'w-48 h-24' :
          size === 'lg' ? 'w-64 h-32' :
          'w-80 h-40'
        }
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Radiant Sun in Center Behind Peaks */}
        <g id="sun-group">
          <circle cx="140" cy="80" r="34" fill={sunColor} />
          {/* Distinctive Sun Rays */}
          {[15, 35, 55, 75, 95, 115, 135, 155, 175].map((deg) => (
            <line
              key={deg}
              x1={140 + Math.cos((deg * Math.PI) / 180) * 38}
              y1={80 - Math.sin((deg * Math.PI) / 180) * 38}
              x2={140 + Math.cos((deg * Math.PI) / 180) * 49}
              y2={80 - Math.sin((deg * Math.PI) / 180) * 49}
              stroke={sunRaysColor}
              strokeWidth="3.2"
              strokeLinecap="round"
            />
          ))}
          {/* Secondary smaller ray tips */}
          {[25, 45, 65, 85, 105, 125, 145, 165].map((deg) => (
            <line
              key={deg}
              x1={140 + Math.cos((deg * Math.PI) / 180) * 38}
              y1={80 - Math.sin((deg * Math.PI) / 180) * 38}
              x2={140 + Math.cos((deg * Math.PI) / 180) * 44}
              y2={80 - Math.sin((deg * Math.PI) / 180) * 44}
              stroke={sunRaysColor}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
          ))}
        </g>

        {/* Flying Birds over the Volcanic Peaks */}
        <g id="birds">
          <path d="M 95 38 Q 102 30 110 38 Q 118 30 125 38" stroke={birdColor} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M 125 28 Q 131 22 137 28 Q 143 22 149 28" stroke={birdColor} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 106 20 Q 111 15 116 20 Q 121 15 126 20" stroke={birdColor} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        </g>

        {/* Volcán Concepción (Tall Majestic Peak on Left) */}
        <path 
          d="M 25 128 L 86 35 L 165 128 Z" 
          fill={mountainColor} 
          stroke={mode === 'white' ? '#FFFFFF' : '#23494D'} 
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        {/* Ridges & Contour detailing */}
        <path d="M 86 35 L 94 72 L 80 128" stroke={mode === 'white' ? '#C2ECE5' : '#80CEDE'} strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <path d="M 86 35 L 68 85 L 50 128" stroke={mode === 'white' ? '#FFFFFF' : '#2C5E62'} strokeWidth="1.5" fill="none" opacity="0.6" />

        {/* Volcán Maderas (Peak on Right with lush profile) */}
        <path 
          d="M 130 128 L 195 55 L 260 128 Z" 
          fill={mountainColor} 
          opacity="0.96"
          stroke={mode === 'white' ? '#FFFFFF' : '#23494D'} 
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path d="M 195 55 L 202 85 L 190 128" stroke={mode === 'white' ? '#C2ECE5' : '#80CEDE'} strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Water Waves of Lake Cocibolca / Nicaragua */}
        <path 
          d="M 15 130 Q 55 124 95 130 T 175 130 T 265 130" 
          stroke={waveColor} 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none" 
        />
        <path 
          d="M 35 136 Q 75 131 115 136 T 195 136 T 255 136" 
          stroke={mode === 'white' ? '#FFFFFF' : '#060795'} 
          strokeWidth="2" 
          strokeLinecap="round" 
          fill="none" 
          opacity="0.8"
        />
      </svg>

      {/* Typography from Brand Board */}
      <div className="-mt-1 flex flex-col items-center">
        {/* "Hotel" */}
        <span 
          className="text-xs sm:text-sm uppercase font-semibold tracking-[0.3em] font-sans"
          style={{ color: mode === 'white' ? '#C2ECE5' : '#804629' }}
        >
          Hotel
        </span>

        {/* "Mirador Ecológico" */}
        <h2 
          className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight font-serif-heading"
          style={{ color: textColor }}
        >
          Mirador Ecológico
        </h2>

        {/* "Ometepe" with Script / Wave underline */}
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-6 h-px bg-brand-sky opacity-80"></span>
          <span 
            className="text-sm sm:text-base font-bold italic tracking-widest"
            style={{ color: mode === 'white' ? '#F2EE9C' : '#387378' }}
          >
            Ometepe
          </span>
          <span className="w-6 h-px bg-brand-sky opacity-80"></span>
        </div>
      </div>
    </div>
  );
};
