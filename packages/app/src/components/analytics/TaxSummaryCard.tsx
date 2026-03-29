'use client';

import { useLocale, formatCurrency } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface TaxSummaryData {
  totalTax: number;
  taxRate: number;
  taxableRevenue: number;
}

interface TaxSummaryCardProps {
  data: TaxSummaryData;
}

export function TaxSummaryCard({ data }: TaxSummaryCardProps) {
  const { locale } = useLocale();

  const items = [
    { label: 'Tax Rate', value: `${data.taxRate}%` },
    { label: 'Taxable Revenue', value: formatCurrency(data.taxableRevenue, locale) },
    { label: 'Total Tax Collected', value: formatCurrency(data.totalTax, locale) },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tax Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-3">
          {items.map(item => (
            <div key={item.label} className="flex justify-between items-center">
              <dt className="text-sm text-muted-foreground">{item.label}</dt>
              <dd className="text-sm font-semibold">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  );
}
