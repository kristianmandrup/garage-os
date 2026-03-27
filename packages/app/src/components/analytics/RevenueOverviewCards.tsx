'use client';

import { DollarSign, CheckCircle, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { useTranslation, useLocale, formatCurrency } from '@/i18n';

interface RevenueOverviewCardsProps {
  revenue: {
    total: number;
    paid: number;
    pending: number;
  };
  jobs: {
    completed: number;
    total: number;
    completionRate: number;
    avgJobHours: number;
    inProgress: number;
  };
}

export function RevenueOverviewCards({ revenue, jobs }: RevenueOverviewCardsProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t.analytics.totalRevenue}</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{formatCurrency(revenue.total, locale)}</p>
          <div className="flex items-center mt-2 text-sm">
            {revenue.paid >= revenue.pending ? (
              <>
                <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                <span className="text-emerald-600">{formatCurrency(revenue.paid, locale)} {t.analytics.collected}</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="h-4 w-4 text-amber-500 mr-1" />
                <span className="text-amber-600">{formatCurrency(revenue.pending, locale)} {t.analytics.pending}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t.analytics.completedJobs}</span>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{jobs.completed}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t.analytics.ofTotal.replace('{total}', jobs.total.toString()).replace('{rate}', jobs.completionRate.toString())}
          </p>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t.analytics.avgJobTime}</span>
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{jobs.avgJobHours}h</p>
          <p className="text-sm text-muted-foreground mt-2">
            {jobs.inProgress} {t.analytics.inProgress}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
