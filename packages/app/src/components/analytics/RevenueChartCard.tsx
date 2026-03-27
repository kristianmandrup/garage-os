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
          <div className="space-y-2">
            {/* Y-axis labels */}
            <div className="flex items-end gap-1 h-48 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className="border-b border-dashed border-border/50 w-full" />
                ))}
              </div>
              {Object.entries(byDay)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([day, amount]) => {
                  const height = (amount / maxRevenue) * 100;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1 relative z-10 group">
                      {/* Tooltip */}
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-foreground text-background text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-lg z-20">
                        {formatCurrency(amount, locale)}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-500 hover:to-blue-300 cursor-pointer"
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                      <span className="text-[10px] text-muted-foreground truncate max-w-full">
                        {new Date(day).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
