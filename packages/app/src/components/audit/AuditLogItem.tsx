'use client';

import { Badge } from '@garageos/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@garageos/ui/avatar';
import type { AuditItem } from '@/hooks/useAuditLog';

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  job_card_created: { label: 'Job Created', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  job_card_completed: { label: 'Job Completed', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  photo_uploaded: { label: 'Photo', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  inspection_complete: { label: 'Inspection', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' },
  invoice_sent: { label: 'Invoice Sent', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300' },
  invoice_paid: { label: 'Invoice Paid', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  message_sent: { label: 'Message', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  vehicle_added: { label: 'Vehicle Added', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  part_used: { label: 'Part Used', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function relativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.floor((now - then) / 1000);

  if (diffSec < 60) return 'just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface AuditLogItemProps {
  item: AuditItem;
}

export function AuditLogItem({ item }: AuditLogItemProps) {
  const config = TYPE_CONFIG[item.type] || { label: item.type, color: 'bg-gray-100 text-gray-800' };
  const userName = item.user?.name || 'Unknown User';

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <Avatar className="h-9 w-9 shrink-0 mt-0.5">
        <AvatarImage src={item.user?.avatar_url || undefined} alt={userName} />
        <AvatarFallback className="text-xs">{getInitials(userName)}</AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">{userName}</span>
          <Badge className={`text-[10px] px-1.5 py-0 font-normal ${config.color}`}>
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">{item.title}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{item.description}</p>
        )}
      </div>

      <span className="text-xs text-muted-foreground shrink-0 mt-1">
        {relativeTime(item.created_at)}
      </span>
    </div>
  );
}
