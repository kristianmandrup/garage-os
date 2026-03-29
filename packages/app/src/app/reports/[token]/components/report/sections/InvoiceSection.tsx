'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';
import type { Invoice } from '../types';

interface InvoiceSectionProps {
  invoice: Invoice;
}

export function InvoiceSection({ invoice }: InvoiceSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ใบแจ้งหนี้</CardTitle>
        <CardDescription>เลขที่: {invoice.invoice_number}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ราคาอะไหล่</span>
            <span>฿{invoice.subtotal.toLocaleString()}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>ส่วนลด</span>
              <span>-฿{invoice.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">ภาษี 7%</span>
            <span>฿{invoice.tax.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>รวมทั้งสิ้น</span>
            <span className="text-emerald-600">฿{invoice.total.toLocaleString()}</span>
          </div>
          <div className="mt-4">
            <Badge className={cn(
              invoice.status === 'paid' ? 'bg-emerald-500' :
              invoice.status === 'sent' ? 'bg-blue-500' : 'bg-amber-500'
            )}>
              {invoice.status === 'paid' ? 'ชำระแล้ว' :
               invoice.status === 'sent' ? 'ส่งแล้ว' : 'รอดำเนินการ'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
