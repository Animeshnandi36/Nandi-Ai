import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Download,
  Copy,
  Check,
  Maximize2,
  Trash2,
  RefreshCw,
  Sliders,
  Layers,
  Image as ImageIcon,
  Zap,
  Heart
} from 'lucide-react';
import { GeneratedImage } from '../types';
import { generateImage } from '../services/api';
import { NandiLogo } from '../components/NandiLogo';

export const ImageStudioScreen: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('cyberpunk');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [copied, setCopied] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Load image history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('nandiai_image_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('Failed to load image history', e);
    }
  }, []);

  const saveHistory = (items: GeneratedImage[]) => {
    setHistory(items);
    try {
      localStorage.setItem('nandiai_image_history', JSON.stringify(items.slice(0, 30)));
    } catch (e) {}
  };

  const styles = [
    { id: 'cyberpunk', label: 'Cyberpunk Neon', desc: 'Futuristic glowing cyber aesthetics' },
    { id: 'realistic', label: 'Photorealistic 8K', desc: 'Master studio photography & lighting' },
    { id: '3d', label: '3D Pixar Octane', desc: 'Smooth volumetric clay & cinematic lights' },
    { id: 'anime', label: 'Anime Masterpiece', desc: 'Vibrant Makoto Shinkai style' },
    { id: 'vector', label: 'Vector Flat Art', desc: 'Clean geometric minimalist illustration' }
  ];

  const aspectRatios = [
    { id: '1:1', label: 'Square (1:1)' },
    { id: '16:9', label: 'Landscape (16:9)' },
    { id: '9:16', label: 'Portrait (9:16)' },
    { id: '4:3', label: 'Standard (4:3)' }
  ];

  const handleGenerate = async (presetPrompt?: string) => {
    const textToGen = (presetPrompt || prompt).trim();
    if (!textToGen) return;

    setIsGenerating(true);
    setErrorNotice(null);

    try {
      const result = await generateImage(textToGen, style, aspectRatio);
      const newImg: GeneratedImage = {
        id: `img-${Date.now()}`,
        prompt: result.prompt || textToGen,
        imageUrl: result.imageUrl,
        model: result.model || 'black-forest-labs/FLUX.1-dev',
        aspectRatio,
        style,
        timestamp: Date.now()
      };

      setCurrentImage(newImg);
      saveHistory([newImg, ...history]);
      if (result.notice) {
        setErrorNotice(result.notice);
      }
    } catch (err: any) {
      setErrorNotice(`Image synthesis notice: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imgUrl: string, promptText: string) => {
    const a = document.createElement('a');
    a.href = imgUrl;
    a.download = `nandiai-${promptText.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    a.click();
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteImage = (id: string) => {
    const updated = history.filter((h) => h.id !== id);
    saveHistory(updated);
    if (currentImage?.id === id) {
      setCurrentImage(updated[0] || null);
    }
  };

  const promptPresets = [
    'A futuristic robotic bull cybernetic deity glowing with neon cyan circuitry in Neo Tokyo',
    'Hyperrealistic astronaut discovering glowing crystal monoliths on Mars at sunset, 8k',
    'Cyberpunk floating cloud city powered by glowing blue fusion reactors and flying drones',
    'Minimalist vector illustration of an AI neural matrix brain connecting global networks'
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-[#060A12] p-4 md:p-6 pb-24 md:pb-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0B1424] via-[#0E1A33] to-[#0B1424] border border-[#1E2F4D] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#FFB800]/20 border border-[#00F0FF]/40 flex items-center justify-center">
            <Sparkles size={24} className="text-[#00F0FF]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              FLUX.1-dev <span className="text-[#00F0FF]">Image Studio</span>
            </h2>
            <p className="text-xs text-slate-400">
              High-fidelity neural diffusion powered by Hugging Face Inference Providers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-[#101F38] text-[11px] font-semibold text-[#00F0FF] border border-[#00F0FF]/30">
            Engine: black-forest-labs/FLUX.1-dev
          </span>
        </div>
      </div>

      {/* Main Generator Box */}
      <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-4 shadow-lg">
        {/* Prompt input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Neural Prompt</span>
            <span className="text-slate-400 font-normal">{prompt.length} chars</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                handleGenerate();
              }
            }}
            placeholder="Describe the image you want to synthesize (e.g., 'Futuristic cyberpunk city at night with neon lights and holograms')..."
            rows={3}
            className="w-full bg-[#080E1A] border border-[#1E2F4D] rounded-xl p-3.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all resize-none"
          />
        </div>

        {/* Style Selector Chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Aesthetic Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {styles.map((s) => (
              <button
                key={s.id}
                onClick={() => setStyle(s.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                  style === s.id
                    ? 'bg-[#101F38] border-[#00F0FF] text-[#00F0FF] shadow-cyan-sm'
                    : 'bg-[#080E1A] border-[#1E2F4D] text-slate-300 hover:text-white hover:bg-[#0E1729]'
                }`}
              >
                <div className="font-semibold">{s.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Aspect Ratio Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#1E2F4D]/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Aspect Ratio:</span>
            <div className="flex items-center gap-1.5">
              {aspectRatios.map((ar) => (
                <button
                  key={ar.id}
                  onClick={() => setAspectRatio(ar.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    aspectRatio === ar.id
                      ? 'bg-[#00F0FF]/15 border-[#00F0FF] text-[#00F0FF]'
                      : 'bg-[#080E1A] border-[#1E2F4D] text-slate-400 hover:text-white'
                  }`}
                >
                  {ar.label}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black font-bold text-sm shadow-neon-cyan/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Image</span>
              </>
            )}
          </button>
        </div>

        {/* Prompt presets */}
        <div className="pt-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
            Quick Spark Prompts
          </div>
          <div className="flex flex-wrap gap-1.5">
            {promptPresets.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(p);
                  handleGenerate(p);
                }}
                className="text-xs text-slate-300 hover:text-[#00F0FF] px-2.5 py-1 rounded-lg bg-[#080E1A] border border-[#1E2F4D] hover:border-[#00F0FF]/40 transition-colors truncate max-w-xs"
              >
                "{p.slice(0, 38)}..."
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notice Banner if any */}
      {errorNotice && (
        <div className="p-3.5 rounded-xl bg-[#0E1B33] border border-[#1E2F4D] text-xs text-[#00F0FF] flex items-center justify-between">
          <span>{errorNotice}</span>
          <button onClick={() => setErrorNotice(null)} className="text-slate-400 hover:text-white">
            Dismiss
          </button>
        </div>
      )}

      {/* Laser Scanning Animation / Active Preview */}
      {isGenerating && (
        <div className="relative rounded-2xl overflow-hidden border border-[#00F0FF]/50 bg-[#080E1A] h-80 flex flex-col items-center justify-center p-6 shadow-neon-cyan/30">
          {/* Laser beam */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00F0FF] to-transparent animate-pulse shadow-[0_0_15px_#00F0FF]"></div>
          
          <div className="relative z-10 flex flex-col items-center gap-4 text-center">
            <NandiLogo size={54} showText={false} />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#00F0FF]">
                Synthesizing Neural Diffusion Latents...
              </h3>
              <p className="text-xs text-slate-400">
                Passing prompt through Hugging Face FLUX.1-dev neural network
              </p>
            </div>
            <div className="w-48 h-1.5 bg-[#101F38] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#00F0FF] to-[#FFB800] animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Current Result Showcase */}
      {currentImage && !isGenerating && (
        <div className="rounded-2xl overflow-hidden border border-[#1E2F4D] bg-[#0B1322] shadow-xl">
          <div className="p-4 bg-[#080E1A] border-b border-[#1E2F4D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">Latest Synthesis</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#101F38] text-[#00F0FF] border border-[#00F0FF]/30 font-mono">
                {currentImage.model}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyPrompt(currentImage.prompt)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0E1729] border border-[#1E2F4D] text-xs text-slate-300 hover:text-white transition-colors"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Prompt'}</span>
              </button>
              <button
                onClick={() => handleDownload(currentImage.imageUrl, currentImage.prompt)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black font-bold text-xs shadow-sm hover:brightness-110 transition-all"
              >
                <Download size={13} />
                <span>Save PNG</span>
              </button>
            </div>
          </div>

          <div className="relative group bg-black/40 flex items-center justify-center min-h-[320px] max-h-[520px] p-4">
            <img
              src={currentImage.imageUrl}
              alt={currentImage.prompt}
              className="max-h-[480px] w-auto max-w-full rounded-xl object-contain shadow-2xl transition-transform"
            />
            <button
              onClick={() => setSelectedPreview(currentImage.imageUrl)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
            >
              <Maximize2 size={16} />
            </button>
          </div>

          <div className="p-4 bg-[#080E1A] border-t border-[#1E2F4D]">
            <p className="text-xs text-slate-300 font-mono leading-relaxed">
              <span className="text-[#00F0FF] font-semibold">Prompt: </span>
              {currentImage.prompt}
            </p>
          </div>
        </div>
      )}

      {/* Generation History Gallery */}
      {history.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers size={16} className="text-[#00F0FF]" />
              <span>Synthesis Gallery ({history.length})</span>
            </h3>
            <button
              onClick={() => saveHistory([])}
              className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
            >
              Clear Gallery
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="group relative rounded-xl overflow-hidden border border-[#1E2F4D] bg-[#0B1322] hover:border-[#00F0FF]/50 transition-all aspect-square cursor-pointer"
                onClick={() => setCurrentImage(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.prompt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2.5 flex flex-col justify-between">
                  <div className="flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(item.id);
                      }}
                      className="p-1 rounded-lg bg-black/60 text-slate-300 hover:text-rose-400"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div>
                    <p className="text-[10px] text-white font-medium line-clamp-2 leading-tight">
                      {item.prompt}
                    </p>
                    <span className="text-[9px] text-[#00F0FF] uppercase tracking-wider font-semibold mt-1 inline-block">
                      {item.style}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Full-screen Zoom Modal */}
      {selectedPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedPreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedPreview}
              alt="Zoom view"
              className="max-h-[85vh] w-auto rounded-2xl border border-[#00F0FF]/50 shadow-2xl"
            />
            <button
              onClick={() => setSelectedPreview(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/80 text-white hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
