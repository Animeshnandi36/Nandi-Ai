import React from 'react';
import {
  HelpCircle,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Terminal,
  Cpu,
  Globe,
  CheckCircle2,
  ExternalLink,
  Bot
} from 'lucide-react';
import { NandiLogo } from '../components/NandiLogo';

export const AboutScreen: React.FC = () => {
  const features = [
    {
      title: 'Groq LPU Accelerated Chat',
      desc: 'Lightning-fast token generation using OpenAI GPT-OSS 120B, Llama 3.3 70B, and DeepSeek R1 models with sub-second latency.',
      icon: Zap
    },
    {
      title: 'Hugging Face FLUX.1 Image Studio',
      desc: 'High-definition neural image synthesis with multiple style presets, aspect ratios, and download utilities.',
      icon: Sparkles
    },
    {
      title: 'Interactive Chart Studio',
      desc: 'Convert natural language prompts into responsive Bar, Line, Area, Pie, and Scatter plots with CSV export.',
      icon: Layers
    },
    {
      title: 'Multi-Language Code Studio',
      desc: 'Synthesis for Kotlin, Python, TypeScript, Java, C++, and SQL with one-click copy, download, and architecture breakdowns.',
      icon: Terminal
    },
    {
      title: 'Document & File Intelligence',
      desc: 'Upload PDF, CSV, JSON, Markdown, and code files for structured summarization, data extraction, and interactive Q&A.',
      icon: Globe
    },
    {
      title: 'Zero-Trust Credential Isolation',
      desc: 'API keys are stored exclusively in backend server environment variables—never exposed to client browser or APK.',
      icon: Shield
    }
  ];

  const shortcuts = [
    { key: 'Enter', action: 'Send chat message' },
    { key: 'Shift + Enter', action: 'Insert new line in input' },
    { key: 'Ctrl + Enter', action: 'Generate image / Execute code synthesis' },
    { key: 'Esc', action: 'Close full-screen modals & overlays' }
  ];

  const faqs = [
    {
      q: 'How does NandiAi protect API keys and private data?',
      a: 'NandiAi uses a backend proxy pattern. All inference requests are routed through the Node.js Express server on Render, which injects GROQ_API_KEY and HF_API_TOKEN securely server-side. No API keys ever touch the frontend or client storage.'
    },
    {
      q: 'Can NandiAi work both as a Web application and Android APK?',
      a: 'Yes! The project is engineered for dual deployment: a high-performance React + Express web application deployable on Render, and a native Android application built with Kotlin and Jetpack Compose.'
    },
    {
      q: 'Who created and developed NandiAi?',
      a: 'NandiAi was conceived, designed, and developed by Animesh Nandi.'
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#060A12] p-4 md:p-6 pb-24 md:pb-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A1324] via-[#0E1A33] to-[#080E1C] border border-[#1E2F4D] p-6 md:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <NandiLogo size={64} showText={false} />
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide">
              About <span className="text-[#00F0FF]">NandiAi</span>
            </h2>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              An enterprise-grade full-stack neural workspace providing ultra-fast Groq LPU inference, Hugging Face FLUX.1 image synthesis, structured charts, and file intelligence.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1 text-xs">
              <span className="px-2.5 py-0.5 rounded-full bg-[#101F38] text-[#00F0FF] border border-[#00F0FF]/30 font-semibold">
                Version 2.4.0
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-[#16233B] text-slate-300 font-semibold">
                Created by Animesh Nandi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Capabilities Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Cpu size={16} className="text-[#00F0FF]" />
          <span>Core Capabilities & Architecture</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-[#0B1322] border border-[#1E2F4D] hover:border-[#00F0FF]/40 transition-all space-y-2 group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#101F38] text-[#00F0FF] group-hover:scale-105 transition-transform">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                    {feat.title}
                  </h4>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed pl-9">
                  {feat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-3 shadow-lg">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Terminal size={15} className="text-[#00F0FF]" />
          <span>Productivity Shortcuts</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-[#080E1A] border border-[#1E2F4D] text-xs">
              <span className="text-slate-300">{sc.action}</span>
              <kbd className="px-2 py-0.5 rounded bg-[#101F38] border border-[#1E2F4D] text-[#00F0FF] font-mono text-[11px] font-semibold">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-3 shadow-lg">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <HelpCircle size={15} className="text-[#00F0FF]" />
          <span>Frequently Asked Questions</span>
        </h3>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-[#080E1A] border border-[#1E2F4D] space-y-1.5">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <CheckCircle2 size={13} className="text-[#00F0FF]" />
                <span>{faq.q}</span>
              </div>
              <p className="text-xs text-slate-400 pl-5 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Attribution & Copyright Banner */}
      <div className="p-4 rounded-xl bg-[#080E1A] border border-[#1E2F4D] text-center text-xs text-slate-400">
        © 2026 NandiAi · Designed & Engineered by <strong className="text-[#00F0FF]">Animesh Nandi</strong>
      </div>
    </div>
  );
};
