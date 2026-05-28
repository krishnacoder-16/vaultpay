'use client';

import React from 'react';
import { CreditCard, ArrowDownToLine, Sparkles, ShieldCheck } from 'lucide-react';

export default function AdminPaymentsPage() {
  const transactions = [
    { id: 'txn_1029', client: 'Acme Global Corp', desc: 'SaaS Agreement Settlement', amount: '+$12,500.00', status: 'SETTLED' },
    { id: 'txn_1028', client: 'Stark Industries', desc: 'API Enterprise Charge', amount: '+$8,400.00', status: 'SETTLED' },
    { id: 'txn_1027', client: 'Wayne Enterprise', desc: 'Custom SLA Settlement', amount: '+$19,200.00', status: 'PENDING' },
    { id: 'txn_1026', client: 'LexCorp Ventures', desc: 'Core License Fee Refund', amount: '-$4,300.00', status: 'SETTLED' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <CreditCard className="h-5.5 w-5.5 text-violet-600" />
            Global Payments Stream
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Realtime audit logs of all global Stripe charges, payout transfers, and billing settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            <ArrowDownToLine className="h-4 w-4" />
            Export Payments CSV
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-violet-600 hover:bg-violet-750 text-xs font-bold text-white rounded-lg transition-all shadow-sm shadow-indigo-600/10 active:scale-[0.98]">
            <Sparkles className="h-4 w-4" />
            Simulate Payout Run
          </button>
        </div>
      </div>

      {/* Split Operations panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ledger Stream */}
        <div className="lg:col-span-2 border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gross Transaction Feed</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <div key={t.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                <div className="min-w-0 pr-4">
                  <p className="text-xs font-bold text-slate-900 truncate">{t.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">{t.client} • <span className="font-mono">{t.id}</span></p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-xs font-bold tracking-tight ${t.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {t.amount}
                  </span>
                  <div>
                    <span className={`inline-block text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border mt-1 ${
                      t.status === 'SETTLED'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        : 'bg-amber-50 border-amber-100 text-amber-700'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stripe compliance widget */}
        <div className="p-6 border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-4 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Payout Operations</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Payout runs are settled directly into customer routing files daily at 00:00 UTC. Global dispute limits are below 0.01%.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Merchant Terminal Status</span>
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
