import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';

const INVOICE_STATUS_LABELS: Record<string, string> = {
  draft: 'แบบร่าง',
  sent: 'ส่งแล้ว',
  paid: 'ชำระแล้ว',
  overdue: 'เกินกำหนด',
  cancelled: 'ยกเลิก',
};

interface Invoice {
  id: string;
  invoice_number: string;
  total: number;
  status: string;
  due_date: string | null;
  job_card: {
    vehicle: {
      brand: string;
      model: string;
    };
  } | null;
}

interface InvoicesCardProps {
  invoices: Invoice[];
}

export function InvoicesCard({ invoices }: InvoicesCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          ใบแจ้งหนี้ ({invoices.length})
        </CardTitle>
        <CardDescription>ประวัติใบแจ้งหนี้</CardDescription>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">ยังไม่มีใบแจ้งหนี้</p>
        ) : (
          <div className="space-y-3">
            {invoices.map(invoice => (
              <div key={invoice.id} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                <div>
                  <p className="font-medium">{invoice.invoice_number}</p>
                  <p className="text-sm text-muted-foreground">
                    {invoice.job_card?.vehicle?.brand} {invoice.job_card?.vehicle?.model}
                  </p>
                  {invoice.due_date && (
                    <p className="text-xs text-muted-foreground mt-1">
                      กำหนดชำระ: {new Date(invoice.due_date).toLocaleDateString('th-TH')}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(invoice.total)}</p>
                  <Badge className={cn(
                    'mt-1',
                    invoice.status === 'paid' ? 'bg-emerald-500' :
                    invoice.status === 'overdue' ? 'bg-red-500' :
                    invoice.status === 'sent' ? 'bg-blue-500' : 'bg-slate-500'
                  )}>
                    {INVOICE_STATUS_LABELS[invoice.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
