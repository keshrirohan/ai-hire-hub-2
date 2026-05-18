'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Bot, LayoutDashboard, FolderOpen, MessageSquare, Wallet,
  User, LogOut, Briefcase, Search, X, Menu,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';
import ThemeToggle from '@/components/ThemeToggle';

interface SidebarProps {
  role: 'client' | 'freelancer';
}

const clientNav = [
  { href: '/dashboard/client', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/client/ai-chat', icon: Bot, label: 'AI Planner' },
  { href: '/dashboard/client/projects', icon: FolderOpen, label: 'Projects' },
  { href: '/dashboard/client/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/dashboard/client/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/dashboard/client/profile', icon: User, label: 'Profile' },
];

const freelancerNav = [
  { href: '/dashboard/freelancer', icon: LayoutDashboard, label: 'Overview' },
  { href: '/dashboard/freelancer/browse', icon: Search, label: 'Browse Projects' },
  { href: '/dashboard/freelancer/projects', icon: Briefcase, label: 'My Work' },
  { href: '/dashboard/freelancer/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/dashboard/freelancer/wallet', icon: Wallet, label: 'Earnings' },
  { href: '/dashboard/freelancer/profile', icon: User, label: 'Profile' },
];

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuthStore();

  const navItems = role === 'client' ? clientNav : freelancerNav;

  const handleLogout = async () => {
    await logout();
    toast.success('Signed out');
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">

      {/* Wordmark */}
      <div className="px-5 py-5 border-b border-white/05">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#e8b86d] flex items-center justify-center flex-shrink-0">
            <Bot className="w-4 h-4 text-[#0f1117]" />
          </div>
          <span
            className="text-[#c4bfb8] font-semibold text-base tracking-tight"
            style={{ fontFamily: 'var(--font-jakarta)' }}
          >
            AI Hire Hub
          </span>
        </Link>
      </div>

      {/* User chip */}
      <div className="px-4 py-4 border-b border-white/05">
        <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/03">
          <div className="w-9 h-9 rounded-lg bg-[#e8b86d] flex items-center justify-center text-[#0f1117] text-xs font-bold flex-shrink-0 overflow-hidden">
            {user?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(user?.name || 'U')
            )}
          </div>
          <div className="min-w-0">
            <div
              className="text-sm font-semibold text-[#c4bfb8] truncate"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              {user?.name}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6ee7b7] flex-shrink-0" />
              <span className="text-xs text-[#4a4845] capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive =
            item.href.endsWith('/dashboard/client') || item.href.endsWith('/dashboard/freelancer')
              ? pathname === item.href
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Wallet balance strip */}
      {user && (
        <div className="px-4 py-3 border-t border-white/05">
          <div className="px-3 py-3 rounded-lg" style={{ background: 'rgba(232,184,109,0.07)', border: '1px solid rgba(232,184,109,0.13)' }}>
            <div className="text-xs text-[#6b6760] mb-1 uppercase tracking-widest font-medium">Balance</div>
            <div className="text-base font-bold text-[#e8b86d]" style={{ fontFamily: 'var(--font-jakarta)' }}>
              ₹{user.walletBalance?.toLocaleString('en-IN') || '0'}
            </div>
          </div>
        </div>
      )}

      {/* Theme + Logout */}
      <div className="px-3 pb-4 space-y-1">
        <div className="flex items-center justify-between px-4 py-2.5">
          <ThemeToggle />
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#4a4845] hover:text-[#fca5a5] hover:bg-red-500/05 transition-all duration-150"
          style={{ fontFamily: 'var(--font-jakarta)' }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-lg surface-raised text-[#a9a49e]"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-60 z-50 lg:hidden transform transition-transform duration-300 border-r ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 text-[#4a4845] hover:text-[#a9a49e]"
        >
          <X className="w-4 h-4" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-60 z-30 border-r"
        style={{ background: 'var(--bg-sidebar)', borderColor: 'var(--border)' }}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
