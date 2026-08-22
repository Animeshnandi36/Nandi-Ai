import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Paperclip,
  Check,
  FileSpreadsheet,
  FileCode,
  Search,
  RefreshCw,
  Send,
  X,
  FileCheck
} from 'lucide-react';
import { analyzeFile } from '../services/api';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

export const FileStudioScreen: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [query, setQuery] = useState('Provide a comprehensive summary and extract key actionable insights.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectFile = (selected: File) => {
    setFile(selected);
    setAnalysisResult(null);

    // Read text preview for text-compatible files
    const reader = new FileReader();
    reader.onload = () => {
      setFileContent((reader.result as string) || '');
    };
    reader.readAsText(selected);
  };

  const handleAnalyze = async (customQuery?: string) => {
    const q = (customQuery || query).trim();
    if (!file && !fileContent) return;

    setIsAnalyzing(true);
    try {
      const res = await analyzeFile(file || fileContent, q, file?.name || 'document.txt', file?.type || 'text/plain');
      if (res && res.analysis) {
        setAnalysisResult(res.analysis);
      }
    } catch (err: any) {
      setAnalysisResult(`### ⚠️ Analysis Error\n\nCould not process the file: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const quickActions = [
    'Summarize executive takeaways in 5 bullet points',
    'Extract numerical metrics, dates, and financial figures into a table',
    'Perform security & bug audit across the file',
    'Identify discrepancies or missing data fields'
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#060A12] p-4 md:p-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0B1424] via-[#0E1A33] to-[#0B1424] border border-[#1E2F4D] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#FFB800]/20 border border-[#00F0FF]/40 flex items-center justify-center">
            <FileText size={24} className="text-[#00F0FF]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              Document & File <span className="text-[#00F0FF]">Intelligence</span>
            </h2>
            <p className="text-xs text-slate-400">
              Upload PDF, CSV, JSON, Code, or Text files for deep Groq semantic analysis & Q&A
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#101F38] text-[11px] font-semibold text-[#00F0FF] border border-[#00F0FF]/30">
            Engine: Groq LPU Vector Scanner
          </span>
        </div>
      </div>

      {/* File Upload Box */}
      <div className="p-6 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-4 shadow-lg">
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleSelectFile(f);
          }}
          className="hidden"
          accept=".pdf,.txt,.csv,.json,.py,.kt,.ts,.js,.md,.xml,.html"
        />

        {!file ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#1E2F4D] hover:border-[#00F0FF]/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer bg-[#080E1A] hover:bg-[#0E1A30] transition-all group"
          >
            <div className="p-4 rounded-2xl bg-[#101F38] text-[#00F0FF] group-hover:scale-110 transition-transform">
              <Upload size={28} />
            </div>
            <div className="text-center">
              <div className="text-sm font-bold text-white mb-1">
                Drop your document or file here, or <span className="text-[#00F0FF]">browse</span>
              </div>
              <p className="text-xs text-slate-400">
                Supports PDF, CSV, JSON, TXT, Markdown, Python, Kotlin, and Code files up to 25MB
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-[#080E1A] border border-[#1E2F4D] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#101F38] text-[#00F0FF]">
                <FileCheck size={22} />
              </div>
              <div>
                <div className="text-sm font-bold text-white">{file.name}</div>
                <div className="text-xs text-slate-400">
                  {(file.size / 1024).toFixed(1)} KB · {file.type || 'Text Document'}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setFile(null);
                setFileContent('');
                setAnalysisResult(null);
              }}
              className="p-2 text-slate-400 hover:text-rose-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Q&A Input */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Analysis Query / Question
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              placeholder="Ask anything about the file contents..."
              className="flex-1 bg-[#080E1A] border border-[#1E2F4D] rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#00F0FF]"
            />
            <button
              onClick={() => handleAnalyze()}
              disabled={(!file && !fileContent) || isAnalyzing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black font-bold text-sm hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Scanning...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Analyze</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Action Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(action);
                handleAnalyze(action);
              }}
              disabled={!file && !fileContent}
              className="text-xs text-slate-300 hover:text-[#00F0FF] px-2.5 py-1 rounded-lg bg-[#080E1A] border border-[#1E2F4D] hover:border-[#00F0FF]/40 transition-colors truncate max-w-sm disabled:opacity-40"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Result Output */}
      {analysisResult && (
        <div className="p-5 md:p-6 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E2F4D] pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles size={16} className="text-[#00F0FF]" />
              <span>Intelligence Analysis Output</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              File: {file?.name || 'document.txt'}
            </span>
          </div>

          <div className="prose prose-invert max-w-none text-slate-200">
            <MarkdownRenderer content={analysisResult} />
          </div>
        </div>
      )}

      {/* Document Raw Snippet Preview */}
      {fileContent && (
        <div className="rounded-2xl overflow-hidden border border-[#1E2F4D] bg-[#070D18]">
          <div className="px-4 py-2.5 bg-[#0C1526] border-b border-[#1E2F4D] text-xs font-mono text-slate-400 flex items-center justify-between">
            <span>Raw File Stream Preview</span>
            <span>{fileContent.length} bytes</span>
          </div>
          <pre className="p-4 max-h-48 overflow-y-auto text-xs font-mono text-slate-300 leading-relaxed">
            {fileContent.slice(0, 4000)}
            {fileContent.length > 4000 ? '\n... [Content truncated for preview]' : ''}
          </pre>
        </div>
      )}
    </div>
  );
};
