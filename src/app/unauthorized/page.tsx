'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12 text-slate-100">
      {/* Decorative radial background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md border border-slate-900 bg-slate-900/40 backdrop-blur-xl p-8 rounded-2xl text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 mb-6">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Access Restricted
        </h1>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          Your credentials do not grant access to this administrative section. Please return to the standard client dashboard or contact security compliance.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-900/60">
          <Link
            href="/invoices"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-slate-200 border border-slate-800 transition-all hover:bg-slate-800 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
