import React from 'react';
import { Menu, Zap, Shield, Cpu, ExternalLink } from 'lucide-react';
import { AppTab } from '../types';
import { NandiLogo } from './NandiLogo';

interface HeaderProps {
  currentTab: AppTab;
  onOpenSidebar: () => void;
  activeModel: string;
  onSelectModel: (model: string) => void;
  serverOnline?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onOpenSidebar,
  activeModel,
  onSelectModel,
  serverOnline = true
}) => {
  const models = [
    { id: 'openai/gpt-oss-120b', label: 'OpenAI GPT-OSS 120B' },
    { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B (Groq)' },
    { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 70B (Reasoning)' },
    { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B (Instant)' },
    { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B (32k)' },
    { id: 'gemma2-9b-it', label: 'Gemma 2 9B (Google/Groq)' }
  ];

  const getTitle = () => {
    switch (currentTab) {
      case 'home': return 'Home Workspace';
      case 'chat': return 'Neural Chat Studio';
      case 'image': return 'FLUX.1 Image Studio';
      case 'chart': return 'Interactive Chart Studio';
      case 'code': return 'Multi-Language Code Studio';
      case 'files': return 'Document & File Intelligence';
      case 'projects': return 'Workspaces & Projects Hub';
      case 'history': return 'Conversation Archives';
      case 'settings': return 'System Settings';
      case 'about': return 'About NandiAi';
      default: return 'Neural Workspace';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#080E1A]/95 backdrop-blur-md border-b border-[#1E2F4D] px-4 py-2.5 flex items-center justify-between">
      {/* Left section: Hamburger & Screen Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="p-2 rounded-xl text-slate-300 hover:text-white bg-[#0F1A2E] border border-[#1E2F4D] hover:border-[#00F0FF]/40 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <NandiLogo size={28} showText={false} />
          <div>
            <h1 className="text-sm font-bold text-white tracking-wide">{getTitle()}</h1>
            <p className="text-[10px] text-slate-400">NandiAi Cloud Edge Architecture</p>
          </div>
        </div>

        <div className="sm:hidden font-bold text-sm text-white truncate max-w-[140px]">
          {getTitle()}
        </div>
      </div>

      {/* Right Section: Model Selector & Status Badge */}
      <div className="flex items-center gap-2.5">
        {/* Model dropdown for Chat/Code tabs */}
        {(currentTab === 'chat' || currentTab === 'code' || currentTab === 'files') && (
          <div className="relative">
            <select
              value={activeModel}
              onChange={(e) => onSelectModel(e.target.value)}
              className="appearance-none bg-[#0F1A2E] text-xs text-slate-200 border border-[#1E2F4D] hover:border-[#00F0FF]/50 rounded-xl px-3 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-[#00F0FF] cursor-pointer font-medium"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id} className="bg-[#080E1A] text-slate-200">
                  {m.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
              <Cpu size={12} />
            </div>
          </div>
        )}

        {/* Live Status Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0F1A2E] border border-[#1E2F4D] text-[11px] font-medium text-slate-300">
          <span className={`w-2 h-2 rounded-full ${serverOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="hidden md:inline">{serverOnline ? 'Groq LPU Active' : 'Offline Engine'}</span>
        </div>
      </div>
    </header>
  );
};
