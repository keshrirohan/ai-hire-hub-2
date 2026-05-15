'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import {
  Wallet, ArrowUpRight, ArrowDownLeft, Loader2,
  CheckCircle, Clock, Building, CreditCard, TrendingUp
} from 'lucide-react';

interface Transaction {
  _id: string;
  type: 'credit' | 'debit' | 'escrow' | 'release';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export default function FreelancerWalletPage() {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/wallet');
        setTransactions(res.data.transactions || []);
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []);

  const totalEarned = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingEarnings = transactions
    .filter(t => t.type === 'release' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Earnings & Wallet</h1>
        <p className="text-gray-400 text-sm mt-1">Track your earnings and withdrawals</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5 bg-gradient-to-br from-cyan-600/20 to-sky-600/20 border border-cyan-500/30">
          <div className="flex items-center gap-2 text-gray-400 mb-2 text-sm">
            <Wallet className="w-4 h-4" /> Available Balance
          </div>
          <div className="text-3xl font-bold text-white">{formatCurrency(user?.walletBalance || 0)}</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 mb-2 text-sm">
            <TrendingUp className="w-4 h-4" /> Total Earned
          </div>
          <div className="text-3xl font-bold text-green-400">{formatCurrency(totalEarned)}</div>
        </div>
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 text-gray-400 mb-2 text-sm">
            <Clock className="w-4 h-4" /> Pending
          </div>
          <div className="text-3xl font-bold text-yellow-400">{formatCurrency(pendingEarnings)}</div>
        </div>
      </div>

      {/* Withdraw Info */}
      <div className="glass-card rounded-xl p-5 border border-blue-500/20 bg-blue-500/5">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-blue-400 flex-shrink-0" />
          <div>
            <div className="text-sm font-medium text-white">Withdrawals</div>
            <div className="text-xs text-gray-400">
              Contact support to set up bank transfer. Minimum withdrawal: ₹500. Processing time: 2-3 business days.
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-cyan-400" /></div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10">
            <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No transactions yet</p>
            <p className="text-sm text-gray-500 mt-1">Earnings will appear here when clients release milestone payments</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => {
              const isCredit = tx.type === 'credit' || tx.type === 'release';
              return (
                <div key={tx._id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {isCredit
                      ? <ArrowDownLeft className="w-4 h-4 text-green-400" />
                      : <ArrowUpRight className="w-4 h-4 text-red-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{tx.description}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${isCredit ? 'text-green-400' : 'text-red-400'}`}>
                      {isCredit ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      tx.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                      tx.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {tx.status === 'completed' ? <CheckCircle className="w-3 h-3 inline mr-0.5" /> : <Clock className="w-3 h-3 inline mr-0.5" />}
                      {tx.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
