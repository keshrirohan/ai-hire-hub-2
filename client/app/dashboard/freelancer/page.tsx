'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import {
  Briefcase, DollarSign, Star, TrendingUp, ArrowRight,
  Clock, CheckCircle, Loader2, Search
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Project {
  _id: string;
  title: string;
  status: string;
  budget: number;
  createdAt: string;
  skills: string[];
}

interface DashboardData {
  activeProjects: number;
  completedProjects: number;
  totalEarnings: number;
  pendingProposals: number;
  rating: number;
}

export default function FreelancerDashboard() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData>({
    activeProjects: 0,
    completedProjects: 0,
    totalEarnings: user?.walletBalance || 0,
    pendingProposals: 0,
    rating: user?.rating || 0,
  });
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [projectsRes] = await Promise.all([
          api.get('/projects?role=freelancer'),
        ]);
        const projects = projectsRes.data.projects || [];
        const active = projects.filter((p: Project) => p.status === 'in_progress');
        const completed = projects.filter((p: Project) => p.status === 'completed');
        setActiveProjects(active.slice(0, 3));
        setData({
          activeProjects: active.length,
          completedProjects: completed.length,
          totalEarnings: user?.walletBalance || 0,
          pendingProposals: 0,
          rating: user?.rating || 0,
        });
      } catch {
        setActiveProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, [user]);

  const statCards = [
    { label: 'Active Projects', value: data.activeProjects, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Completed', value: data.completedProjects, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Balance', value: formatCurrency(data.totalEarnings), icon: DollarSign, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Rating', value: data.rating?.toFixed(1) || 'New', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Welcome */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-r from-cyan-600/20 to-violet-600/20 border border-cyan-500/30">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Welcome, {user?.name?.split(' ')[0]} 👋</h1>
            <p className="text-gray-400 mt-1">Ready to find your next great project?</p>
          </div>
          <Link href="/dashboard/freelancer/browse" className="btn-primary flex items-center gap-2">
            <Search className="w-4 h-4" /> Browse Projects
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-5 hover-lift">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
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
          <Link href="/dashboard/freelancer/browse" className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-400/50 transition-all group">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Search className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Find Projects</div>
              <div className="text-xs text-gray-400">Browse open projects</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/dashboard/freelancer/projects" className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-purple-600/20 border border-violet-500/30 hover:border-violet-400/50 transition-all group">
            <div className="p-2 bg-violet-500/20 rounded-lg">
              <Briefcase className="w-5 h-5 text-violet-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">My Work</div>
              <div className="text-xs text-gray-400">Active assignments</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/dashboard/freelancer/wallet" className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-green-600/20 to-emerald-600/20 border border-green-500/30 hover:border-green-400/50 transition-all group">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Earnings</div>
              <div className="text-xs text-gray-400">View wallet</div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Active Projects */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Active Projects</h2>
          <Link href="/dashboard/freelancer/projects" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
        ) : activeProjects.length === 0 ? (
          <div className="text-center py-10">
            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No active projects</p>
            <Link href="/dashboard/freelancer/browse" className="btn-primary mt-4 inline-flex items-center gap-2">
              <Search className="w-4 h-4" /> Browse Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {activeProjects.map((project) => (
              <Link key={project._id} href={`/dashboard/freelancer/projects/${project._id}`}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                <div>
                  <div className="text-sm font-medium text-white">{project.title}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{formatDate(project.createdAt)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-300">{formatCurrency(project.budget)}</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                    In Progress
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Profile Completion */}
      {(!user?.bio || !user?.skills?.length) && (
        <div className="glass-card rounded-xl p-5 border border-orange-500/30 bg-orange-500/5">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            <div className="flex-1">
              <div className="text-sm font-medium text-white">Complete your profile</div>
              <div className="text-xs text-gray-400">A complete profile gets 3x more responses from clients</div>
            </div>
            <Link href="/dashboard/freelancer/profile" className="btn-secondary text-sm">
              Update Profile
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
