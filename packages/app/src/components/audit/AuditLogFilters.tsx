'use client';

import { Input } from '@garageos/ui/input';
import type { AuditFilters } from '@/hooks/useAuditLog';

const ACTIVITY_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'job_card_created', label: 'Job Card Created' },
  { value: 'job_card_completed', label: 'Job Card Completed' },
  { value: 'photo_uploaded', label: 'Photo Uploaded' },
  { value: 'inspection_complete', label: 'Inspection Complete' },
  { value: 'invoice_sent', label: 'Invoice Sent' },
  { value: 'invoice_paid', label: 'Invoice Paid' },
  { value: 'message_sent', label: 'Message Sent' },
  { value: 'vehicle_added', label: 'Vehicle Added' },
  { value: 'part_used', label: 'Part Used' },
] as const;

interface AuditLogFiltersProps {
  filters: AuditFilters;
  onFilterChange: (filters: AuditFilters) => void;
}

export function AuditLogFilters({ filters, onFilterChange }: AuditLogFiltersProps) {
  const update = (key: keyof AuditFilters, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <select
        value={filters.type}
        onChange={(e) => update('type', e.target.value)}
        className="h-10 px-3 rounded-md border border-input bg-background text-sm"
      >
        {ACTIVITY_TYPES.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      <Input
        type="date"
        value={filters.from}
        onChange={(e) => update('from', e.target.value)}
        className="w-auto"
        placeholder="From date"
      />

      <Input
        type="date"
        value={filters.to}
        onChange={(e) => update('to', e.target.value)}
        className="w-auto"
        placeholder="To date"
      />

      <Input
        type="text"
        value={filters.userId}
        onChange={(e) => update('userId', e.target.value)}
        className="w-auto"
        placeholder="Filter by user ID"
      />
    </div>
  );
}
