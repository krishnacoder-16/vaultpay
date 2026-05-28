'use client';

import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';

export default function PaymentsPage() {
  const metrics = [
    { title: 'Total Settled', value: '$84,200.00', change: 'Payments history', trend: true },
    { title: 'Last Payment', value: '$8,400.00', change: 'May 24, 2026', trend: true },
    { title: 'Balance Outstanding', value: '$12,400.00', change: 'Awaiting SLA', trend: false },
    { title: 'Processing Payouts', value: '$0.00', change: 'Current Month', trend: null },
  ];

  const transactions = [
    { id: 'txn_1029', desc: 'SaaS Subscription Plan', email: 'billing@apple.com', amount: '+$800.00', type: 'STRIPE_CHARGE' },
    { id: 'txn_1028', desc: 'Enterprise Core API Access', email: 'finance@meta.com', amount: '+$4,200.00', type: 'STRIPE_CHARGE' },
    { id: 'txn_1027', desc: 'Credit Settlement Adjustment', email: 'ledger@stripe.com', amount: '-$1,200.00', type: 'STRIPE_PAYOUT' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <CreditCard className="h-5.5 w-5.5 text-indigo-600" />
            Payment History
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Review past settlement events, SaaS subscription deductions, and billing payments.
          </p>
        </div>
      </div>

      {/* Metrics Grid - Restructured for visual hierarchy and bold values */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m) => (
          <div key={m.title} className="p-6 border border-slate-200/60 bg-white rounded-2xl shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_4px_16px_rgba(148,163,184,0.06)]">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3.5">{m.title}</p>
            <div className="space-y-1">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none">{m.value}</p>
              <div className="flex items-baseline justify-between pt-1">
                <span className={`text-[10px] font-bold ${
                  m.trend === true
                    ? 'text-emerald-600'
                    : m.trend === false
                    ? 'text-amber-600'
                    : 'text-slate-400'
                }`}>
                  {m.change}
                </span>
                <span className="text-[8px] font-extrabold uppercase tracking-wider text-slate-300">Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main split dashboard content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Transaction Ledger Table */}
        <div className="lg:col-span-2 border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01),0_4px_12px_rgba(148,163,184,0.04)] flex flex-col">
          <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/40">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Statement Settlements</h2>
          </div>
          <div className="divide-y divide-slate-100 bg-white">
            {transactions.map((t) => (
              <div key={t.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50/70 active:bg-slate-100/50 cursor-pointer transition-all duration-150 group">
                <div className="min-w-0 pr-4">
                  <p className="text-xs font-bold text-slate-900 truncate">{t.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{t.email} • <span className="font-mono">{t.id}</span></p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold tracking-tight ${t.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {t.amount}
                  </span>
                  <div>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-indigo-600 mt-1 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 inline-block">
                      {t.type}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stripe status module */}
        <div className="p-6 border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-4 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Secure Payment Terminal</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Your merchant connection is encrypted directly with Stripe PCI standards. No cardholder data touches your server.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Terminal Encryption</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
