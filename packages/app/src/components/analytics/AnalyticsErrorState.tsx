'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/i18n';

export function AnalyticsErrorState() {
  const t = useTranslation();

  return (
    <div className="text-center py-12">
      <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{t.analytics.unableToLoad}</h3>
      <p className="text-muted-foreground">{t.analytics.tryAgainLater}</p>
    </div>
  );
}
