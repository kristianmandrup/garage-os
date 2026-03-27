'use client';

import Link from 'next/link';
import { ArrowLeft, Edit2, Trash2, Package } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';

interface PartDetailHeaderProps {
  part: {
    name: string;
    part_number: string | null;
    category: string;
    quantity: number;
    status: string;
  };
  statusConfig: {
    labelKey: string;
    color: string;
  };
  statusLabel: string;
  editing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function PartDetailHeader({
  part,
  statusConfig,
  statusLabel,
  editing,
  onEdit,
  onDelete,
}: PartDetailHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            part.quantity === 0 ? 'bg-red-100 dark:bg-red-900/30' :
            part.status === 'low_stock' ? 'bg-amber-100 dark:bg-amber-900/30' :
            'bg-emerald-100 dark:bg-emerald-900/30'
          )}>
            <Package className={cn(
              'h-6 w-6',
              part.quantity === 0 ? 'text-red-600 dark:text-red-400' :
              part.status === 'low_stock' ? 'text-amber-600 dark:text-amber-400' :
              'text-emerald-600 dark:text-emerald-400'
            )} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{part.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              {part.part_number && <span>#{part.part_number}</span>}
              <span>•</span>
              <span>{part.category}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Badge className={statusConfig.color}>{statusLabel}</Badge>
        {!editing && (
          <>
            <Button variant="outline" onClick={onEdit}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Part
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
