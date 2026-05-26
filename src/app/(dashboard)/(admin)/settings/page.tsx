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
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Settings className="h-6 w-6 text-violet-400" />
          Compliance Console
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Authorized administrative portal for VaultPay systems controls and security configurations.
        </p>
      </div>

      {/* Info Warning banner */}
      <div className="p-4 border border-violet-500/20 bg-violet-500/5 rounded-2xl flex gap-3 text-violet-300">
        <Info className="h-5 w-5 shrink-0" />
        <div className="text-xs leading-relaxed">
          <p className="font-bold">Administrative Session Active</p>
          <p className="text-slate-400 mt-0.5">
            Any alterations to these system-level parameters will propagate to all merchant client instances immediately.
          </p>
        </div>
      </div>

      {/* Admin Toggles Card */}
      <div className="border border-slate-900 bg-slate-950 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-900 bg-slate-900/10 flex items-center gap-2 text-slate-300">
          <Shield className="h-4.5 w-4.5 text-violet-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider">Gatekeeper Controls</h2>
        </div>

        <div className="divide-y divide-slate-900">
          {/* Toggle 1 */}
          <div className="p-6 flex items-center justify-between hover:bg-slate-900/10 transition-colors">
            <div className="space-y-1 pr-4">
              <p className="text-xs font-bold text-slate-200">Allow Public Stripe Sandbox Checkout</p>
              <p className="text-[10px] text-slate-500">
                Permits clients to execute mock checkouts without a valid merchant subscription key.
              </p>
            </div>
            <button
              onClick={() => setAllowPublicCheckouts(!allowPublicCheckouts)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {allowPublicCheckouts ? (
                <ToggleRight className="h-9 w-9 text-violet-400" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-slate-600" />
              )}
            </button>
          </div>

          {/* Toggle 2 */}
          <div className="p-6 flex items-center justify-between hover:bg-slate-900/10 transition-colors">
            <div className="space-y-1 pr-4">
              <p className="text-xs font-bold text-slate-200">Strict Edge-Level RBAC Enforcement</p>
              <p className="text-[10px] text-slate-500">
                Secures paths through Edge Middlewares instead of standard local-layout level checks.
              </p>
            </div>
            <button
              onClick={() => setStrictRbacSession(!strictRbacSession)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {strictRbacSession ? (
                <ToggleRight className="h-9 w-9 text-violet-400" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-slate-600" />
              )}
            </button>
          </div>

          {/* Toggle 3 */}
          <div className="p-6 flex items-center justify-between hover:bg-slate-900/10 transition-colors">
            <div className="space-y-1 pr-4">
              <p className="text-xs font-bold text-slate-200">Automatic Billing Payout Reconciliation</p>
              <p className="text-[10px] text-slate-500">
                Enables background ledger audit pipelines with Stripe webhooks.
              </p>
            </div>
            <button
              onClick={() => setAutoBillingLedgerSync(!autoBillingLedgerSync)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              {autoBillingLedgerSync ? (
                <ToggleRight className="h-9 w-9 text-violet-400" />
              ) : (
                <ToggleLeft className="h-9 w-9 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tech spec blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 border border-slate-900 bg-slate-900/10 rounded-2xl flex gap-3.5">
          <Server className="h-5 w-5 text-indigo-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Compute Infrastructure</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              Serving from AWS us-east-1 and Vercel edge endpoints. Node runtime v20.12.0.
            </p>
          </div>
        </div>

        <div className="p-5 border border-slate-900 bg-slate-900/10 rounded-2xl flex gap-3.5">
          <Key className="h-5 w-5 text-indigo-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Key Management</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              HSM key vault active. Stripe sandbox keys rotated every 30 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
