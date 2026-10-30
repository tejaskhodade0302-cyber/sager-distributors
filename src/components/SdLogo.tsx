import React from 'react';

interface SdLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  showText?: boolean;
  textColor?: 'dark' | 'light';
  variant?: 'image' | 'svg' | 'hybrid';
}

export const SdLogo: React.FC<SdLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  textColor = 'dark',
  variant = 'hybrid',
}) => {
  const sizeMap = {
    xs: 'w-7 h-7',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  };

  const dimMap = {
    xs: 28,
    sm: 36,
    md: 48,
    lg: 64,
    xl: 80,
    '2xl': 112,
  };

  const dim = dimMap[size];

  // SVG representation matching the official Sagar Distributor shield emblem
  const renderSvg = () => (
    <svg
      viewBox="0 0 200 200"
      width={dim}
      height={dim}
      className={`${sizeMap[size]} shrink-0 drop-shadow-md select-none transition-transform hover:scale-105 duration-200`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Left shield clip */}
        <clipPath id="leftShieldClip">
          <path d="M100 8 C60 8, 20 20, 18 36 C18 110, 52 165, 100 192 L100 8 Z" />
        </clipPath>
        {/* Right shield clip */}
        <clipPath id="rightShieldClip">
          <path d="M100 8 L100 192 C148 165, 182 110, 182 36 C180 20, 140 8, 100 8 Z" />
        </clipPath>
        
        {/* Full shield clip */}
        <clipPath id="fullShieldClip">
          <path d="M100 8 C60 8, 20 20, 18 36 C18 110, 52 165, 100 192 C148 165, 182 110, 182 36 C180 20, 140 8, 100 8 Z" />
        </clipPath>
        
        {/* Gradients */}
        <linearGradient id="blueHalf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4ba3e3" />
          <stop offset="100%" stopColor="#2980b9" />
        </linearGradient>
        
        <linearGradient id="greenHalf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8cc63f" />
          <stop offset="100%" stopColor="#6ba328" />
        </linearGradient>
        
        <linearGradient id="shieldRim" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Outer 3D Shield Rim Border */}
      <path
        d="M100 4 C58 4, 15 16, 13 34 C13 114, 48 172, 100 198 C152 172, 187 114, 187 34 C185 16, 142 4, 100 4 Z"
        fill="url(#shieldRim)"
      />

      {/* Left Blue Half */}
      <path
        d="M99 10 C62 10, 24 21, 22 36 C22 108, 54 161, 99 187 Z"
        fill="url(#blueHalf)"
      />

      {/* Right Green Half */}
      <path
        d="M101 10 C138 10, 176 21, 178 36 C178 108, 146 161, 101 187 Z"
        fill="url(#greenHalf)"
      />

      {/* Vertical subtle center line */}
      <line x1="100" y1="10" x2="100" y2="187" stroke="#ffffff" strokeWidth="2.5" strokeOpacity="0.85" />

      {/* ================= LEFT SIDE (BLUE): CADUCEUS & SYRINGE ================= */}
      {/* Top Left: Caduceus (Medical Staff with Wings & Snakes) */}
      <g transform="translate(60, 48) scale(0.6)" fill="#ffffff" stroke="#ffffff" strokeWidth="0.8">
        {/* Central staff & ball top */}
        <circle cx="0" cy="-24" r="5" fill="#ffffff" />
        <line x1="0" y1="-24" x2="0" y2="28" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        {/* Wings */}
        <path d="M0 -18 C -14 -32, -34 -28, -40 -12 C -28 -10, -14 -12, 0 -16 Z" fill="#ffffff" />
        <path d="M0 -18 C 14 -32, 34 -28, 40 -12 C 28 -10, 14 -12, 0 -16 Z" fill="#ffffff" />
        {/* Entwined snakes figure-8 */}
        <path d="M-8 -6 C-14 -12, -14 -2, 0 4 C14 10, 14 20, 0 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M8 -6 C14 -12, 14 -2, 0 4 C-14 10, -14 20, 0 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
      </g>

      {/* Bottom Left: Medical Syringe (Angled 45 deg downwards right) */}
      <g transform="translate(68, 142) rotate(45) scale(0.65)" fill="#ffffff" stroke="#ffffff">
        {/* Needle */}
        <line x1="0" y1="-26" x2="0" y2="-16" stroke="#ffffff" strokeWidth="1.8" />
        {/* Nozzle */}
        <rect x="-2" y="-16" width="4" height="4" fill="#ffffff" />
        {/* Barrel */}
        <rect x="-6" y="-12" width="12" height="24" rx="2" fill="none" stroke="#ffffff" strokeWidth="2.2" />
        {/* Measurement notches */}
        <line x1="-5" y1="-7" x2="-1" y2="-7" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="-5" y1="-2" x2="-1" y2="-2" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="-5" y1="3" x2="-1" y2="3" stroke="#ffffff" strokeWidth="1.5" />
        <line x1="-5" y1="8" x2="-1" y2="8" stroke="#ffffff" strokeWidth="1.5" />
        {/* Plunger stem and thumb press */}
        <line x1="0" y1="12" x2="0" y2="24" stroke="#ffffff" strokeWidth="2.5" />
        <rect x="-8" y="24" width="16" height="3" rx="1" fill="#ffffff" />
      </g>

      {/* ================= RIGHT SIDE (GREEN): CAPSULE & LEAF/SYRINGE ================= */}
      {/* Top Right: Medical Capsule (Tilted) */}
      <g transform="translate(138, 46) rotate(-35) scale(0.68)">
        {/* Pill outer rounded capsule */}
        <rect x="-10" y="-22" width="20" height="44" rx="10" fill="none" stroke="#ffffff" strokeWidth="3" />
        {/* Top filled half */}
        <path d="M-10 -2 C -10 -14, -8 -22, 0 -22 C 8 -22, 10 -14, 10 -2 Z" fill="#ffffff" />
        {/* Pill shine reflection */}
        <path d="M -4 -16 Q -5 -8, -5 6" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" opacity="0.75" />
      </g>

      {/* Bottom Right: Herbal Leaf + Syringe (Natural & Modern Pharma) */}
      <g transform="translate(130, 142) scale(0.65)">
        {/* Herbal Leaf */}
        <path
          d="M-22 6 C-30 -8, -12 -18, -4 -10 C-6 0, -14 8, -22 6 Z"
          fill="#ffffff"
        />
        {/* Syringe tilted downwards */}
        <g transform="rotate(-40)" fill="#ffffff" stroke="#ffffff">
          <line x1="0" y1="-24" x2="0" y2="-15" stroke="#ffffff" strokeWidth="1.8" />
          <rect x="-2" y="-15" width="4" height="3" fill="#ffffff" />
          <rect x="-5" y="-12" width="10" height="22" rx="2" fill="none" stroke="#ffffff" strokeWidth="2" />
          <line x1="-4" y1="-6" x2="-1" y2="-6" stroke="#ffffff" strokeWidth="1.2" />
          <line x1="-4" y1="0" x2="-1" y2="0" stroke="#ffffff" strokeWidth="1.2" />
          <line x1="-4" y1="6" x2="-1" y2="6" stroke="#ffffff" strokeWidth="1.2" />
          <line x1="0" y1="10" x2="0" y2="20" stroke="#ffffff" strokeWidth="2" />
          <rect x="-7" y="20" width="14" height="2.5" rx="1" fill="#ffffff" />
        </g>
      </g>

      {/* ================= CENTER: BOLD "SD" WITH THICK WHITE BORDER ================= */}
      <g>
        {/* Outer White Contour/Halo for High Contrast across blue & green */}
        <text
          x="100"
          y="126"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', 'Arial Black', Georgia, sans-serif"
          fontWeight="900"
          fontSize="76"
          fill="#ffffff"
          stroke="#ffffff"
          strokeWidth="12"
          strokeLinejoin="round"
          letterSpacing="-2"
        >
          SD
        </text>

        {/* Inner Solid Navy Blue "SD" */}
        <text
          x="100"
          y="126"
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', 'Arial Black', Georgia, sans-serif"
          fontWeight="900"
          fontSize="76"
          fill="#1b365d"
          letterSpacing="-2"
        >
          SD
        </text>
      </g>
    </svg>
  );

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {variant === 'image' ? (
        <img
          src="/sd-logo.png"
          alt="Sagar Distributor SD Shield Logo"
          referrerPolicy="no-referrer"
          className={`${sizeMap[size]} object-contain drop-shadow-md transition-transform hover:scale-105 duration-200`}
        />
      ) : (
        renderSvg()
      )}

      {showText && (
        <div className="flex flex-col text-left">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight font-display text-lg sm:text-xl leading-tight ${
                textColor === 'light' ? 'text-white' : 'text-slate-900'
              }`}
            >
              SAGAR <span className="text-teal-600">DISTRIBUTOR</span>
            </span>
          </div>
          <span
            className={`text-[10px] sm:text-[11px] font-semibold tracking-wide ${
              textColor === 'light' ? 'text-teal-400' : 'text-slate-500'
            }`}
          >
            Wholesale Medicines • Chalisgaon
          </span>
        </div>
      )}
    </div>
  );
};
