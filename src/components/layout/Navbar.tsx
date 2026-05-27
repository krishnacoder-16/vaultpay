'use client';

import React from 'react';
import { Bell, ShieldCheck, Activity } from 'lucide-react';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="h-16 border-b border-slate-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between px-8 text-slate-800 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
      {/* Context System Badge */}
      <div className="flex items-center gap-2.5">
        <Activity className="h-3.5 w-3.5 text-emerald-500 animate-pulse" />
        <span className="text-xs font-semibold text-slate-500">
          Core Engine: <span className="text-slate-800 font-bold">v1.0.4</span>
        </span>
        <span className="h-4 w-px bg-slate-200" />
        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-wide">
          Mainnet Active
        </span>
      </div>

      {/* Action Controls & Notifications */}
      <div className="flex items-center gap-4">
        {/* Simple Notification Bell */}
        <button className="relative p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all border border-transparent hover:border-slate-200/60">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-indigo-600 rounded-full" />
        </button>

        {/* Security Compliance Badge */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
            {user?.role === 'ADMIN' ? 'Compliance Admin' : 'Merchant Secure'}
          </span>
        </div>
      </div>
    </header>
  );
}
