import React from 'react';

interface NatureBackgroundProps {
  variant?: 'water-ripples' | 'sunset-landscape' | 'sunburst-tree' | 'ambient-warm';
  className?: string;
  opacity?: number;
}

export const NatureBackground: React.FC<NatureBackgroundProps> = ({
  variant = 'water-ripples',
  className = '',
  opacity = 0.85,
}) => {
  if (variant === 'water-ripples') {
    return (
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        {/* Soft golden sunset water gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F2E5D0]/80 via-[#E8D6BC]/70 to-[#D4BFA4]/90" />

        {/* Concentric organic ripples */}
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          viewBox="0 0 600 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="waterCenter" cx="50%" cy="52%" r="50%">
              <stop offset="0%" stopColor="#FFF2D6" stopOpacity="0.9" />
              <stop offset="15%" stopColor="#EAD0AE" stopOpacity="0.6" />
              <stop offset="45%" stopColor="#C9AC89" stopOpacity="0.35" />
              <stop offset="80%" stopColor="#9E805F" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#6E563C" stopOpacity="0.05" />
            </radialGradient>
            <linearGradient id="horizonGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE3B8" stopOpacity="0.8" />
              <stop offset="40%" stopColor="#E8BF88" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#BF9763" stopOpacity="0.1" />
            </linearGradient>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Golden sky reflection */}
          <rect width="600" height="900" fill="url(#horizonGlow)" opacity="0.4" />

          {/* Central concentric lake ripples */}
          <ellipse cx="300" cy="460" rx="35" ry="14" fill="none" stroke="#FFF7E6" strokeWidth="2.5" opacity="0.85" filter="url(#softGlow)" />
          <ellipse cx="300" cy="460" rx="65" ry="24" fill="none" stroke="#F5DFBC" strokeWidth="1.8" opacity="0.75" />
          <ellipse cx="300" cy="460" rx="105" ry="38" fill="none" stroke="#E6C89F" strokeWidth="1.6" opacity="0.65" />
          <ellipse cx="300" cy="460" rx="155" ry="54" fill="none" stroke="#D4AF83" strokeWidth="1.4" opacity="0.55" />
          <ellipse cx="300" cy="460" rx="215" ry="72" fill="none" stroke="#C49B6F" strokeWidth="1.2" opacity="0.45" />
          <ellipse cx="300" cy="460" rx="285" ry="94" fill="none" stroke="#B08658" strokeWidth="1.1" opacity="0.35" />
          <ellipse cx="300" cy="460" rx="370" ry="120" fill="none" stroke="#9E7448" strokeWidth="1" opacity="0.25" />
          <ellipse cx="300" cy="460" rx="460" ry="150" fill="none" stroke="#8C633A" strokeWidth="0.8" opacity="0.18" />

          {/* Central water drop crown */}
          <path
            d="M 288 458 Q 290 442 294 445 Q 297 435 300 440 Q 303 435 306 445 Q 310 442 312 458 Z"
            fill="#FFF5DE"
            opacity="0.9"
            filter="url(#softGlow)"
          />
          <circle cx="300" cy="430" r="3" fill="#FFFBEB" opacity="0.95" />
        </svg>

        {/* Ambient warmth vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2C2318]/25 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  if (variant === 'sunset-landscape') {
    return (
      <div
        className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-700 ${className}`}
        style={{ opacity }}
        aria-hidden="true"
      >
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          viewBox="0 0 600 900"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="skySunset" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F7E6CE" />
              <stop offset="30%" stopColor="#FCD5A4" />
              <stop offset="60%" stopColor="#FFAA5E" />
              <stop offset="100%" stopColor="#B37840" />
            </linearGradient>
            <radialGradient id="sunGlow" cx="65%" cy="38%" r="40%">
              <stop offset="0%" stopColor="#FFF9E6" stopOpacity="1" />
              <stop offset="25%" stopColor="#FED797" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#F5A95A" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C9732B" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sky with glowing sun */}
          <rect width="600" height="900" fill="url(#skySunset)" />
          <circle cx="390" cy="340" r="160" fill="url(#sunGlow)" />

          {/* Distant mountains */}
          <path d="M 0 420 Q 150 390 300 410 T 600 395 L 600 900 L 0 900 Z" fill="#996F4B" opacity="0.6" />
          <path d="M 0 450 Q 200 420 400 440 T 600 425 L 600 900 L 0 900 Z" fill="#755E38" opacity="0.75" />

          {/* Rolling green and golden hills */}
          <path d="M 0 500 Q 160 460 320 490 T 600 470 L 600 900 L 0 900 Z" fill="#69693B" />
          <path d="M 0 570 Q 250 510 600 540 L 600 900 L 0 900 Z" fill="#5A5930" />

          {/* Winding sandy pathway leading into the sunset */}
          <path
            d="M 330 900 Q 300 780 340 680 Q 370 600 350 540 Q 340 500 370 470"
            fill="none"
            stroke="#DFD1B5"
            strokeWidth="32"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M 330 900 Q 300 780 340 680 Q 370 600 350 540 Q 340 500 370 470"
            fill="none"
            stroke="#F4E9D5"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.8"
          />
        </svg>

        {/* Soft atmospheric overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#252219]/40 via-transparent to-white/10" />
      </div>
    );
  }

  // Fallback / ambient-warm
  return (
    <div
      className={`absolute inset-0 pointer-events-none bg-gradient-to-b from-[#FBF7F0] via-[#F4EFE6] to-[#EAE0D0] ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  );
};
