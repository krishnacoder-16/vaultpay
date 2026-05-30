import { useMutation } from '@tanstack/react-query';
import { Invoice } from '../stores/use-invoice-store';

interface DownloadRequest {
  invoice: Invoice;
  isReceipt?: boolean;
}

interface DownloadResponse {
  invoiceId: string;
  filename: string;
  isReceipt: boolean;
}

export function useDownloadMutation() {
  return useMutation<DownloadResponse, Error, DownloadRequest>({
    mutationFn: async ({ invoice, isReceipt = false }) => {
      // 1. Simulate randomized remote document generation server latency (800ms - 2000ms)
      const latency = Math.floor(Math.random() * 1200) + 800;
      await new Promise((resolve) => setTimeout(resolve, latency));

      // 2. Simulating a mock backend failure rate of 4% (to test our robust error UI handling)
      const shouldFail = Math.random() < 0.04;
      if (shouldFail) {
        throw new Error('Unable to download invoice PDF. The document could not be generated at this time.');
      }

      // 3. Extract billing numbers for formatting
      const rawAmount = parseFloat(invoice.amount.replace('$', '').replace(',', ''));
      const subtotal = rawAmount;
      const tax = rawAmount * 0.1; // 10% tax
      const grandTotal = subtotal + tax;

      const formattedSubtotal = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      const formattedTax = `$${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      const formattedTotal = `$${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;

      // 4. Generate highly professional plain text / layout summary representing a financial document
      const fileContent = `================================================================================
                           VAULTPAY FINANCIAL CORE
                        ${isReceipt ? 'OFFICIAL PAYMENT RECEIPT' : 'COMMERCIAL STATEMENT OF INVOICE'}
================================================================================

Document Ref:   ${invoice.id}
Date Issued:    ${invoice.date}
Payment Status: ${invoice.status}
Service Scope:  ${invoice.type}

--------------------------------------------------------------------------------
ISSUED BY (MERCHANT):
VaultPay Financial Core, Inc.
100 Pine Street, Suite 2400
San Francisco, CA 94111
Contact: billing@vaultpay.financial
Portal:  https://vaultpay.financial

CUSTOMER / BILLING TARGET:
Client Entity:  ${invoice.billingEntity}
Routing Reference: ${invoice.billingEntity.toLowerCase().replace(/\s+/g, '-')}-vp-acct
--------------------------------------------------------------------------------

LEDGER SPECIFICATIONS & SERVICE BREAKDOWN:

  Item Description                       Qty    Unit Rate       Line Total
  ------------------------------------------------------------------------------
  1. ${invoice.type}                      1      ${invoice.amount}      ${invoice.amount}
     [Scope Reference: Core API & Node Service SLA Support]

--------------------------------------------------------------------------------
SUBTOTAL BALANCE:                                               ${formattedSubtotal}
GOVERNMENT TAX / VAT (10.0%):                                   ${formattedTax}
--------------------------------------------------------------------------------
TOTAL ACCOUNTS OUTSTANDING:                                     ${formattedTotal}
================================================================================
${isReceipt ? 'RECEIPT TRANSACTION STATUS: SETTLED & PAID IN FULL' : 'PAYMENT TERMS: DUE IMMEDIATELY ON RECEIPT'}

Thank you for your business.
VaultPay Operations & Billing Bureau.
================================================================================
`;

      // 5. Trigger browser-native download using a local Web Blob
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const filename = `vaultpay-${isReceipt ? 'receipt' : 'invoice'}-${invoice.id.toLowerCase()}.pdf`;
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up DOM and URL resources immediately
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return {
        invoiceId: invoice.id,
        filename,
        isReceipt,
      };
    },
  });
}
