'use client';

import React from 'react';
import { CreditCard, Sparkles, ShieldCheck } from 'lucide-react';

export default function PaymentsPage() {
  const metrics = [
    { title: 'Gross Volume', value: '$84,200.00', change: '+12.4%', trend: true },
    { title: 'SaaS MRR', value: '$8,400.00', change: '+5.2%', trend: true },
    { title: 'Avg Ticket', value: '$2,105.00', change: '-1.2%', trend: false },
    { title: 'Failed Charges', value: '0.00%', change: '0% change', trend: null },
  ];

  const transactions = [
    { id: 'txn_1029', desc: 'SaaS Subscription Plan', email: 'billing@apple.com', amount: '+$800.00', type: 'STRIPE_CHARGE' },
    { id: 'txn_1028', desc: 'Enterprise Core API Access', email: 'finance@meta.com', amount: '+$4,200.00', type: 'STRIPE_CHARGE' },
    { id: 'txn_1027', desc: 'Credit Settlement Settlement', email: 'ledger@stripe.com', amount: '-$1,200.00', type: 'STRIPE_PAYOUT' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <CreditCard className="h-6 w-6 text-indigo-400" />
            Transaction Ledger
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Realtime audit log for processed Stripe payments, charges, and settlement accounts.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-slate-100 rounded-xl transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98]">
          <Sparkles className="h-4 w-4" />
          Stripe Checkout Sandbox
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.title} className="p-5 border border-slate-900 bg-slate-900/10 rounded-2xl">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">{m.title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-lg font-bold text-slate-200">{m.value}</p>
              <span className={`text-[10px] font-semibold ${
                m.trend === true
                  ? 'text-emerald-400'
                  : m.trend === false
                  ? 'text-rose-400'
                  : 'text-slate-500'
              }`}>
                {m.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main split dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction Ledger Table */}
        <div className="lg:col-span-2 border border-slate-900 bg-slate-950 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="px-6 py-4 border-b border-slate-900 bg-slate-900/10">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payments Stream</h2>
          </div>
          <div className="divide-y divide-slate-900">
            {transactions.map((t) => (
              <div key={t.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-900/10 transition-colors">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-200 truncate">{t.desc}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{t.email} • {t.id}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-bold ${t.amount.startsWith('+') ? 'text-emerald-400' : 'text-slate-300'}`}>
                    {t.amount}
                  </span>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 mt-1 bg-indigo-500/5 px-1.5 py-0.5 rounded border border-indigo-500/10 inline-block">
                    {t.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stripe status module */}
        <div className="p-6 border border-slate-900 bg-slate-900/20 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2">PCI Compliant Terminal</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your merchant connection is encrypted directly with Stripe PCI standards. No cardholder data touches your server.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-900 mt-6 flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Stripe API Status</span>
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
