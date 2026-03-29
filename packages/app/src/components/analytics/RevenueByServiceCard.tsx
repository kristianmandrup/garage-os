'use client';

import { useLocale, formatCurrency } from '@/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ServiceRevenue {
  service: string;
  revenue: number;
  count: number;
}

interface RevenueByServiceCardProps {
  data: ServiceRevenue[];
}

export function RevenueByServiceCard({ data }: RevenueByServiceCardProps) {
  const { locale } = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue by Service</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-48 flex items-center justify-center text-muted-foreground">
            No service data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(200, data.length * 40)}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 5, bottom: 5, left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                type="number"
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
                tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)}
              />
              <YAxis
                type="category"
                dataKey="service"
                tick={{ fontSize: 11 }}
                stroke="var(--muted-foreground)"
                width={75}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value, _name, entry) => [
                  `${formatCurrency(Number(value), locale)} (${entry.payload.count} jobs)`,
                  'Revenue',
                ]}
              />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
