'use client';

import { CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation, useLocale, formatCurrency, formatDateOnly } from '@/i18n';

interface InvoicePaymentSummaryProps {
  invoice: {
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    status: string;
    paid_at: string | null;
    payment_method: string | null;
    due_date: string | null;
  };
  paymentMethodLabels: Record<string, string>;
}

export function InvoicePaymentSummary({ invoice, paymentMethodLabels }: InvoicePaymentSummaryProps) {
  const { locale } = useLocale();
  const t = require('@/i18n').useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(invoice.subtotal, locale)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>{formatCurrency(invoice.tax, locale)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Discount</span>
              <span>-{formatCurrency(invoice.discount, locale)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg pt-4 border-t">
            <span>Total</span>
            <span>{formatCurrency(invoice.total, locale)}</span>
          </div>
        </div>

        {invoice.status === 'paid' && invoice.paid_at && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">
                Paid on {formatDateOnly(new Date(invoice.paid_at), locale)}
              </span>
            </div>
            {invoice.payment_method && (
              <p className="text-sm text-muted-foreground mt-1">
                Via {paymentMethodLabels[invoice.payment_method] || invoice.payment_method}
              </p>
            )}
          </div>
        )}

        {invoice.due_date && invoice.status !== 'paid' && (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">Due Date</p>
            <p className="font-medium">{formatDateOnly(new Date(invoice.due_date), locale)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
