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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: () => {
    if (typeof window === 'undefined') return;

    try {
      const savedUser = localStorage.getItem('vp_user');
      const savedCookie = document.cookie
        .split('; ')
        .find((row) => row.startsWith('vp_role='));

      if (savedUser && savedCookie) {
        const user = JSON.parse(savedUser) as User;
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        // Clear any orphaned data
        localStorage.removeItem('vp_user');
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email: string, role: 'CLIENT' | 'ADMIN') => {
    set({ isLoading: true });

    // Mock API latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser: User = {
      id: role === 'ADMIN' ? 'usr_admin_01' : 'usr_client_01',
      email: email,
      name: role === 'ADMIN' ? 'Compliance Admin' : 'Merchant Client',
      role,
    };

    // Set persistence values
    if (typeof window !== 'undefined') {
      localStorage.setItem('vp_user', JSON.stringify(mockUser));
      // Set session cookie for Middleware edge routing
      document.cookie = `vp_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    }

    set({ user: mockUser, isAuthenticated: true, isLoading: false });
  },

  logout: async () => {
    set({ isLoading: true });

    // Mock API latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (typeof window !== 'undefined') {
      localStorage.removeItem('vp_user');
      // Expire session cookie
      document.cookie = 'vp_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    }

    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
