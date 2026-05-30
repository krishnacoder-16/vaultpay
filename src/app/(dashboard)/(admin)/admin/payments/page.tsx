'use client';

import React, { useState } from 'react';
import { useInvoiceStore } from '@/features/invoices/stores/use-invoice-store';
import { 
  CreditCard, 
  ArrowDownToLine, 
  ShieldCheck, 
  AlertCircle, 
  Loader2, 
  X, 
  Check 
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { invoices } = useInvoiceStore();
  
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev.type === type ? { message: '', type: null } : prev));
    }, 4000);
  };

  // Base historical transactions
  const baseTransactions = [
    { id: 'txn_1029', client: 'Acme Global Corp', desc: 'SaaS Agreement Settlement', amount: '+$12,500.00', status: 'SETTLED' },
    { id: 'txn_1028', client: 'Stark Industries', desc: 'API Enterprise Charge', amount: '+$8,400.00', status: 'SETTLED' },
    { id: 'txn_1027', client: 'Wayne Enterprise', desc: 'Custom SLA Settlement', amount: '+$19,200.00', status: 'PENDING' },
    { id: 'txn_1026', client: 'LexCorp Ventures', desc: 'Core License Fee Refund', amount: '-$4,300.00', status: 'SETTLED' },
  ];

  // Dynamically compile payments from live PAID invoices to synchronize checkout payments instantly
  const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
  
  // Format live paid invoices as settled transactions
  const liveTransactions = paidInvoices.map((inv) => {
    const numericId = inv.id.replace('INV-2026-', '');
    return {
      id: `txn_${numericId}`,
      client: inv.billingEntity,
      desc: `${inv.type} Payment Settlement`,
      amount: `+${inv.amount}`,
      status: 'SETTLED' as const,
    };
  });

  // Merge live transactions and filter out duplicate invoice matches from base transactions to keep the ledger pristine
  const mergedTransactions = [
    ...liveTransactions,
    ...baseTransactions.filter(
      (base) => !liveTransactions.some((live) => live.client === base.client && live.amount === base.amount)
    ),
  ];

  // CSV Payments Export Compiler
  const handleExportCSV = async () => {
    if (mergedTransactions.length === 0) {
      showToast('No payment transactions available.', 'error');
      return;
    }

    setIsExporting(true);

    try {
      // Simulate remote operational export processing delay (800ms)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const shouldFail = Math.random() < 0.03;
      if (shouldFail) {
        throw new Error('Failed to generate export. Please try again.');
      }

      const csvHeaders = 'Transaction ID,Client,Description,Amount,Status\n';
      const csvRows = mergedTransactions
        .map(
          (t) =>
            `"${t.id}","${t.client}","${t.desc}","${t.amount}","${t.status}"`
        )
        .join('\n');

      const csvContent = csvHeaders + csvRows;

      // Browser-native Blob download trigger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `vaultpay-payments-stream.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Payments stream exported successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate export. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Toast Notice Banner */}
      {toast.type && (
        <div className={`p-4 border rounded-2xl flex items-center justify-between shadow-sm transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
          toast.type === 'success'
            ? 'border-emerald-100 bg-emerald-50/50 text-emerald-800'
            : 'border-rose-100 bg-rose-50/50 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg shadow-sm shrink-0 ${
              toast.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {toast.type === 'success' ? <Check className="h-4.5 w-4.5" /> : <AlertCircle className="h-4.5 w-4.5" />}
            </div>
            <p className="text-xs font-bold leading-normal">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast({ message: '', type: null })}
            className={`p-1 transition-colors ${
              toast.type === 'success' ? 'text-emerald-500 hover:text-emerald-700' : 'text-rose-500 hover:text-rose-700'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <CreditCard className="h-5.5 w-5.5 text-violet-600" />
            Payments Overview
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Realtime audit logs of all global Stripe charges, payout transfers, and billing settlements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            disabled={isExporting}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
          >
            {isExporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                Compiling CSV...
              </>
            ) : (
              <>
                <ArrowDownToLine className="h-4 w-4" />
                Export Payments CSV
              </>
            )}
          </button>
        </div>
      </div>

      {/* Split Operations panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Ledger Stream / Transaction Summary */}
        <div className="lg:col-span-2 border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex flex-col">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/40">
            <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transaction Summary</h2>
          </div>
          
          {mergedTransactions.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium bg-white">
              No transactions recorded in the payment ledger.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 bg-white">
              {mergedTransactions.map((t) => (
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
          )}
        </div>

        {/* Settlement compliance widget */}
        <div className="p-6 border border-slate-200/80 bg-white rounded-2xl flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-4 shadow-sm">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Settlement Operations</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
              Payout runs are settled directly into customer routing files daily at 00:00 UTC. Global dispute limits are below 0.01%.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Settlement Status</span>
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
