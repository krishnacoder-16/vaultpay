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

  // Handle client-side fallback redirect if store reports unauthenticated after loading finishes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center text-slate-900">
        <div className="relative flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-4" />
          <p className="text-xs text-slate-400 uppercase tracking-widest font-bold animate-pulse">
            Decrypting Core Sessions...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Stop flashing content before redirect
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Primary Sidebar Layout */}
      <Sidebar />

      {/* Main Container Layer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Workspace panel */}
        <main className="flex-1 overflow-y-auto bg-[#fafbfc] p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
