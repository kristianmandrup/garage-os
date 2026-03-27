'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface CustomerRetentionCardProps {
  retention: {
    total: number;
    returning: number;
    rate: number;
  };
}

export function CustomerRetentionCard({ retention }: CustomerRetentionCardProps) {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.analytics.customerRetention}</CardTitle>
        <CardDescription>{t.analytics.returningCustomers}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-muted"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={`${retention.rate * 2.51} 251`}
                className="text-emerald-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{retention.rate}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t.analytics.returningCustomerRate}</p>
            <p className="text-lg font-semibold mt-1">
              {t.analytics.returningOutOf.replace('{returning}', retention.returning.toString()).replace('{total}', retention.total.toString())}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {t.analytics.customersWithMultipleJobs}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
