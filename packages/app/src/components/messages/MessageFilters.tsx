'use client';

import { Search } from 'lucide-react';
import { Input } from '@garageos/ui/input';
import { CHANNELS } from '@/lib/messaging/templates';
import { useTranslation } from '@/i18n';

interface MessageFiltersProps {
  search: string;
  channelFilter: string;
  onSearchChange: (search: string) => void;
  onChannelChange: (channel: string) => void;
}

export function MessageFilters({
  search,
  channelFilter,
  onSearchChange,
  onChannelChange,
}: MessageFiltersProps) {
  const t = useTranslation();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t.message.searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <select
        value={channelFilter}
        onChange={(e) => onChannelChange(e.target.value)}
        className="h-10 px-3 rounded-md border border-input bg-background text-sm"
      >
        <option value="">{t.message.allChannels}</option>
        {CHANNELS.map(ch => (
          <option key={ch.value} value={ch.value}>{ch.label}</option>
        ))}
      </select>
    </div>
  );
}
