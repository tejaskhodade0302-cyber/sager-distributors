import React from 'react';

interface PharmaBrandLogoProps {
  logoKey: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const PharmaBrandLogo: React.FC<PharmaBrandLogoProps> = ({
  logoKey,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-8 w-24',
    md: 'h-11 w-32',
    lg: 'h-14 w-40',
    xl: 'h-16 w-48',
  };

  const currentSize = sizeClasses[size];

  switch (logoKey.toLowerCase()) {
    // 1. USV
    case 'usv':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Hexagon Border */}
            <polygon
              points="30,8 130,8 152,30 130,52 30,52 8,30"
              stroke="#0284c7"
              strokeWidth="5"
              fill="#ffffff"
            />
            <polygon
              points="33,12 127,12 147,30 127,48 33,48 13,30"
              fill="#0284c7"
              fillOpacity="0.08"
            />
            {/* USV Text */}
            <text
              x="80"
              y="38"
              textAnchor="middle"
              fontFamily="'Space Grotesk', 'Arial Black', sans-serif"
              fontWeight="900"
              fontSize="28"
              letterSpacing="2"
              fill="#0284c7"
            >
              USV
            </text>
          </svg>
        </div>
      );

    // 2. Mankind
    case 'mankind':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(18, 28)">
              {/* Outer oval M */}
              <circle cx="0" cy="0" r="14" stroke="#0077b6" strokeWidth="2.5" />
              <path d="M-8 6 L-8 -6 L-2 2 L0 0 L2 2 L8 -6 L8 6" stroke="#0077b6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </g>
            <text x="42" y="27" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="19" fill="#005f73" letterSpacing="-0.5">
              Mankind<tspan fill="#0077b6">▸▸</tspan>
            </text>
            <text x="43" y="40" fontFamily="'Plus Jakarta Sans', cursive, sans-serif" fontStyle="italic" fontWeight="600" fontSize="10" fill="#0077b6">
              Serving Life
            </text>
          </svg>
        </div>
      );

    // 3. Alkem
    case 'alkem':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Diamond symbol with 'a' */}
            <g transform="translate(80, 18)">
              <polygon points="0,-12 20,0 0,12 -20,0" stroke="#004e89" strokeWidth="2" fill="#e0f2fe" />
              <text x="0" y="4" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="13" fill="#004e89">
                a
              </text>
            </g>
            <text x="80" y="40" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="800" fontSize="16" fill="#004e89" letterSpacing="2">
              ALKEM
            </text>
            <text x="80" y="51" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" fontSize="8" fill="#64748b" letterSpacing="0.5">
              Alkem Laboratories
            </text>
          </svg>
        </div>
      );

    // 4. Torrent Pharma
    case 'torrent':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Checkered purple/blue 'T' icon */}
            <g transform="translate(18, 14)">
              <rect x="0" y="0" width="30" height="30" rx="4" fill="#312e81" />
              {/* Checkered blocks forming T */}
              <rect x="4" y="4" width="6" height="6" fill="#ffffff" />
              <rect x="12" y="4" width="6" height="6" fill="#ffffff" />
              <rect x="20" y="4" width="6" height="6" fill="#ffffff" />
              <rect x="12" y="12" width="6" height="6" fill="#ffffff" />
              <rect x="12" y="20" width="6" height="6" fill="#ffffff" />
            </g>
            <text x="56" y="29" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="18" fill="#1e1b4b">
              torrent
            </text>
            <text x="58" y="42" fontFamily="'Space Grotesk', sans-serif" fontWeight="800" fontSize="9" fill="#4338ca" letterSpacing="3">
              PHARMA
            </text>
          </svg>
        </div>
      );

    // 5. FDC
    case 'fdc':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="80" cy="30" rx="55" ry="22" stroke="#15803d" strokeWidth="4" fill="#f0fdf4" />
            <text x="80" y="38" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="26" fill="#15803d" letterSpacing="1">
              FDC
            </text>
          </svg>
        </div>
      );

    // 6. Glenmark
    case 'glenmark':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Stylized Red G emblem */}
            <g transform="translate(80, 16)">
              <circle cx="0" cy="-3" r="4" fill="#b91c1c" />
              <path d="M-8 8 C-10 0, 10 0, 8 8 C7 14, -7 14, -8 8 Z" fill="#b91c1c" />
            </g>
            <text x="80" y="44" textAnchor="middle" fontFamily="'Plus Jakarta Sans', Georgia, serif" fontWeight="800" fontSize="17" fill="#b91c1c" letterSpacing="1">
              glenmark
            </text>
          </svg>
        </div>
      );

    // 7. Pfizer
    case 'pfizer':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Pfizer Double Helix / Oval */}
            <g transform="translate(24, 30)">
              <ellipse cx="0" cy="0" rx="14" ry="16" fill="none" stroke="#0033a0" strokeWidth="3" transform="rotate(-30)" />
              <path d="M-10 -6 Q 0 8, 10 -6" stroke="#00d2c4" strokeWidth="3" fill="none" />
            </g>
            <text x="48" y="38" fontFamily="'Plus Jakarta Sans', sans-serif" fontStyle="italic" fontWeight="900" fontSize="26" fill="#0033a0" letterSpacing="-1">
              Pfizer
            </text>
          </svg>
        </div>
      );

    // 8. Sun Pharma
    case 'sunpharma':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Orange Torus Sun Icon */}
            <g transform="translate(80, 16)">
              <circle cx="0" cy="0" r="11" stroke="#ea580c" strokeWidth="4" fill="none" />
              <path d="M-8 4 C -4 -4, 4 -4, 8 4" stroke="#f97316" strokeWidth="3" fill="none" />
            </g>
            <text x="80" y="39" textAnchor="middle" fontFamily="'Space Grotesk', serif" fontWeight="900" fontSize="16" fill="#1e293b" letterSpacing="2">
              SUN
            </text>
            <text x="80" y="49" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="7" fill="#64748b" letterSpacing="1">
              PHARMACEUTICAL
            </text>
          </svg>
        </div>
      );

    // 9. MSN
    case 'msn':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Red Arc */}
            <path d="M 28 36 C 30 14, 110 14, 134 36" stroke="#dc2626" strokeWidth="3" fill="none" />
            <text x="80" y="38" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="24" fill="#1e3a8a" letterSpacing="1">
              MSN<tspan fill="#dc2626" fontSize="18">▫</tspan>
            </text>
          </svg>
        </div>
      );

    // 10. Macleods
    case 'macleods':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="80" y="30" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="18" fill="#b91c1c" letterSpacing="1.5">
              MACLEODS
            </text>
            {/* Barcode line pattern */}
            <g transform="translate(35, 36)">
              <rect x="0" y="0" width="2" height="7" fill="#1e293b" />
              <rect x="4" y="0" width="4" height="7" fill="#1e293b" />
              <rect x="10" y="0" width="2" height="7" fill="#1e293b" />
              <rect x="14" y="0" width="3" height="7" fill="#1e293b" />
              <rect x="19" y="0" width="1" height="7" fill="#1e293b" />
              <rect x="22" y="0" width="4" height="7" fill="#1e293b" />
              <rect x="28" y="0" width="2" height="7" fill="#1e293b" />
              <rect x="32" y="0" width="5" height="7" fill="#1e293b" />
              <rect x="39" y="0" width="2" height="7" fill="#1e293b" />
              <rect x="43" y="0" width="4" height="7" fill="#1e293b" />
              <rect x="49" y="0" width="2" height="7" fill="#1e293b" />
              <rect x="53" y="0" width="3" height="7" fill="#1e293b" />
              <rect x="58" y="0" width="5" height="7" fill="#1e293b" />
              <rect x="65" y="0" width="2" height="7" fill="#1e293b" />
              <rect x="69" y="0" width="4" height="7" fill="#1e293b" />
              <rect x="75" y="0" width="2" height="7" fill="#1e293b" />
              <rect x="79" y="0" width="5" height="7" fill="#1e293b" />
              <rect x="86" y="0" width="3" height="7" fill="#1e293b" />
            </g>
          </svg>
        </div>
      );

    // 11. Ipca
    case 'ipca':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Molecular cluster bubbles */}
            <g transform="translate(25, 30)">
              <circle cx="-8" cy="-6" r="5" fill="#00b4d8" />
              <circle cx="6" cy="-6" r="4.5" fill="#0077b6" />
              <circle cx="-6" cy="7" r="4" fill="#0096c7" />
              <circle cx="7" cy="6" r="5.5" fill="#00b4d8" />
              <line x1="-8" y1="-6" x2="6" y2="-6" stroke="#90e0ef" strokeWidth="1.5" />
              <line x1="-8" y1="-6" x2="-6" y2="7" stroke="#90e0ef" strokeWidth="1.5" />
              <line x1="6" y1="-6" x2="7" y2="6" stroke="#90e0ef" strokeWidth="1.5" />
              <line x1="-6" y1="7" x2="7" y2="6" stroke="#90e0ef" strokeWidth="1.5" />
            </g>
            <text x="48" y="32" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="24" fill="#023e8a">
              ipca
            </text>
            <text x="50" y="44" fontFamily="'Plus Jakarta Sans', cursive, sans-serif" fontStyle="italic" fontSize="9" fill="#0077b6">
              A dose of life
            </text>
          </svg>
        </div>
      );

    // 12. Abbott
    case 'abbott':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Abbott lowercase 'a' block */}
            <g transform="translate(22, 17)">
              <rect x="0" y="0" width="26" height="26" rx="4" fill="#0096d6" />
              <circle cx="13" cy="13" r="7" stroke="#ffffff" strokeWidth="3" fill="none" />
              <line x1="20" y1="6" x2="20" y2="20" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
            </g>
            <text x="56" y="35" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="22" fill="#0f172a" letterSpacing="-0.5">
              Abbott
            </text>
          </svg>
        </div>
      );

    // 13. Emcure
    case 'emcure':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="80" y="33" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="24" fill="#b91c1c" letterSpacing="-0.5">
              Emcure<tspan fontSize="12" dy="-8">®</tspan>
            </text>
            <text x="80" y="47" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="7" fill="#64748b" letterSpacing="1">
              SUCCESS THROUGH INNOVATION
            </text>
          </svg>
        </div>
      );

    // 14. Zuventus
    case 'zuventus':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Maroon circle silhouette */}
            <g transform="translate(22, 30)">
              <circle cx="0" cy="0" r="14" fill="#780016" />
              {/* Leaping silhouette figure */}
              <circle cx="0" cy="-6" r="2.5" fill="#ffffff" />
              <path d="M-6 4 L0 -2 L6 4" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M-4 1 L4 1" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
            </g>
            <text x="44" y="30" fontFamily="'Plus Jakarta Sans', serif" fontWeight="800" fontStyle="italic" fontSize="19" fill="#780016">
              Zuventus
            </text>
            <text x="45" y="43" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="600" fontSize="8" fill="#475569">
              Healthcare Limited
            </text>
          </svg>
        </div>
      );

    // 15. Med Manor Organics
    case 'medmanor':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Cyan ribbons badge */}
            <g transform="translate(18, 16)">
              <rect x="0" y="0" width="22" height="26" rx="3" fill="#0284c7" />
              <path d="M4 6 L11 20 L18 6" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>
            <text x="46" y="27" fontFamily="'Space Grotesk', sans-serif" fontWeight="800" fontSize="13" fill="#0369a1" letterSpacing="0.5">
              MED MANOR
            </text>
            <text x="46" y="40" fontFamily="'Space Grotesk', sans-serif" fontWeight="700" fontSize="10" fill="#0284c7" letterSpacing="1">
              ORGANICS
            </text>
          </svg>
        </div>
      );

    // 16. Pharmed
    case 'pharmed':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Blue dot on left */}
            <g transform="translate(80, 16)">
              <circle cx="-16" cy="0" r="9" fill="#0284c7" />
              <rect x="-3" y="-9" width="18" height="18" fill="#94a3b8" rx="2" />
            </g>
            <text x="80" y="44" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="16" fill="#0369a1" letterSpacing="2">
              PHARMED
            </text>
          </svg>
        </div>
      );

    // 17. Blue Cross Laboratories
    case 'bluecross':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Solid Dark Blue Box */}
            <rect x="12" y="10" width="136" height="40" rx="4" fill="#1e3a8a" />
            <text x="80" y="29" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="15" fill="#ffffff" letterSpacing="0.5">
              Blue Cross
            </text>
            <text x="80" y="43" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="9" fill="#93c5fd" letterSpacing="2">
              LABORATORIES
            </text>
          </svg>
        </div>
      );

    // 18. Indoco
    case 'indoco':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(24, 30)">
              <circle cx="0" cy="0" r="14" fill="#0284c7" />
              <text x="0" y="5" textAnchor="middle" fontFamily="'Plus Jakarta Sans', cursive, sans-serif" fontWeight="900" fontSize="14" fill="#ffffff">
                ir
              </text>
            </g>
            <text x="46" y="38" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="900" fontSize="24" fill="#0284c7" letterSpacing="-0.5">
              indoco
            </text>
          </svg>
        </div>
      );

    // 19. Hetero
    case 'hetero':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Red 'H' geometric icon */}
            <g transform="translate(26, 17)">
              <rect x="0" y="0" width="24" height="26" stroke="#b91c1c" strokeWidth="2" fill="none" />
              <line x1="6" y1="4" x2="6" y2="22" stroke="#b91c1c" strokeWidth="3" />
              <line x1="18" y1="4" x2="18" y2="22" stroke="#b91c1c" strokeWidth="3" />
              <line x1="6" y1="13" x2="18" y2="13" stroke="#b91c1c" strokeWidth="3" />
            </g>
            <text x="58" y="36" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="20" fill="#b91c1c" letterSpacing="1">
              HETERO
            </text>
          </svg>
        </div>
      );

    // 20. Centaur
    case 'centaur':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="80" cy="30" rx="55" ry="18" fill="#1e3a8a" />
            <text x="80" y="36" textAnchor="middle" fontFamily="'Plus Jakarta Sans', Georgia, serif" fontWeight="800" fontSize="17" fill="#ffffff" letterSpacing="1">
              Centaur
            </text>
          </svg>
        </div>
      );

    // 21. Cipla
    case 'cipla':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="80" y="40" textAnchor="middle" fontFamily="'Plus Jakarta Sans', 'Arial Black', sans-serif" fontWeight="900" fontSize="34" fill="#0369a1" letterSpacing="-1">
              Cipla
            </text>
          </svg>
        </div>
      );

    // 22. Ajanta Pharma
    case 'ajanta':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Purple 'ap' badge */}
            <g transform="translate(80, 16)">
              <rect x="-24" y="-12" width="48" height="24" rx="12" fill="#581c87" />
              <text x="0" y="6" textAnchor="middle" fontFamily="'Space Grotesk', sans-serif" fontWeight="900" fontSize="18" fill="#ffffff" letterSpacing="1">
                ap
              </text>
            </g>
            <text x="80" y="44" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontStyle="italic" fontWeight="800" fontSize="14" fill="#581c87">
              ajanta pharma
            </text>
          </svg>
        </div>
      );

    // 23. Dr. Reddy's
    case 'drreddy':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="20" y="36" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="17" fill="#1e1b4b" letterSpacing="-0.5">
              Dr.Reddy's
            </text>
            {/* Molecular Purple Heart Cluster */}
            <g transform="translate(126, 30)">
              <circle cx="-6" cy="-6" r="3.5" fill="#6b21a8" />
              <circle cx="0" cy="-7" r="4.5" fill="#7e22ce" />
              <circle cx="6" cy="-5" r="3.5" fill="#9333ea" />
              <circle cx="-7" cy="0" r="4" fill="#581c87" />
              <circle cx="0" cy="0" r="5" fill="#6b21a8" />
              <circle cx="7" cy="1" r="4" fill="#a855f7" />
              <circle cx="-4" cy="6" r="3.5" fill="#7e22ce" />
              <circle cx="3" cy="7" r="3.5" fill="#9333ea" />
              <circle cx="0" cy="11" r="2.5" fill="#6b21a8" />
            </g>
          </svg>
        </div>
      );

    // 24. AIMIL
    case 'aimil':
      return (
        <div className={`flex items-center justify-center ${currentSize} ${className}`}>
          <svg viewBox="0 0 160 60" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
            <text x="80" y="32" textAnchor="middle" fontFamily="'Times New Roman', Georgia, serif" fontWeight="900" fontSize="24" fill="#b91c1c" letterSpacing="1">
              AIMIL
            </text>
            <line x1="30" y1="38" x2="130" y2="38" stroke="#b91c1c" strokeWidth="1.5" />
            <text x="80" y="48" textAnchor="middle" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="8" fill="#1e293b" letterSpacing="3">
              SINCE 1984
            </text>
          </svg>
        </div>
      );

    default:
      return (
        <div className={`flex items-center justify-center bg-slate-100 rounded-lg text-slate-800 font-black text-sm px-3 py-1 ${currentSize} ${className}`}>
          {logoKey.toUpperCase()}
        </div>
      );
  }
};
