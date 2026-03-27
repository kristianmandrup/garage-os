'use client';

import { useTranslation } from '@/i18n';

interface AnalyticsHeaderProps {
  period: string;
  onPeriodChange: (period: string) => void;
}

export function AnalyticsHeader({ period, onPeriodChange }: AnalyticsHeaderProps) {
  const t = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.nav.analytics}</h1>
        <p className="text-muted-foreground">
          {t.analytics.description}
        </p>
      </div>
      <select
        value={period}
        onChange={(e) => onPeriodChange(e.target.value)}
        className="h-10 px-3 rounded-md border border-input bg-background text-sm"
      >
        <option value="7">{t.analytics.last7Days}</option>
        <option value="30">{t.analytics.last30Days}</option>
        <option value="90">{t.analytics.last90Days}</option>
      </select>
    </div>
  );
}
