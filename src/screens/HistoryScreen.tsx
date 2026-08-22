import React, { useState } from 'react';
import {
  History,
  Search,
  MessageSquare,
  Trash2,
  Edit2,
  Calendar,
  Download,
  ArrowRight,
  Sparkles,
  Bot
} from 'lucide-react';
import { Conversation } from '../types';

interface HistoryScreenProps {
  conversations: Conversation[];
  onOpenConversation: (id: string) => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  onClearAll: () => void;
}

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  conversations,
  onOpenConversation,
  onDeleteConversation,
  onClearAll
}) => {
  const [search, setSearch] = useState('');

  const filtered = conversations.filter((c) => {
    const titleMatch = (c.title || '').toLowerCase().includes(search.toLowerCase());
    const messageMatch = c.messages.some((m) => m.content.toLowerCase().includes(search.toLowerCase()));
    return titleMatch || messageMatch;
  });

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(conversations, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nandiai-chat-history-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#060A12] p-4 md:p-6 pb-24 md:pb-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0B1424] via-[#0E1A33] to-[#0B1424] border border-[#1E2F4D] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#FFB800]/20 border border-[#00F0FF]/40 flex items-center justify-center">
            <History size={24} className="text-[#00F0FF]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              Conversation <span className="text-[#00F0FF]">Archives</span>
            </h2>
            <p className="text-xs text-slate-400">
              Search, resume, and export your historical Groq LPU interactions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJson}
            disabled={conversations.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1A2E] border border-[#1E2F4D] text-xs font-semibold text-slate-300 hover:text-white hover:border-[#00F0FF]/40 transition-colors disabled:opacity-50"
          >
            <Download size={14} className="text-[#00F0FF]" />
            <span>Export Archives</span>
          </button>
          {conversations.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/40 border border-rose-800 text-xs font-semibold text-rose-300 hover:bg-rose-900/60 transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search through titles or message contents..."
          className="w-full bg-[#0B1322] border border-[#1E2F4D] rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#00F0FF] transition-all"
        />
        <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
      </div>

      {/* Conversations List */}
      {filtered.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#101F38] text-slate-400 flex items-center justify-center mx-auto">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-base font-bold text-white">No archived conversations found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search ? 'Try adjusting your search query.' : 'Start chatting with NandiAi to record your session history.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((conv) => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            return (
              <div
                key={conv.id}
                onClick={() => onOpenConversation(conv.id)}
                className="p-4 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] hover:border-[#00F0FF]/50 hover:bg-[#0E192E] transition-all cursor-pointer group flex items-center justify-between gap-4 shadow-md"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#101F38] border border-[#1E2F4D] flex items-center justify-center flex-shrink-0 text-[#00F0FF] group-hover:scale-105 transition-transform">
                    <MessageSquare size={18} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors truncate">
                        {conv.title || 'Untitled Conversation'}
                      </h4>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-[#080E1A] text-slate-400 border border-[#1E2F4D] font-mono">
                        {conv.model || 'llama-3.3-70b'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate leading-relaxed">
                      {lastMsg ? lastMsg.content.slice(0, 120) : 'Empty thread'}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                      <span>{conv.messages.length} messages</span>
                      <span>•</span>
                      <span>{new Date(conv.updatedAt || conv.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => onDeleteConversation(conv.id, e)}
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Conversation"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="p-2 rounded-xl text-slate-400 group-hover:text-[#00F0FF] transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
