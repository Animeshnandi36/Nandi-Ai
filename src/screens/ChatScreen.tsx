import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Square,
  Mic,
  MicOff,
  Image as ImageIcon,
  Paperclip,
  RotateCcw,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Globe,
  Sparkles,
  Zap,
  Terminal,
  Bot,
  User,
  X
} from 'lucide-react';
import { ChatMessage, Conversation } from '../types';
import { sendChatMessage } from '../services/api';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { NandiLogo } from '../components/NandiLogo';

interface ChatScreenProps {
  activeConversation: Conversation | null;
  activeModel: string;
  onUpdateConversation: (updated: Conversation) => void;
  onCreateNewChat: () => Conversation;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  activeConversation,
  activeModel,
  onUpdateConversation,
  onCreateNewChat
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileAttachment, setFileAttachment] = useState<{ name: string; type: string; size: number } | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages, isLoading]);

  // Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser. Please type your query.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        setIsRecording(false);
      }
    }
  };

  const handleSpeak = (text: string, msgId: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/```[\s\S]*?```/g, 'Code block omitted for speech.').replace(/[#*_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFileAttachment({
        name: file.name,
        type: file.type || 'text/plain',
        size: file.size
      });
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent && !imagePreview && !fileAttachment) return;

    let conv = activeConversation;
    if (!conv) {
      conv = onCreateNewChat();
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: Date.now(),
      imageAttachment: imagePreview || undefined,
      fileAttachment: fileAttachment || undefined
    };

    const updatedMessages = [...conv.messages, userMessage];
    const updatedConv: Conversation = {
      ...conv,
      title: conv.messages.length === 0 ? (messageContent.slice(0, 32) || 'Image Query') : conv.title,
      updatedAt: Date.now(),
      messages: updatedMessages
    };

    onUpdateConversation(updatedConv);
    setInput('');
    setImagePreview(null);
    setFileAttachment(null);
    setIsLoading(true);

    try {
      // Build conversation payload
      const historyPayload = updatedMessages.map((m) => ({
        role: m.role,
        content: m.content + (m.fileAttachment ? `\n[Attached File: ${m.fileAttachment.name}]` : '')
      }));

      const systemPrompt = webSearchEnabled
        ? 'You are NandiAi with real-time web grounding. Provide accurate answers with technical depth, citations, and clear structure.'
        : undefined;

      const response = await sendChatMessage(historyPayload, activeModel, systemPrompt);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        model: response.model || activeModel
      };

      onUpdateConversation({
        ...updatedConv,
        messages: [...updatedMessages, assistantMessage]
      });
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `### ⚠️ Connection Notice\n\nCould not reach the neural inference server. Please check your network connection or verify that \`GROQ_API_KEY\` is configured in your Render environment variables.\n\n*Error details*: ${err.message}`,
        timestamp: Date.now(),
        isError: true
      };

      onUpdateConversation({
        ...updatedConv,
        messages: [...updatedMessages, errorMessage]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!activeConversation || activeConversation.messages.length === 0) return;
    const lastUserMsg = [...activeConversation.messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    // Filter out trailing assistant response
    const messagesWithoutLastAssistant = activeConversation.messages.filter(
      (m, idx) => !(idx === activeConversation.messages.length - 1 && m.role === 'assistant')
    );

    const updatedConv = {
      ...activeConversation,
      messages: messagesWithoutLastAssistant
    };

    onUpdateConversation(updatedConv);
    setIsLoading(true);

    try {
      const historyPayload = messagesWithoutLastAssistant.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const response = await sendChatMessage(historyPayload, activeModel);
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: Date.now(),
        model: response.model || activeModel
      };

      onUpdateConversation({
        ...updatedConv,
        messages: [...messagesWithoutLastAssistant, assistantMessage]
      });
    } catch (err: any) {
      // Handle gracefully
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    { title: 'Explain DeepSeek R1', desc: 'Break down how reasoning tokens work with Groq LPU', icon: Zap },
    { title: 'Write a Kotlin Service', desc: 'Create a thread-safe coroutine repository for Android', icon: Terminal },
    { title: 'Quarterly Growth Chart', desc: 'Generate interactive financial performance metrics', icon: Sparkles },
    { title: 'Analyze System Architecture', desc: 'Compare monolithic vs microservices for AI inference', icon: Globe }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-[#060A12] overflow-hidden relative">
      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl w-full mx-auto">
        {(!activeConversation || activeConversation.messages.length === 0) ? (
          /* Empty State Showcase */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl animate-pulse"></div>
              <NandiLogo size={72} showText={false} />
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-2">
              Welcome to <span className="text-[#00F0FF]">NandiAi</span>
            </h2>
            <p className="text-sm md:text-base text-slate-400 max-w-lg mb-8 leading-relaxed">
              Ultra-fast neural intelligence powered by Groq LPU architecture & Hugging Face FLUX.1.
              Developed by <strong className="text-white font-medium">Animesh Nandi</strong>.
            </p>

            {/* Starter Prompt Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl text-left">
              {suggestions.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(item.title + ' - ' + item.desc)}
                    className="p-3.5 rounded-xl bg-[#0B1322] border border-[#1E2F4D] hover:border-[#00F0FF]/50 hover:bg-[#101C33] transition-all group active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="p-1.5 rounded-lg bg-[#0F1D38] text-[#00F0FF] group-hover:text-white transition-colors">
                        <Icon size={16} />
                      </div>
                      <span className="font-semibold text-sm text-slate-200 group-hover:text-[#00F0FF] transition-colors">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 pl-8 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* Active Chat Thread */
          activeConversation.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 md:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-xl bg-[#0F1A2E] border border-[#1E2F4D] flex items-center justify-center flex-shrink-0 mt-1 shadow-cyan-sm">
                    <Bot size={18} className="text-[#00F0FF]" />
                  </div>
                )}

                <div className={`flex flex-col max-w-[85%] md:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* User Attachments if present */}
                  {msg.imageAttachment && (
                    <div className="mb-2 rounded-xl overflow-hidden border border-[#1E2F4D] max-w-xs">
                      <img src={msg.imageAttachment} alt="User attachment" className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {msg.fileAttachment && (
                    <div className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F1A2E] border border-[#1E2F4D] text-xs text-slate-300">
                      <Paperclip size={14} className="text-[#00F0FF]" />
                      <span>{msg.fileAttachment.name}</span>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      isUser
                        ? 'bg-gradient-to-r from-[#0066CC] to-[#0099FF] text-white rounded-tr-none shadow-md'
                        : msg.isError
                        ? 'bg-rose-950/40 border border-rose-800 text-rose-200 rounded-tl-none'
                        : 'bg-[#0B1322] border border-[#1E2F4D] text-slate-100 rounded-tl-none shadow-md'
                    }`}
                  >
                    {isUser ? (
                      <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <MarkdownRenderer content={msg.content} />
                    )}
                  </div>

                  {/* Assistant Footer Controls */}
                  {!isUser && !msg.isError && (
                    <div className="flex items-center gap-3 mt-1.5 pl-1 text-slate-400 text-xs">
                      <button
                        onClick={() => handleCopy(msg.content, msg.id)}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                        title="Copy message"
                      >
                        {copiedMsgId === msg.id ? (
                          <Check size={13} className="text-emerald-400" />
                        ) : (
                          <Copy size={13} />
                        )}
                        <span>{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>

                      <button
                        onClick={() => handleSpeak(msg.content, msg.id)}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                        title="Read aloud"
                      >
                        {isSpeaking === msg.id ? (
                          <VolumeX size={13} className="text-amber-400" />
                        ) : (
                          <Volume2 size={13} />
                        )}
                        <span>{isSpeaking === msg.id ? 'Stop' : 'Speak'}</span>
                      </button>

                      {msg.model && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          {msg.model}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00F0FF] to-[#0066CC] flex items-center justify-center flex-shrink-0 mt-1 text-black font-bold text-xs shadow-md">
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Loading Reasoning Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-center">
            <div className="w-8 h-8 rounded-xl bg-[#0F1A2E] border border-[#1E2F4D] flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-[#00F0FF] animate-spin-slow" />
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] text-xs text-[#00F0FF] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-ping"></span>
              <span className="font-semibold">NandiAi is reasoning via Groq LPU...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar & Controls */}
      <div className="p-3 md:p-4 bg-[#080E1A] border-t border-[#1E2F4D]">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Active Attachments Previews */}
          {(imagePreview || fileAttachment) && (
            <div className="flex items-center gap-3 p-2 rounded-xl bg-[#0F1A2E] border border-[#1E2F4D]">
              {imagePreview && (
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#1E2F4D]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => setImagePreview(null)}
                    className="absolute top-0.5 right-0.5 p-0.5 bg-black/80 rounded-full text-white"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}
              {fileAttachment && (
                <div className="flex items-center justify-between flex-1 text-xs text-slate-200">
                  <div className="flex items-center gap-2">
                    <Paperclip size={14} className="text-[#00F0FF]" />
                    <span className="truncate max-w-[200px]">{fileAttachment.name}</span>
                    <span className="text-[10px] text-slate-400">({(fileAttachment.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    onClick={() => setFileAttachment(null)}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Controls row */}
          <div className="flex items-center justify-between text-xs px-1 text-slate-400">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg border transition-colors ${
                  webSearchEnabled
                    ? 'bg-[#00F0FF]/10 border-[#00F0FF]/40 text-[#00F0FF]'
                    : 'bg-[#0F1A2E] border-[#1E2F4D] text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe size={13} />
                <span>Web Grounding</span>
              </button>

              {activeConversation && activeConversation.messages.length > 0 && (
                <button
                  onClick={handleRegenerate}
                  disabled={isLoading}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0F1A2E] border border-[#1E2F4D] text-slate-400 hover:text-white transition-colors disabled:opacity-50"
                >
                  <RotateCcw size={12} />
                  <span>Regenerate</span>
                </button>
              )}
            </div>

            <div className="text-[11px] text-slate-400">
              Model: <span className="text-[#00F0FF] font-mono">{activeModel.split('-')[0]}</span>
            </div>
          </div>

          {/* Main Input Box */}
          <div className="flex items-end gap-2 bg-[#0B1322] border border-[#1E2F4D] rounded-2xl p-2 focus-within:border-[#00F0FF]/60 focus-within:ring-1 focus-within:ring-[#00F0FF]/30 transition-all shadow-lg">
            {/* Attachment Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.txt,.csv,.json,.py,.kt,.ts,.js,.md"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-slate-400 hover:text-[#00F0FF] rounded-xl hover:bg-[#101B2E] transition-colors"
              title="Attach File or Image"
            >
              <Paperclip size={18} />
            </button>

            {/* Voice Input Button */}
            <button
              onClick={toggleRecording}
              className={`p-2 rounded-xl transition-colors ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-[#00F0FF] hover:bg-[#101B2E]'
              }`}
              title={isRecording ? 'Listening...' : 'Voice Input'}
            >
              {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            {/* Text Input Area */}
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isRecording ? 'Listening to voice...' : 'Ask NandiAi anything (Groq LPU)...'}
              rows={1}
              className="flex-1 bg-transparent border-0 text-slate-100 placeholder-slate-400 text-sm focus:outline-none resize-none py-1.5 max-h-32 min-h-[24px]"
            />

            {/* Send or Stop Button */}
            {isLoading ? (
              <button
                onClick={() => setIsLoading(false)}
                className="p-2 rounded-xl bg-rose-600 text-white hover:bg-rose-500 active:scale-95 transition-all"
                title="Stop generation"
              >
                <Square size={16} fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() && !imagePreview && !fileAttachment}
                className="p-2 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-95 transition-all shadow-neon-cyan/20"
                title="Send Message (Enter)"
              >
                <Send size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
