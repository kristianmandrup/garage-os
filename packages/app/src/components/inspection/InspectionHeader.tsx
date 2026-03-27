'use client';

import { useTranslation } from '@/i18n';

export function InspectionHeader() {
  const t = useTranslation();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{t.inspection.title}</h1>
      <p className="text-muted-foreground">
        {t.inspection.description}
      </p>
    </div>
  );
}
