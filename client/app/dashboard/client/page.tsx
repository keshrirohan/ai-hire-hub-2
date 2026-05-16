'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import {
  Bot, Plus, FolderOpen, DollarSign, TrendingUp,
  ArrowRight, Loader2,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalSpent: number;
  walletBalance: number;
}

interface RecentProject {
  _id: string;
  title: string;
  status: string;
  budget: number;
  createdAt: string;
  freelancer?: { name: string; avatar?: string };
}

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalSpent: 0,
    walletBalance: user?.walletBalance || 0,
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [projectsRes] = await Promise.all([
          api.get('/projects?limit=5&role=client'),
        ]);
        const projects = projectsRes.data.projects || [];
        setRecentProjects(projects.slice(0, 5));
        setStats({
          totalProjects: projectsRes.data.total || projects.length,
          activeProjects: projects.filter((p: RecentProject) =>
            ['in_progress', 'open'].includes(p.status)
          ).length,
          totalSpent: projects.reduce((sum: number, p: RecentProject) => sum + (p.budget || 0), 0),
          walletBalance: user?.walletBalance || 0,
        });
      } catch {
        setRecentProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  const statCards = [
    {
      label: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      accent: '#93b4f0',
      bg: 'rgba(100,140,220,0.08)',
    },
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      icon: TrendingUp,
      accent: '#6ee7b7',
      bg: 'rgba(110,231,183,0.08)',
    },
    {
      label: 'Wallet Balance',
      value: formatCurrency(stats.walletBalance),
      icon: DollarSign,
      accent: '#e8b86d',
      bg: 'rgba(232,184,109,0.08)',
    },
    {
      label: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      icon: DollarSign,
      accent: '#f0a070',
      bg: 'rgba(240,160,112,0.08)',
    },
  ];

  const getStatusConfig = (status: string) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      open: { label: 'Open', color: '#93b4f0', bg: 'rgba(100,140,220,0.1)' },
      in_progress: { label: 'In Progress', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
      completed: { label: 'Completed', color: '#6ee7b7', bg: 'rgba(110,231,183,0.1)' },
      cancelled: { label: 'Cancelled', color: '#fca5a5', bg: 'rgba(252,165,165,0.1)' },
    };
    return map[status] || { label: status, color: '#6b6760', bg: 'rgba(107,103,96,0.1)' };
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-6xl">

      {/* Welcome */}
      <div>
        <h1
          className="text-3xl text-[#e8e4dc] mb-1"
          style={{ fontFamily: 'var(--font-serif)' }}
        >
          Good day, {user?.name?.split(' ')[0]}.
        </h1>
        <p className="text-[#4a4845] text-sm">
          Here&apos;s an overview of your workspace.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="surface-raised rounded-xl p-5 card-hover"
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
              style={{ background: stat.bg }}
            >
              <stat.icon className="w-4.5 h-4.5" style={{ color: stat.accent }} />
            </div>
            <div className="stat-value text-2xl text-[#e8e4dc]">{stat.value}</div>
            <div className="text-xs text-[#4a4845] mt-1 font-medium uppercase tracking-wider">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="surface rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[#6b6760] uppercase tracking-widest mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              href: '/dashboard/client/ai-chat',
              icon: Bot,
              label: 'AI Project Planner',
              desc: 'Chat with AI to plan',
              accent: '#e8b86d',
            },
            {
              href: '/dashboard/client/projects/new',
              icon: Plus,
              label: 'Post a Project',
              desc: 'Find top freelancers',
              accent: '#93b4f0',
            },
            {
              href: '/dashboard/client/wallet',
              icon: DollarSign,
              label: 'Add Funds',
              desc: 'Top up your wallet',
              accent: '#6ee7b7',
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-lg border border-white/06 hover:border-white/12 hover:bg-white/03 transition-all group"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${action.accent}15` }}
              >
                <action.icon className="w-4 h-4" style={{ color: action.accent }} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[#c4bfb8] group-hover:text-[#e8e4dc] transition-colors">
                  {action.label}
                </div>
                <div className="text-xs text-[#4a4845]">{action.desc}</div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-[#3d3b38] ml-auto group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Projects */}
      <div className="surface rounded-xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-[#6b6760] uppercase tracking-widest">
            Recent Projects
          </h2>
          <Link
            href="/dashboard/client/projects"
            className="text-xs text-[#e8b86d] hover:text-[#f0c87a] transition-colors flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin text-[#e8b86d]" />
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-10 h-10 text-[#2a2a30] mx-auto mb-3" />
            <p className="text-[#4a4845] font-medium text-sm">No projects yet</p>
            <p className="text-[#3d3b38] text-xs mt-1 mb-4">
              Start by chatting with our AI to plan your first project
            </p>
            <Link href="/dashboard/client/ai-chat" className="btn-primary">
              <Bot className="w-4 h-4" /> Plan with AI
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentProjects.map((project) => {
              const s = getStatusConfig(project.status);
              return (
                <Link
                  key={project._id}
                  href={`/dashboard/client/projects/${project._id}`}
                  className="flex items-center justify-between p-4 rounded-lg border border-transparent hover:border-white/06 hover:bg-white/02 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#0f1117] font-bold text-sm flex-shrink-0"
                      style={{ background: '#e8b86d' }}
                    >
                      {project.title[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-[#c4bfb8] truncate">
                        {project.title}
                      </div>
                      <div className="text-xs text-[#3d3b38]">{formatDate(project.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-sm text-[#6b6760] font-mono">
                      {formatCurrency(project.budget)}
                    </span>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ color: s.color, background: s.bg }}
                    >
                      {s.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
