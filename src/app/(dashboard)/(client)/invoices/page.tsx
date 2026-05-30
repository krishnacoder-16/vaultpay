'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInvoiceStore } from '@/features/invoices/stores/use-invoice-store';
import { useCheckoutMutation } from '@/features/payments/hooks/use-checkout-mutation';
import { useDownloadMutation } from '@/features/invoices/hooks/use-download-mutation';
import { FileText, Receipt, Clock, CheckCircle2, AlertCircle, Loader2, Sparkles, X, ChevronRight } from 'lucide-react';

export default function InvoicesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { invoices } = useInvoiceStore();
  const checkoutMutation = useCheckoutMutation();
  const downloadMutation = useDownloadMutation();

  // Success toast/banner state
  const [successBanner, setSuccessBanner] = useState<{ visible: boolean; invId: string | null }>({
    visible: false,
    invId: null,
  });

  const [downloadBanner, setDownloadBanner] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });

  useEffect(() => {
    const successParam = searchParams.get('success');
    const invIdParam = searchParams.get('invId');

    if (successParam === 'true' && invIdParam) {
      setSuccessBanner({ visible: true, invId: invIdParam });

      // Clear search query parameters to keep the URL clean
      const newUrl = window.location.pathname;
      window.history.replaceState(null, '', newUrl);
    }
  }, [searchParams]);

  // Calculate client-specific live metrics
  const totalVolume = invoices
    .filter((inv) => inv.status === 'PAID')
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);

  const awaitingVolume = invoices
    .filter((inv) => inv.status === 'AWAITING' || inv.status === 'OVERDUE')
    .reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);

  const settledReceiptsCount = invoices.filter((inv) => inv.status === 'PAID').length;
  const overdueCount = invoices.filter((inv) => inv.status === 'OVERDUE').length;

  const metrics = [
    { title: 'Gross Balance Settled', value: `$${totalVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Receipt, color: 'text-indigo-600 border-indigo-100 bg-indigo-50/50' },
    { title: 'Awaiting Settlement', value: `$${awaitingVolume.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Clock, color: 'text-amber-600 border-amber-100 bg-amber-50/50' },
    { title: 'Settled Receipts', value: `${settledReceiptsCount} bills`, icon: CheckCircle2, color: 'text-emerald-600 border-emerald-100 bg-emerald-50/50' },
    { title: 'Overdue Adjustments', value: `${overdueCount} items`, icon: AlertCircle, color: 'text-rose-600 border-rose-100 bg-rose-50/50' },
  ];

  const handlePayInvoice = async (invoiceId: string) => {
    // Safety check: Prevent click if another mutation is already processing
    if (checkoutMutation.isPending) return;

    try {
      const response = await checkoutMutation.mutateAsync({ invoiceId });
      // Safely redirect out of the dashboard layout to the Stripe Checkout Simulator page
      router.push(response.redirectUrl);
    } catch {
      // TanStack Query handles local error state, which we will display gracefully
    }
  };

  const handleDownloadReceipt = async (invoiceId: string) => {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;
    try {
      await downloadMutation.mutateAsync({ invoice: inv, isReceipt: true });
      setDownloadBanner({
        message: 'Receipt PDF downloaded successfully.',
        type: 'success',
      });
      setTimeout(() => {
        setDownloadBanner(prev => prev.type === 'success' ? { message: '', type: null } : prev);
      }, 4000);
    } catch (err: any) {
      setDownloadBanner({
        message: err.message || 'Unable to download receipt PDF.',
        type: 'error',
      });
    }
  };

  const handleRowClick = (id: string, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't navigate if clicking a button or another interactive element
    if (target.closest('button') || target.closest('a')) {
      return;
    }
    router.push(`/invoices/${id}`);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Download Success/Error Toast */}
      {downloadBanner.type && (
        <div className={`p-4 border rounded-2xl flex items-center justify-between shadow-sm transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
          downloadBanner.type === 'success'
            ? 'border-emerald-100 bg-emerald-50/50 text-emerald-800'
            : 'border-rose-100 bg-rose-50/50 text-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`flex h-7 w-7 items-center justify-center rounded-lg shadow-sm shrink-0 ${
              downloadBanner.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}>
              {downloadBanner.type === 'success' ? <CheckCircle2 className="h-4.5 w-4.5" /> : <AlertCircle className="h-4.5 w-4.5" />}
            </div>
            <p className="text-xs font-bold leading-normal">{downloadBanner.message}</p>
          </div>
          <button
            onClick={() => setDownloadBanner({ message: '', type: null })}
            className={`p-1 transition-colors ${
              downloadBanner.type === 'success' ? 'text-emerald-500 hover:text-emerald-700' : 'text-rose-500 hover:text-rose-700'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Success Notification Banner */}
      {successBanner.visible && (
        <div className="p-4 border border-emerald-100 bg-emerald-50/50 rounded-2xl flex items-center justify-between text-emerald-800 shadow-sm transition-all animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 shadow-sm shrink-0">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
            <p className="text-xs font-bold leading-normal">
              Payment successful. Statement <span className="font-mono text-[11px] bg-emerald-100/50 px-1.5 py-0.5 rounded border border-emerald-100/20">{successBanner.invId}</span> has been marked as settled.
            </p>
          </div>
          <button
            onClick={() => setSuccessBanner({ visible: false, invId: null })}
            className="text-emerald-500 hover:text-emerald-700 transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* TanStack Mutation Error Banner */}
      {checkoutMutation.isError && (
        <div className="p-4 border border-rose-100 bg-rose-50/50 rounded-2xl flex items-center justify-between text-rose-800 shadow-sm animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-700 shadow-sm shrink-0">
              <AlertCircle className="h-4.5 w-4.5" />
            </div>
            <p className="text-xs font-bold leading-normal">
              {checkoutMutation.error.message || 'Unable to initialize checkout. Your card was not charged.'}
            </p>
          </div>
          <button
            onClick={() => checkoutMutation.reset()}
            className="text-rose-500 hover:text-rose-700 transition-colors p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2.5">
            <FileText className="h-5.5 w-5.5 text-indigo-600" />
            Billing Statements
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            View active statements, manage subscription fees, and download receipt documents.
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
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

      {/* Customer Billing Ledger Table Card */}
      <div className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01),0_4px_12px_rgba(148,163,184,0.04)]">
        <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/40 flex items-center justify-between">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Account Statements</h2>
          <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
            Secure Portal
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                <th className="px-6 py-3.5 text-[10px]">Statement ID</th>
                <th className="px-6 py-3.5 text-[10px]">Billing Entity</th>
                <th className="px-6 py-3.5 text-[10px]">Settlement Date</th>
                <th className="px-6 py-3.5 text-[10px] text-right">Amount Due</th>
                <th className="px-6 py-3.5 text-[10px] text-center">Status</th>
                <th className="px-6 py-3.5 text-[10px] text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {invoices.map((inv) => {
                const isThisPending = checkoutMutation.isPending && checkoutMutation.variables?.invoiceId === inv.id;
                const isAnyPending = checkoutMutation.isPending;

                const isDownloadingThis = downloadMutation.isPending && downloadMutation.variables?.invoice.id === inv.id;

                return (
                  <tr 
                    key={inv.id} 
                    onClick={(e) => handleRowClick(inv.id, e)}
                    className="hover:bg-slate-50/70 active:bg-slate-100/50 cursor-pointer transition-all duration-150 group"
                    title="Click to view full invoice & receipt details"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
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
                    <td className="px-6 py-4 text-right pr-8">
                      {/* Dynamic, status-based checkout actions with strict button locking */}
                      {inv.status === 'PAID' && (
                        <button
                          onClick={() => handleDownloadReceipt(inv.id)}
                          disabled={isDownloadingThis}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/60 px-3 py-1.5 rounded-lg border border-emerald-100 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                        >
                          {isDownloadingThis ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin text-emerald-600" />
                              Downloading...
                            </>
                          ) : (
                            'Download Receipt'
                          )}
                        </button>
                      )}

                      {inv.status === 'AWAITING' && (
                        <button
                          onClick={() => handlePayInvoice(inv.id)}
                          disabled={isAnyPending}
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm shadow-indigo-600/10 active:scale-[0.98]"
                        >
                          {isThisPending ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin text-slate-200" />
                              Securing...
                            </>
                          ) : (
                            'Pay Invoice'
                          )}
                        </button>
                      )}

                      {inv.status === 'OVERDUE' && (
                        <button
                          onClick={() => handlePayInvoice(inv.id)}
                          disabled={isAnyPending}
                          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed px-3.5 py-1.5 rounded-lg transition-all cursor-pointer shadow-sm shadow-rose-600/10 active:scale-[0.98]"
                        >
                          {isThisPending ? (
                            <>
                              <Loader2 className="h-3 w-3 animate-spin text-slate-200" />
                              Securing...
                            </>
                          ) : (
                            'Pay Now'
                          )}
                        </button>
                      )}

                      {inv.status === 'PROCESSING' && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 cursor-not-allowed select-none">
                          <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                          Processing...
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
