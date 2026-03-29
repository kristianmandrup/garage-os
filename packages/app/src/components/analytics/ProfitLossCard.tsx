'use client';

import { useLocale, formatCurrency, type Locale } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface ProfitLossData {
  revenue: number;
  partsCost: number;
  laborRevenue: number;
  profit: number;
  margin: number;
}

interface ProfitLossCardProps {
  data: ProfitLossData;
}

function ProgressRow({ label, amount, total, color, locale }: {
  label: string; amount: number; total: number; color: string; locale: Locale;
}) {
  const pct = total > 0 ? Math.round((amount / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{formatCurrency(amount, locale)}</span>
      </div>
      <div className="h-2 rounded-full bg-muted">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

export function ProfitLossCard({ data }: ProfitLossCardProps) {
  const { locale } = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Profit & Loss
          <span className={`text-lg font-bold ${data.margin >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {data.margin}% margin
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProgressRow label="Revenue" amount={data.revenue} total={data.revenue} color="bg-blue-500" locale={locale} />
        <ProgressRow label="Parts Cost" amount={data.partsCost} total={data.revenue} color="bg-amber-500" locale={locale} />
        <ProgressRow label="Labor Revenue" amount={data.laborRevenue} total={data.revenue} color="bg-indigo-500" locale={locale} />
        <div className="pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Gross Profit</span>
            <span className={`text-lg font-bold ${data.profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {formatCurrency(data.profit, locale)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
