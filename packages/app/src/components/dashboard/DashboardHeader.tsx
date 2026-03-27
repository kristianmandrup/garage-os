'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';

export function DashboardHeader() {
  const t = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.nav.dashboard}</h1>
        <p className="text-muted-foreground">
          {t.dashboard.welcome}
        </p>
      </div>
      <div className="flex gap-3">
        <Link href="/dashboard/job-cards/new">
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            {t.dashboard.newJobCard}
          </Button>
        </Link>
      </div>
    </div>
  );
}
