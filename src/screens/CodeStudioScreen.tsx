import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Copy,
  Check,
  Download,
  Sparkles,
  RefreshCw,
  Play,
  FileCode,
  Layers,
  Cpu
} from 'lucide-react';
import { generateCode } from '../services/api';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export const CodeStudioScreen: React.FC = () => {
  const [language, setLanguage] = useState('kotlin');
  const [prompt, setPrompt] = useState('Create a thread-safe coroutine repository for Android with Room offline caching and Groq API sync');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [generatedCode, setGeneratedCode] = useState(`// NandiAi Generated Kotlin Service
package com.example.nandiai.data

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext

data class AiTaskResult(
    val id: String,
    val payload: String,
    val latencyMs: Long
)

class NandiAiRepository(
    private val localDao: LocalCacheDao,
    private val apiService: GroqApiService
) {
    suspend fun executeNeuralTask(prompt: String): AiTaskResult = withContext(Dispatchers.IO) {
        val start = System.currentTimeMillis()
        
        // 1. Check local cache
        val cached = localDao.getCachedResponse(prompt)
        if (cached != null) {
            return@withContext AiTaskResult(cached.id, cached.content, 0L)
        }

        // 2. Query Groq LPU API
        val response = apiService.createChatCompletion(
            model = "llama-3.3-70b-versatile",
            messages = listOf(GroqMessage(role = "user", content = prompt))
        )
        
        val content = response.choices.firstOrNull()?.message?.content ?: "No output"
        localDao.insertCache(CachedEntity(prompt = prompt, content = content))

        AiTaskResult(
            id = java.util.UUID.randomUUID().toString(),
            payload = content,
            latencyMs = System.currentTimeMillis() - start
        )
    }
}`);

  const [explanation, setExplanation] = useState(`### ⚡ Architecture & Best Practices\n\n- **Concurrency**: Dispatches IO operations to \`Dispatchers.IO\` for non-blocking execution.\n- **Cache-First Pattern**: Queries local Room DB before dispatching network requests to reduce latency.\n- **Security**: Injects API credentials via repository dependencies rather than hardcoding in classes.`);

  const languages = [
    { id: 'kotlin', label: 'Kotlin (Android)' },
    { id: 'python', label: 'Python (FastAPI/ML)' },
    { id: 'typescript', label: 'TypeScript (React/Node)' },
    { id: 'javascript', label: 'JavaScript' },
    { id: 'java', label: 'Java (Spring/Android)' },
    { id: 'cpp', label: 'C++ (Low Latency)' },
    { id: 'html', label: 'HTML / Tailwind CSS' },
    { id: 'sql', label: 'SQL (PostgreSQL/Room)' },
    { id: 'bash', label: 'Bash / Linux Shell' },
    { id: 'rust', label: 'Rust (Memory Safe)' }
  ];

  const handleGenerate = async (presetPrompt?: string) => {
    const text = (presetPrompt || prompt).trim();
    if (!text) return;

    setIsGenerating(true);
    try {
      const res = await generateCode(language, text);
      if (res && res.code) {
        setGeneratedCode(res.code);
        setExplanation(res.explanation);
      }
    } catch (err) {
      console.error('Code generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const extensions: Record<string, string> = {
      kotlin: 'kt',
      python: 'py',
      typescript: 'ts',
      javascript: 'js',
      java: 'java',
      cpp: 'cpp',
      html: 'html',
      sql: 'sql',
      bash: 'sh',
      rust: 'rs'
    };
    const ext = extensions[language] || 'txt';
    const blob = new Blob([generatedCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nandiai-${language}-solution.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const quickTasks = [
    'Express.js production REST API with Groq chat and CORS security',
    'Kotlin StateFlow ViewModel for real-time streaming chat messages',
    'Python Async Web Scraper with rate-limiting and BeautifulSoup',
    'PostgreSQL schema with indexes for conversations and token telemetry'
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#060A12] p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0B1424] via-[#0E1A33] to-[#0B1424] border border-[#1E2F4D] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#FFB800]/20 border border-[#00F0FF]/40 flex items-center justify-center">
            <Code2 size={24} className="text-[#00F0FF]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              Neural <span className="text-[#00F0FF]">Code Studio</span>
            </h2>
            <p className="text-xs text-slate-400">
              Multi-language code synthesis and explanation powered by Groq LPU
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#101F38] text-[11px] font-semibold text-[#00F0FF] border border-[#00F0FF]/30 font-mono">
            llama-3.3-70b-versatile
          </span>
        </div>
      </div>

      {/* Code Prompt Box */}
      <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-4 shadow-lg">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Programming Task & Requirements
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={2}
            placeholder="Describe the function, class, or architecture you need..."
            className="w-full bg-[#080E1A] border border-[#1E2F4D] rounded-xl p-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all resize-none"
          />
        </div>

        {/* Language Selection Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E2F4D]/50">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">Target Language:</span>
            {languages.map((l) => (
              <button
                key={l.id}
                onClick={() => setLanguage(l.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  language === l.id
                    ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF]'
                    : 'bg-[#080E1A] border-[#1E2F4D] text-slate-400 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black font-bold text-sm shadow-neon-cyan/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Compiling Code...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Synthesize Code</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Task Presets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickTasks.map((t, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(t);
                handleGenerate(t);
              }}
              className="text-xs text-slate-300 hover:text-[#00F0FF] px-2.5 py-1 rounded-lg bg-[#080E1A] border border-[#1E2F4D] hover:border-[#00F0FF]/40 transition-colors truncate max-w-xs"
            >
              "{t.slice(0, 36)}..."
            </button>
          ))}
        </div>
      </div>

      {/* Code Editor Output Display */}
      <div className="rounded-2xl overflow-hidden border border-[#1E2F4D] bg-[#070D18] shadow-xl">
        {/* Editor Top Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0C1526] border-b border-[#1E2F4D]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF]">
            <Terminal size={15} />
            <span className="font-semibold uppercase tracking-wider">{language}</span>
            <span className="text-slate-400">· solution.{language === 'kotlin' ? 'kt' : language === 'python' ? 'py' : 'ts'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#101B2E] border border-[#1E2F4D] text-xs text-slate-300 hover:text-white transition-colors"
            >
              <Download size={13} />
              <span>Download File</span>
            </button>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black font-bold text-xs shadow-sm hover:brightness-110 transition-all"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 md:p-6 overflow-x-auto">
          <pre className="font-mono text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre">
            <code>{generatedCode}</code>
          </pre>
        </div>
      </div>

      {/* Explanation Drawer */}
      {explanation && (
        <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-3 shadow-lg">
          <h3 className="text-xs font-bold text-[#00F0FF] uppercase tracking-wider flex items-center gap-2">
            <Cpu size={15} />
            <span>Architecture & Logic Breakdown</span>
          </h3>
          <MarkdownRenderer content={explanation} />
        </div>
      )}
    </div>
  );
};
