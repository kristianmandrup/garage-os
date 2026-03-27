'use client';

import { Plus } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';

interface RemindersHeaderProps {
  showNew: boolean;
  onToggleNew: () => void;
}

export function RemindersHeader({ showNew, onToggleNew }: RemindersHeaderProps) {
  const t = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.nav.reminders}</h1>
        <p className="text-muted-foreground">
          {t.reminder.pageDescription}
        </p>
      </div>
      <Button className="btn-gradient" onClick={onToggleNew}>
        <Plus className="h-4 w-4 mr-2" />
        {t.reminder.newReminder}
      </Button>
    </div>
  );
}
