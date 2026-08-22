import React, { useState } from 'react';
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  Download,
  Sparkles,
  RefreshCw,
  Table as TableIcon,
  Layers,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { ChartData } from '../types';
import { generateChart } from '../services/api';
import { NandiLogo } from '../components/NandiLogo';

export const ChartStudioScreen: React.FC = () => {
  const [prompt, setPrompt] = useState('Global AI Compute & LPU Performance Index 2024-2026');
  const [chartType, setChartType] = useState<'bar' | 'line' | 'area' | 'pie' | 'scatter'>('bar');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [copied, setCopied] = useState(false);

  const [currentChart, setCurrentChart] = useState<ChartData>({
    title: 'Global AI Compute & LPU Performance Index',
    type: 'bar',
    xAxis: 'AI Architectures & Silicon',
    yAxis: 'Tokens Per Second (k/s)',
    seriesKey: 'Throughput',
    data: [
      { label: 'Groq LPU Llama-3.3 70B', value: 380, secondary: 290 },
      { label: 'DeepSeek R1 Distill', value: 310, secondary: 240 },
      { label: 'Standard GPU Cloud', value: 95, secondary: 80 },
      { label: 'Edge Neural Coprocessor', value: 160, secondary: 120 },
      { label: 'Distributed Mesh Node', value: 240, secondary: 190 }
    ],
    notes: 'Benchmarked across active neural inference pipelines in Q1 2026.'
  });

  const chartTypes: { id: 'bar' | 'line' | 'area' | 'pie' | 'scatter'; label: string; icon: any }[] = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'line', label: 'Line Chart', icon: LineChart },
    { id: 'area', label: 'Area Chart', icon: TrendingUp },
    { id: 'pie', label: 'Pie Chart', icon: PieChart },
    { id: 'scatter', label: 'Scatter Plot', icon: Layers }
  ];

  const handleGenerate = async (presetPrompt?: string) => {
    const query = (presetPrompt || prompt).trim();
    if (!query) return;

    setIsGenerating(true);
    try {
      const res = await generateChart(query, chartType);
      if (res && res.chart) {
        setCurrentChart(res.chart);
      }
    } catch (err) {
      console.error('Failed to synthesize chart:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportCsv = () => {
    if (!currentChart || !currentChart.data) return;
    const header = `${currentChart.xAxis || 'Label'},${currentChart.yAxis || 'Value'},Secondary\n`;
    const rows = currentChart.data.map((d) => `"${d.label}",${d.value},${d.secondary || 0}`).join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(header + rows);
    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `nandiai-chart-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const promptSuggestions = [
    'Quarterly revenue & growth rate of major tech sectors 2025-2026',
    'Programming language popularity breakdown for AI & backend development',
    'Global renewable energy generation by solar, wind, and hydro',
    'Customer retention vs churn rate over 12 consecutive months'
  ];

  // SVG Chart Calculation Helpers
  const maxVal = Math.max(...(currentChart.data?.map((d) => Math.max(d.value, d.secondary || 0)) || [100]), 1);

  return (
    <div className="flex-1 overflow-y-auto bg-[#060A12] p-4 md:p-6 pb-24 md:pb-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0B1424] via-[#0E1A33] to-[#0B1424] border border-[#1E2F4D] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#FFB800]/20 border border-[#00F0FF]/40 flex items-center justify-center">
            <BarChart3 size={24} className="text-[#00F0FF]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              Neural <span className="text-[#00F0FF]">Chart Studio</span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive data synthesis & visualization powered by Groq structured JSON
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTable(!showTable)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              showTable
                ? 'bg-[#00F0FF]/20 border-[#00F0FF] text-[#00F0FF]'
                : 'bg-[#0F1A2E] border-[#1E2F4D] text-slate-300 hover:text-white'
            }`}
          >
            <TableIcon size={14} />
            <span>{showTable ? 'View Chart' : 'View Data Table'}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F1A2E] border border-[#1E2F4D] text-xs font-semibold text-slate-300 hover:text-white hover:border-[#00F0FF]/40 transition-colors"
          >
            <FileSpreadsheet size={14} className="text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Describe any dataset or metrics to visualize..."
            className="flex-1 bg-[#080E1A] border border-[#1E2F4D] rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF] transition-all"
          />

          <button
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isGenerating}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black font-bold text-sm shadow-neon-cyan/20 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Synthesizing...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Chart</span>
              </>
            )}
          </button>
        </div>

        {/* Chart Type Selector */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1E2F4D]/50">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1">Display Type:</span>
            {chartTypes.map((t) => {
              const Icon = t.icon;
              const isSelected = chartType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setChartType(t.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-[#101F38] border-[#00F0FF] text-[#00F0FF] shadow-cyan-sm'
                      : 'bg-[#080E1A] border-[#1E2F4D] text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Preset Queries */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {promptSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(item);
                handleGenerate(item);
              }}
              className="text-xs text-slate-300 hover:text-[#00F0FF] px-2.5 py-1 rounded-lg bg-[#080E1A] border border-[#1E2F4D] hover:border-[#00F0FF]/40 transition-colors truncate max-w-xs"
            >
              "{item.slice(0, 36)}..."
            </button>
          ))}
        </div>
      </div>

      {/* Chart Visualization Display */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] space-y-6 shadow-xl">
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E2F4D] pb-4">
          <div>
            <h3 className="text-lg font-black text-white">{currentChart.title}</h3>
            <p className="text-xs text-[#00F0FF] font-medium mt-0.5">
              X-Axis: {currentChart.xAxis} · Y-Axis: {currentChart.yAxis}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <span className="w-3 h-3 rounded-full bg-[#00F0FF]"></span>
              <span>{currentChart.seriesKey || 'Primary'}</span>
            </div>
            {currentChart.data?.some((d) => d.secondary !== undefined) && (
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-full bg-[#FFB800]"></span>
                <span>Secondary</span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Canvas or Table */}
        {showTable ? (
          /* Data Table View */
          <div className="overflow-x-auto rounded-xl border border-[#1E2F4D]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080E1A] text-slate-300 uppercase border-b border-[#1E2F4D]">
                <tr>
                  <th className="px-4 py-3 font-semibold">{currentChart.xAxis || 'Metric'}</th>
                  <th className="px-4 py-3 font-semibold text-right">{currentChart.yAxis || 'Value'}</th>
                  <th className="px-4 py-3 font-semibold text-right">Secondary Index</th>
                  <th className="px-4 py-3 font-semibold text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E2F4D]/60 bg-[#0B1322]">
                {currentChart.data?.map((row, i) => {
                  const totalSum = currentChart.data.reduce((a, b) => a + b.value, 0) || 1;
                  const pct = ((row.value / totalSum) * 100).toFixed(1);
                  return (
                    <tr key={i} className="hover:bg-[#101F38]/60 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{row.label}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#00F0FF]">{row.value.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-mono text-[#FFB800]">
                        {row.secondary !== undefined ? row.secondary.toLocaleString() : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-400">{pct}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Interactive High-Def SVG Rendering */
          <div className="w-full bg-[#080E1A] rounded-xl p-4 md:p-6 border border-[#1E2F4D]/60 flex flex-col items-center">
            {chartType === 'pie' ? (
              /* SVG Donut / Pie */
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4 w-full">
                <svg viewBox="0 0 240 240" className="w-56 h-56">
                  <circle cx="120" cy="120" r="85" fill="none" stroke="#00F0FF" strokeWidth="26" strokeDasharray="320 180" strokeDashoffset="0" />
                  <circle cx="120" cy="120" r="85" fill="none" stroke="#FFB800" strokeWidth="26" strokeDasharray="180 320" strokeDashoffset="-320" />
                  <circle cx="120" cy="120" r="85" fill="none" stroke="#3B82F6" strokeWidth="26" strokeDasharray="80 420" strokeDashoffset="-500" />
                  <text x="120" y="116" textAnchor="middle" fill="#FFFFFF" fontSize="20" fontWeight="bold">100%</text>
                  <text x="120" y="134" textAnchor="middle" fill="#94A3B8" fontSize="10">Distribution</text>
                </svg>

                <div className="space-y-2.5 max-w-xs">
                  {currentChart.data?.slice(0, 5).map((item, idx) => {
                    const colors = ['#00F0FF', '#FFB800', '#3B82F6', '#10B981', '#F43F5E'];
                    const color = colors[idx % colors.length];
                    return (
                      <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
                          <span className="text-slate-200 font-medium">{item.label}</span>
                        </div>
                        <span className="font-mono text-white font-semibold">{item.value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Bar / Line / Area Chart */
              <div className="w-full space-y-4">
                {currentChart.data?.map((item, idx) => {
                  const pct = Math.min(100, Math.max(6, (item.value / maxVal) * 100));
                  const secPct = item.secondary ? Math.min(100, Math.max(4, (item.secondary / maxVal) * 100)) : 0;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-slate-200 truncate max-w-[240px]">{item.label}</span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-[#00F0FF] font-bold">{item.value.toLocaleString()}</span>
                          {item.secondary !== undefined && (
                            <span className="text-[#FFB800]">({item.secondary.toLocaleString()})</span>
                          )}
                        </div>
                      </div>

                      {/* Primary Bar */}
                      <div className="w-full h-3.5 bg-[#0F1A2E] rounded-full overflow-hidden flex gap-1">
                        <div
                          className="h-full bg-gradient-to-r from-[#00A3FF] to-[#00F0FF] rounded-full transition-all duration-700 shadow-sm"
                          style={{ width: `${pct}%` }}
                        ></div>
                        {secPct > 0 && (
                          <div
                            className="h-full bg-gradient-to-r from-[#FF9900] to-[#FFB800] rounded-full transition-all duration-700 opacity-80"
                            style={{ width: `${secPct}%` }}
                          ></div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Observation Notes */}
        {currentChart.notes && (
          <div className="p-3.5 rounded-xl bg-[#080E1A] border border-[#1E2F4D] text-xs text-slate-300 leading-relaxed">
            <span className="text-[#00F0FF] font-bold">Observation: </span>
            {currentChart.notes}
          </div>
        )}
      </div>
    </div>
  );
};
