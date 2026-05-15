'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Plus, Search, Filter, FolderOpen, Loader2, ChevronRight, Bot } from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  createdAt: string;
  skills: string[];
  proposals: unknown[];
  freelancer?: { name: string; avatar?: string };
}

const STATUS_OPTIONS = ['all', 'open', 'in_progress', 'completed', 'cancelled'];

const statusConfig: Record<string, { label: string; class: string }> = {
  all: { label: 'All', class: '' },
  open: { label: 'Open', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  in_progress: { label: 'In Progress', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  completed: { label: 'Completed', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
  cancelled: { label: 'Cancelled', class: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

export default function ClientProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects?role=client');
        setProjects(res.data.projects || []);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Projects</h1>
          <p className="text-gray-400 text-sm mt-1">Manage and track all your projects</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/client/ai-chat" className="btn-secondary flex items-center gap-2">
            <Bot className="w-4 h-4" /> AI Planner
          </Link>
          <Link href="/dashboard/client/projects/new" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9 w-full"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                statusFilter === s
                  ? 'bg-cyan-600 text-white border-cyan-500'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {statusConfig[s]?.label || s}
            </button>
          ))}
        </div>
      </div>

      {/* Project List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <FolderOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
          <p className="text-gray-400 mb-6">
            {search || statusFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first project to get started'}
          </p>
          <Link href="/dashboard/client/ai-chat" className="btn-primary inline-flex items-center gap-2">
            <Bot className="w-4 h-4" /> Plan with AI
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((project) => {
            const badge = statusConfig[project.status] || statusConfig.open;
            return (
              <Link
                key={project._id}
                href={`/dashboard/client/projects/${project._id}`}
                className="glass-card rounded-xl p-5 hover-lift block"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white truncate">{project.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${badge.class}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {project.skills?.slice(0, 5).map((skill) => (
                        <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                          {skill}
                        </span>
                      ))}
                      {project.skills?.length > 5 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400">
                          +{project.skills.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div className="text-lg font-bold text-white">{formatCurrency(project.budget)}</div>
                    <div className="text-xs text-gray-500">{formatDate(project.createdAt)}</div>
                    <div className="text-xs text-gray-400">{project.proposals?.length || 0} proposals</div>
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

