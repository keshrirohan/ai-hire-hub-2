'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Star, Briefcase, Camera, Save, Loader2, Plus, X } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  bio: z.string().max(500, 'Bio too long'),
  hourlyRate: z.preprocess((v) => (v === '' || v === undefined ? undefined : Number(v)), z.number().min(0).optional()),
  location: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  github: z.string().optional(),
  linkedin: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      hourlyRate: (user as unknown as { hourlyRate?: number })?.hourlyRate || 0,
      location: (user as unknown as { location?: string })?.location || '',
      website: (user as unknown as { website?: string })?.website || '',
    },
  });

  const addSkill = () => {
    if (!skillInput.trim() || skills.includes(skillInput.trim())) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const onSubmit = async (data: ProfileForm) => {
    setIsSaving(true);
    try {
      const res = await api.put('/users/profile', { ...data, skills });
      setUser(res.data.user);
      toast.success('Profile updated successfully!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your profile to attract more clients</p>
      </div>

      {/* Avatar & Stats */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.[0] || 'U'}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-violet-600 rounded-full flex items-center justify-center border-2 border-[hsl(var(--background))] hover:bg-violet-500 transition-colors">
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <div className="text-sm text-gray-400">{user?.email}</div>
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-white">{user?.rating?.toFixed(1) || '5.0'}</span>
                <span className="text-xs text-gray-400">({user?.totalRatings || 0} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-violet-400" />
                <span className="text-sm text-gray-300">{user?.completedProjects || 0} completed</span>
              </div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-violet-500/20 text-violet-300 text-sm border border-violet-500/30 capitalize">
            {user?.role}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-violet-400" /> Basic Information
          </h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
            <input {...register('name')} className="input-field w-full" />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
            <textarea
              {...register('bio')}
              rows={4}
              placeholder="Tell clients about yourself, your experience, and what you can do for them..."
              className="input-field w-full resize-none"
            />
            {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Location</label>
              <input {...register('location')} placeholder="e.g., Mumbai, India" className="input-field w-full" />
            </div>
            {user?.role === 'freelancer' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Hourly Rate (₹)</label>
                <input type="number" {...register('hourlyRate')} className="input-field w-full" placeholder="500" />
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {user?.role === 'freelancer' && (
          <div className="glass-card rounded-xl p-6 space-y-4">
            <h3 className="font-semibold text-white">Skills</h3>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill..."
                className="input-field flex-1"
              />
              <button type="button" onClick={addSkill} className="btn-secondary px-4 flex items-center gap-1">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="flex items-center gap-1.5 text-sm px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <span className="text-sm text-gray-500">No skills added yet</span>
              )}
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="glass-card rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-white">Links</h3>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Website</label>
            <input {...register('website')} placeholder="https://yourwebsite.com" className="input-field w-full" />
            {errors.website && <p className="text-red-400 text-xs mt-1">{errors.website.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">GitHub</label>
              <input {...register('github')} placeholder="github.com/username" className="input-field w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">LinkedIn</label>
              <input {...register('linkedin')} placeholder="linkedin.com/in/name" className="input-field w-full" />
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSaving} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {isSaving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
