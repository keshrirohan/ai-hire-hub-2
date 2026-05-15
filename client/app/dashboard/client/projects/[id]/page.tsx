'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ArrowLeft, CheckCircle, Clock, AlertCircle, User,
  Loader2, DollarSign, MessageSquare, Star, ChevronDown, ChevronUp, Send
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Milestone {
  _id: string;
  title: string;
  description: string;
  amount: number;
  duration: string;
  status: 'pending' | 'active' | 'submitted' | 'approved' | 'rejected';
  submissionNote?: string;
  submissionFile?: string;
}

interface Proposal {
  _id: string;
  freelancer: { _id: string; name: string; avatar?: string; rating: number; completedProjects: number };
  coverLetter: string;
  bidAmount: number;
  timeline: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  status: string;
  budget: number;
  timeline: string;
  skills: string[];
  milestones: Milestone[];
  proposals: Proposal[];
  freelancer?: { _id: string; name: string; avatar?: string; rating: number };
  createdAt: string;
}

const milestoneStatus: Record<string, { label: string; class: string; icon: React.FC<{ className?: string }> }> = {
  pending: { label: 'Pending', class: 'text-gray-400 bg-gray-500/20 border-gray-500/30', icon: Clock },
  active: { label: 'Active', class: 'text-blue-400 bg-blue-500/20 border-blue-500/30', icon: Clock },
  submitted: { label: 'Review Needed', class: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30', icon: AlertCircle },
  approved: { label: 'Approved', class: 'text-green-400 bg-green-500/20 border-green-500/30', icon: CheckCircle },
  rejected: { label: 'Rejected', class: 'text-red-400 bg-red-500/20 border-red-500/30', icon: AlertCircle },
};

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'proposals' | 'milestones'>('overview');
  const [expandedProposal, setExpandedProposal] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data.project);
      } catch {
        toast.error('Failed to load project');
        router.push('/dashboard/client/projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, router]);

  const handleProposal = async (proposalId: string, action: 'accept' | 'reject') => {
    try {
      await api.patch(`/projects/${id}/proposals/${proposalId}`, { action });
      toast.success(`Proposal ${action}ed!`);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
    } catch {
      toast.error('Action failed');
    }
  };

  const approveMilestone = async (milestoneId: string) => {
    try {
      await api.patch(`/milestones/${milestoneId}/review`, { action: 'approve' });
      toast.success('Milestone approved and payment released!');
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
    } catch {
      toast.error('Failed to approve milestone');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full py-20">
      <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
    </div>
  );

  if (!project) return null;

  const pendingProposals = project.proposals?.filter(p => p.status === 'pending') || [];
  const submittedMilestones = project.milestones?.filter(m => m.status === 'submitted') || [];

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/client/projects" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 mt-1">
          <ArrowLeft className="w-4 h-4 text-gray-400" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{project.title}</h1>
            <span className={`text-xs px-2 py-1 rounded-full border ${
              project.status === 'open' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
              project.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
              'bg-green-500/20 text-green-400 border-green-500/30'
            }`}>
              {project.status?.replace('_', ' ')}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{formatCurrency(project.budget)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{project.timeline}</span>
            <span>Posted {formatDate(project.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {pendingProposals.length > 0 && (
        <div className="glass-card rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0" />
          <span className="text-sm text-yellow-300">
            You have <strong>{pendingProposals.length}</strong> pending proposal{pendingProposals.length > 1 ? 's' : ''} to review
          </span>
          <button onClick={() => setActiveTab('proposals')} className="ml-auto text-xs text-yellow-400 hover:underline">
            Review Now
          </button>
        </div>
      )}
      {submittedMilestones.length > 0 && (
        <div className="glass-card rounded-xl p-4 border border-cyan-500/30 bg-cyan-500/5 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <span className="text-sm text-cyan-300">
            <strong>{submittedMilestones.length}</strong> milestone{submittedMilestones.length > 1 ? 's' : ''} submitted for review
          </span>
          <button onClick={() => setActiveTab('milestones')} className="ml-auto text-xs text-cyan-400 hover:underline">
            Review Now
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {(['overview', 'proposals', 'milestones'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
              activeTab === tab ? 'bg-cyan-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab}
            {tab === 'proposals' && pendingProposals.length > 0 && (
              <span className="ml-1.5 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full">{pendingProposals.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Description</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills?.map((skill) => (
                <span key={skill} className="text-sm px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          {project.freelancer && (
            <div className="glass-card rounded-xl p-5">
              <h3 className="font-semibold text-white mb-3">Assigned Freelancer</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-sky-600 flex items-center justify-center text-white font-bold">
                  {project.freelancer.name[0]}
                </div>
                <div>
                  <div className="font-medium text-white">{project.freelancer.name}</div>
                  <div className="flex items-center gap-1 text-xs text-yellow-400">
                    <Star className="w-3 h-3 fill-current" />
                    {project.freelancer.rating?.toFixed(1)}
                  </div>
                </div>
                <Link
                  href={`/dashboard/client/messages`}
                  className="ml-auto btn-secondary flex items-center gap-2 text-sm"
                >
                  <MessageSquare className="w-4 h-4" /> Message
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proposals Tab */}
      {activeTab === 'proposals' && (
        <div className="space-y-4">
          {project.proposals?.length === 0 ? (
            <div className="glass-card rounded-xl p-10 text-center">
              <User className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No proposals received yet</p>
            </div>
          ) : (
            project.proposals.map((proposal) => (
              <div key={proposal._id} className={`glass-card rounded-xl overflow-hidden border ${
                proposal.status === 'accepted' ? 'border-green-500/30' :
                proposal.status === 'rejected' ? 'border-red-500/30' : 'border-white/10'
              }`}>
                <div
                  className="p-5 cursor-pointer"
                  onClick={() => setExpandedProposal(expandedProposal === proposal._id ? null : proposal._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-sky-600 flex items-center justify-center text-white font-bold">
                        {proposal.freelancer?.name?.[0] || 'F'}
                      </div>
                      <div>
                        <div className="font-medium text-white">{proposal.freelancer?.name}</div>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          {proposal.freelancer?.rating?.toFixed(1)} · {proposal.freelancer?.completedProjects} projects
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-bold text-white">{formatCurrency(proposal.bidAmount)}</div>
                        <div className="text-xs text-gray-400">{proposal.timeline}</div>
                      </div>
                      {expandedProposal === proposal._id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                </div>

                {expandedProposal === proposal._id && (
                  <div className="px-5 pb-5 space-y-4 border-t border-white/5 pt-4">
                    <p className="text-sm text-gray-300 leading-relaxed">{proposal.coverLetter}</p>
                    {proposal.status === 'pending' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleProposal(proposal._id, 'accept')}
                          className="btn-primary flex items-center gap-2 flex-1 justify-center"
                        >
                          <CheckCircle className="w-4 h-4" /> Accept Proposal
                        </button>
                        <button
                          onClick={() => handleProposal(proposal._id, 'reject')}
                          className="btn-secondary flex items-center gap-2 flex-1 justify-center text-red-400 hover:bg-red-500/10"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                    {proposal.status !== 'pending' && (
                      <div className={`text-sm px-3 py-2 rounded-lg ${
                        proposal.status === 'accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {proposal.status === 'accepted' ? '✓ Accepted' : '✗ Declined'}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div className="space-y-4">
          {project.milestones?.map((milestone, idx) => {
            const cfg = milestoneStatus[milestone.status] || milestoneStatus.pending;
            const Icon = cfg.icon;
            return (
              <div key={milestone._id} className={`glass-card rounded-xl p-5 border ${
                milestone.status === 'submitted' ? 'border-yellow-500/30' :
                milestone.status === 'approved' ? 'border-green-500/30' : 'border-white/10'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      milestone.status === 'approved' ? 'bg-green-500 text-white' : 'bg-white/10 text-gray-400'
                    }`}>
                      {milestone.status === 'approved' ? '✓' : idx + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-white">{milestone.title}</h4>
                      <p className="text-xs text-gray-400">{milestone.duration}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{formatCurrency(milestone.amount)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex items-center gap-1 ${cfg.class}`}>
                      <Icon className="w-3 h-3" />{cfg.label}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-3">{milestone.description}</p>
                {milestone.submissionNote && (
                  <div className="bg-white/5 rounded-lg p-3 mb-3">
                    <p className="text-xs text-gray-400 mb-1">Freelancer&apos;s Note:</p>
                    <p className="text-sm text-gray-300">{milestone.submissionNote}</p>
                  </div>
                )}
                {milestone.status === 'submitted' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => approveMilestone(milestone._id)}
                      className="btn-primary flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve & Release Payment
                    </button>
                    <button className="btn-secondary text-red-400">Request Changes</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
