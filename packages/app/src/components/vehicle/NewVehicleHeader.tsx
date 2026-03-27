'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';

export function NewVehicleHeader() {
  const t = useTranslation();

  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard/vehicles">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.newVehicle.title}</h1>
        <p className="text-muted-foreground">
          {t.newVehicle.description}
        </p>
      </div>
    </div>
  );
}
