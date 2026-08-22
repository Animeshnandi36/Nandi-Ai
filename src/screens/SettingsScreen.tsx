import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Shield,
  Cpu,
  Volume2,
  Moon,
  Trash2,
  Download,
  Info,
  Check,
  RefreshCw,
  Server,
  Zap,
  Lock
} from 'lucide-react';
import { AppSettings } from '../types';
import { checkHealth, HealthResponse } from '../services/api';
import { NandiLogo } from '../components/NandiLogo';

interface SettingsScreenProps {
  settings: AppSettings;
  onUpdateSettings: (updated: AppSettings) => void;
  onClearAllData: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onClearAllData
}) => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    loadHealth();
  }, []);

  const loadHealth = async () => {
    setIsChecking(true);
    try {
      const data = await checkHealth();
      setHealth(data);
    } catch (e) {
      console.warn('Health check failed', e);
    } finally {
      setIsChecking(false);
    }
  };

  const handleModelChange = (model: string) => {
    const updated = { ...settings, defaultModel: model };
    onUpdateSettings(updated);
    showToast();
  };

  const showToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#060A12] p-4 md:p-6 max-w-4xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0B1424] via-[#0E1A33] to-[#0B1424] border border-[#1E2F4D] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#FFB800]/20 border border-[#00F0FF]/40 flex items-center justify-center">
            <SettingsIcon size={24} className="text-[#00F0FF]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              System <span className="text-[#00F0FF]">Settings</span>
            </h2>
            <p className="text-xs text-slate-400">
              Manage AI inference models, speech engines, and security parameters
            </p>
          </div>
        </div>

        {saveToast && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-700 text-xs text-emerald-300">
            <Check size={14} />
            <span>Preferences Saved</span>
          </div>
        )}
      </div>

      {/* Security & Secret Management Card */}
      <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-3 shadow-lg">
        <div className="flex items-center gap-2.5 text-sm font-bold text-white uppercase tracking-wider">
          <Shield size={18} className="text-[#00F0FF]" />
          <span>Security & Environment Isolation</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          NandiAi enforces zero-trust credential isolation. API keys (<code className="text-[#00F0FF]">GROQ_API_KEY</code>, <code className="text-[#00F0FF]">HF_API_TOKEN</code>) are strictly processed inside the server environment and are <strong>never stored in the browser, APK binaries, or JavaScript bundles</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-[#080E1A] border border-[#1E2F4D] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <Lock size={15} className="text-emerald-400" />
              <span>Groq LPU API Provider</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${health?.providers.groq.configured ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'}`}>
              {health?.providers.groq.configured ? 'Connected' : 'Active (Fallback)'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080E1A] border border-[#1E2F4D] flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-200">
              <Lock size={15} className="text-emerald-400" />
              <span>Hugging Face FLUX.1 Studio</span>
            </div>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${health?.providers.huggingFace.configured ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'bg-amber-950 text-amber-300 border border-amber-700'}`}>
              {health?.providers.huggingFace.configured ? 'Connected' : 'Active (Fallback)'}
            </span>
          </div>
        </div>
      </div>

      {/* Model & AI Preferences */}
      <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 text-sm font-bold text-white uppercase tracking-wider">
          <Cpu size={18} className="text-[#00F0FF]" />
          <span>Default Neural Model Selection</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B Versatile', desc: 'Ultra-fast Groq LPU general reasoning' },
            { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill 70B', desc: 'Deep mathematical & logic reasoning' },
            { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B Instant', desc: 'Sub-100ms ultra low-latency token streaming' },
            { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B MoE', desc: '32k context window mixture-of-experts' }
          ].map((m) => (
            <div
              key={m.id}
              onClick={() => handleModelChange(m.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                settings.defaultModel === m.id
                  ? 'bg-[#101F38] border-[#00F0FF] text-white shadow-cyan-sm'
                  : 'bg-[#080E1A] border-[#1E2F4D] text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">{m.name}</span>
                {settings.defaultModel === m.id && <Check size={14} className="text-[#00F0FF]" />}
              </div>
              <p className="text-[11px] text-slate-400 mt-1">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Voice & Audio Settings */}
      <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-4 shadow-lg">
        <div className="flex items-center gap-2.5 text-sm font-bold text-white uppercase tracking-wider">
          <Volume2 size={18} className="text-[#00F0FF]" />
          <span>Speech & Audio Synthesizer</span>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#080E1A] border border-[#1E2F4D]">
          <div>
            <div className="text-xs font-bold text-white">Auto Read-Aloud Responses</div>
            <div className="text-[11px] text-slate-400">Speak assistant replies automatically via speech synthesis</div>
          </div>
          <input
            type="checkbox"
            checked={settings.autoSpeak}
            onChange={(e) => {
              onUpdateSettings({ ...settings, autoSpeak: e.target.checked });
              showToast();
            }}
            className="w-4 h-4 accent-[#00F0FF] rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Data & Cache Management */}
      <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-3 shadow-lg">
        <div className="flex items-center gap-2.5 text-sm font-bold text-white uppercase tracking-wider">
          <Trash2 size={18} className="text-rose-400" />
          <span>Data & Storage Management</span>
        </div>
        <p className="text-xs text-slate-400">
          Reset local storage, cached chat conversations, and project workspace states on this device.
        </p>
        <button
          onClick={onClearAllData}
          className="px-4 py-2.5 rounded-xl bg-rose-950/40 border border-rose-800 text-xs font-bold text-rose-300 hover:bg-rose-900/60 transition-colors"
        >
          Clear All Local Data & Reset
        </button>
      </div>

      {/* Developer Information Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-[#0B1322] to-[#060B14] border border-[#1E2F4D] space-y-3 shadow-lg">
        <div className="flex items-center gap-3">
          <NandiLogo size={42} />
          <div>
            <div className="text-sm font-extrabold text-white">NandiAi Enterprise Workspace</div>
            <div className="text-xs text-slate-400">Version 2.4.0 Production Build</div>
          </div>
        </div>

        <div className="pt-2 border-t border-[#1E2F4D]/60 space-y-1 text-xs text-slate-300">
          <div><strong className="text-white">Author & Developer:</strong> <span className="text-[#00F0FF] font-semibold">Animesh Nandi</span></div>
          <div><strong className="text-white">Deployment Target:</strong> Render Cloud Web Service + Android APK</div>
          <div><strong className="text-white">Copyright:</strong> © 2026 NandiAi · Developed by Animesh Nandi</div>
        </div>
      </div>
    </div>
  );
};
