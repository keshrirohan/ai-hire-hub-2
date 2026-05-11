'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { formatCurrency } from '@/lib/utils';
import {
  Wallet, Plus, ArrowUpRight, ArrowDownLeft, Loader2,
  CreditCard, Building, CheckCircle, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Transaction {
  _id: string;
  type: 'credit' | 'debit' | 'escrow' | 'release';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

export default function ClientWalletPage() {
  const { user, setUser } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [addAmount, setAddAmount] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showAddFunds, setShowAddFunds] = useState(false);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await api.get('/wallet');
        setTransactions(res.data.transactions || []);
        if (res.data.balance !== undefined && user) {
          setUser({ ...user, walletBalance: res.data.balance });
        }
      } catch {
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchWallet();
  }, []); // eslint-disable-line

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);
    if (!amount || amount < 100) {
      toast.error('Minimum amount is ₹100');
      return;
    }
    setIsAdding(true);
    try {
      await loadRazorpay();
      const orderRes = await api.post('/wallet/create-order', { amount });
      const { orderId, amount: orderAmount, currency, keyId } = orderRes.data;

      const options = {
        key: keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderAmount,
        currency,
        name: 'AI Hire Hub',
        description: 'Wallet Top-up',
        order_id: orderId,
        handler: async (response: Record<string, string>) => {
          try {
            await api.post('/wallet/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            toast.success(`₹${amount} added to wallet!`);
            setAddAmount('');
            setShowAddFunds(false);
            const res = await api.get('/wallet');
            setTransactions(res.data.transactions || []);
            if (res.data.balance !== undefined && user) {
              setUser({ ...user, walletBalance: res.data.balance });
            }
          } catch {
            toast.error('Payment verification failed');
          }
        },
        theme: { color: '#7c3aed' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error('Failed to initiate payment');
    } finally {
      setIsAdding(false);
    }
  };

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  const txIcon = (type: string) => {
    if (type === 'credit' || type === 'release') return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
    return <ArrowUpRight className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet</h1>
        <p className="text-gray-400 text-sm mt-1">Manage your funds and transactions</p>
      </div>

      {/* Balance Card */}
      <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-violet-600/20 to-cyan-600/20 border border-violet-500/30">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Wallet className="w-4 h-4" /> Available Balance
            </div>
            <div className="text-4xl font-bold text-white">{formatCurrency(user?.walletBalance || 0)}</div>
            <div className="text-sm text-gray-400 mt-1">Escrow funds are held separately</div>
          </div>
          <button
            onClick={() => setShowAddFunds(!showAddFunds)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Funds
          </button>
        </div>

        {showAddFunds && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-2 mb-4">
              {quickAmounts.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setAddAmount(amt.toString())}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
                    addAmount === amt.toString()
                      ? 'bg-violet-600 text-white border-violet-500'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="Enter custom amount"
                  className="input-field w-full pl-7"
                  min={100}
                />
              </div>
              <button
                onClick={handleAddFunds}
                disabled={isAdding || !addAmount}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                Pay Now
              </button>
            </div>
            <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
              <Building className="w-3.5 h-3.5" />
              Secured by Razorpay. Supports UPI, Net Banking, Cards & Wallets.
            </div>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="glass-card rounded-xl p-5">
        <h2 className="text-lg font-semibold text-white mb-4">Transaction History</h2>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-violet-400" /></div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-10">
            <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {transactions.map((tx) => (
              <div key={tx._id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  tx.type === 'credit' || tx.type === 'release' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {txIcon(tx.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{tx.description}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${
                    tx.type === 'credit' || tx.type === 'release' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tx.type === 'credit' || tx.type === 'release' ? '+' : '-'}{formatCurrency(tx.amount)}
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
