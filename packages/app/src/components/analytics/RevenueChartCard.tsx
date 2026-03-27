'use client';

import { useLocale, formatCurrency } from '@/i18n';
import { useTranslation } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface RevenueChartCardProps {
  byDay: Record<string, number>;
  period: number;
}

export function RevenueChartCard({ byDay, period }: RevenueChartCardProps) {
  const { locale } = useLocale();
  const t = useTranslation();

  const data = Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, amount]) => ({
      date: new Date(day).toLocaleDateString(locale === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short' }),
      revenue: amount,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.analytics.revenueTrend}</CardTitle>
        <CardDescription>{t.analytics.dailyRevenue.replace('{days}', period.toString())}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            {t.analytics.noRevenueData}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)} />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                formatter={(value) => [formatCurrency(Number(value), locale), 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
