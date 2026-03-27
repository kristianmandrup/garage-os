import { FileText } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';

interface PendingInvoice {
  total: number;
}

interface PendingInvoicesAlertProps {
  invoices: PendingInvoice[];
}

export function PendingInvoicesAlert({ invoices }: PendingInvoicesAlertProps) {
  if (invoices.length === 0) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <Card className="border-red-500 bg-red-50 dark:bg-red-950/20">
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center">
            <FileText className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 dark:text-red-200">
              รอชำระเงิน ({invoices.length})
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">
              คุณมีใบแจ้งหนี้ที่ต้องชำระ รวม {formatCurrency(invoices.reduce((sum, inv) => sum + inv.total, 0))}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
