'use client';

import React from 'react';
import { Bell, ShieldCheck, Activity } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-slate-900 bg-slate-950/40 backdrop-blur-md flex items-center justify-between px-8 text-slate-200">
      {/* Context System Badge */}
      <div className="flex items-center gap-2.5">
        <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold text-slate-400">
          Core Engine: <span className="text-slate-200">v1.0.4</span>
        </span>
        <span className="h-4 w-px bg-slate-800" />
        <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Mainnet Active
        </span>
      </div>

      {/* Action Controls & Notifications */}
      <div className="flex items-center gap-4">
        {/* Simple Notification bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-all border border-transparent hover:border-slate-800">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-indigo-500 rounded-full" />
        </button>

        {/* Security Compliance Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-indigo-400" />
          <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
            {user?.role === 'ADMIN' ? 'Compliance Admin' : 'Merchant Secure'}
          </span>
        </div>
      </div>
    </header>
  );
}
