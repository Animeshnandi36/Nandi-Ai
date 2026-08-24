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
        className="relative flex items-center justify-center shrink-0 rounded-full"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 256 256"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="bgCanvasGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0B1C33" />
              <stop offset="70%" stopColor="#060F1E" />
              <stop offset="100%" stopColor="#020710" />
            </radialGradient>
            <linearGradient id="neonCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00FFFF" />
              <stop offset="50%" stopColor="#00B4D8" />
              <stop offset="100%" stopColor="#00FFFF" />
            </linearGradient>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD166" />
              <stop offset="50%" stopColor="#E0A96D" />
              <stop offset="100%" stopColor="#FFC043" />
            </linearGradient>
            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>

          {/* Background Canvas */}
          <circle cx="128" cy="128" r="120" fill="url(#bgCanvasGrad)" />

          {/* Outer Soft Neon Glow Circle */}
          <circle cx="128" cy="128" r="110" stroke="#00E5FF" strokeWidth="10" strokeOpacity="0.25" />

          {/* Primary Glowing Neon Cyan Outer Ring */}
          <circle cx="128" cy="128" r="110" stroke="url(#neonCyanGrad)" strokeWidth="5" filter="url(#cyanGlow)" />

          {/* Inner Gold Accent Ring */}
          <circle cx="128" cy="128" r="102" stroke="url(#goldGrad)" strokeWidth="2.5" />

          {/* Circuit Traces Left Side */}
          <path d="M65 70 L48 70 L38 82 L38 102 M75 100 L52 100 L40 114 M80 128 L42 128 L30 140 M78 150 L56 150 L46 162 M90 165 L70 165 L58 178" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" />
          <path d="M70 85 L56 85 L44 98 L44 120 M82 112 L60 112 L50 124 M72 138 L54 138 L42 150" stroke="#E0A96D" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="38" cy="102" r="3" fill="#00FFFF" />
          <circle cx="40" cy="114" r="3" fill="#FFD166" />
          <circle cx="30" cy="140" r="3.5" fill="#00FFFF" />
          <circle cx="46" cy="162" r="3" fill="#FFD166" />
          <circle cx="58" cy="178" r="3" fill="#00FFFF" />

          {/* Circuit Traces Right Side */}
          <path d="M191 70 L208 70 L218 82 L218 102 M181 100 L204 100 L216 114 M176 128 L214 128 L226 140 M178 150 L200 150 L210 162 M166 165 L186 165 L198 178" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" />
          <path d="M186 85 L200 85 L212 98 L212 120 M174 112 L196 112 L206 124 M184 138 L202 138 L214 150" stroke="#E0A96D" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="218" cy="102" r="3" fill="#00FFFF" />
          <circle cx="216" cy="114" r="3" fill="#FFD166" />
          <circle cx="226" cy="140" r="3.5" fill="#00FFFF" />
          <circle cx="210" cy="162" r="3" fill="#FFD166" />
          <circle cx="198" cy="178" r="3" fill="#00FFFF" />

          {/* Brain Neural Cortex (Top) */}
          <path d="M128 42 C120 42 110 46 106 53 C102 60 104 68 107 74 C110 80 118 84 128 84 C138 84 146 80 149 74 C152 68 154 60 150 53 C146 46 136 42 128 42 Z" fill="#082A45" stroke="#00E5FF" strokeWidth="1.5" />
          <path d="M128 43 L128 83 M118 50 C114 54 114 60 119 63 C114 67 114 73 121 76 M138 50 C142 54 142 60 137 63 C142 67 142 73 135 76 M122 56 L128 59 L134 56 M122 70 L128 67 L134 70" stroke="#00FFFF" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="117" cy="54" r="1.5" fill="#00FFFF" />
          <circle cx="139" cy="54" r="1.5" fill="#00FFFF" />
          <circle cx="128" cy="51" r="1.5" fill="#FFD166" />
          <circle cx="116" cy="71" r="1.5" fill="#00FFFF" />
          <circle cx="140" cy="71" r="1.5" fill="#00FFFF" />
          <circle cx="128" cy="75" r="1.5" fill="#FFD166" />

          {/* Left Horn */}
          <path d="M98 102 C84 88 72 66 92 44 C100 34 102 46 95 64 C90 76 96 90 104 98 Z" fill="#0F3B59" stroke="#00E5FF" strokeWidth="2.5" />
          <path d="M92 44 C96 38 98 48 94 62 C90 72 94 84 99 92 C96 90 92 80 91 68 C90 56 90 48 92 44 Z" fill="#FFD166" />

          {/* Right Horn */}
          <path d="M158 102 C172 88 184 66 164 44 C156 34 154 46 161 64 C166 76 160 90 152 98 Z" fill="#0F3B59" stroke="#00E5FF" strokeWidth="2.5" />
          <path d="M164 44 C160 38 158 48 162 62 C166 72 162 84 157 92 C160 90 164 80 165 68 C166 56 166 48 164 44 Z" fill="#FFD166" />

          {/* Left & Right Ears */}
          <path d="M92 106 L72 112 C70 116 78 124 88 122 L96 114 Z" fill="#0D2E47" stroke="#E0A96D" strokeWidth="1.8" />
          <path d="M78 114 L88 118 L86 115 Z" fill="#00E5FF" />
          <path d="M164 106 L184 112 C186 116 178 124 168 122 L160 114 Z" fill="#0D2E47" stroke="#E0A96D" strokeWidth="1.8" />
          <path d="M178 114 L168 118 L170 115 Z" fill="#00E5FF" />

          {/* Face Armor & Plates */}
          <path d="M102 96 L154 96 L148 138 L140 166 L128 176 L116 166 L108 138 Z" fill="#0B233A" stroke="#00E5FF" strokeWidth="2" />
          <path d="M110 98 L128 114 L146 98 M128 114 L128 142 M114 122 L128 132 L142 122 M114 142 L128 152 L142 142" stroke="#FFD166" strokeWidth="1.8" strokeLinecap="round" />

          {/* Glowing Eyes */}
          <path d="M110 120 L122 123 L118 128 L108 125 Z" fill="#00FFFF" filter="url(#cyanGlow)" />
          <path d="M146 120 L134 123 L138 128 L148 125 Z" fill="#00FFFF" filter="url(#cyanGlow)" />
          <path d="M108 117 L124 121 L122 119 L109 116 Z" fill="#FFD166" />
          <path d="M148 117 L132 121 L134 119 L147 116 Z" fill="#FFD166" />

          {/* Snout & Nostrils */}
          <path d="M116 146 L140 146 L142 164 L136 172 L120 172 L114 164 Z" fill="#0E3654" stroke="#00E5FF" strokeWidth="2" />
          <ellipse cx="120" cy="158" rx="2.5" ry="4" fill="#040D18" stroke="#FFD166" strokeWidth="1.5" />
          <ellipse cx="136" cy="158" rx="2.5" ry="4" fill="#040D18" stroke="#FFD166" strokeWidth="1.5" />

          {/* Chin & Power Lines */}
          <path d="M120 172 L136 172 L132 184 L124 184 Z" fill="#07192A" stroke="#00E5FF" strokeWidth="1.6" />
          <path d="M106 148 L96 172 L100 192 M150 148 L160 172 L156 192 M114 168 L110 192 M142 168 L146 192" stroke="#00B4D8" strokeWidth="2" strokeLinecap="round" />
          <path d="M102 160 L92 184 M154 160 L164 184 M122 176 L118 194 M134 176 L138 194" stroke="#FFD166" strokeWidth="1.8" strokeLinecap="round" />

          {/* NANDI Text Typography */}
          <text x="128" y="222" textAnchor="middle" fill="#FFFFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="24" letterSpacing="4">NANDI</text>

          {/* AI Banner with Flanking Lines */}
          <line x1="84" y1="237" x2="114" y2="237" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
          <text x="128" y="241" textAnchor="middle" fill="#00FFFF" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="800" fontSize="13" letterSpacing="3">AI</text>
          <line x1="142" y1="237" x2="172" y2="237" stroke="#FFD166" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1">
            <span className="font-black tracking-wider text-white text-lg font-sans">NANDI</span>
            <span className="font-black text-[#00F0FF] text-lg font-sans tracking-wide">AI</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
            NEURAL WORKSPACE
          </span>
        </div>
      )}
    </div>
  );
};
