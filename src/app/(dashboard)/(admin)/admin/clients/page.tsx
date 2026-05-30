'use client';

import React, { useState } from 'react';
import { useClientStore, ClientRecord } from '@/features/clients/stores/use-client-store';
import { 
  Users, 
  Plus, 
  ArrowDownToLine, 
  AlertCircle, 
  Loader2, 
  X, 
  Check 
} from 'lucide-react';

export default function AdminClientsPage() {
  const { clients, addClient } = useClientStore();

  // Modal and notification states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [agreementTier, setAgreementTier] = useState('');

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

  // CSV Directory Export Compiler with empty state checks
  const handleExportCSV = async () => {
    if (clients.length === 0) {
      showToast('No client records available. Please add a client account first.', 'error');
      return;
    }

    setIsExporting(true);

    try {
      // Simulate CSV assembly latency (800ms)
      await new Promise((resolve) => setTimeout(resolve, 800));

      const shouldFail = Math.random() < 0.03;
      if (shouldFail) {
        throw new Error('Failed to generate export. Please try again.');
      }

      const csvHeaders = 'Client ID,Company Name,Contact,Tier,Status,Settled Volume\n';
      const csvRows = clients
        .map(
          (cli) =>
            `"${cli.id}","${cli.name}","${cli.email}","${cli.plan}","${cli.status}","${cli.spent}"`
        )
        .join('\n');

      const csvContent = csvHeaders + csvRows;

      // Browser-native Blob download trigger
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `vaultpay-clients-directory.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast('Client directory exported successfully.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to generate export. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // Add client submission
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Form validations
    if (!companyName || !contactEmail || !agreementTier) {
      setValidationError('All form fields are strictly required.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail)) {
      setValidationError('Please specify a valid contact email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate remote network processing latency (600ms)
      await new Promise((resolve) => setTimeout(resolve, 600));

      const shouldFail = Math.random() < 0.03;
      if (shouldFail) {
        throw new Error('Unable to create client account. Please try again.');
      }

      // Generate a unique client ID
      const randomSuffix = Math.floor(10 + Math.random() * 90);
      const newClientId = `cli_${randomSuffix}`;

      const newClient: ClientRecord = {
        id: newClientId,
        name: companyName,
        email: contactEmail,
        plan: agreementTier,
        status: 'ACTIVE',
        spent: '$0.00', // Newly created client starts with $0 settled spent
      };

      // Dispatch to global Zustand store (prepending to the top row!)
      addClient(newClient);

      // Reset form fields
      setCompanyName('');
      setContactEmail('');
      setAgreementTier('');
      
      // Close modal
      setIsModalOpen(false);

      showToast(`Client account ${companyName} added successfully.`, 'success');
    } catch (err: any) {
      setValidationError(err.message || 'Unable to create client account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6">
      
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
            <Users className="h-5.5 w-5.5 text-violet-600" />
            Merchant Clients Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage billing agreements, subscription accounts, and payout profiles.
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
                Export Directory
              </>
            )}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-violet-600 hover:bg-violet-755 text-xs font-bold text-white rounded-lg transition-all shadow-sm shadow-violet-600/10 active:scale-[0.98] cursor-pointer select-none"
          >
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
          {clients.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium">
              No client directory profiles registered. Click "Add Client Account" to create one.
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Plus className="h-4.5 w-4.5 text-violet-600" />
                Add Client Account
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
            <form onSubmit={handleAddClient} className="p-6 space-y-4 flex-1">
              
              {/* Error prompts */}
              {validationError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs font-bold text-rose-600 leading-normal flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Company Name */}
              <div>
                <label htmlFor="client-name" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Company Name *
                </label>
                <input
                  id="client-name"
                  type="text"
                  required
                  placeholder="e.g. Wayne Enterprise"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Contact Email */}
              <div>
                <label htmlFor="client-email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Primary Contact Email *
                </label>
                <input
                  id="client-email"
                  type="email"
                  required
                  placeholder="e.g. accounts@wayne.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all placeholder:text-slate-400"
                />
              </div>

              {/* Agreement Tier */}
              <div>
                <label htmlFor="client-tier" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1.5">
                  Agreement Tier / Plan *
                </label>
                <select
                  id="client-tier"
                  required
                  value={agreementTier}
                  onChange={(e) => setAgreementTier(e.target.value)}
                  className="block w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:ring-4 focus:ring-violet-500/5 focus:border-violet-600 transition-all"
                >
                  <option value="">Select agreement tier...</option>
                  <option value="Enterprise SaaS">Enterprise SaaS</option>
                  <option value="Enterprise API">Enterprise API</option>
                  <option value="Custom SLA">Custom SLA</option>
                  <option value="Basic Core License">Basic Core License</option>
                </select>
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
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 hover:bg-violet-755 text-xs font-bold text-white rounded-xl transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Account'
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
