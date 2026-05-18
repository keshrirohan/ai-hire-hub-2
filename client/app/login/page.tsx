'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Bot, Eye, EyeOff, Loader2, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import ThemeToggle from '@/components/ThemeToggle';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      toast.success(`Welcome back, ${user?.name}!`);
      if (user?.role === 'client') {
        router.push('/dashboard/client');
      } else {
        router.push('/dashboard/freelancer');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen hero-gradient dot-grid flex items-center justify-center p-6">
      {/* Theme toggle – floating top-right */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle compact />
      </div>
      <div className="w-full max-w-[400px]">

        {/* Wordmark */}
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
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
            Welcome back.
          </h1>
          <p className="text-[#6b6760] text-sm">Sign in to continue to your workspace</p>
        </div>

        {/* Form card */}
        <div className="surface-raised rounded-xl p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  placeholder="••••••••"
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
              id="login-btn"
              className="btn-primary w-full justify-center py-3 mt-1"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-lg bg-[#1a1d27] border border-white/5">
            <p className="text-xs text-[#6b6760] font-medium mb-1.5 uppercase tracking-widest">Demo</p>
            <p className="text-xs text-[#4a4845] font-mono">client@demo.com / demo123</p>
            <p className="text-xs text-[#4a4845] font-mono mt-0.5">freelancer@demo.com / demo123</p>
          </div>
        </div>

        <p className="text-center text-sm text-[#4a4845] mt-6">
          No account?{' '}
          <Link href="/register" className="text-[#e8b86d] hover:text-[#f0c87a] transition-colors">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
