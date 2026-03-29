'use client';

import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { StatusBadge } from '@garageos/ui/status-badge';
import { useTranslation, useLocale, formatDateOnly } from '@/i18n';

interface JobCardHeaderProps {
  title: string;
  status: string;
  createdAt: string;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function JobCardHeader({
  title,
  status,
  createdAt,
  editing,
  onEdit,
  onDelete,
}: JobCardHeaderProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/job-cards">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted-foreground">
            {t.jobCards.detail.created} {formatDateOnly(new Date(createdAt), locale)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <StatusBadge status={status as any} />
        {!editing && (
          <>
            <Button variant="outline" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              {t.common.edit}
            </Button>
            <Button variant="destructive" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
