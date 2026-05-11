'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Plus, Trash2, Loader2, ArrowLeft, Lightbulb,
  DollarSign, Clock, Tag, AlignLeft
} from 'lucide-react';
import Link from 'next/link';

const milestoneSchema = z.object({
  title: z.string().min(3, 'Title too short'),
  description: z.string().min(10, 'Description too short'),
  amount: z.preprocess((v) => Number(v), z.number().min(1, 'Amount required')),
  duration: z.string().min(1, 'Duration required'),
});

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(30, 'Description must be at least 30 characters'),
  budget: z.preprocess((v) => Number(v), z.number().min(100, 'Budget must be at least ₹100')),
  timeline: z.string().min(1, 'Timeline is required'),
  skills: z.string().min(1, 'At least one skill required'),
  milestones: z.array(milestoneSchema).min(1, 'At least one milestone required'),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ProjectForm>({ resolver: zodResolver(projectSchema) as any, defaultValues: {
      milestones: [{ title: '', description: '', amount: 0, duration: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'milestones' });
  const skillsValue = watch('skills');
  const skillsList = skillsValue ? skillsValue.split(',').map(s => s.trim()).filter(Boolean) : [];

  const addSkill = () => {
    if (!skillInput.trim()) return;
    const current = skillsValue ? skillsValue.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!current.includes(skillInput.trim())) {
      setValue('skills', [...current, skillInput.trim()].join(', '));
    }
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    const current = skillsValue ? skillsValue.split(',').map(s => s.trim()).filter(Boolean) : [];
    setValue('skills', current.filter(s => s !== skill).join(', '));
  };

  const onSubmit = async (data: ProjectForm) => {
    setIsSubmitting(true);
    try {
      const payload = {
        ...data,
        skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
      };
      const res = await api.post('/projects', payload);
      toast.success('Project created successfully!');
      router.push(`/dashboard/client/projects/${res.data.project._id}`);
    } catch {
      toast.error('Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/client/projects" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-4 h-4 text-gray-400" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Post a New Project</h1>
          <p className="text-gray-400 text-sm">Fill in the details to find the perfect freelancer</p>
        </div>
      </div>

      {/* Tip */}
      <div className="glass-card rounded-xl p-4 flex gap-3 border border-violet-500/20 bg-violet-500/5">
        <Lightbulb className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-300">
          <strong className="text-violet-300">Pro tip:</strong> Use our{' '}
          <Link href="/dashboard/client/ai-chat" className="text-violet-400 hover:underline">AI Planner</Link>{' '}
          to automatically generate your project scope, milestones, and budget estimate!
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit as Parameters<typeof handleSubmit>[0])} className="space-y-6">
        {/* Basic Info */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <AlignLeft className="w-5 h-5 text-violet-400" /> Project Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Project Title *</label>
            <input
              {...register('title')}
              className="input-field w-full"
              placeholder="e.g., E-commerce Platform with AI Recommendations"
            />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description *</label>
            <textarea
              {...register('description')}
              rows={5}
              className="input-field w-full resize-none"
              placeholder="Describe your project in detail. Include the goals, features, and any specific requirements..."
            />
            {errors.description && <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <DollarSign className="w-4 h-4 inline mr-1 text-violet-400" /> Budget (₹) *
              </label>
              <input
                type="number"
                {...register('budget')}
                className="input-field w-full"
                placeholder="50000"
              />
              {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                <Clock className="w-4 h-4 inline mr-1 text-violet-400" /> Timeline *
              </label>
              <select {...register('timeline')} className="input-field w-full">
                <option value="">Select timeline</option>
                <option value="Less than 1 week">Less than 1 week</option>
                <option value="1-2 weeks">1-2 weeks</option>
                <option value="2-4 weeks">2-4 weeks</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6+ months">6+ months</option>
              </select>
              {errors.timeline && <p className="text-red-400 text-xs mt-1">{errors.timeline.message}</p>}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-violet-400" /> Required Skills *
          </h2>
          <input type="hidden" {...register('skills')} />
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="input-field flex-1"
              placeholder="Type a skill and press Enter or Add"
            />
            <button type="button" onClick={addSkill} className="btn-secondary px-4">Add</button>
          </div>
          {skillsList.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skillsList.map((skill) => (
                <span key={skill} className="flex items-center gap-1 text-sm px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
          {errors.skills && <p className="text-red-400 text-xs">{errors.skills.message}</p>}
        </div>

        {/* Milestones */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">📍 Milestones *</h2>
            <button
              type="button"
              onClick={() => append({ title: '', description: '', amount: 0, duration: '' })}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Plus className="w-4 h-4" /> Add Milestone
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, idx) => (
              <div key={field.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-violet-300">Milestone {idx + 1}</span>
                  {fields.length > 1 && (
                    <button type="button" onClick={() => remove(idx)} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  )}
                </div>
                <input
                  {...register(`milestones.${idx}.title`)}
                  className="input-field w-full"
                  placeholder="Milestone title"
                />
                <textarea
                  {...register(`milestones.${idx}.description`)}
                  rows={2}
                  className="input-field w-full resize-none"
                  placeholder="What will be delivered in this milestone?"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      {...register(`milestones.${idx}.amount`)}
                      className="input-field w-full"
                      placeholder="Amount (₹)"
                    />
                  </div>
                  <div>
                    <input
                      {...register(`milestones.${idx}.duration`)}
                      className="input-field w-full"
                      placeholder="Duration (e.g., 1 week)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {isSubmitting ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
}
