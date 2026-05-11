import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return formatDate(date);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getMilestoneStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    active: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    submitted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
    paid: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  };
  return colors[status] || colors.pending;
}

export function getProjectStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-slate-500/20 text-slate-400',
    open: 'bg-blue-500/20 text-blue-400',
    in_progress: 'bg-amber-500/20 text-amber-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
    disputed: 'bg-orange-500/20 text-orange-400',
  };
  return colors[status] || colors.draft;
}

export function truncate(str: string, n: number): string {
  return str.length > n ? str.slice(0, n) + '...' : str;
}
