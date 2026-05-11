'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import Link from 'next/link';
import {
  Search, Filter, DollarSign, Clock, Tag, Loader2,
  ChevronRight, Users, Briefcase
} from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  timeline: string;
  skills: string[];
  proposals: unknown[];
  createdAt: string;
  client?: { name: string; rating?: number };
}

const BUDGET_RANGES = [
  { label: 'All Budgets', value: '' },
  { label: 'Under ₹10K', value: '0-10000' },
  { label: '₹10K - ₹50K', value: '10000-50000' },
  { label: '₹50K - ₹1L', value: '50000-100000' },
  { label: 'Above ₹1L', value: '100000-999999' },
];

export default function BrowseProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [budgetFilter, setBudgetFilter] = useState('');
  const [skillFilter, setSkillFilter] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const params = new URLSearchParams({ status: 'open' });
        if (budgetFilter) {
          const [min, max] = budgetFilter.split('-');
          params.set('minBudget', min);
          params.set('maxBudget', max);
        }
        const res = await api.get(`/projects?${params}`);
        setProjects(res.data.projects || []);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [budgetFilter]);

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchSkill = !skillFilter || p.skills?.some((s) =>
      s.toLowerCase().includes(skillFilter.toLowerCase())
    );
    return matchSearch && matchSkill;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Browse Projects</h1>
        <p className="text-gray-400 text-sm mt-1">Find projects that match your skills</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4 space-y-3">
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="input-field pl-9 w-full"
            />
          </div>
          <div className="relative">
            <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Filter by skill..."
              className="input-field pl-9 w-48"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {BUDGET_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setBudgetFilter(range.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${
                budgetFilter === range.value
                  ? 'bg-violet-600 text-white border-violet-500'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="text-sm text-gray-400">
        {!loading && `${filtered.length} project${filtered.length !== 1 ? 's' : ''} found`}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-violet-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No projects found</h3>
          <p className="text-gray-400">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((project) => (
            <Link
              key={project._id}
              href={`/dashboard/freelancer/projects/${project._id}`}
              className="glass-card rounded-xl p-5 hover-lift block"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-semibold text-white hover:text-violet-300 transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-lg font-bold text-white">{formatCurrency(project.budget)}</div>
                      <div className="text-xs text-gray-400">Fixed Price</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.skills?.slice(0, 6).map((skill) => (
                      <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />{project.timeline}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />{project.proposals?.length || 0} proposals
                    </span>
                    <span>Posted {formatDate(project.createdAt)}</span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
