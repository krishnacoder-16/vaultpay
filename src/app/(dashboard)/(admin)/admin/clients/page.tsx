'use client';

import React from 'react';
import { Users, Plus, ArrowDownToLine, ShieldCheck } from 'lucide-react';

export default function AdminClientsPage() {
  const clients = [
    { id: 'cli_01', name: 'Acme Global Corp', email: 'billing@acme.com', plan: 'Enterprise SaaS', status: 'ACTIVE', spent: '$128,400.00' },
    { id: 'cli_02', name: 'Stark Industries', email: 'finance@stark.com', plan: 'Enterprise API', status: 'ACTIVE', spent: '$84,200.00' },
    { id: 'cli_03', name: 'Wayne Enterprise', email: 'ledgers@wayne.com', plan: 'Custom SLA', status: 'ACTIVE', spent: '$94,000.00' },
    { id: 'cli_04', name: 'LexCorp Ventures', email: 'billing@lexcorp.com', plan: 'Basic Core License', status: 'SUSPENDED', spent: '$12,300.00' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="h-5.5 w-5.5 text-violet-600" />
            Merchant Clients Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage billing agreements, subscription accounts, and payout profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm">
            <ArrowDownToLine className="h-4 w-4" />
            Export Directory
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-violet-600 hover:bg-violet-750 text-xs font-bold text-white rounded-lg transition-all shadow-sm shadow-violet-600/10 active:scale-[0.98]">
            <Plus className="h-4 w-4" />
            Add Client Account
          </button>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01),0_4px_12px_rgba(148,163,184,0.04)]">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Merchant Profiles</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="px-6 py-3.5 text-[10px]">Client ID</th>
                <th className="px-6 py-3.5 text-[10px]">Company Name</th>
                <th className="px-6 py-3.5 text-[10px]">Primary Contact</th>
                <th className="px-6 py-3.5 text-[10px]">Agreement tier</th>
                <th className="px-6 py-3.5 text-[10px] text-right">Settled Volume</th>
                <th className="px-6 py-3.5 text-[10px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((cli) => (
                <tr key={cli.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 font-mono">{cli.id}</td>
                  <td className="px-6 py-4 text-slate-900 font-bold">{cli.name}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{cli.email}</td>
                  <td className="px-6 py-4 text-slate-600 font-semibold">{cli.plan}</td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900 tracking-tight">{cli.spent}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                      cli.status === 'ACTIVE'
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                        : 'bg-rose-50 border-rose-100 text-rose-700'
                    }`}>
                      {cli.status}
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
