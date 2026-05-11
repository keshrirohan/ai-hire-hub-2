'use client';

import AuthGuard from '@/components/AuthGuard';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard requiredRole="client">
      <div className="min-h-screen hero-gradient flex">
        <DashboardSidebar role="client" />
        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
