import React, { useState, useEffect } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit2,
  MessageSquare,
  FileText,
  Calendar,
  ExternalLink,
  Sparkles,
  Layers
} from 'lucide-react';
import { ProjectWorkspace, Conversation } from '../types';

interface ProjectsScreenProps {
  conversations: Conversation[];
  onOpenConversation: (id: string) => void;
}

export const ProjectsScreen: React.FC<ProjectsScreenProps> = ({
  conversations,
  onOpenConversation
}) => {
  const [projects, setProjects] = useState<ProjectWorkspace[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nandiai_workspaces');
      if (saved) {
        setProjects(JSON.parse(saved));
      } else {
        const defaultProjects: ProjectWorkspace[] = [
          {
            id: 'proj-1',
            name: 'NandiAi System Architecture',
            description: 'Core LPU inference pipelines, Hugging Face image studio, and Render edge deployment.',
            createdAt: Date.now() - 86400000 * 2,
            updatedAt: Date.now(),
            color: '#00F0FF',
            conversationIds: [],
            fileNames: ['build.gradle.kts', 'server/index.js', 'render.yaml']
          },
          {
            id: 'proj-2',
            name: 'Financial Data & Market Analysis',
            description: 'Quarterly financial metrics, charts, and growth projection reports.',
            createdAt: Date.now() - 86400000 * 5,
            updatedAt: Date.now() - 86400000,
            color: '#FFB800',
            conversationIds: [],
            fileNames: ['market_trends_2026.csv']
          }
        ];
        setProjects(defaultProjects);
        localStorage.setItem('nandiai_workspaces', JSON.stringify(defaultProjects));
      }
    } catch (e) {}
  }, []);

  const saveProjects = (updated: ProjectWorkspace[]) => {
    setProjects(updated);
    try {
      localStorage.setItem('nandiai_workspaces', JSON.stringify(updated));
    } catch (e) {}
  };

  const handleCreateProject = () => {
    if (!name.trim()) return;

    const colors = ['#00F0FF', '#FFB800', '#3B82F6', '#10B981', '#F43F5E', '#A855F7'];
    const newProj: ProjectWorkspace = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || 'Custom AI workspace project.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      color: colors[projects.length % colors.length],
      conversationIds: [],
      fileNames: []
    };

    saveProjects([newProj, ...projects]);
    setName('');
    setDescription('');
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    saveProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#060A12] p-4 md:p-6 pb-24 md:pb-6 max-w-5xl mx-auto w-full space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#0B1424] via-[#0E1A33] to-[#0B1424] border border-[#1E2F4D] shadow-lg">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F0FF]/20 to-[#FFB800]/20 border border-[#00F0FF]/40 flex items-center justify-center">
            <FolderKanban size={24} className="text-[#00F0FF]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white tracking-wide">
              Workspaces & <span className="text-[#00F0FF]">Projects</span>
            </h2>
            <p className="text-xs text-slate-400">
              Organize your neural chats, codebases, datasets, and generated media
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00F0FF] to-[#0099FF] text-black font-bold text-xs shadow-neon-cyan/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus size={16} />
          <span>New Workspace</span>
        </button>
      </div>

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="p-5 rounded-2xl bg-[#0B1322] border border-[#00F0FF]/40 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Create New Workspace</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300">Project Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Mobile App AI Integration"
                className="w-full bg-[#080E1A] border border-[#1E2F4D] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00F0FF] mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary of project objectives..."
                className="w-full bg-[#080E1A] border border-[#1E2F4D] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00F0FF] mt-1 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-[#0F1A2E] text-slate-300 text-xs hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateProject}
              disabled={!name.trim()}
              className="px-5 py-2 rounded-xl bg-[#00F0FF] text-black font-bold text-xs hover:brightness-110 disabled:opacity-50"
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-[#0B1322] border border-[#1E2F4D] hover:border-[#00F0FF]/40 transition-all shadow-lg space-y-3 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ backgroundColor: proj.color || '#00F0FF' }}
                ></div>
                <h3 className="text-base font-bold text-white group-hover:text-[#00F0FF] transition-colors">
                  {proj.name}
                </h3>
              </div>

              <button
                onClick={() => handleDelete(proj.id)}
                className="p-1 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
              {proj.description}
            </p>

            {/* Attached files chips */}
            {proj.fileNames && proj.fileNames.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.fileNames.map((f, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 text-[10px] text-slate-300 px-2 py-0.5 rounded bg-[#080E1A] border border-[#1E2F4D] font-mono"
                  >
                    <FileText size={10} className="text-[#00F0FF]" />
                    <span>{f}</span>
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#1E2F4D]/50 text-xs text-slate-400">
              <div className="flex items-center gap-1 text-[11px]">
                <Calendar size={12} />
                <span>Updated {new Date(proj.updatedAt).toLocaleDateString()}</span>
              </div>

              <span className="text-[11px] font-semibold text-[#00F0FF]">
                Active Workspace
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
