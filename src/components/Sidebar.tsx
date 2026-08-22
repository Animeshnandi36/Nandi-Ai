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
  HelpCircle,
  Plus,
  Trash2,
  Layers,
  X
} from 'lucide-react';
import { AppTab, Conversation } from '../types';
import { NandiLogo } from './NandiLogo';

interface SidebarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation
}) => {
  const navItems = [
    { id: 'chat', label: 'AI Chat', icon: MessageSquare, badge: 'Groq LPU' },
    { id: 'image', label: 'Image Studio', icon: Sparkles, badge: 'FLUX.1' },
    { id: 'chart', label: 'Chart Studio', icon: BarChart3 },
    { id: 'code', label: 'Code Studio', icon: Code2 },
    { id: 'files', label: 'Document & Files', icon: FileText },
    { id: 'projects', label: 'Projects & Hub', icon: FolderKanban },
    { id: 'history', label: 'Chat History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'about', label: 'About & Help', icon: HelpCircle }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-[#080E1A] border-r border-[#1E2F4D] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between p-4 border-b border-[#1E2F4D]">
          <NandiLogo size={36} />
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#101B2E]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action Button: New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onSelectTab('chat');
              if (window.innerWidth < 1024) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black font-bold text-sm shadow-neon-cyan/20 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Plus size={18} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Primary Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="text-[11px] font-semibold text-slate-400 px-3 py-1 uppercase tracking-wider">
            Workspace Hub
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id as AppTab);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#101F38] text-[#00F0FF] border border-[#00F0FF]/40 shadow-cyan-sm'
                    : 'text-slate-300 hover:text-white hover:bg-[#0E1729]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-[#00F0FF]' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-[#00F0FF]/20 text-[#00F0FF]' : 'bg-[#121E33] text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Recent Conversations Subsection */}
          {conversations.length > 0 && (
            <div className="pt-4 mt-4 border-t border-[#1E2F4D]/60">
              <div className="flex items-center justify-between px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <span>Recent Chats</span>
                <span className="text-[10px] text-slate-400">{conversations.length}</span>
              </div>
              <div className="space-y-0.5 mt-1 max-h-48 overflow-y-auto">
                {conversations.slice(0, 8).map((conv) => {
                  const isSelected = activeConversationId === conv.id && currentTab === 'chat';
                  return (
                    <div
                      key={conv.id}
                      onClick={() => {
                        onSelectConversation(conv.id);
                        onSelectTab('chat');
                        if (window.innerWidth < 1024) onClose();
                      }}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#101F38] text-white font-medium border border-[#1E2F4D]'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#0E1729]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <MessageSquare size={13} className="text-slate-400 flex-shrink-0" />
                        <span className="truncate">{conv.title || 'Untitled Conversation'}</span>
                      </div>
                      <button
                        onClick={(e) => onDeleteConversation(conv.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 rounded transition-opacity"
                        title="Delete chat"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Developer & Version Badge */}
        <div className="p-3 border-t border-[#1E2F4D] bg-[#060A14]">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-[#0B1322] border border-[#16233B]">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F0FF]/20 to-[#FFB800]/20 border border-[#00F0FF]/30 flex items-center justify-center text-white font-bold text-xs">
              AN
            </div>
            <div className="flex-1 truncate">
              <div className="text-xs font-semibold text-white truncate">Animesh Nandi</div>
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>NandiAi v2.4.0</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
