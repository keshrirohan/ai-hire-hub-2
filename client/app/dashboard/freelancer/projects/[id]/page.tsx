'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  ArrowLeft, Clock, DollarSign, Users, CheckCircle,
  Loader2, AlertCircle, Send, Star, Upload
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';

const proposalSchema = z.object({
  coverLetter: z.string().min(100, 'Cover letter must be at least 100 characters'),
  bidAmount: z.preprocess((v) => Number(v), z.number().min(1, 'Bid amount required')),
  timeline: z.string().min(1, 'Timeline required'),
});

type ProposalForm = z.infer<typeof proposalSchema>;

interface Milestone {
  _id: string;
  title: string;
  description: string;
  amount: number;
  duration: string;
  status: string;
  submissionNote?: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  budget: number;
  timeline: string;
  skills: string[];
  milestones: Milestone[];
  proposals: { freelancer: string; status: string }[];
  status: string;
  createdAt: string;
  client?: { _id: string; name: string; rating?: number };
  freelancer?: { _id: string };
}

export default function FreelancerProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'milestones'>('details');
  const [submitNote, setSubmitNote] = useState('');
  const [submittingMilestone, setSubmittingMilestone] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ProposalForm>({
    resolver: zodResolver(proposalSchema),
    defaultValues: { bidAmount: 0 },
  });

  const coverLetter = watch('coverLetter') || '';

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await api.get(`/projects/${id}`);
        setProject(res.data.project);
      } catch {
        toast.error('Project not found');
        router.push('/dashboard/freelancer/browse');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, router]);

  const alreadyProposed = project?.proposals?.some(p => p.freelancer === user?._id);
  const isAssigned = project?.freelancer?._id === user?._id;

  const onSubmitProposal = async (data: ProposalForm) => {
    setSubmitting(true);
    try {
      await api.post(`/projects/${id}/proposals`, data);
      toast.success('Proposal submitted successfully!');
      setShowProposalForm(false);
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
    } catch {
      toast.error('Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  const submitMilestone = async (milestoneId: string) => {
    if (!submitNote.trim()) {
      toast.error('Please add a note about your submission');
      return;
    }
    setSubmittingMilestone(milestoneId);
    try {
      await api.patch(`/milestones/${milestoneId}/submit`, { note: submitNote });
      toast.success('Milestone submitted for review!');
      setSubmitNote('');
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.project);
    } catch {
      toast.error('Failed to submit milestone');
    } finally {
      setSubmittingMilestone(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
    </div>
  );
  if (!project) return null;

  const milestoneStatusConfig: Record<string, { label: string; class: string }> = {
    pending: { label: 'Pending', class: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
    active: { label: 'Active', class: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    submitted: { label: 'Submitted', class: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    approved: { label: 'Approved ✓', class: 'bg-green-500/20 text-green-400 border-green-500/30' },
    rejected: { label: 'Changes Requested', class: 'bg-red-500/20 text-red-400 border-red-500/30' },
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/freelancer/browse" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 mt-1">
          <ArrowLeft className="w-4 h-4 text-gray-400" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white">{project.title}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" />{formatCurrency(project.budget)}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{project.timeline}</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{project.proposals?.length || 0} proposals</span>
          </div>
        </div>
        {!alreadyProposed && !isAssigned && project.status === 'open' && (
          <button
            onClick={() => setShowProposalForm(!showProposalForm)}
            className="btn-primary flex items-center gap-2"
          >
            <Send className="w-4 h-4" /> Submit Proposal
          </button>
        )}
        {alreadyProposed && !isAssigned && (
          <span className="flex items-center gap-2 text-sm text-green-400 bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20">
            <CheckCircle className="w-4 h-4" /> Proposed
          </span>
        )}
      </div>

      {/* Proposal Form */}
      {showProposalForm && (
        <div className="glass-card rounded-xl p-6 border border-violet-500/30">
          <h2 className="text-lg font-semibold text-white mb-4">Write Your Proposal</h2>
          <form onSubmit={handleSubmit(onSubmitProposal)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Cover Letter *</label>
              <textarea
                {...register('coverLetter')}
                rows={6}
                placeholder="Introduce yourself, explain why you're the best fit, describe your approach..."
                className="input-field w-full resize-none"
              />
              <div className="flex justify-between mt-1">
                {errors.coverLetter && <p className="text-red-400 text-xs">{errors.coverLetter.message}</p>}
                <span className="text-xs text-gray-500 ml-auto">{coverLetter.length} chars</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Your Bid (₹) *</label>
                <input type="number" {...register('bidAmount')} className="input-field w-full" placeholder="e.g. 45000" />
                {errors.bidAmount && <p className="text-red-400 text-xs mt-1">{errors.bidAmount.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Estimated Timeline *</label>
                <select {...register('timeline')} className="input-field w-full">
                  <option value="">Select...</option>
                  <option value="Less than 1 week">Less than 1 week</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                </select>
                {errors.timeline && <p className="text-red-400 text-xs mt-1">{errors.timeline.message}</p>}
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Submit Proposal
              </button>
              <button type="button" onClick={() => setShowProposalForm(false)} className="btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Tabs (only for assigned freelancer) */}
      {isAssigned && (
        <div className="flex gap-1 bg-white/5 rounded-xl p-1">
          {(['details', 'milestones'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all capitalize ${
                activeTab === tab ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* Details */}
      {(activeTab === 'details' || !isAssigned) && (
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Project Description</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>
          </div>
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {project.skills?.map((skill) => (
                <span key={skill} className="text-sm px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <h3 className="font-semibold text-white mb-3">Project Milestones</h3>
            <div className="space-y-3">
              {project.milestones?.map((m, idx) => (
                <div key={m._id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
                  <div className="w-6 h-6 rounded-full bg-violet-500/30 flex items-center justify-center text-xs text-violet-300 font-bold flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">{m.title}</span>
                      <span className="text-sm text-green-400 font-semibold">{formatCurrency(m.amount)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{m.description}</p>
                    <span className="text-xs text-gray-500">{m.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Milestones for assigned freelancer */}
      {isAssigned && activeTab === 'milestones' && (
        <div className="space-y-4">
          {project.milestones?.map((milestone) => {
            const cfg = milestoneStatusConfig[milestone.status] || milestoneStatusConfig.pending;
            const canSubmit = milestone.status === 'active';
            return (
              <div key={milestone._id} className={`glass-card rounded-xl p-5 border ${
                milestone.status === 'submitted' ? 'border-yellow-500/30' :
                milestone.status === 'approved' ? 'border-green-500/30' : 'border-white/10'
              }`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-white">{milestone.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{formatCurrency(milestone.amount)}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${cfg.class}`}>{cfg.label}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-1">{milestone.description}</p>
                <p className="text-xs text-gray-500 mb-3">{milestone.duration}</p>
                {canSubmit && (
                  <div className="space-y-2">
                    <textarea
                      value={submitNote}
                      onChange={(e) => setSubmitNote(e.target.value)}
                      rows={3}
                      placeholder="Describe what you've completed in this milestone..."
                      className="input-field w-full resize-none text-sm"
                    />
                    <button
                      onClick={() => submitMilestone(milestone._id)}
                      disabled={submittingMilestone === milestone._id}
                      className="btn-primary flex items-center gap-2"
                    >
                      {submittingMilestone === milestone._id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Upload className="w-4 h-4" />}
                      Submit for Review
                    </button>
                  </div>
                )}
                {milestone.status === 'rejected' && (
                  <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" /> Client has requested changes
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
