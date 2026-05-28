'use client';

import React from 'react';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Plus, 
  ArrowDownToLine, 
  Mail, 
  Filter, 
  LayoutDashboard,
  Calendar,
  ArrowUpRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const metrics = [
    { title: 'Total Revenue', value: '$1,428,900.00', icon: TrendingUp, color: 'text-violet-600 border-violet-100 bg-violet-50/50', change: '+14.2% MoM' },
    { title: 'Outstanding Payments', value: '$142,500.00', icon: Clock, color: 'text-amber-600 border-amber-100 bg-amber-50/50', change: '18 invoices' },
    { title: 'Paid Invoices', value: '642', icon: CheckCircle2, color: 'text-emerald-600 border-emerald-100 bg-emerald-50/50', change: '96.2% rate' },
    { title: 'Overdue Invoices', value: '18', icon: AlertCircle, color: 'text-rose-600 border-rose-100 bg-rose-50/50', change: 'Requires review' },
    { title: 'Monthly Revenue', value: '$128,450.00', icon: Calendar, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/50', change: 'Current Month' },
    { title: 'Active Clients', value: '104', icon: Users, color: 'text-blue-600 border-blue-100 bg-blue-50/50', change: '+4 new' },
  ];

  const mockInvoices = [
    { id: 'INV-2026-104', client: 'Acme Global Corp', date: 'May 27, 2026', amount: '$12,500.00', status: 'PAID', type: 'SaaS Agreement' },
    { id: 'INV-2026-103', client: 'Stark Industries', date: 'May 26, 2026', amount: '$8,400.00', status: 'PAID', type: 'API Enterprise' },
    { id: 'INV-2026-102', client: 'Wayne Enterprise', date: 'May 25, 2026', amount: '$19,200.00', status: 'AWAITING', type: 'Custom SLA' },
    { id: 'INV-2026-101', client: 'LexCorp Ventures', date: 'May 22, 2026', amount: '$4,300.00', status: 'OVERDUE', type: 'Core License' },
    { id: 'INV-2026-100', client: 'Oscorp Biotech', date: 'May 20, 2026', amount: '$7,100.00', status: 'PAID', type: 'SaaS Agreement' },
  ];

  const recentActivity = [
    { type: 'PAYMENT', text: 'Stark Industries paid invoice INV-2026-103', time: '12m ago', amount: '$8,400.00' },
    { type: 'INVOICE', text: 'Acme Global Corp generated invoice INV-2026-104', time: '1h ago', amount: '$12,500.00' },
    { type: 'REMINDER', text: 'Sent overdue invoice notice to LexCorp Ventures', time: '3h ago', amount: null },
    { type: 'PAYMENT', text: 'Wayne Enterprise settled balance adjustment txn_932', time: '5h ago', amount: '$3,100.00' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <LayoutDashboard className="h-5.5 w-5.5 text-violet-600" />
            Billing Operations Console
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global administrative view of transaction pipelines, client ledgers, and revenue flows.
          </p>
        </div>

        {/* Quick Operations Panel */}
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            <ArrowDownToLine className="h-3.5 w-3.5" />
            Export CSV
          </button>
          <button className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            <Filter className="h-3.5 w-3.5" />
            Filter
          </button>
          <button className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white rounded-lg transition-all shadow-sm shadow-violet-600/10 active:scale-[0.98]">
            <Plus className="h-3.5 w-3.5" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Primary KPI Grid - Restructured for strong visual dominance and balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="p-6 border border-slate-200/60 bg-white rounded-2xl flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_16px_rgba(148,163,184,0.08)]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m.title}</span>
                <span className={`p-2 rounded-xl border ${m.color} shadow-sm`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">{m.value}</p>
                <div className="flex items-center justify-between pt-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{m.change}</p>
                  <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-300">Operational</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Operations Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Invoices Ledger Table */}
        <div className="lg:col-span-2 border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01),0_4px_12px_rgba(148,163,184,0.04)] flex flex-col">
          <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Operational Ledger</h2>
            <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full border border-violet-100 uppercase tracking-wider">
              Ledger Live
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                  <th className="px-6 py-3.5 text-[10px]">Invoice ID</th>
                  <th className="px-6 py-3.5 text-[10px]">Client Target</th>
                  <th className="px-6 py-3.5 text-[10px]">Service Type</th>
                  <th className="px-6 py-3.5 text-[10px] text-right">Invoice Total</th>
                  <th className="px-6 py-3.5 text-[10px] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 active:bg-slate-100/50 cursor-pointer transition-all duration-150 group">
                    <td className="px-6 py-4 font-bold text-slate-900">{inv.id}</td>
                    <td className="px-6 py-4 text-slate-700 font-bold group-hover:text-violet-600 transition-colors">{inv.client}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{inv.type}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 tracking-tight">{inv.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : inv.status === 'AWAITING'
                          ? 'bg-amber-50 border-amber-100 text-amber-700'
                          : 'bg-rose-50 border-rose-100 text-rose-700'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity stream and Quick Actions */}
        <div className="space-y-6">
          {/* Operations Actions Card */}
          <div className="p-6 border border-slate-200/80 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Operations Console</h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-all hover:shadow-sm cursor-pointer">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  Send Overdue Reminders
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-left text-xs font-semibold text-slate-700 transition-all hover:shadow-sm cursor-pointer">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-400" />
                  Audit Client Profiles
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="p-6 border border-slate-200/80 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex-1">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Activity Stream</h3>
            <div className="space-y-4">
              {recentActivity.map((act, i) => (
                <div key={i} className="flex items-start justify-between gap-3 text-xs leading-normal">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-700 truncate">{act.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-medium">{act.time}</p>
                  </div>
                  {act.amount && (
                    <span className="text-[10px] font-bold text-slate-800 shrink-0 font-mono">
                      {act.amount}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
