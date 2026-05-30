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

      const filename = `vaultpay-${isReceipt ? 'receipt' : 'invoice'}-${invoice.id.toLowerCase()}.pdf`;

      // 4. Dynamically import jsPDF on client-side ONLY to secure Vercel/SSR static builds
      const { jsPDF } = await import('jspdf');
      
      // Create new standard A4 page (default unit: mm, format: a4 [210 x 297])
      const doc = new jsPDF();

      // --- BRAND HEADER ---
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(79, 70, 229); // indigo-600
      doc.setFontSize(16);
      doc.text('VaultPay Financial', 20, 25);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139); // slate-500
      doc.setFontSize(8);
      doc.text('BILLING OPERATIONS BUREAU', 20, 30);

      // --- DOCUMENT SPECS ---
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59); // slate-800
      doc.setFontSize(12);
      doc.text(isReceipt ? 'OFFICIAL PAYMENT RECEIPT' : 'COMMERCIAL STATEMENT OF INVOICE', 110, 25);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105); // slate-700
      doc.setFontSize(9);
      doc.text(`Document ID:  ${invoice.id}`, 110, 31);
      doc.text(`Date Issued:  ${invoice.date}`, 110, 37);

      // Section divider line
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.setLineWidth(0.5);
      doc.line(20, 43, 190, 43);

      // --- BILLER & RECIPIENT GRID ---
      // Left Column: Merchant Details
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(148, 163, 184); // slate-400
      doc.setFontSize(8);
      doc.text('MERCHANT / ISSUED BY:', 20, 52);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85); // slate-800
      doc.setFontSize(9);
      doc.text('VaultPay Financial Core, Inc.', 20, 58);
      doc.setFont('helvetica', 'normal');
      doc.text('100 Pine Street, Suite 2400', 20, 64);
      doc.text('San Francisco, CA 94111', 20, 70);
      doc.setTextColor(79, 70, 229);
      doc.text('billing@vaultpay.financial', 20, 76);

      // Right Column: Client details
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(148, 163, 184);
      doc.text('BILL TO / RECIPIENT:', 110, 52);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(invoice.billingEntity, 110, 58);
      doc.setFont('helvetica', 'normal');
      
      // Realistic address mapping matching details view
      let clientAddress = '900 Metro Boulevard, Building 4';
      let clientCity = 'Silicon Valley, CA 94025';
      let clientEmail = 'accounting@client-corp.com';
      if (invoice.billingEntity === 'Acme Global Corp') {
        clientAddress = '123 Innovation Way, Suite 400';
        clientCity = 'San Francisco, CA 94107';
        clientEmail = 'accounts@acme-global.com';
      } else if (invoice.billingEntity === 'Stark Industries') {
        clientAddress = '10880 Wilshire Blvd, Penthouse A';
        clientCity = 'Los Angeles, CA 90024';
        clientEmail = 'billing@stark.com';
      } else if (invoice.billingEntity === 'Wayne Enterprise') {
        clientAddress = '1007 Mountain Drive';
        clientCity = 'Gotham City, NJ 07001';
        clientEmail = 'finance@waynecorp.com';
      } else if (invoice.billingEntity === 'LexCorp Ventures') {
        clientAddress = '350 Fifth Ave, Floor 72';
        clientCity = 'New York, NY 10118';
        clientEmail = 'treasury@lexcorp.com';
      }

      doc.text(clientAddress, 110, 64);
      doc.text(clientCity, 110, 70);
      doc.setTextColor(71, 85, 105);
      doc.text(clientEmail, 110, 76);

      // Section divider line
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 84, 190, 84);

      // --- LEDGER TABLE ---
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(148, 163, 184);
      doc.text('STATEMENT SERVICE BREAKDOWN:', 20, 93);

      // Draw table header block background
      doc.setFillColor(248, 250, 252); // slate-50
      doc.rect(20, 97, 170, 8, 'F');
      
      doc.setFontSize(8.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Line Items & Description', 24, 102.5);
      doc.text('Qty', 115, 102.5);
      doc.text('Rate', 140, 102.5);
      doc.text('Total', 172, 102.5);

      // Underline table header
      doc.setDrawColor(241, 245, 249);
      doc.line(20, 105, 190, 105);

      // Write table rows
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(51, 65, 85);
      doc.text(invoice.type, 24, 114);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184);
      doc.text('Core node integration license agreement & operational SLA metrics routing.', 24, 119);

      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('1', 116, 114);
      doc.text(invoice.amount, 140, 114);
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(invoice.amount, 172, 114);

      // Table bottom divider line
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 126, 190, 126);

      // --- FINANCIAL SUMMARY GRID (Right Aligned) ---
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Subtotal Balance:', 110, 136);
      doc.setTextColor(51, 65, 85);
      doc.text(formattedSubtotal, 172, 136);

      doc.setTextColor(100, 116, 139);
      doc.text('VAT / SaaS Tax (10.0%):', 110, 142);
      doc.setTextColor(51, 65, 85);
      doc.text(formattedTax, 172, 142);

      doc.setDrawColor(241, 245, 249);
      doc.line(110, 147, 190, 147);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Grand Total:', 110, 153);
      doc.text(formattedTotal, 172, 153);

      // --- TRANSACTION STATUS WATERMARK / STAMP ---
      if (isReceipt || invoice.status === 'PAID') {
        // Beautiful green settled stamp block
        doc.setFillColor(240, 253, 244); // emerald-50
        doc.setDrawColor(187, 247, 208); // emerald-200
        doc.rect(20, 170, 170, 18, 'DF');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(21, 128, 61); // emerald-700
        doc.setFontSize(10);
        doc.text('TRANSACTION STATUS: SETTLED & PAID IN FULL', 25, 181);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(`Payment parsed on secure mainnet ledger reference txn_${invoice.id.replace('INV-2026-', '')}`, 25, 185);
      } else {
        // Awaiting or overdue orange/rose stamp block
        const isOverdue = invoice.status === 'OVERDUE';
        
        doc.setFillColor(isOverdue ? 254 : 254, isOverdue ? 226 : 243, isOverdue ? 226 : 199); // rose-50 or amber-50
        doc.setDrawColor(isOverdue ? 254 : 253, isOverdue ? 202 : 230, isOverdue ? 202 : 138); // rose-200 or amber-200
        doc.rect(20, 170, 170, 18, 'DF');

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(isOverdue ? 185 : 180, isOverdue ? 28 : 83, isOverdue ? 28 : 9); // rose-700 or amber-700
        doc.setFontSize(10);
        doc.text(
          isOverdue ? 'WARNING: STATEMENT OVERDUE & UNPAID' : 'PAYMENT TERMS: DUE IMMEDIATELY UPON RECEIPT',
          25, 
          181
        );
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.text(
          isOverdue 
            ? 'Account has past due limit bounds. Please execute a card settlement immediately to prevent suspension.' 
            : 'Please log in to your secure client billing portal to settle this commercial statement.',
          25, 
          185
        );
      }

      // --- SIGN-OFF FOOTER ---
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 260, 190, 260);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text('Thank you for choosing VaultPay. All transaction registers are secured under secure Edge Ledger frameworks.', 20, 268);
      doc.text('VaultPay Billing Operations & Global Accounts Registry Division.', 20, 273);

      // 5. Save the compiled binary PDF document natively using browser hooks
      doc.save(filename);

      return {
        invoiceId: invoice.id,
        filename,
        isReceipt,
      };
    },
  });
}
