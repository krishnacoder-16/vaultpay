'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useInvoiceStore } from '@/features/invoices/stores/use-invoice-store';
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
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { invoices } = useInvoiceStore();

  // Dynamic KPI math using baseline enterprise mock constants
  const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
  const outstandingInvoices = invoices.filter(inv => inv.status === 'AWAITING' || inv.status === 'OVERDUE');
  const overdueInvoices = invoices.filter(inv => inv.status === 'OVERDUE');

  const dynamicPaidSum = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);
  const dynamicOutstandingSum = outstandingInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);

  // High-trust large business baseline alignment
  const totalRevenue = 1411600.00 + dynamicPaidSum;
  const outstandingPayments = 130100.00 + dynamicOutstandingSum;
  const paidCount = 640 + paidInvoices.length;
  const overdueCount = 16 + overdueInvoices.length;

  const metrics = [
    { title: 'Total Revenue', value: `$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-violet-600 border-violet-100 bg-violet-50/50', change: '+14.2% MoM' },
    { title: 'Outstanding Payments', value: `$${outstandingPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Clock, color: 'text-amber-600 border-amber-100 bg-amber-50/50', change: `${outstandingInvoices.length} active bills` },
    { title: 'Paid Invoices', value: `${paidCount}`, icon: CheckCircle2, color: 'text-emerald-600 border-emerald-100 bg-emerald-50/50', change: '96.2% rate' },
    { title: 'Overdue Invoices', value: `${overdueCount}`, icon: AlertCircle, color: 'text-rose-600 border-rose-100 bg-rose-50/50', change: 'Requires review' },
    { title: 'Monthly Revenue', value: '$128,450.00', icon: Calendar, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/50', change: 'Current Month' },
    { title: 'Active Clients', value: '104', icon: Users, color: 'text-blue-600 border-blue-100 bg-blue-50/50', change: '+4 new' },
  ];

  // Dynamic Recent Activity logs aligned with store status
  const recentActivity = [
    { type: 'INVOICE', text: 'LexCorp Ventures statement INV-2026-004 is overdue', time: 'Term past due limit', amount: '$3,200.00' },
    { type: 'PAYMENT', text: 'Acme Global Corp settled invoice INV-2026-001', time: 'Completed on secure portal', amount: '$12,500.00' },
    ...invoices.filter(i => i.status === 'PAID' && i.id !== 'INV-2026-001').map(i => ({
      type: 'PAYMENT',
      text: `${i.billingEntity} paid invoice ${i.id}`,
      time: 'Live Settlement',
      amount: i.amount
    }))
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

      {/* Primary KPI Grid */}
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
                {invoices.map((inv) => (
                  <tr 
                    key={inv.id} 
                    onClick={() => router.push(`/admin/invoices/${inv.id}`)}
                    className="hover:bg-slate-50/70 active:bg-slate-100/50 cursor-pointer transition-all duration-150 group"
                    title="Click to view official commercial document"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-violet-600 transition-colors flex items-center gap-1.5">
                      {inv.id}
                      <ChevronRight className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-bold transition-colors">{inv.billingEntity}</td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{inv.type}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 tracking-tight">{inv.amount}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full border transition-all ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : inv.status === 'AWAITING'
                          ? 'bg-amber-50 border-amber-100 text-amber-700'
                          : inv.status === 'OVERDUE'
                          ? 'bg-rose-50 border-rose-100 text-rose-700'
                          : 'bg-slate-100 border-slate-200 text-slate-500 animate-pulse'
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
