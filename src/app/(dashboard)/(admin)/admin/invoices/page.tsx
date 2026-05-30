'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoiceStore, Invoice } from '@/features/invoices/stores/use-invoice-store';
import { 
  FileText, 
  ArrowDownToLine, 
  Plus, 
  Receipt, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Loader2,
  X,
  Check
} from 'lucide-react';

export default function AdminInvoicesPage() {
  const router = useRouter();
  const { invoices, addInvoice } = useInvoiceStore();

  // Modal and notification states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form states
  const [client, setClient] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [amount, setAmount] = useState('');
  const [issueDate, setIssueDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [dueDate, setDueDate] = useState(() => {
    const defaultDue = new Date();
    defaultDue.setDate(defaultDue.getDate() + 30);
    return defaultDue.toISOString().split('T')[0];
  });

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

  // Dynamic KPI math using baseline enterprise mock constants
  const paidInvoices = invoices.filter(inv => inv.status === 'PAID');
  const outstandingInvoices = invoices.filter(inv => inv.status === 'AWAITING' || inv.status === 'OVERDUE');

  const dynamicPaidSum = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);
  const dynamicOutstandingSum = outstandingInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);
  const dynamicTotalSum = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace('$', '').replace(',', '')), 0);

  // High-trust large business baseline alignment
  const globalInvoiced = 1554100.00 + dynamicTotalSum;
  const awaitingSettlement = 130100.00 + dynamicOutstandingSum;
  const settledInvoices = 1411600.00 + dynamicPaidSum;

  const metrics = [
    { title: 'Global Invoiced', value: `$${globalInvoiced.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Receipt, color: 'text-violet-600 border-violet-100 bg-violet-50/50' },
    { title: 'Awaiting Settlement', value: `$${awaitingSettlement.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: Clock, color: 'text-amber-600 border-amber-100 bg-amber-50/50' },
    { title: 'Settled Invoices', value: `$${settledInvoices.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, icon: CheckCircle2, color: 'text-emerald-600 border-emerald-100 bg-emerald-50/50' },
    { title: 'Flagged Disputes', value: '$0.00', icon: AlertCircle, color: 'text-rose-600 border-rose-100 bg-rose-50/50' },
  ];

  // CSV Audit Export Compiler with empty state checks
  const handleExportCSV = async () => {
    // 1. Gated by empty state handling
    if (invoices.length === 0) {
      showToast('No invoices available to export. Please generate an invoice first.', 'error');
      return;
    }

    setIsExporting(true);

    try {
      // 2. Simulate processing latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      // 3. Simulating random network processing failure (3% rate)
      const shouldFail = Math.random() < 0.03;
      if (shouldFail) {
        throw new Error('Failed to generate export. Please try again.');
      }

      // 4. Compile realistic CSV data
      const csvHeaders = 'Invoice ID,Client,Issue Date,Amount,Status,Service Type\n';
      const csvRows = invoices
        .map(
          (inv) =>
            `"${inv.id}","${inv.billingEntity}","${inv.date}","${inv.amount}","${inv.status}","${inv.type}"`
        )
        .join('\n');
      
      const csvContent = csvHeaders + csvRows;
      
      // 5. Trigger native browser Blob download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `vaultpay-invoices-audit.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Audit CSV exported successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate export. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Invoice creation submission
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form field validations
    if (!client || !serviceName || !amount || !issueDate || !dueDate) {
      setValidationError('All form fields are strictly required.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Please specify a valid invoice amount greater than zero.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate remote operational dispatch latency (600ms)
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Simulated failure state if random trigger fires (3%)
      const shouldFail = Math.random() < 0.03;
      if (shouldFail) {
        throw new Error('Unable to create invoice. Please review the form and try again.');
      }

      // Format date nicely: e.g. "May 30, 2026"
      const dateObj = new Date(issueDate);
      const formattedDate = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      const formattedAmount = `$${parsedAmount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;

      // Compile unique Invoice ID
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      const newInvoiceId = `INV-2026-${randomSuffix}`;

      const newInvoice: Invoice = {
        id: newInvoiceId,
        billingEntity: client,
        date: formattedDate,
        amount: formattedAmount,
        status: 'AWAITING',
        type: serviceName,
      };

      // Add invoice prepending at the top!
      addInvoice(newInvoice);

      // Reset form fields
      setClient('');
      setServiceName('');
      setAmount('');
      
      // Close modal
      setIsModalOpen(false);

      showToast(`Invoice ${newInvoiceId} generated successfully.`, 'success');
    } catch (err: any) {
      setValidationError(err.message || 'Unable to create invoice. Please review the form and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Dynamic Action Toast Notifications */}
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
            <FileText className="h-5.5 w-5.5 text-violet-600" />
            Global Invoice Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global ledger of all customer invoicing pipelines and billing agreements.
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
                Export Audit CSV
              </>
            )}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white rounded-lg transition-all shadow-sm shadow-violet-600/10 active:scale-[0.98] cursor-pointer select-none"
          >
            <Plus className="h-4 w-4" />
            Generate Invoice
          </button>
        </div>
      </div>

      {/* Metrics Row */}
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

      {/* Main Ledger Table */}
      <div className="border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.01),0_4px_12px_rgba(148,163,184,0.04)]">
        <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50/40">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">All Merchant Invoices</h2>
        </div>
        <div className="overflow-x-auto">
          {invoices.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">
              No invoice records registered. Click "Generate Invoice" to populate this ledger.
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/20">
                  <th className="px-6 py-3.5 text-[10px]">Invoice ID</th>
                  <th className="px-6 py-3.5 text-[10px]">Client Target</th>
                  <th className="px-6 py-3.5 text-[10px]">Issuance Date</th>
                  <th className="px-6 py-3.5 text-[10px] text-right">Invoice Total</th>
                  <th className="px-6 py-3.5 text-[10px] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {invoices.map((inv) => (
                  <tr 
                    key={inv.id} 
                    onClick={() => router.push(`/admin/invoices/${inv.id}`)}
                    className="hover:bg-slate-50/70 active:bg-slate-100/50 cursor-pointer transition-all duration-150 group"
                    title="Click to view official commercial document"
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-violet-600 transition-colors flex items-center gap-1.5">
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
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Plus className="h-4.5 w-4.5 text-violet-600" />
                Generate New Invoice
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setValidationError(null);
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Close Modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4 flex-1">
              
              {/* Validation Error Prompts */}
              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 leading-normal flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Client Selection */}
              <div>
                <label htmlFor="modal-client" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Client Recipient *
                </label>
                <select
                  id="modal-client"
                  required
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all font-sans"
                >
                  <option value="">Select billing target...</option>
                  <option value="Acme Global Corp">Acme Global Corp</option>
                  <option value="Stark Industries">Stark Industries</option>
                  <option value="Wayne Enterprise">Wayne Enterprise</option>
                  <option value="LexCorp Ventures">LexCorp Ventures</option>
                  <option value="Oscorp Biotech">Oscorp Biotech</option>
                </select>
              </div>

              {/* Service Type / Description */}
              <div>
                <label htmlFor="modal-service" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Service Name / Agreement Line *
                </label>
                <input
                  id="modal-service"
                  type="text"
                  required
                  placeholder="e.g. SaaS Core Support Integrations"
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Amount */}
              <div>
                <label htmlFor="modal-amount" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Agreement Amount (USD) *
                </label>
                <input
                  id="modal-amount"
                  type="number"
                  required
                  min="0.01"
                  step="0.01"
                  placeholder="e.g. 9200.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all font-mono placeholder:text-slate-400"
                />
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="modal-issue" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Issue Date *
                  </label>
                  <input
                    id="modal-issue"
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="modal-due" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                    Due Date *
                  </label>
                  <input
                    id="modal-due"
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setValidationError(null);
                  }}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-xs font-bold text-white rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
