'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      const destination = user.role === 'ADMIN' ? '/admin/dashboard' : '/invoices';
      router.replace(destination);
    }
  }, [user, router]);

  return null;
}
