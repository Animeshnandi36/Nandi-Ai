import React, { useState } from 'react';
import { Copy, Check, Terminal, Download } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  const handleDownloadCode = (code: string, lang: string) => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      kotlin: 'kt',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      html: 'html',
      css: 'css',
      sql: 'sql',
      json: 'json',
      bash: 'sh',
      shell: 'sh'
    };
    const ext = extensions[lang.toLowerCase()] || 'txt';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nandiai-snippet.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Simple and robust parser for markdown text, headers, lists, code blocks, tables
  const renderFormattedBlocks = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    let codeBlockCounter = 0;

    return parts.map((part, pIdx) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeIndex = codeBlockCounter++;
        const firstLineBreak = part.indexOf('\n');
        const lang = firstLineBreak !== -1 ? part.slice(3, firstLineBreak).trim() : 'code';
        const code = firstLineBreak !== -1 ? part.slice(firstLineBreak + 1, -3) : part.slice(3, -3);

        return (
          <div key={`code-${pIdx}`} className="my-3 rounded-xl overflow-hidden border border-[#1E2F4D] bg-[#070D18] shadow-lg">
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#0C1526] border-b border-[#1E2F4D]">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00F0FF]">
                <Terminal size={14} />
                <span>{lang || 'code'}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadCode(code, lang)}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-[#101B2E] hover:bg-[#16243D] transition-colors"
                  title="Download Code"
                >
                  <Download size={12} />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => handleCopyCode(code, codeIndex)}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-[#101B2E] hover:bg-[#16243D] transition-colors"
                >
                  {copiedCodeIndex === codeIndex ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="p-3.5 text-xs md:text-sm font-mono text-slate-200 overflow-x-auto leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }

      // Process lines for headers, lists, tables, paragraphs
      const lines = part.split('\n');
      return (
        <div key={`text-${pIdx}`} className="space-y-2">
          {lines.map((line, lIdx) => {
            const trimmed = line.trim();

            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={lIdx} className="text-base md:text-lg font-bold text-[#00F0FF] mt-3 mb-1">
                  {trimmed.replace(/^###\s+/, '')}
                </h3>
              );
            }
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={lIdx} className="text-lg md:text-xl font-extrabold text-white mt-4 mb-1 border-b border-[#1E2F4D] pb-1">
                  {trimmed.replace(/^##\s+/, '')}
                </h2>
              );
            }
            if (trimmed.startsWith('# ')) {
              return (
                <h1 key={lIdx} className="text-xl md:text-2xl font-black text-white mt-4 mb-2">
                  {trimmed.replace(/^#\s+/, '')}
                </h1>
              );
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2 text-sm text-slate-200">
                  <span className="text-[#00F0FF] font-bold mt-0.5">•</span>
                  <span>{renderInlineStyles(trimmed.replace(/^[-*]\s+/, ''))}</span>
                </div>
              );
            }
            if (/^\d+\.\s+/.test(trimmed)) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-2 text-sm text-slate-200">
                  <span className="text-[#FFB800] font-bold text-xs mt-0.5">{trimmed.match(/^\d+\./)?.[0]}</span>
                  <span>{renderInlineStyles(trimmed.replace(/^\d+\.\s+/, ''))}</span>
                </div>
              );
            }

            if (trimmed === '') {
              return <div key={lIdx} className="h-1" />;
            }

            return (
              <p key={lIdx} className="text-sm md:text-base text-slate-200 leading-relaxed">
                {renderInlineStyles(line)}
              </p>
            );
          })}
        </div>
      );
    });
  };

  const renderInlineStyles = (str: string) => {
    // Process **bold**, *italic*, `code`
    const tokens = str.split(/(\*\*.*?\*\*|\*.*?\*|`.*?`)/g);

    return tokens.map((token, i) => {
      if (token.startsWith('**') && token.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{token.slice(2, -2)}</strong>;
      }
      if (token.startsWith('*') && token.endsWith('*')) {
        return <em key={i} className="italic text-slate-300">{token.slice(1, -1)}</em>;
      }
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code key={i} className="px-1.5 py-0.5 rounded bg-[#0F1A2E] text-[#00F0FF] font-mono text-xs border border-[#1E2F4D]">
            {token.slice(1, -1)}
          </code>
        );
      }
      return token;
    });
  };

  return <div className="markdown-body space-y-2">{renderFormattedBlocks(content)}</div>;
};
