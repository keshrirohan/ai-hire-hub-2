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
      toast.success('Account created successfully! 🎉');
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
    <div className="min-h-screen hero-gradient flex items-center justify-center p-6">
      {/* Background orbs */}
      <div className="fixed top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-20 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">AI Hire Hub</span>
          </Link>
          <h1 className="text-2xl font-black text-white">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">Join thousands of professionals</p>
        </div>

        <div className="glass-strong rounded-2xl p-8 border border-white/10">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              onClick={() => handleRoleSelect('client')}
              className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                selectedRole === 'client'
                  ? 'bg-purple-500/20 border-purple-500/50 text-purple-300'
                  : 'glass border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <User className="w-5 h-5 mb-2" />
              <div className="text-sm font-semibold">Client</div>
              <div className="text-xs opacity-70">Hire freelancers</div>
            </button>
            <button
              type="button"
              onClick={() => handleRoleSelect('freelancer')}
              className={`p-4 rounded-xl border transition-all duration-200 text-left ${
                selectedRole === 'freelancer'
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                  : 'glass border-white/10 text-slate-400 hover:border-white/20'
              }`}
            >
              <Briefcase className="w-5 h-5 mb-2" />
              <div className="text-sm font-semibold">Freelancer</div>
              <div className="text-xs opacity-70">Find projects</div>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('name')}
                  placeholder="John Doe"
                  className="input-dark w-full pl-10"
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('email')}
                  type="email"
                  placeholder="john@example.com"
                  className="input-dark w-full pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="input-dark w-full pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 mt-2"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen hero-gradient flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-400" /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
