import { create } from 'zustand';

export interface Invoice {
  id: string;
  billingEntity: string;
  date: string;
  amount: string;
  status: 'PAID' | 'AWAITING' | 'OVERDUE' | 'PROCESSING';
  type: string;
}

interface InvoiceState {
  invoices: Invoice[];
  markAsPaid: (id: string) => void;
  setProcessing: (id: string) => void;
  resetInvoices: () => void;
}

const initialInvoices: Invoice[] = [
  { id: 'INV-2026-001', billingEntity: 'Acme Global Corp', date: 'May 24, 2026', amount: '$12,500.00', status: 'PAID', type: 'SaaS Agreement' },
  { id: 'INV-2026-002', billingEntity: 'Stark Industries', date: 'May 22, 2026', amount: '$4,800.00', status: 'PAID', type: 'API Enterprise' },
  { id: 'INV-2026-003', billingEntity: 'Wayne Enterprise', date: 'May 18, 2026', amount: '$9,200.00', status: 'AWAITING', type: 'Custom SLA' },
  { id: 'INV-2026-004', billingEntity: 'LexCorp Ventures', date: 'May 10, 2026', amount: '$3,200.00', status: 'OVERDUE', type: 'Core License' },
];

export const useInvoiceStore = create<InvoiceState>((set) => ({
  invoices: initialInvoices,

  markAsPaid: (id: string) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, status: 'PAID' as const } : inv
      ),
    })),

  setProcessing: (id: string) =>
    set((state) => ({
      invoices: state.invoices.map((inv) =>
        inv.id === id ? { ...inv, status: 'PROCESSING' as const } : inv
      ),
    })),

  resetInvoices: () =>
    set({ invoices: initialInvoices }),
}));
