'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Bot, LayoutDashboard, FolderOpen, MessageSquare, Wallet,
  User, LogOut, Briefcase, Star, TrendingUp, Search,
  X, Menu
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

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
    toast.success('Logged out successfully');
    router.push('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold gradient-text">AI Hire Hub</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-sm font-bold text-white shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              getInitials(user?.name || 'U')
            )}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
            <div className="text-xs text-slate-500 capitalize flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {user?.role}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          // Exact match for root dashboard routes, startsWith for others
          const isActive = item.href.endsWith('/dashboard/client') || item.href.endsWith('/dashboard/freelancer')
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active' : 'text-slate-400 hover:text-white'}`}
              onClick={() => setIsMobileOpen(false)}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Wallet balance */}
      {user && (
        <div className="p-4 border-t border-white/10">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Wallet Balance</div>
                <div className="text-lg font-bold text-white">
                  ₹{user.walletBalance?.toLocaleString('en-IN') || 0}
                </div>
              </div>
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 pt-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
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
        className="fixed top-4 left-4 z-40 lg:hidden p-2 rounded-xl glass border border-white/10 text-white"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-50 lg:hidden transform transition-transform duration-300 glass border-r border-white/10 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-64 glass border-r border-white/10 z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
