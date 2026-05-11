'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: 'client' | 'freelancer';
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
    if (!isLoading && isAuthenticated && requiredRole && user?.role !== requiredRole) {
      router.push(`/dashboard/${user?.role}`);
    }
  }, [isAuthenticated, isLoading, user, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen hero-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;

  return <>{children}</>;
}
