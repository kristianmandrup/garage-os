'use client';

import { Plus } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { useTranslation } from '@/i18n';

interface MessagesHeaderProps {
  onNewMessage: () => void;
}

export function MessagesHeader({ onNewMessage }: MessagesHeaderProps) {
  const t = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t.nav.messages}</h1>
        <p className="text-muted-foreground">
          {t.message.description}
        </p>
      </div>
      <Button className="btn-gradient" onClick={onNewMessage}>
        <Plus className="h-4 w-4 mr-2" />
        {t.message.newMessage}
      </Button>
    </div>
  );
}
