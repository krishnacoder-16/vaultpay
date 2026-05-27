'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#fafbfc] px-6 py-12 text-slate-900">
      {/* Dots background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      {/* Decorative radial background light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md border border-slate-200/80 bg-white p-8 rounded-2xl text-center shadow-[0_1px_3px_rgba(0,0,0,0.02),0_12px_32px_rgba(148,163,184,0.08)] z-10">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 mb-6 shadow-sm">
          <ShieldAlert className="h-6 w-6" />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-slate-900">
          Access Restricted
        </h1>
        <p className="mt-3 text-xs font-semibold text-slate-500 leading-relaxed">
          Your credentials do not grant access to this administrative section. Please return to the standard client dashboard or contact security compliance.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <Link
            href="/invoices"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
