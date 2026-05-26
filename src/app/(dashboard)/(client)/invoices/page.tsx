'use client';

import React from 'react';
import { FileText, Plus, ArrowDownToLine, Receipt, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InvoicesPage() {
  const metrics = [
    { title: 'Total Volume', value: '$148,250.00', icon: Receipt, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
    { title: 'Awaiting Payment', value: '$12,400.00', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'Paid Invoices', value: '$135,850.00', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'Overdue Audits', value: '$0.00', icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  ];

  const mockInvoices = [
    { id: 'INV-2026-001', client: 'Acme Global Corp', date: 'May 24, 2026', amount: '$12,500.00', status: 'PAID' },
    { id: 'INV-2026-002', client: 'Stark Industries', date: 'May 22, 2026', amount: '$4,800.00', status: 'PAID' },
    { id: 'INV-2026-003', client: 'Wayne Enterprise', date: 'May 18, 2026', amount: '$9,200.00', status: 'AWAITING' },
    { id: 'INV-2026-004', client: 'LexCorp Ventures', date: 'May 10, 2026', amount: '$3,200.00', status: 'OVERDUE' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <FileText className="h-6 w-6 text-indigo-400" />
            Invoices Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and track institutional billing documents and merchant accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-all">
            <ArrowDownToLine className="h-4 w-4" />
            Export CSV
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-slate-100 rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="p-5 border border-slate-900/80 bg-slate-900/20 backdrop-blur-sm rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{m.title}</p>
                <p className="text-lg font-bold text-slate-200">{m.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl border border-slate-800/40 ${m.bg} ${m.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid List View */}
      <div className="border border-slate-900 bg-slate-950 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-900 bg-slate-900/10 flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Billing Ledger</h2>
          <span className="text-[10px] text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
            Realtime Sync
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-900 text-slate-500 font-semibold uppercase tracking-wider bg-slate-950">
                <th className="px-6 py-4 font-bold text-[10px]">Invoice ID</th>
                <th className="px-6 py-4 font-bold text-[10px]">Client Target</th>
                <th className="px-6 py-4 font-bold text-[10px]">Issuance Date</th>
                <th className="px-6 py-4 font-bold text-[10px] text-right">Invoice Total</th>
                <th className="px-6 py-4 font-bold text-[10px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/60 bg-slate-950/20">
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="px-6 py-4 font-semibold text-slate-300">{inv.id}</td>
                  <td className="px-6 py-4 text-slate-400 font-medium">{inv.client}</td>
                  <td className="px-6 py-4 text-slate-500">{inv.date}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-200">{inv.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                      inv.status === 'PAID'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : inv.status === 'AWAITING'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
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
    </div>
  );
}
