import { create } from 'zustand';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, role: 'CLIENT' | 'ADMIN') => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => void;
}

// Simple cookie extraction utility
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    if (typeof window === 'undefined') return;

    try {
      // 1. The Cookie is the security authority
      const activeRole = getCookie('vp_role') as 'CLIENT' | 'ADMIN' | null;

      if (!activeRole) {
        // No session cookie exists -> force unauthenticated state
        localStorage.removeItem('vp_user');
        set({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      // 2. LocalStorage acts as a display convenience only
      const savedUserStr = localStorage.getItem('vp_user');
      let hydratedUser: User | null = null;

      if (savedUserStr) {
        const parsed = JSON.parse(savedUserStr) as User;
        // Verify that the localStorage role perfectly aligns with the sovereign cookie role
        if (parsed.role === activeRole) {
          hydratedUser = parsed;
        }
      }

      // 3. Fallback profile if localStorage was cleared but cookie remains
      if (!hydratedUser) {
        hydratedUser = {
          id: activeRole === 'ADMIN' ? 'usr_admin_default' : 'usr_client_default',
          email: activeRole === 'ADMIN' ? 'compliance@vaultpay.io' : 'merchant@vaultpay.io',
          name: activeRole === 'ADMIN' ? 'Compliance Admin' : 'Merchant Client',
          role: activeRole,
        };
        localStorage.setItem('vp_user', JSON.stringify(hydratedUser));
      }

      set({
        user: hydratedUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      localStorage.removeItem('vp_user');
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, role: 'CLIENT' | 'ADMIN') => {
    set({ isLoading: true });

    // Mock network latency for realistic SaaS UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    const sessionUser: User = {
      id: role === 'ADMIN' ? 'usr_admin_01' : 'usr_client_01',
      email: email,
      name: role === 'ADMIN' ? 'Compliance Admin' : 'Merchant Client',
      role,
    };

    if (typeof window !== 'undefined') {
      // Sovereign Cookie Authority: Set session cookie for Edge Middleware checks
      document.cookie = `vp_role=${role}; path=/; max-age=86400; SameSite=Lax`;
      
      // Optional display persistence
      localStorage.setItem('vp_user', JSON.stringify(sessionUser));
    }

    set({ user: sessionUser, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    set({ isLoading: true });

    // Simulated API request
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (typeof window !== 'undefined') {
      // Clear display persistence
      localStorage.removeItem('vp_user');
      
      // Expire sovereign session cookie
      document.cookie = 'vp_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }

    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
