'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/features/auth/stores/use-auth-store';
import { 
  FileText, 
  CreditCard, 
  LogOut, 
  User, 
  Sparkles, 
  LayoutDashboard, 
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const persisted = localStorage.getItem('vp_sidebar_collapsed');
    if (persisted === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const toggleCollapse = () => {
    const nextState = !isCollapsed;
    setIsCollapsed(nextState);
    localStorage.setItem('vp_sidebar_collapsed', String(nextState));
  };

  // Structured menu items with strict role mapping
  const navItems = [
    // Client Specific Menu
    {
      name: 'Invoices',
      href: '/invoices',
      icon: FileText,
      role: 'CLIENT',
    },
    {
      name: 'Payments',
      href: '/payments',
      icon: CreditCard,
      role: 'CLIENT',
    },
    // Admin Specific Menu (Refocused on Real Billing Operations)
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      role: 'ADMIN',
      adminOnly: true,
    },
    {
      name: 'Invoices',
      href: '/admin/invoices',
      icon: FileText,
      role: 'ADMIN',
      adminOnly: true,
    },
    {
      name: 'Clients',
      href: '/admin/clients',
      icon: Users,
      role: 'ADMIN',
      adminOnly: true,
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: CreditCard,
      role: 'ADMIN',
      adminOnly: true,
    },
  ];

  return (
    <aside 
      className={`border-r border-slate-200/80 bg-white flex flex-col h-full text-slate-800 shadow-[1px_0_4px_rgba(0,0,0,0.01)] transition-all duration-300 ease-in-out shrink-0 select-none ${
        isHydrated && isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header & Toggle */}
      <div 
        className={`flex items-center justify-between border-b border-slate-100 transition-all duration-300 ${
          isHydrated && isCollapsed 
            ? 'px-4 justify-center flex-col py-3.5 h-24 gap-2.5' 
            : 'px-6 h-16'
        }`}
      >
        <Link 
          href={user?.role === 'ADMIN' ? '/admin/dashboard' : '/invoices'} 
          className="flex items-center gap-2.5 shrink-0"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm shrink-0">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          {!(isHydrated && isCollapsed) && (
            <span className="font-bold tracking-tight text-slate-900 text-sm">
              VaultPay <span className="text-indigo-600 font-semibold">Core</span>
            </span>
          )}
        </Link>

        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-all border border-slate-100 cursor-pointer shadow-sm flex items-center justify-center shrink-0"
          title={isHydrated && isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          aria-label={isHydrated && isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isHydrated && isCollapsed ? (
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          ) : (
            <ChevronLeft className="h-3.5 w-3.5 text-slate-500" />
          )}
        </button>
      </div>

      {/* Nav Menu Items - Dynamically Filtered */}
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
        {navItems
          .filter((item) => user?.role === item.role)
          .map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                title={isHydrated && isCollapsed ? item.name : undefined}
                className={`flex items-center text-xs font-semibold rounded-lg transition-all duration-150 border ${
                  isHydrated && isCollapsed 
                    ? 'justify-center p-2.5' 
                    : 'gap-3 px-4 py-2.5'
                } ${
                  isActive
                    ? item.adminOnly
                      ? 'bg-violet-50/60 border-violet-100 text-violet-700 shadow-sm'
                      : 'bg-indigo-50/60 border-indigo-100 text-indigo-700 shadow-sm'
                    : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? (item.adminOnly ? 'text-violet-600' : 'text-indigo-600') : 'text-slate-400'}`} />
                {!(isHydrated && isCollapsed) && <span>{item.name}</span>}
              </Link>
            );
          })}
      </nav>

      {/* User Session Profile Box */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/30">
        <div 
          className={`p-2.5 rounded-xl bg-white border border-slate-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.02)] mb-3 flex items-center ${
            isHydrated && isCollapsed ? 'justify-center' : 'gap-3'
          }`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-400 border border-slate-200/50 shrink-0">
            <User className="h-4 w-4" />
          </div>
          {!(isHydrated && isCollapsed) && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-800 truncate leading-none mb-1.5">
                {user?.name || 'User Profile'}
              </p>
              <p className="text-[10px] text-slate-400 truncate mb-1.5 leading-none">
                {user?.email || 'demo@vaultpay.io'}
              </p>
              <span className={`inline-block text-[8px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded leading-none ${
                user?.role === 'ADMIN' 
                  ? 'bg-violet-50 text-violet-600 border border-violet-100' 
                  : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
              }`}>
                {user?.role === 'ADMIN' ? 'Finance Admin' : 'Client'}
              </span>
            </div>
          )}
        </div>

        {/* Log out option */}
        <button
          onClick={handleLogout}
          title={isHydrated && isCollapsed ? "Sign Out Session" : undefined}
          aria-label="Sign Out Session"
          className={`w-full flex items-center justify-center rounded-lg hover:bg-red-50/5 transition-all border border-transparent hover:border-red-100 cursor-pointer ${
            isHydrated && isCollapsed 
              ? 'p-2.5 text-slate-400 hover:text-red-600' 
              : 'gap-2 px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-600'
          }`}
        >
          <LogOut className="h-3.5 w-3.5 shrink-0" />
          {!(isHydrated && isCollapsed) && <span>Sign Out session</span>}
        </button>
      </div>
    </aside>
  );
}
