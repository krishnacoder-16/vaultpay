'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';
import { ShieldCheck, UserCheck, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/invoices';

  const { login, isAuthenticated, initialize, isLoading } = useAuthStore();

  const [email, setEmail] = useState('demo@vaultpay.io');
  const [role, setRole] = useState<'CLIENT' | 'ADMIN'>('CLIENT');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(callbackUrl);
    }
  }, [isAuthenticated, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await login(email, role);
      // Let the useEffect handle the redirection to callbackUrl
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border border-slate-900 bg-slate-900/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl">
      {/* Brand Logo Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-3 shadow-inner shadow-indigo-500/10">
          <Sparkles className="h-6 w-6 animate-pulse" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-100">
          VaultPay <span className="text-indigo-400">Core</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Financial Operations SaaS Dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Professional Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/60 transition-all"
              placeholder="name@company.com"
            />
          </div>
        </div>

        {/* Role Selector Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Simulation Role Profile
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('CLIENT')}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                role === 'CLIENT'
                  ? 'border-indigo-500 bg-indigo-500/5 text-slate-200 shadow-md shadow-indigo-500/5'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`p-1 rounded-lg ${role === 'CLIENT' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-900 text-slate-500'}`}>
                  <UserCheck className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">Client</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Manage invoices, view billing, initiate payments & checkouts.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                role === 'ADMIN'
                  ? 'border-violet-500 bg-violet-500/5 text-slate-200 shadow-md shadow-violet-500/5'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`p-1 rounded-lg ${role === 'ADMIN' ? 'bg-violet-500/10 text-violet-400' : 'bg-slate-900 text-slate-500'}`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wide">Admin</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Access compliance limits, control system toggles, audit logs.
              </p>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="relative w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-slate-100 rounded-xl text-sm font-semibold border border-indigo-500/20 transition-all duration-200 shadow-lg shadow-indigo-600/15 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin text-slate-200" />
          ) : (
            <>
              Sign In to core
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </form>

      {/* Security note */}
      <div className="mt-6 text-center">
        <p className="text-[10px] text-slate-600 tracking-wider">
          SECURE MOCK ENVIRONMENT • BANK-GRADE ENCRYPTION SIMULATOR
        </p>
      </div>
    </div>
  );
}
