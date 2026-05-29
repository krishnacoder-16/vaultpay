'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useInvoiceStore } from '@/features/invoices/stores/use-invoice-store';
import { ShieldCheck, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const { invoices, markAsPaid } = useInvoiceStore();

  const invoiceId = params.invoiceId as string;
  const invoice = invoices.find((inv) => inv.id === invoiceId);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Card form states
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('•••');

  useEffect(() => {
    // If the invoice is invalid or already paid, route back immediately
    if (!invoice) {
      router.push('/invoices');
    }
  }, [invoice, router]);

  if (!invoice) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // 1. Simulate randomized bank API network delay (800ms - 2000ms)
      const latency = Math.floor(Math.random() * 1200) + 800;
      await new Promise((resolve) => setTimeout(resolve, latency));

      // 2. Simulate small mock settlement failure rate (3% for verification tests)
      const shouldFail = Math.random() < 0.03;
      if (shouldFail) {
        throw new Error('Payment declined by card issuer. Your card was not charged.');
      }

      // 3. Mark invoice as paid inside the global state store
      markAsPaid(invoice.id);

      // 4. Safely return back to client invoicing dashboard with settlement metadata
      router.push(`/invoices?success=true&invId=${invoice.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment failed. Please verify your details.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center p-4 sm:p-6 lg:p-8 text-slate-800">
      {/* Background Dots */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

      <div className="relative w-full max-w-4xl bg-white border border-slate-200/80 rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.01),0_12px_36px_rgba(148,163,184,0.08)] overflow-hidden grid grid-cols-1 md:grid-cols-2 z-10">
        
        {/* Left Column: Settlement Metadata Details */}
        <div className="p-8 sm:p-10 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-200/60 flex flex-col justify-between">
          <div className="space-y-6">
            {/* Back to invoices Link */}
            <button
              onClick={() => router.push('/invoices')}
              disabled={isProcessing}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Cancel and return
            </button>

            {/* Brand Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-slate-900">
                VaultPay <span className="text-indigo-600">Core</span>
              </span>
            </div>

            {/* Invoicing summary */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount Due</span>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                {invoice.amount}
              </p>
              <p className="text-xs text-slate-500 font-semibold pt-1">
                {invoice.type} • <span className="font-mono">{invoice.id}</span>
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-8 md:pt-0">
            <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />
              Gated Checkout Session
            </div>
            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
              Payments are resolved securely. Card credentials do not reside on our systems.
            </p>
          </div>
        </div>

        {/* Right Column: High-Trust Card Checkout Fields */}
        <div className="p-8 sm:p-10 flex flex-col justify-between">
          <form onSubmit={handlePayment} className="space-y-6">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Secure Card Details</h2>

            <div className="space-y-4">
              {/* Card Number Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Card Number
                </label>
                <input
                  type="text"
                  required
                  disabled={isProcessing}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-mono"
                />
              </div>

              {/* Expiry and CVC Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Expiration
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isProcessing}
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-mono"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    CVC
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isProcessing}
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    className="block w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 placeholder-slate-400 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-600 transition-all font-mono"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 leading-normal">
                {errorMessage}
              </div>
            )}

            {/* Submit checkout CTA */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-xl text-xs font-bold border border-transparent transition-all duration-200 shadow-md shadow-slate-900/5 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-200" />
                  Processing payment...
                </>
              ) : (
                <>
                  Pay {invoice.amount}
                </>
              )}
            </button>
          </form>

          {/* PCI Shield Indicator */}
          <div className="pt-6 mt-6 border-t border-slate-100/80 flex items-center justify-between text-xs font-bold text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              PCI-DSS Secured Connection
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
