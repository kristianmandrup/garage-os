'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  InvoiceDetailHeader,
  InvoiceJobCardInfo,
  InvoicePartsLabor,
  InvoiceNotes,
  InvoiceCustomer,
  InvoicePaymentSummary,
  InvoiceLoadingState,
  InvoiceNotFoundState,
} from '@/components/invoice';
import { useTranslation } from '@/i18n';

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  notes: string | null;
  created_at: string;
  due_date: string | null;
  paid_at: string | null;
  payment_method: string | null;
  customer: {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    address: string | null;
  };
  job_card: {
    id: string;
    title: string;
    description: string | null;
    actual_cost: number | null;
    actual_hours: number | null;
    vehicle: {
      license_plate: string;
      brand: string;
      model: string;
      year: number;
    };
    part_usages: Array<{
      id: string;
      quantity: number;
      unit_price: number;
      part: {
        name: string;
        part_number: string | null;
      };
    }>;
  } | null;
  shop: {
    name: string;
    address: string | null;
    phone: string | null;
    email: string | null;
  };
}

const STATUS_CONFIG = {
  draft: { label: 'Draft', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400' },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  paid: { label: 'Paid', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400' },
};

export default function InvoiceDetailPage() {
  const t = useTranslation();
  const params = useParams();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchInvoice();
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoices/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setInvoice(data);
        setNotes(data.notes || '');
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    if (!invoice) return;
    setUpdating(true);
    try {
      const response = await fetch(`/api/invoices/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchInvoice();
      }
    } catch (error) {
      console.error('Failed to update invoice:', error);
    } finally {
      setUpdating(false);
    }
  };

  const markAsPaid = async (paymentMethod: string) => {
    if (!invoice) return;
    setUpdating(true);
    try {
      const response = await fetch(`/api/invoices/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid', payment_method: paymentMethod }),
      });
      if (response.ok) {
        fetchInvoice();
      }
    } catch (error) {
      console.error('Failed to mark as paid:', error);
    } finally {
      setUpdating(false);
    }
  };

  const saveNotes = async () => {
    if (!invoice) return;
    setUpdating(true);
    try {
      const response = await fetch(`/api/invoices/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });
      if (response.ok) {
        fetchInvoice();
      }
    } catch (error) {
      console.error('Failed to save notes:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <InvoiceLoadingState />;
  }

  if (!invoice) {
    return <InvoiceNotFoundState />;
  }

  const statusConfig = STATUS_CONFIG[invoice.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
  const statusLabel = t.invoices.statuses[invoice.status as keyof typeof t.invoices.statuses] || invoice.status;

  const paymentMethodLabels: Record<string, string> = {
    cash: t.invoices.detail?.cash || 'Cash',
    transfer: t.invoices.detail?.bankTransfer || 'Bank Transfer',
    card: t.invoices.detail?.creditDebitCard || 'Credit/Debit Card',
    qr: t.invoices.detail?.qrPayment || 'QR Payment',
  };

  return (
    <div className="space-y-6">
      <InvoiceDetailHeader
        invoiceNumber={invoice.invoice_number}
        status={invoice.status}
        statusConfig={statusConfig}
        statusLabel={statusLabel}
        updating={updating}
        onMarkAsSent={() => updateStatus('sent')}
        paymentMethodLabels={paymentMethodLabels}
        onMarkAsPaid={markAsPaid}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <InvoiceJobCardInfo
            jobCard={invoice.job_card}
            licenseLabel={t.invoices.detail?.license || 'License'}
          />

          <InvoicePartsLabor
            partUsages={invoice.job_card?.part_usages}
            actualHours={invoice.job_card?.actual_hours}
            actualCost={invoice.job_card?.actual_cost ?? null}
            laborLabel={t.invoices.detail?.labor || 'Labor'}
            partsLabel={t.invoices.detail?.parts || 'Parts'}
            partsTotalLabel={t.invoices.detail?.partsTotal || 'Parts Total'}
          />

          <InvoiceNotes
            notes={notes}
            updating={updating}
            placeholder={t.invoices.detail?.addNotesPlaceholder || 'Add notes...'}
            savingLabel={t.invoices.detail?.saving || 'Saving...'}
            saveLabel={t.invoices.detail?.saveNotes || 'Save Notes'}
            onNotesChange={setNotes}
            onSave={saveNotes}
          />
        </div>

        <div className="space-y-6">
          <InvoiceCustomer customer={invoice.customer} />
          <InvoicePaymentSummary invoice={invoice} paymentMethodLabels={paymentMethodLabels} />
        </div>
      </div>
    </div>
  );
}
