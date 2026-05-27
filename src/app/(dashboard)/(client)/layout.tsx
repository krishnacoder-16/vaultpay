'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';
import { Loader2 } from 'lucide-react';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || user?.role !== 'CLIENT') {
        router.push('/unauthorized');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Render clean loading indicator while hydrating
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (user?.role !== 'CLIENT') {
    return null; // Block children render during redirect
  }

  return <>{children}</>;
}
