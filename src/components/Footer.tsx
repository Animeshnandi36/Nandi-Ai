import React, { useState } from 'react';
import { Shield, FileText, AlertCircle, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'disclaimer' | null>(null);

  return (
    <>
      <footer className="py-2.5 px-4 text-center border-t border-[#1E2F4D]/50 bg-[#050912] text-xs text-slate-400 select-none">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-2">
          <div className="flex items-center gap-1.5 text-center sm:text-left">
            <span className="font-medium text-slate-300">© 2026 NandiAi · Developed by Animesh Nandi</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <button
              onClick={() => setLegalModal('privacy')}
              className="hover:text-[#00F0FF] transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => setLegalModal('terms')}
              className="hover:text-[#00F0FF] transition-colors"
            >
              Terms of Use
            </button>
            <span>·</span>
            <button
              onClick={() => setLegalModal('disclaimer')}
              className="hover:text-[#00F0FF] transition-colors"
            >
              AI Disclaimer
            </button>
          </div>
        </div>
      </footer>

      {/* Legal Dialog Modal */}
      {legalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl bg-[#0B1322] border border-[#1E2F4D] p-6 text-left shadow-2xl text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E2F4D] pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                {legalModal === 'privacy' && <Shield className="text-[#00F0FF]" size={18} />}
                {legalModal === 'terms' && <FileText className="text-[#00F0FF]" size={18} />}
                {legalModal === 'disclaimer' && <AlertCircle className="text-amber-400" size={18} />}
                <span>
                  {legalModal === 'privacy' && 'Privacy Policy'}
                  {legalModal === 'terms' && 'Terms of Use'}
                  {legalModal === 'disclaimer' && 'AI Model & Usage Disclaimer'}
                </span>
              </div>
              <button
                onClick={() => setLegalModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#16233B]"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
              {legalModal === 'privacy' && (
                <>
                  <p><strong>Effective Date:</strong> January 1, 2026</p>
                  <p><strong>1. Zero-Trust Data Isolation:</strong> NandiAi respects user privacy. Chat messages, prompts, uploaded file contents, and generated media are processed in transient runtime memory and are never sold, collected for advertising, or tracked across external sessions.</p>
                  <p><strong>2. Local Persistence:</strong> All chat history and user workspace data remain stored on your local device (in browser localStorage or device SQLite). You can clear this data at any time via Settings.</p>
                  <p><strong>3. Third-Party API Processors:</strong> Inference queries are relayed through secure backend routes to authorized infrastructure providers (Groq LPU and Hugging Face). No personal identifiers are appended to inference requests.</p>
                </>
              )}

              {legalModal === 'terms' && (
                <>
                  <p><strong>Effective Date:</strong> January 1, 2026</p>
                  <p><strong>1. Acceptance of Terms:</strong> By accessing and using NandiAi, you agree to comply with applicable laws and ethical AI usage standards.</p>
                  <p><strong>2. Responsible Use:</strong> You agree not to use NandiAi for generating harmful, illegal, defamatory, or copyright-infringing content, or to attempt unauthorized access or denial-of-service against the inference backend.</p>
                  <p><strong>3. Intellectual Property:</strong> NandiAi is developed by Animesh Nandi. All original code, UI elements, branding, and designs are protected by copyright law.</p>
                </>
              )}

              {legalModal === 'disclaimer' && (
                <>
                  <p><strong>1. Independent Application:</strong> NandiAi is an independent software application developed by <strong>Animesh Nandi</strong>. It is not affiliated with, endorsed by, or sponsored by OpenAI, Google, Groq Inc., Meta, Hugging Face, or Black Forest Labs.</p>
                  <p><strong>2. AI Output Notice:</strong> Content generated by AI models may contain inaccuracies, hallucinations, or outdated information. Users should independently verify critical technical, legal, medical, or financial information.</p>
                  <p><strong>3. Trademarks:</strong> Groq, Llama, FLUX.1, and all respective third-party model names are trademarks of their respective owners.</p>
                </>
              )}
            </div>

            <div className="pt-3 border-t border-[#1E2F4D] flex justify-end">
              <button
                onClick={() => setLegalModal(null)}
                className="px-4 py-2 rounded-xl bg-[#101F38] border border-[#00F0FF]/40 text-xs font-bold text-[#00F0FF] hover:bg-[#00F0FF]/10 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
