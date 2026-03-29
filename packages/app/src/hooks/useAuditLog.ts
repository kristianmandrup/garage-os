import { useState, useEffect, useCallback } from 'react';

export interface AuditFilters {
  type: string;
  userId: string;
  from: string;
  to: string;
}

export interface AuditItem {
  id: string;
  shop_id: string;
  user_id: string;
  type: string;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  user: { id: string; name: string; avatar_url: string | null } | null;
}

const DEFAULT_FILTERS: AuditFilters = { type: '', userId: '', from: '', to: '' };

export function useAuditLog() {
  const [items, setItems] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<AuditFilters>(DEFAULT_FILTERS);

  const fetchLog = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filters.type) params.set('type', filters.type);
      if (filters.userId) params.set('user_id', filters.userId);
      if (filters.from) params.set('from', filters.from);
      if (filters.to) params.set('to', filters.to);

      const res = await fetch(`/api/audit-log?${params}`);
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch audit log:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchLog(); }, [fetchLog]);

  // Reset to page 1 when filters change
  const updateFilters = useCallback((next: AuditFilters) => {
    setFilters(next);
    setPage(1);
  }, []);

  return { items, loading, page, totalPages, setPage, filters, setFilters: updateFilters };
}
