'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useInvoiceStore } from '@/features/invoices/stores/use-invoice-store';
import { FileText, ArrowDownToLine, Plus, Receipt, Clock, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';

export default function AdminInvoicesPage() {
  const router = useRouter();
  const { invoices } = useInvoiceStore();

  // Dynamic KPI math using baseline enterprise mock constants
  const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
  const outstandingInvoices = invoices.filter(inv => inv.status === 'AWAITING' || inv.status === 'OVERDUE');

  const dynamicPaidSum = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);
  const dynamicOutstandingSum = outstandingInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);
  const dynamicTotalSum = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);

  // High-trust large business baseline alignment
  const globalInvoiced = 1554100.00 + dynamicTotalSum;
  const awaitingSettlement = 130100.00 + dynamicOutstandingSum;
  const settledInvoices = 1411600.00 + dynamicPaidSum;

  const metrics = [
    { title: 'Global Invoiced', value: `$${globalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Receipt, color: 'text-violet-600 border-violet-100 bg-violet-50/50' },
    { title: 'Awaiting Settlement', value: `$${awaitingSettlement.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Clock, color: 'text-amber-600 border-amber-100 bg-amber-50/50' },
    { title: 'Settled Invoices', value: `$${settledInvoices.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: CheckCircle2, color: 'text-emerald-600 border-emerald-100 bg-emerald-50/50' },
    { title: 'Flagged Disputes', value: '$0.00', icon: AlertCircle, color: 'text-rose-600 border-rose-100 bg-rose-50/50' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileText className="h-5.5 w-5.5 text-violet-600" />
            Global Invoice Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global ledger of all customer invoicing pipelines and billing agreements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm cursor-pointer">
            <ArrowDownToLine className="h-4 w-4" />
            Export Audit CSV
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white rounded-lg transition-all shadow-sm shadow-violet-600/10 active:scale-[0.98] cursor-pointer">
            <Plus className="h-4 w-4" />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="p-6 border border-slate-200/60 bg-white rounded-2xl flex items-center justify-between shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_16px_rgba(148,163,184,0.06)]">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{m.title}</p>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">{m.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${m.color} shadow-sm`}>
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Ledger Table */}
      <div className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01),0_4px_12px_rgba(148,163,184,0.04)]">
        <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/40">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">All Merchant Invoices</h2>
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
                  <td className="px-6 py-4 text-slate-500 font-medium">{inv.date}</td>
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
    </div>
  );
}
