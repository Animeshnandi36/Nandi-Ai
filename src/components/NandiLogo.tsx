import React from 'react';

interface NandiLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export const NandiLogo: React.FC<NandiLogoProps> = ({
  size = 36,
  showText = true,
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0B1424] to-[#050A14] border border-[#1E2F4D] shadow-neon-cyan/20"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-[78%] h-[78%]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00F0FF" />
              <stop offset="100%" stop-color="#FFB800" />
            </linearGradient>
            <radialGradient id="emblemGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.6" />
              <stop offset="100%" stop-color="#00F0FF" stop-opacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Cyber Matrix Ring */}
          <circle cx="50" cy="50" r="44" stroke="url(#logoGrad)" strokeWidth="3" strokeDasharray="10 5" opacity="0.85" />
          <circle cx="50" cy="50" r="36" stroke="#00F0FF" strokeWidth="1.5" opacity="0.4" />
          <circle cx="50" cy="50" r="28" fill="url(#emblemGlow)" />

          {/* Nandi Bull Emblem Shape */}
          <path
            d="M 28 34 C 32 20, 42 18, 50 26 C 58 18, 68 20, 72 34 C 77 48, 68 64, 50 82 C 32 64, 23 48, 28 34 Z"
            fill="url(#logoGrad)"
            stroke="#00F0FF"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Neural Core Lights */}
          <circle cx="50" cy="46" r="6" fill="#FFFFFF" />
          <circle cx="50" cy="46" r="3" fill="#00F0FF" />
          <circle cx="38" cy="38" r="3.5" fill="#FFB800" />
          <circle cx="62" cy="38" r="3.5" fill="#FFB800" />

          {/* Neural Synapse Lines */}
          <line x1="38" y1="38" x2="50" y2="46" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
          <line x1="62" y1="38" x2="50" y2="46" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />
          <line x1="50" y1="46" x2="50" y2="70" stroke="#FFB800" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="font-extrabold tracking-wider text-white text-lg font-sans">NANDI</span>
            <span className="font-extrabold text-[#00F0FF] text-lg font-sans tracking-wide">AI</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
            NEURAL WORKSPACE
          </span>
        </div>
      )}
    </div>
  );
};
