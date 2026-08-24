import React from 'react';
import {
  MessageSquare,
  Sparkles,
  BarChart3,
  Code2,
  FileText,
  FolderKanban,
  History,
  Settings,
  ArrowRight,
  Zap,
  Cpu,
  Shield,
  Activity,
  ChevronRight,
  Clock,
  Trash2
} from 'lucide-react';
import { AppTab, Conversation } from '../types';
import { NandiLogo } from '../components/NandiLogo';

interface HomeScreenProps {
  onSelectTab: (tab: AppTab) => void;
  onOpenConversation: (id: string) => void;
  onNewChat: () => void;
  conversations: Conversation[];
  serverOnline?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectTab,
  onOpenConversation,
  onNewChat,
  conversations,
  serverOnline = true
}) => {
  const quickActions = [
    {
      id: 'chat' as AppTab,
      title: 'AI Chat',
      subtitle: 'Multi-turn dialogue',
      icon: MessageSquare,
      color: '#00F0FF',
      bgColor: 'rgba(0, 240, 255, 0.12)',
      borderColor: 'rgba(0, 240, 255, 0.3)'
    },
    {
      id: 'image' as AppTab,
      title: 'Image Studio',
      subtitle: 'Neural synthesis',
      icon: Sparkles,
      color: '#A855F7',
      bgColor: 'rgba(168, 85, 247, 0.12)',
      borderColor: 'rgba(168, 85, 247, 0.3)'
    },
    {
      id: 'chart' as AppTab,
      title: 'Chart Studio',
      subtitle: 'Data to visual graphs',
      icon: BarChart3,
      color: '#FFB800',
      bgColor: 'rgba(255, 184, 0, 0.12)',
      borderColor: 'rgba(255, 184, 0, 0.3)'
    },
    {
      id: 'code' as AppTab,
      title: 'Code Studio',
      subtitle: 'Multi-language code',
      icon: Code2,
      color: '#00E676',
      bgColor: 'rgba(0, 230, 118, 0.12)',
      borderColor: 'rgba(0, 230, 118, 0.3)'
    },
    {
      id: 'files' as AppTab,
      title: 'File Intelligence',
      subtitle: 'PDF/CSV/Doc analysis',
      icon: FileText,
      color: '#FF7A00',
      bgColor: 'rgba(255, 122, 0, 0.12)',
      borderColor: 'rgba(255, 122, 0, 0.3)'
    },
    {
      id: 'projects' as AppTab,
      title: 'Projects Hub',
      subtitle: 'Custom workspaces',
      icon: FolderKanban,
      color: '#00B4D8',
      bgColor: 'rgba(0, 180, 216, 0.12)',
      borderColor: 'rgba(0, 180, 216, 0.3)'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 md:py-6 space-y-5 max-w-5xl mx-auto w-full pb-24 md:pb-8">
      {/* Top Mobile Bar Header */}
      <div className="flex items-center justify-between">
        <NandiLogo size={36} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('history')}
            className="w-9 h-9 rounded-full bg-[#0F1A2E] border border-[#1E2F4D] flex items-center justify-center text-[#00F0FF] hover:bg-[#152542] active:scale-95 transition-all"
            title="History"
            aria-label="History"
          >
            <History size={17} />
          </button>
          <button
            onClick={() => onSelectTab('settings')}
            className="w-9 h-9 rounded-full bg-[#0F1A2E] border border-[#1E2F4D] flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#152542] active:scale-95 transition-all"
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>

      {/* Hero Banner with Cyber Glow */}
      <div className="relative overflow-hidden rounded-2xl border border-[#00F0FF]/30 bg-gradient-to-br from-[#0C192E] via-[#070E1A] to-[#140D26] p-5 sm:p-6 shadow-2xl shadow-[#00F0FF]/5">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-[#00F0FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-[#FFB800]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#00F0FF]/15 border border-[#00F0FF]/40 text-[#00F0FF]">
              AI 2026 EDITION
            </span>
            <span className="text-[10px] font-bold text-[#FFB800] tracking-wider uppercase">
              AN ANIMESH NANDI CREATION
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Meet NandiAi
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Your intelligent workspace for chat, neural image synthesis, documents, charts, and code generation.
            </p>
          </div>

          {/* Status Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#091222]/80 border border-[#16233B]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Nandi Core</div>
                <div className="text-xs font-bold text-white truncate">Active & Ready</div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#091222]/80 border border-[#16233B]">
              <Cpu size={14} className="text-[#00F0FF] flex-shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Intelligence</div>
                <div className="text-xs font-bold text-white truncate">GPT-OSS 120B / Groq</div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 p-2.5 rounded-xl bg-[#091222]/80 border border-[#16233B]">
              <Shield size={14} className="text-purple-400 flex-shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Security</div>
                <div className="text-xs font-bold text-white truncate">End-to-End Local</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Studios & Capabilities Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#00F0FF]">
            STUDIOS & CAPABILITIES
          </h3>
          <span className="text-[11px] text-slate-400">6 Studios Available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => onSelectTab(action.id)}
                className="flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl bg-[#0C1526] border transition-all text-left hover:scale-[1.02] active:scale-[0.98] group min-h-[110px]"
                style={{ borderColor: action.borderColor }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6"
                  style={{ backgroundColor: action.bgColor, color: action.color }}
                >
                  <Icon size={18} />
                </div>

                <div className="mt-2">
                  <div className="text-sm font-bold text-white flex items-center justify-between">
                    <span>{action.title}</span>
                    <ChevronRight size={14} className="text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {action.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start New Session Featured Card */}
      <button
        onClick={() => {
          onNewChat();
          onSelectTab('chat');
        }}
        className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#0F1B30] border border-[#1E2F4D] hover:border-[#00F0FF]/50 transition-all text-left group active:scale-[0.99]"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/30 flex items-center justify-center text-[#00F0FF] group-hover:scale-105 transition-transform">
            <Zap size={22} />
          </div>
          <div>
            <div className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
              Start a New Session
            </div>
            <div className="text-xs text-slate-400">
              Experience real-time AI reasoning and lightning-fast responses
            </div>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-[#162744] flex items-center justify-center text-[#00F0FF] group-hover:translate-x-1 transition-transform">
          <ArrowRight size={16} />
        </div>
      </button>

      {/* Recent Activity Subsection */}
      {conversations.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              RECENT CONVERSATIONS
            </h3>
            <button
              onClick={() => onSelectTab('history')}
              className="text-xs text-[#00F0FF] hover:underline"
            >
              View All ({conversations.length})
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {conversations.slice(0, 4).map((conv) => (
              <button
                key={conv.id}
                onClick={() => {
                  onOpenConversation(conv.id);
                  onSelectTab('chat');
                }}
                className="flex items-center justify-between p-3 rounded-xl bg-[#0A1220] border border-[#16233B] hover:border-[#00F0FF]/40 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-8 h-8 rounded-lg bg-[#0F1B30] flex items-center justify-center text-slate-400 group-hover:text-[#00F0FF]">
                    <MessageSquare size={15} />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate">
                      {conv.title || 'Untitled Conversation'}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={10} />
                      <span>{new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span>•</span>
                      <span>{conv.messages.length} msgs</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={14} className="text-slate-400 group-hover:text-[#00F0FF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* System Specs & Engine Info */}
      <div className="p-4 rounded-2xl bg-[#070D18] border border-[#16233B] text-xs text-slate-400 space-y-2">
        <div className="flex items-center justify-between text-slate-300 font-semibold text-xs">
          <span>SYSTEM ARCHITECTURE</span>
          <span className="text-[10px] text-[#00F0FF] font-mono">v2.4.0 (2026)</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
          <div className="p-2 rounded-lg bg-[#0C1526]">
            <div className="text-slate-400">Chat Engine</div>
            <div className="font-semibold text-slate-200 truncate">GPT-OSS 120B</div>
          </div>
          <div className="p-2 rounded-lg bg-[#0C1526]">
            <div className="text-slate-400">Diffusion</div>
            <div className="font-semibold text-slate-200 truncate">FLUX.1 Dev</div>
          </div>
          <div className="p-2 rounded-lg bg-[#0C1526]">
            <div className="text-slate-400">Inference</div>
            <div className="font-semibold text-slate-200 truncate">Groq LPU Array</div>
          </div>
          <div className="p-2 rounded-lg bg-[#0C1526]">
            <div className="text-slate-400">Data Engine</div>
            <div className="font-semibold text-slate-200 truncate">Local Persistence</div>
          </div>
        </div>
      </div>
    </div>
  );
};
