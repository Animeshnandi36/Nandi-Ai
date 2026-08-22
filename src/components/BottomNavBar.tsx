import React from 'react';
import { Home, MessageSquare, Sparkles, BarChart3, Code2, Layers } from 'lucide-react';
import { AppTab } from '../types';

interface BottomNavBarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  onOpenSidebar?: () => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSidebar
}) => {
  const tabs = [
    { id: 'home' as AppTab, label: 'Home', icon: Home },
    { id: 'chat' as AppTab, label: 'Chat', icon: MessageSquare },
    { id: 'image' as AppTab, label: 'Images', icon: Sparkles },
    { id: 'chart' as AppTab, label: 'Charts', icon: BarChart3 },
    { id: 'code' as AppTab, label: 'Code', icon: Code2 }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#080E1A]/95 backdrop-blur-lg border-t border-[#1E2F4D] px-2 py-1.5 md:hidden shadow-2xl safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded-xl transition-all relative ${
                isActive
                  ? 'text-[#00F0FF]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              aria-label={tab.label}
            >
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]" />
              )}
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'scale-110 bg-[#00F0FF]/15' : ''
                }`}
              >
                <Icon size={19} />
              </div>
              <span className={`text-[10px] font-semibold tracking-tight mt-0.5 ${isActive ? 'text-[#00F0FF]' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
