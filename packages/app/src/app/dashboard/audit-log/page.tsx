'use client';

import { useTranslation } from '@/i18n';
import { Card, CardContent } from '@garageos/ui/card';
import { Skeleton } from '@garageos/ui/skeleton';
import { Button } from '@garageos/ui/button';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuditLog } from '@/hooks/useAuditLog';
import { AuditLogFilters } from '@/components/audit/AuditLogFilters';
import { AuditLogItem } from '@/components/audit/AuditLogItem';

export default function AuditLogPage() {
  const t = useTranslation();
  const { items, loading, page, totalPages, setPage, filters, setFilters } = useAuditLog();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Log</h1>
          <p className="text-sm text-muted-foreground">Track all activity across your shop</p>
        </div>
      </div>

      {/* Filters */}
      <AuditLogFilters filters={filters} onFilterChange={setFilters} />

      {/* List */}
      <Card>
        <CardContent className="p-0 divide-y divide-border">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-3 w-12" />
              </div>
            ))
          ) : items.length === 0 ? (
            <div className="py-16 text-center">
              <ClipboardList className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
              <p className="text-sm text-muted-foreground">No activity found</p>
            </div>
          ) : (
            items.map((item) => <AuditLogItem key={item.id} item={item} />)
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
