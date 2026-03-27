'use client';

import Link from 'next/link';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';

interface InvoiceDetailHeaderProps {
  invoiceNumber: string;
  status: string;
  statusConfig: {
    label: string;
    color: string;
  };
  statusLabel: string;
  updating: boolean;
  onMarkAsSent: () => void;
  paymentMethodLabels: Record<string, string>;
  onMarkAsPaid: (method: string) => void;
}

export function InvoiceDetailHeader({
  invoiceNumber,
  status,
  statusConfig,
  statusLabel,
  updating,
  onMarkAsSent,
  paymentMethodLabels,
  onMarkAsPaid,
}: InvoiceDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{invoiceNumber}</h1>
          <p className="text-muted-foreground">
            Invoice
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge className={cn('text-sm px-3 py-1', statusConfig.color)}>
          {statusLabel}
        </Badge>
        {status === 'draft' && (
          <Button variant="outline" onClick={onMarkAsSent} disabled={updating}>
            <Send className="h-4 w-4 mr-2" />
            Mark as Sent
          </Button>
        )}
        {['draft', 'sent', 'overdue'].includes(status) && (
          <div className="flex gap-2">
            <select
              onChange={(e) => e.target.value && onMarkAsPaid(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
              disabled={updating}
            >
              <option value="">Mark as Paid</option>
              {Object.entries(paymentMethodLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
