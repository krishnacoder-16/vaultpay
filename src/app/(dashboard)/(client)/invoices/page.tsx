'use client';

import React from 'react';
import { FileText, Plus, ArrowDownToLine, Receipt, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InvoicesPage() {
  const metrics = [
    { title: 'Total Volume', value: '$148,250.00', icon: Receipt, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/50' },
    { title: 'Awaiting Payment', value: '$12,400.00', icon: Clock, color: 'text-amber-600 border-amber-100 bg-amber-50/50' },
    { title: 'Paid Invoices', value: '$135,850.00', icon: CheckCircle2, color: 'text-emerald-600 border-emerald-100 bg-emerald-50/50' },
    { title: 'Overdue Audits', value: '$0.00', icon: AlertCircle, color: 'text-rose-600 border-rose-100 bg-rose-50/50' },
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileText className="h-5.5 w-5.5 text-indigo-600" />
            Invoices Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate and track institutional billing documents and merchant accounts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            <ArrowDownToLine className="h-4 w-4" />
            Export CSV
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white rounded-lg transition-all shadow-sm shadow-indigo-600/10 active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="p-5 border border-slate-200/60 bg-white rounded-2xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{m.title}</p>
                <p className="text-xl font-bold text-slate-900 tracking-tight">{m.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${m.color}`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Billing Ledger Card */}
      <div className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01),0_4px_12px_rgba(148,163,184,0.04)]">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Billing Ledger</h2>
          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            Realtime Sync
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="px-6 py-3.5 text-[10px]">Invoice ID</th>
                <th className="px-6 py-3.5 text-[10px]">Client Target</th>
                <th className="px-6 py-3.5 text-[10px]">Issuance Date</th>
                <th className="px-6 py-3.5 text-[10px] text-right">Invoice Total</th>
                <th className="px-6 py-3.5 text-[10px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{inv.id}</td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{inv.client}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{inv.date}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 tracking-tight">{inv.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
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
    </div>
  );
}
