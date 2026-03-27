'use client';

import { useTranslation } from '@/i18n';

interface TasksHeaderProps {}

export function TasksHeader({}: TasksHeaderProps) {
  const t = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.tasks.title}</h1>
        <p className="text-muted-foreground">
          {t.tasks.description}
        </p>
      </div>
    </div>
  );
}
