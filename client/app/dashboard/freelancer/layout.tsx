'use client';

import AuthGuard from '@/components/AuthGuard';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function FreelancerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="freelancer">
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar role="freelancer" />
        <main className="flex-1 overflow-y-auto bg-[hsl(var(--background))]">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
