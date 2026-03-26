'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle, Clock, AlertTriangle, Printer, Send, Trash2 } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { Textarea } from '@garageos/ui/textarea';
import { cn } from '@garageos/ui/utils';

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
  };
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

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Credit/Debit Card' },
  { value: 'qr', label: 'QR Payment' },
];

export default function InvoiceDetailPage() {
  const params = useParams();
  const router = useRouter();
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
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Invoice not found</h2>
        <Link href="/dashboard/invoices" className="text-primary hover:underline mt-4 inline-block">
          Back to invoices
        </Link>
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[invoice.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
  const partsTotal = invoice.job_card?.part_usages?.reduce(
    (sum, pu) => sum + (pu.quantity * pu.unit_price),
    0
  ) || 0;
  const laborCost = invoice.job_card?.actual_cost || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{invoice.invoice_number}</h1>
            <p className="text-muted-foreground">
              Created {new Date(invoice.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={cn('text-sm px-3 py-1', statusConfig.color)}>
            {statusConfig.label}
          </Badge>
          {invoice.status === 'draft' && (
            <>
              <Button variant="outline" onClick={() => updateStatus('sent')} disabled={updating}>
                <Send className="h-4 w-4 mr-2" />
                Mark as Sent
              </Button>
            </>
          )}
          {['draft', 'sent', 'overdue'].includes(invoice.status) && (
            <div className="flex gap-2">
              <select
                onChange={(e) => e.target.value && markAsPaid(e.target.value)}
                className="h-10 px-3 rounded-md border border-input bg-background text-sm"
                disabled={updating}
              >
                <option value="">Mark as Paid</option>
                {PAYMENT_METHODS.map(pm => (
                  <option key={pm.value} value={pm.value}>{pm.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Card Info */}
          <Card>
            <CardHeader>
              <CardTitle>Service Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-lg">{invoice.job_card?.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.job_card?.vehicle?.brand} {invoice.job_card?.vehicle?.model} ({invoice.job_card?.vehicle?.year})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    License: {invoice.job_card?.vehicle?.license_plate}
                  </p>
                </div>
                {invoice.job_card?.description && (
                  <p className="text-sm text-muted-foreground">{invoice.job_card.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Parts & Labor */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Parts */}
                {invoice.job_card?.part_usages && invoice.job_card.part_usages.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Parts</h4>
                    <div className="space-y-2">
                      {invoice.job_card.part_usages.map((pu) => (
                        <div key={pu.id} className="flex justify-between text-sm">
                          <span>{pu.part.name} x {pu.quantity}</span>
                          <span className="font-medium">฿{(pu.quantity * pu.unit_price).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Labor */}
                <div className="flex justify-between text-sm pt-4 border-t">
                  <span>Labor ({invoice.job_card?.actual_hours || 0} hours)</span>
                  <span className="font-medium">฿{laborCost.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm pt-4 border-t">
                  <span>Parts Total</span>
                  <span className="font-medium">฿{partsTotal.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes..."
                rows={3}
              />
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={saveNotes}
                disabled={updating}
              >
                {updating ? 'Saving...' : 'Save Notes'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          {/* Customer */}
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{invoice.customer?.name}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer?.phone}</p>
                {invoice.customer?.email && (
                  <p className="text-sm text-muted-foreground">{invoice.customer.email}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>฿{invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (7%)</span>
                  <span>฿{invoice.tax.toLocaleString()}</span>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-600">
                    <span>Discount</span>
                    <span>-฿{invoice.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-4 border-t">
                  <span>Total</span>
                  <span>฿{invoice.total.toLocaleString()}</span>
                </div>
              </div>

              {invoice.status === 'paid' && invoice.paid_at && (
                <div className="pt-4 border-t">
                  <div className="flex items-center gap-2 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Paid on {new Date(invoice.paid_at).toLocaleDateString()}</span>
                  </div>
                  {invoice.payment_method && (
                    <p className="text-sm text-muted-foreground mt-1">
                      via {PAYMENT_METHODS.find(p => p.value === invoice.payment_method)?.label}
                    </p>
                  )}
                </div>
              )}

              {invoice.due_date && invoice.status !== 'paid' && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Due Date</p>
                  <p className="font-medium">{new Date(invoice.due_date).toLocaleDateString()}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
