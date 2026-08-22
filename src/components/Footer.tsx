import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-3 px-4 text-center border-t border-[#1E2F4D]/50 bg-[#050912] text-xs text-slate-400 select-none">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2">
        <span className="font-medium text-slate-300">© 2026 NandiAi</span>
        <span className="hidden sm:inline text-slate-400">·</span>
        <span className="text-slate-400">Developed by <strong className="text-[#00F0FF] font-semibold">Animesh Nandi</strong></span>
        <span className="hidden sm:inline text-slate-400">·</span>
        <span className="text-[11px] text-slate-400">Groq LPU & Hugging Face FLUX.1 Neural Engine</span>
      </div>
    </footer>
  );
};
