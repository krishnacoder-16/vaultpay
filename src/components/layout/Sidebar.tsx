'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';
import { FileText, CreditCard, Settings, LogOut, User, Sparkles } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    {
      name: 'Invoices',
      href: '/invoices',
      icon: FileText,
      role: 'ALL',
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: CreditCard,
      role: 'ALL',
    },
    {
      name: 'Admin Settings',
      href: '/settings',
      icon: Settings,
      role: 'ADMIN',
      adminOnly: true,
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col h-full text-slate-200">
      {/* Sidebar Header Brand */}
      <div className="h-16 flex items-center px-6 border-b border-slate-900">
        <Link href="/invoices" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold tracking-tight text-slate-100 text-sm">
            VaultPay <span className="text-indigo-400">Core</span>
          </span>
        </Link>
      </div>

      {/* Nav Menu items */}
      <nav className="flex-1 py-6 px-4 space-y-1">
        {navItems
          .filter((item) => item.role === 'ALL' || (user?.role === 'ADMIN' && item.role === 'ADMIN'))
          .map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 border ${
                  isActive
                    ? item.adminOnly
                      ? 'bg-violet-500/10 border-violet-500/20 text-violet-300'
                      : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300'
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? (item.adminOnly ? 'text-violet-400' : 'text-indigo-400') : 'text-slate-500'}`} />
                <span>{item.name}</span>
                {item.adminOnly && (
                  <span className="ml-auto text-[9px] font-semibold bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded-md border border-violet-500/20 uppercase tracking-wide">
                    Admin
                  </span>
                )}
              </Link>
            );
          })}
      </nav>

      {/* User Session Profile Box */}
      <div className="p-4 border-t border-slate-900 bg-slate-950/40">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-900/20 border border-slate-900 mb-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
            <User className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate leading-none mb-1">
              {user?.name || 'User Profile'}
            </p>
            <p className="text-[10px] text-slate-500 truncate mb-1">
              {user?.email || 'demo@vaultpay.io'}
            </p>
            <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${
              user?.role === 'ADMIN' 
                ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' 
                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
            }`}>
              {user?.role || 'CLIENT'}
            </span>
          </div>
        </div>

        {/* Log out option */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/5 transition-all border border-transparent hover:border-red-500/10"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out session
        </button>
      </div>
    </aside>
  );
}
