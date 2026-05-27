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
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.02),0_12px_32px_rgba(148,163,184,0.12)]">
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-3 shadow-sm">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900">
          VaultPay <span className="text-indigo-600 font-semibold">Core</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">Financial Operations SaaS Dashboard</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
            Professional Email Address
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <Mail className="h-4 w-4" />
            </span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 focus:bg-white transition-all duration-200"
              placeholder="name@company.com"
            />
          </div>
        </div>

        {/* Role Selector Grid */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2.5">
            Simulation Role Profile
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('CLIENT')}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 ${
                role === 'CLIENT'
                  ? 'border-indigo-600 bg-indigo-50/10 text-slate-900 shadow-sm'
                  : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`p-1 rounded-lg ${role === 'CLIENT' ? 'bg-indigo-600/10 text-indigo-600' : 'bg-slate-200/50 text-slate-400'}`}>
                  <UserCheck className="h-3.5 w-3.5" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider">Client</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                View invoices, settle payments, and access billing assets.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 ${
                role === 'ADMIN'
                  ? 'border-indigo-600 bg-indigo-50/10 text-slate-900 shadow-sm'
                  : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`p-1 rounded-lg ${role === 'ADMIN' ? 'bg-indigo-600/10 text-indigo-600' : 'bg-slate-200/50 text-slate-400'}`}>
                  <ShieldCheck className="h-3.5 w-3.5" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider">Admin</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-snug">
                Configure limits, execute compliance controls, audit parameters.
              </p>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="relative w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-xl text-sm font-semibold border border-transparent transition-all duration-200 shadow-md shadow-slate-900/5 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
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
        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">
          SECURE MOCK ENVIRONMENT • PCI COMPLIANCE SIMULATION
        </p>
      </div>
    </div>
  );
}
