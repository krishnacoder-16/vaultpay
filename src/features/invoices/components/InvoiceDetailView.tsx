'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoiceStore, Invoice } from '../stores/use-invoice-store';
import { useDownloadMutation } from '../hooks/use-download-mutation';
import { useCheckoutMutation } from '@/features/payments/hooks/use-checkout-mutation';
import { 
  ArrowLeft, 
  Download, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2, 
  FileText, 
  Check,
  X,
  History,
  Building2
} from 'lucide-react';

interface InvoiceDetailViewProps {
  invoiceId: string;
  role: 'CLIENT' | 'ADMIN';
}

export function InvoiceDetailView({ invoiceId, role }: InvoiceDetailViewProps) {
  const router = useRouter();
  const { invoices } = useInvoiceStore();
  const downloadMutation = useDownloadMutation();
  const checkoutMutation = useCheckoutMutation();

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | null }>({
    message: '',
    type: null,
  });

  // Find the invoice in the live store
  const invoice = invoices.find((inv) => inv.id === invoiceId);

  if (!invoice) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-center">
        <AlertTriangle className="h-10 w-10 text-rose-500 mx-auto mb-4" />
        <h2 className="text-base font-bold text-slate-900">Document Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          The billing statement with ID <span className="font-mono bg-slate-100 px-1 py-0.5 rounded border border-slate-200">{invoiceId}</span> could not be found in our billing register.
        </p>
        <button
          onClick={() => router.push(role === 'ADMIN' ? '/admin/dashboard' : '/invoices')}
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-all border border-indigo-100 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </button>
      </div>
    );
  }

  // Parse amounts
  const subtotalAmount = parseFloat(invoice.amount.replace('$', '').replace(',', ''));
  const taxAmount = subtotalAmount * 0.1; // 10% standard rate
  const totalAmount = subtotalAmount + taxAmount;

  const formattedSubtotal = `$${subtotalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const formattedTax = `$${taxAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  const formattedTotal = `$${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

  // Professional Customer Addresses Mock Data
  const getBillingAddress = (entity: string) => {
    switch (entity) {
      case 'Acme Global Corp':
        return {
          address: '123 Innovation Way, Suite 400',
          city: 'San Francisco, CA 94107',
          email: 'accounts@acme-global.com',
          company: 'Acme Global Corporation'
        };
      case 'Stark Industries':
        return {
          address: '10880 Wilshire Blvd, Penthouse A',
          city: 'Los Angeles, CA 90024',
          email: 'billing@stark.com',
          company: 'Stark Industries, Inc.'
        };
      case 'Wayne Enterprise':
        return {
          address: '1007 Mountain Drive',
          city: 'Gotham City, NJ 07001',
          email: 'finance@waynecorp.com',
          company: 'Wayne Enterprises'
        };
      case 'LexCorp Ventures':
        return {
          address: '350 Fifth Ave, Floor 72',
          city: 'New York, NY 10118',
          email: 'treasury@lexcorp.com',
          company: 'LexCorp Ventures LLC'
        };
      default:
        return {
          address: '900 Metro Boulevard, Building 4',
          city: 'Silicon Valley, CA 94025',
          email: 'accounting@client-corp.com',
          company: entity
        };
    }
  };

  const clientAddress = getBillingAddress(invoice.billingEntity);

  const handleDownload = async (isReceipt: boolean) => {
    try {
      await downloadMutation.mutateAsync({ invoice, isReceipt });
      setToast({
        message: `${isReceipt ? 'Receipt' : 'Invoice'} PDF downloaded successfully.`,
        type: 'success',
      });
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setToast((prev) => (prev.type === 'success' ? { message: '', type: null } : prev));
      }, 4000);
    } catch (err: any) {
      setToast({
        message: err.message || 'Unable to download invoice PDF.',
        type: 'error',
      });
    }
  };

  const handlePayInvoice = async () => {
    if (checkoutMutation.isPending) return;
    try {
      const response = await checkoutMutation.mutateAsync({ invoiceId: invoice.id });
      router.push(response.redirectUrl);
    } catch (err: any) {
      setToast({
        message: err.message || 'Unable to initialize payment checkout.',
        type: 'error',
      });
    }
  };

  // Determine back navigation path
  const handleBackNavigation = () => {
    if (role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/invoices');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
      
      {/* Toast Notification Box */}
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
              {toast.type === 'success' ? <Check className="h-4.5 w-4.5" /> : <AlertTriangle className="h-4.5 w-4.5" />}
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

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 bg-white border border-slate-200/80 rounded-2xl px-6 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
        <button
          onClick={handleBackNavigation}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Invoices
        </button>

        <div className="flex flex-wrap items-center gap-3">
          
          {/* Status-Based Actions: Download Triggers */}
          {invoice.status === 'PAID' && (
            <button
              onClick={() => handleDownload(true)}
              disabled={downloadMutation.isPending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl px-4 py-2 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloadMutation.isPending && downloadMutation.variables?.isReceipt ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-3.5 w-3.5" />
                  Download Receipt
                </>
              )}
            </button>
          )}

          <button
            onClick={() => handleDownload(false)}
            disabled={downloadMutation.isPending}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloadMutation.isPending && !downloadMutation.variables?.isReceipt ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Preparing Document...
              </>
            ) : (
              <>
                <Download className="h-3.5 w-3.5" />
                Download PDF
              </>
            )}
          </button>

          {/* Client-Only Payment Actions */}
          {role === 'CLIENT' && invoice.status === 'AWAITING' && (
            <button
              onClick={handlePayInvoice}
              disabled={checkoutMutation.isPending || downloadMutation.isPending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Securing...
                </>
              ) : (
                <>
                  <CreditCard className="h-3.5 w-3.5" />
                  Pay Invoice
                </>
              )}
            </button>
          )}

          {role === 'CLIENT' && invoice.status === 'OVERDUE' && (
            <button
              onClick={handlePayInvoice}
              disabled={checkoutMutation.isPending || downloadMutation.isPending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm"
            >
              {checkoutMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Securing...
                </>
              ) : (
                <>
                  <CreditCard className="h-3.5 w-3.5" />
                  Pay Now
                </>
              )}
            </button>
          )}

          {role === 'CLIENT' && invoice.status === 'PROCESSING' && (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 cursor-not-allowed">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Settling Payment...
            </span>
          )}

        </div>
      </div>

      {/* Invoice Document Body: Paper Aesthetic */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01),0_10px_32px_rgba(148,163,184,0.03)] p-8 sm:p-12 space-y-10 relative overflow-hidden">
        
        {/* Subtle Watermark on paid sheets */}
        {invoice.status === 'PAID' && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-[6px] border-emerald-500/10 text-emerald-500/10 font-black tracking-[0.2em] uppercase text-5xl select-none pointer-events-none rounded-2xl px-6 py-3 rotate-12 z-0 font-sans">
            Settled & Paid
          </div>
        )}

        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-100 pb-8 z-10 relative">
          <div className="space-y-3">
            {/* Professional Biller branding */}
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm select-none shrink-0">
                V
              </div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">VaultPay Financial</span>
            </div>
            
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Billing Operations Department</p>
          </div>

          <div className="text-left sm:text-right space-y-2">
            <h1 className="text-lg font-bold text-slate-900 flex items-center sm:justify-end gap-1.5">
              <FileText className="h-4.5 w-4.5 text-slate-400" />
              {invoice.id}
            </h1>
            <div className="flex sm:justify-end">
              <span className={`inline-flex text-[9px] font-bold px-2.5 py-0.5 rounded-full border ${
                invoice.status === 'PAID'
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : invoice.status === 'AWAITING'
                  ? 'bg-amber-50 border-amber-100 text-amber-700'
                  : invoice.status === 'OVERDUE'
                  ? 'bg-rose-50 border-rose-100 text-rose-700'
                  : 'bg-slate-100 border-slate-200 text-slate-500 animate-pulse'
              }`}>
                {invoice.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:flex sm:items-center sm:justify-end gap-x-4 gap-y-1 text-slate-500 text-[11px]">
              <div>
                <span className="font-semibold text-slate-400 mr-1">Issued:</span>
                <span className="font-medium text-slate-700">{invoice.date}</span>
              </div>
              <div className="sm:border-l sm:border-slate-200 sm:pl-4">
                <span className="font-semibold text-slate-400 mr-1">Due:</span>
                <span className="font-medium text-slate-700">Immediate</span>
              </div>
            </div>
          </div>
        </div>

        {/* Client & Billing Info Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-slate-100 pb-8 z-10 relative">
          <div className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              Merchant Entity
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">VaultPay Financial Core, Inc.</p>
              <p>100 Pine Street, Suite 2400</p>
              <p>San Francisco, CA 94111</p>
              <p className="text-indigo-600 font-medium">billing@vaultpay.financial</p>
            </div>
          </div>

          <div className="space-y-2 text-left">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Client Recipient</h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">{clientAddress.company}</p>
              <p>{clientAddress.address}</p>
              <p>{clientAddress.city}</p>
              <p className="text-slate-500">{clientAddress.email}</p>
            </div>
          </div>
        </div>

        {/* Service Breakdown Ledger Table */}
        <div className="space-y-3 z-10 relative">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Statement breakdown</h3>
          <div className="overflow-hidden border border-slate-200/60 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="px-5 py-3 text-[10px] font-bold">Line Items & Services</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-center w-20">Qty</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-right w-36">Rate</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-right w-36">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr className="text-slate-700">
                  <td className="px-5 py-4 font-bold text-slate-800">
                    {invoice.type}
                    <p className="text-[10px] text-slate-400 font-medium mt-1">Core node license integration & professional API SLA metrics mapping.</p>
                  </td>
                  <td className="px-5 py-4 text-center font-bold text-slate-500">1</td>
                  <td className="px-5 py-4 text-right font-medium text-slate-700">{invoice.amount}</td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900 tracking-tight">{invoice.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end pt-2 z-10 relative">
          <div className="w-full sm:w-80 space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-500 font-medium">
              <span>Ledger Subtotal:</span>
              <span className="font-bold text-slate-800">{formattedSubtotal}</span>
            </div>
            
            <div className="flex justify-between text-slate-500 font-medium">
              <span>SaaS Compliance Tax / VAT (10.0%):</span>
              <span className="font-bold text-slate-800">{formattedTax}</span>
            </div>
            
            <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-slate-900">
              <span className="font-bold uppercase tracking-wider text-[10px]">Accounts Total due:</span>
              <span className="text-base font-black tracking-tight">{formattedTotal}</span>
            </div>
          </div>
        </div>

        {/* Optional Activity Timeline */}
        <div className="border-t border-slate-100 pt-8 z-10 relative">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-4">
            <History className="h-3.5 w-3.5 text-slate-400" />
            Invoice History & Audit Stream
          </h3>
          <div className="space-y-3.5 pl-2 text-xs">
            
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ring-4 ring-slate-100 shrink-0"></div>
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-500 font-medium">Billing Statement Compiled</span>
                <span className="text-[10px] text-slate-400 font-semibold">{invoice.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-300 ring-4 ring-slate-100 shrink-0"></div>
              <div className="flex items-center justify-between w-full">
                <span className="text-slate-500 font-medium">Document accessed & verified on secure ledger</span>
                <span className="text-[10px] text-slate-400 font-semibold">Today (Live)</span>
              </div>
            </div>

            {invoice.status === 'PAID' && (
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 shrink-0"></div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-emerald-700 font-bold">Payment settled & checkout transaction registered</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Completed</span>
                </div>
              </div>
            )}
            
            {invoice.status === 'PROCESSING' && (
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-400 ring-4 ring-slate-100 shrink-0 animate-ping"></div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-slate-500 font-medium">Card gateway processing checkout confirmation...</span>
                  <span className="text-[10px] text-slate-400 font-semibold animate-pulse">Pending Gateway</span>
                </div>
              </div>
            )}

            {invoice.status === 'OVERDUE' && (
              <div className="flex items-center gap-3">
                <div className="h-1.5 w-1.5 rounded-full bg-rose-500 ring-4 ring-rose-100 shrink-0"></div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-rose-700 font-bold">Statement past standard due term limits</span>
                  <span className="text-[10px] text-rose-600 font-semibold">Action Required</span>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
