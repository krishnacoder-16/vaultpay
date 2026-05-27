'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Client-side fail-safe redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Clean, high-trust Session Initialization Screen
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-50/50 flex flex-col items-center justify-center text-slate-800">
        <div className="relative flex flex-col items-center">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600 mb-3" />
          <p className="text-[11px] text-slate-400 uppercase tracking-widest font-extrabold animate-pulse">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Block flashing children before redirect completes
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Dynamic Sidebar Shell */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Workstation */}
        <main className="flex-1 overflow-y-auto bg-[#fafbfc] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
