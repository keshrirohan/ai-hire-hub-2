'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Briefcase, Search, Loader2, ChevronRight, Clock, CheckCircle, AlertCircle
} from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  createdAt: string;
  milestones?: { status: string }[];
  client?: { name: string };
}

const statusConfig: Record<string, { label: string; class: string; icon: React.FC<{ className?: string }> }> = {
  open: { label: 'Open', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Clock },
  in_progress: { label: 'In Progress', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: AlertCircle },
  completed: { label: 'Completed', class: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
};

export default function FreelancerProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects?role=freelancer');
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
    const matchTab = tab === 'active' ? p.status === 'in_progress' : p.status === 'completed';
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Work</h1>
          <p className="text-gray-400 text-sm mt-1">Projects you&apos;re working on</p>
        </div>
        <Link href="/dashboard/freelancer/browse" className="btn-primary flex items-center gap-2">
          <Search className="w-4 h-4" /> Find More Projects
        </Link>
      </div>

      <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit">
        {(['active', 'completed'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
              tab === t ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects..."
          className="input-field pl-9 w-full"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No {tab} projects</h3>
          <p className="text-gray-400 mb-6">
            {tab === 'active' ? 'Submit proposals to get hired!' : 'Complete your first project to see it here.'}
          </p>
          <Link href="/dashboard/freelancer/browse" className="btn-primary inline-flex items-center gap-2">
            <Search className="w-4 h-4" /> Browse Projects
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((project) => {
            const cfg = statusConfig[project.status] || statusConfig.open;
            const Icon = cfg.icon;
            const activeMilestones = project.milestones?.filter(m => m.status === 'active').length || 0;
            const doneMilestones = project.milestones?.filter(m => m.status === 'approved').length || 0;
            const total = project.milestones?.length || 0;
            const progress = total > 0 ? Math.round((doneMilestones / total) * 100) : 0;

            return (
              <Link
                key={project._id}
                href={`/dashboard/freelancer/projects/${project._id}`}
                className="glass-card rounded-xl p-5 hover-lift block"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="font-semibold text-white">{project.title}</h3>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {project.client?.name && `by ${project.client.name} · `}{formatDate(project.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">{formatCurrency(project.budget)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border flex items-center gap-1 ${cfg.class}`}>
                      <Icon className="w-3 h-3" />{cfg.label}
                    </span>
                  </div>
                </div>

                {total > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-1.5">
                      <span>{doneMilestones}/{total} milestones done</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
