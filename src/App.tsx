import React, { useState, useEffect } from 'react';
import { AppTab, Conversation, AppSettings } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { ChatScreen } from './screens/ChatScreen';
import { ImageStudioScreen } from './screens/ImageStudioScreen';
import { ChartStudioScreen } from './screens/ChartStudioScreen';
import { CodeStudioScreen } from './screens/CodeStudioScreen';
import { FileStudioScreen } from './screens/FileStudioScreen';
import { ProjectsScreen } from './screens/ProjectsScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { AboutScreen } from './screens/AboutScreen';
import { checkHealth } from './services/api';

const DEFAULT_SETTINGS: AppSettings = {
  defaultModel: 'llama-3.3-70b-versatile',
  theme: 'cyber',
  voiceSpeed: 1.0,
  autoSpeak: false,
  streamResponse: true,
  customSystemPrompt: ''
};

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<AppTab>('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [serverOnline, setServerOnline] = useState(true);

  // Load conversations and settings from localStorage
  useEffect(() => {
    try {
      const savedConvs = localStorage.getItem('nandiai_conversations');
      if (savedConvs) {
        const parsed = JSON.parse(savedConvs);
        setConversations(parsed);
        if (parsed.length > 0) {
          setActiveConversationId(parsed[0].id);
        }
      }

      const savedSettings = localStorage.getItem('nandiai_settings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (e) {
      console.warn('Storage load error', e);
    }

    // Health ping
    checkHealth()
      .then((res) => setServerOnline(res.status === 'online'))
      .catch(() => setServerOnline(false));
  }, []);

  const saveConversations = (updated: Conversation[]) => {
    setConversations(updated);
    try {
      localStorage.setItem('nandiai_conversations', JSON.stringify(updated.slice(0, 50)));
    } catch (e) {}
  };

  const handleUpdateSettings = (updated: AppSettings) => {
    setSettings(updated);
    try {
      localStorage.setItem('nandiai_settings', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleCreateNewChat = (): Conversation => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'New Conversation',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      model: settings.defaultModel,
      messages: []
    };

    const updated = [newConv, ...conversations];
    saveConversations(updated);
    setActiveConversationId(newConv.id);
    return newConv;
  };

  const handleUpdateConversation = (updated: Conversation) => {
    const exists = conversations.some((c) => c.id === updated.id);
    let newConvs: Conversation[];
    if (exists) {
      newConvs = conversations.map((c) => (c.id === updated.id ? updated : c));
    } else {
      newConvs = [updated, ...conversations];
    }
    saveConversations(newConvs);
  };

  const handleDeleteConversation = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = conversations.filter((c) => c.id !== id);
    saveConversations(updated);
    if (activeConversationId === id) {
      setActiveConversationId(updated[0]?.id || null);
    }
  };

  const handleClearAllData = () => {
    if (confirm('Are you sure you want to reset all conversation history and stored cache?')) {
      localStorage.clear();
      setConversations([]);
      setActiveConversationId(null);
      setSettings(DEFAULT_SETTINGS);
      alert('NandiAi local storage reset successfully.');
    }
  };

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#060A12] text-slate-100 font-sans">
      {/* Responsive Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => {
          setActiveConversationId(id);
          setCurrentTab('chat');
        }}
        onNewChat={handleCreateNewChat}
        onDeleteConversation={handleDeleteConversation}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header
          currentTab={currentTab}
          onOpenSidebar={() => setSidebarOpen(true)}
          activeModel={settings.defaultModel}
          onSelectModel={(m) => handleUpdateSettings({ ...settings, defaultModel: m })}
          serverOnline={serverOnline}
        />

        <main className="flex-1 flex flex-col overflow-hidden relative">
          {currentTab === 'chat' && (
            <ChatScreen
              activeConversation={activeConversation}
              activeModel={settings.defaultModel}
              onUpdateConversation={handleUpdateConversation}
              onCreateNewChat={handleCreateNewChat}
            />
          )}

          {currentTab === 'image' && <ImageStudioScreen />}

          {currentTab === 'chart' && <ChartStudioScreen />}

          {currentTab === 'code' && <CodeStudioScreen />}

          {currentTab === 'files' && <FileStudioScreen />}

          {currentTab === 'projects' && (
            <ProjectsScreen
              conversations={conversations}
              onOpenConversation={(id) => {
                setActiveConversationId(id);
                setCurrentTab('chat');
              }}
            />
          )}

          {currentTab === 'history' && (
            <HistoryScreen
              conversations={conversations}
              onOpenConversation={(id) => {
                setActiveConversationId(id);
                setCurrentTab('chat');
              }}
              onDeleteConversation={handleDeleteConversation}
              onClearAll={() => saveConversations([])}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsScreen
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onClearAllData={handleClearAllData}
            />
          )}

          {currentTab === 'about' && <AboutScreen />}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
