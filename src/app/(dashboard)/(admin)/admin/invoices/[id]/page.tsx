'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { InvoiceDetailView } from '@/features/invoices/components/InvoiceDetailView';

export default function AdminInvoiceDetailPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="py-6">
      <InvoiceDetailView invoiceId={id} role="ADMIN" />
    </div>
  );
}
