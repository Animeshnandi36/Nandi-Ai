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
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <img
          src="/assets/nandi-logo.png"
          alt="NandiAi Logo"
          width={size}
          height={size}
          className="w-full h-full object-contain select-none pointer-events-none"
          loading="eager"
        />
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
