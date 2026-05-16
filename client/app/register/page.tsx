'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Bot, Eye, EyeOff, Loader2, User, Briefcase, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { Suspense } from 'react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['client', 'freelancer']),
});

type RegisterForm = z.infer<typeof registerSchema>;

function RegisterContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer'>('client');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register: registerUser, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: (searchParams.get('role') as 'client' | 'freelancer') || 'client',
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({ ...data, role: selectedRole });
      toast.success('Account created!');
      if (selectedRole === 'client') {
        router.push('/dashboard/client');
      } else {
        router.push('/dashboard/freelancer');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Registration failed');
    }
  };

  const handleRoleSelect = (role: 'client' | 'freelancer') => {
    setSelectedRole(role);
    setValue('role', role);
  };

  return (
    <div className="min-h-screen hero-gradient dot-grid flex items-center justify-center p-6">
      <div className="w-full max-w-[420px]">

        {/* Wordmark */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#e8b86d] flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-[#0f1117]" />
            </div>
            <span
              className="text-[#e8e4dc] font-semibold text-lg tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              AI Hire Hub
            </span>
          </Link>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1
            className="text-4xl text-[#e8e4dc] mb-2"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            Create account.
          </h1>
          <p className="text-[#6b6760] text-sm">Join thousands of professionals worldwide</p>
        </div>

        {/* Form card */}
        <div className="surface-raised rounded-xl p-7">

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-[#6b6760] uppercase tracking-widest mb-3">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('client')}
                className={`p-3.5 rounded-lg border text-left transition-all duration-150 ${
                  selectedRole === 'client'
                    ? 'bg-[#e8b86d]/10 border-[#e8b86d]/35 text-[#e8b86d]'
                    : 'border-white/07 text-[#4a4845] hover:border-white/15 hover:text-[#a9a49e]'
                }`}
              >
                <User className="w-4 h-4 mb-2" />
                <div className="text-sm font-semibold">Client</div>
                <div className="text-xs opacity-60 mt-0.5">Hire freelancers</div>
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect('freelancer')}
                className={`p-3.5 rounded-lg border text-left transition-all duration-150 ${
                  selectedRole === 'freelancer'
                    ? 'bg-[#e8b86d]/10 border-[#e8b86d]/35 text-[#e8b86d]'
                    : 'border-white/07 text-[#4a4845] hover:border-white/15 hover:text-[#a9a49e]'
                }`}
              >
                <Briefcase className="w-4 h-4 mb-2" />
                <div className="text-sm font-semibold">Freelancer</div>
                <div className="text-xs opacity-60 mt-0.5">Find projects</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[#6b6760] uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d3b38]" />
                <input
                  {...register('name')}
                  placeholder="Your full name"
                  className="input-dark pl-10"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6b6760] uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d3b38]" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="you@example.com"
                  className="input-dark pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-[#6b6760] uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#3d3b38]" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="input-dark pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3d3b38] hover:text-[#a9a49e] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1.5">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-3 mt-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#4a4845] mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#e8b86d] hover:text-[#f0c87a] transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <Loader2 className="w-7 h-7 animate-spin text-[#e8b86d]" />
      </div>
    }>
      <RegisterContent />
    </Suspense>
  );
}
