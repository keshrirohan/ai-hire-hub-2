'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import {
  Bot, Plus, FolderOpen, DollarSign, Clock, TrendingUp,
  ArrowRight, CheckCircle, AlertCircle, Loader2, Star, Users
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
        // Use mock data if API unavailable
        setRecentProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  const statCards = [
    { label: 'Total Projects', value: stats.totalProjects, icon: FolderOpen, color: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
    { label: 'Active Projects', value: stats.activeProjects, icon: TrendingUp, color: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' },
    { label: 'Wallet Balance', value: formatCurrency(stats.walletBalance), icon: DollarSign, color: 'from-purple-500 to-violet-500', bg: 'bg-purple-500/10' },
    { label: 'Total Spent', value: formatCurrency(stats.totalSpent), icon: Clock, color: 'from-orange-500 to-amber-500', bg: 'bg-orange-500/10' },
  ];

  const getStatusBadge = (status: string) => {
    const map: Record<string, { label: string; class: string }> = {
      open: { label: 'Open', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      in_progress: { label: 'In Progress', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
      completed: { label: 'Completed', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
      cancelled: { label: 'Cancelled', class: 'bg-red-500/20 text-red-400 border-red-500/30' },
    };
    return map[status] || { label: status, class: 'bg-gray-500/20 text-gray-400 border-gray-500/30' };
  };

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Banner */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-violet-600/20 to-cyan-600/20 border border-violet-500/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-gray-400 mt-1">Here&apos;s what&apos;s happening with your projects today.</p>
          </div>
          <Link href="/dashboard/client/ai-chat" className="btn-primary flex items-center gap-2">
            <Bot className="w-4 h-4" />
            Start AI Project
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5 hover-lift">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 bg-gradient-to-r ${stat.color} bg-clip-text`} style={{ color: 'transparent', backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/dashboard/client/ai-chat" className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 hover:border-violet-400/50 transition-all group">
            <div className="p-2 bg-violet-500/20 rounded-lg group-hover:bg-violet-500/30 transition-colors">
              <Bot className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">AI Project Planner</div>
              <div className="text-xs text-gray-400">Chat with AI to plan</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/dashboard/client/projects/new" className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 hover:border-blue-400/50 transition-all group">
            <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
              <Plus className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Post Project</div>
              <div className="text-xs text-gray-400">Find top freelancers</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/dashboard/client/wallet" className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-400/50 transition-all group">
            <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Add Funds</div>
              <div className="text-xs text-gray-400">Top up your wallet</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Recent Projects */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          <Link href="/dashboard/client/projects" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="text-center py-12">
            <FolderOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">No projects yet</p>
            <p className="text-gray-500 text-sm mt-1">Start by chatting with our AI to plan your first project</p>
            <Link href="/dashboard/client/ai-chat" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Bot className="w-4 h-4" /> Plan with AI
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentProjects.map((project) => {
              const badge = getStatusBadge(project.status);
              return (
                <Link key={project._id} href={`/dashboard/client/projects/${project._id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white font-bold text-sm">
                      {project.title[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{project.title}</div>
                      <div className="text-xs text-gray-400">{formatDate(project.createdAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-300">{formatCurrency(project.budget)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full border ${badge.class}`}>{badge.label}</span>
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
