'use client';

import { useLocale, formatCurrency } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';

interface RevenueChartCardProps {
  byDay: Record<string, number>;
  period: number;
}

export function RevenueChartCard({ byDay, period }: RevenueChartCardProps) {
  const { locale } = useLocale();
  const t = require('@/i18n').useTranslation();

  const maxRevenue = Math.max(...Object.values(byDay), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.analytics.revenueTrend}</CardTitle>
        <CardDescription>{t.analytics.dailyRevenue.replace('{days}', period.toString())}</CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(byDay).length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            {t.analytics.noRevenueData}
          </div>
        ) : (
          <div className="flex items-end gap-1 h-48">
            {Object.entries(byDay)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([day, amount]) => {
                const height = (amount / maxRevenue) * 100;
                return (
                  <div key={day} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-500 hover:to-blue-300"
                      style={{ height: `${Math.max(height, 4)}%` }}
                      title={formatCurrency(amount, locale)}
                    />
                    <span className="text-xs text-muted-foreground">
                      {new Date(day).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
