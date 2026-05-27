'use client';

import React, { useState } from 'react';
import { Settings, Shield, ToggleLeft, ToggleRight, Server, Key, Info } from 'lucide-react';

export default function AdminSettingsPage() {
  const [allowPublicCheckouts, setAllowPublicCheckouts] = useState(true);
  const [strictRbacSession, setStrictRbacSession] = useState(true);
  const [autoBillingLedgerSync, setAutoBillingLedgerSync] = useState(false);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
          <Settings className="h-5.5 w-5.5 text-violet-600" />
          Compliance Console
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Authorized administrative portal for VaultPay systems controls and security configurations.
        </p>
      </div>

      {/* Info Warning banner */}
      <div className="p-4 border border-violet-100 bg-violet-50/50 rounded-2xl flex gap-3 text-violet-800 shadow-sm">
        <Info className="h-5 w-5 text-violet-600 shrink-0" />
        <div className="text-xs leading-relaxed font-semibold">
          <p className="font-bold text-violet-900">Administrative Session Active</p>
          <p className="text-violet-700/80 mt-0.5 font-medium">
            Any alterations to these system-level parameters will propagate to all merchant client instances immediately.
          </p>
        </div>
      </div>

      {/* Admin Toggles Card */}
      <div className="border border-slate-200/85 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01),0_4px_12px_rgba(148,163,184,0.04)]">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40 flex items-center gap-2 text-slate-700">
          <Shield className="h-4.5 w-4.5 text-violet-600" />
          <h2 className="text-[11px] font-bold uppercase tracking-wider">Gatekeeper Controls</h2>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Toggle 1 */}
          <div className="p-6 flex items-center justify-between hover:bg-slate-50/20 transition-colors">
            <div className="space-y-1 pr-4">
              <p className="text-xs font-bold text-slate-900">Allow Public Stripe Sandbox Checkout</p>
              <p className="text-[10px] text-slate-500 font-medium">
                Permits clients to execute mock checkouts without a valid merchant subscription key.
              </p>
            </div>
            <button
              onClick={() => setAllowPublicCheckouts(!allowPublicCheckouts)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {allowPublicCheckouts ? (
                <ToggleRight className="h-9 w-9 text-violet-600" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-slate-300" />
              )}
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="p-6 flex items-center justify-between hover:bg-slate-50/20 transition-colors">
            <div className="space-y-1 pr-4">
              <p className="text-xs font-bold text-slate-900">Strict Edge-Level RBAC Enforcement</p>
              <p className="text-[10px] text-slate-500 font-medium">
                Secures paths through Edge Middlewares instead of standard local-layout level checks.
              </p>
            </div>
            <button
              onClick={() => setStrictRbacSession(!strictRbacSession)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {strictRbacSession ? (
                <ToggleRight className="h-9 w-9 text-violet-600" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-slate-300" />
              )}
            </button>
          </div>

          {/* Toggle 3 */}
          <div className="p-6 flex items-center justify-between hover:bg-slate-50/20 transition-colors">
            <div className="space-y-1 pr-4">
              <p className="text-xs font-bold text-slate-900">Automatic Billing Payout Reconciliation</p>
              <p className="text-[10px] text-slate-500 font-medium">
                Enables background ledger audit pipelines with Stripe webhooks.
              </p>
            </div>
            <button
              onClick={() => setAutoBillingLedgerSync(!autoBillingLedgerSync)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              {autoBillingLedgerSync ? (
                <ToggleRight className="h-9 w-9 text-violet-600" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tech spec blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 border border-slate-200/80 bg-white rounded-2xl flex gap-3.5 shadow-sm">
          <Server className="h-5 w-5 text-indigo-600 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Compute Infrastructure</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              Serving from AWS us-east-1 and Vercel edge endpoints. Node runtime v20.12.0.
            </p>
          </div>
        </div>

        <div className="p-5 border border-slate-200/80 bg-white rounded-2xl flex gap-3.5 shadow-sm">
          <Key className="h-5 w-5 text-indigo-600 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">Key Management</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
              HSM key vault active. Stripe sandbox keys rotated every 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
