export type AppTab =
  | 'chat'
  | 'image'
  | 'chart'
  | 'code'
  | 'files'
  | 'projects'
  | 'history'
  | 'settings'
  | 'about';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  model?: string;
  imageAttachment?: string;
  fileAttachment?: {
    name: string;
    type: string;
    size: number;
  };
  isError?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  model: string;
  messages: ChatMessage[];
  projectId?: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  aspectRatio: string;
  style: string;
  timestamp: number;
  favorite?: boolean;
}

export interface ChartDataItem {
  label: string;
  value: number;
  secondary?: number;
}

export interface ChartData {
  id?: string;
  title: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'scatter';
  xAxis: string;
  yAxis: string;
  seriesKey: string;
  data: ChartDataItem[];
  notes?: string;
  timestamp?: number;
}

export interface CodeSnippet {
  id: string;
  language: string;
  title: string;
  code: string;
  explanation: string;
  timestamp: number;
}

export interface ProjectWorkspace {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  color: string;
  conversationIds: string[];
  fileNames: string[];
}

export interface AppSettings {
  defaultModel: string;
  theme: 'cyber' | 'dark' | 'oled';
  voiceSpeed: number;
  autoSpeak: boolean;
  streamResponse: boolean;
  customSystemPrompt: string;
}
