'use client';

import { useLocale, formatCurrency } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface AgingBucket {
  bucket: '0-30' | '31-60' | '61-90' | '90+';
  count: number;
  amount: number;
}

interface PaymentAgingCardProps {
  data: AgingBucket[];
}

const bucketColors: Record<string, { bg: string; text: string }> = {
  '0-30': { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  '31-60': { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  '61-90': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400' },
  '90+': { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
};

export function PaymentAgingCard({ data }: PaymentAgingCardProps) {
  const { locale } = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Aging</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {data.map(bucket => {
            const colors = bucketColors[bucket.bucket] || bucketColors['0-30'];
            return (
              <div key={bucket.bucket} className={`rounded-lg p-3 ${colors.bg}`}>
                <p className={`text-xs font-medium ${colors.text}`}>{bucket.bucket} days</p>
                <p className={`text-lg font-bold ${colors.text}`}>
                  {formatCurrency(bucket.amount, locale)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {bucket.count} invoice{bucket.count !== 1 ? 's' : ''}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
