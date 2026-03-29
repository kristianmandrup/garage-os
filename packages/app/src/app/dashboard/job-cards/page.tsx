'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Wrench, Plus } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { DataTable, type Column } from '@garageos/ui/data-table';
import { Skeleton } from '@garageos/ui/skeleton';
import { cn } from '@garageos/ui/utils';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@garageos/ui/breadcrumb';
import { useTranslation } from '@/i18n';

interface JobCard {
  id: string;
  title: string;
  status: string;
  created_at: string;
  vehicle: { license_plate: string; brand: string; model: string };
  customer: { name: string; phone: string };
  assigned_to: { name: string } | null;
}

export default function JobCardsPage() {
  const t = useTranslation();
  const router = useRouter();
  const [jobCards, setJobCards] = useState<JobCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchJobCards();
  }, [statusFilter]);

  const fetchJobCards = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/job-cards?${params}`);
      if (response.ok) {
        const data = await response.json();
        setJobCards(data);
      }
    } catch (error) {
      console.error('Failed to fetch job cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    inspection: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    diagnosed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    parts_ordered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    in_progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    pending_approval: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  };

  const columns: Column<JobCard>[] = [
    {
      key: 'title',
      header: 'Job',
      sortable: true,
      render: (card) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
            <Wrench className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium">{card.title}</p>
            <p className="text-xs text-muted-foreground">{card.vehicle?.brand} {card.vehicle?.model}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'vehicle',
      header: 'Plate',
      render: (card) => <span className="font-mono text-sm">{card.vehicle?.license_plate}</span>,
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (card) => <span>{card.customer?.name}</span>,
    },
    {
      key: 'assigned_to',
      header: 'Assigned',
      render: (card) => <span className="text-muted-foreground">{card.assigned_to?.name || '—'}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (card) => {
        const color = statusColors[card.status] || statusColors.completed;
        const label = t.jobCards.detail.statuses[card.status as keyof typeof t.jobCards.detail.statuses] || card.status;
        return <Badge className={color}>{label}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Job Cards</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.nav.jobCards}</h1>
          <p className="text-muted-foreground">
            {t.jobCards.description}
          </p>
        </div>
        <Link href="/dashboard/job-cards/new">
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            {t.jobCards.newJobCard}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">{t.jobCards.allStatus}</option>
          {Object.entries(t.jobCards.detail.statuses).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {Object.entries(t.jobCards.detail.statuses).slice(0, 4).map(([key, label]) => {
          const count = jobCards.filter(c => c.status === key).length;
          const color = statusColors[key] || statusColors.completed;
          return (
            <Card
              key={key}
              className={cn('cursor-pointer transition-all hover:scale-105', statusFilter === key && 'ring-2 ring-primary')}
              onClick={() => setStatusFilter(statusFilter === key ? '' : key)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{label}</span>
                  <Badge className={color}>{count}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Job Cards List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          data={jobCards.filter(c => !statusFilter || c.status === statusFilter)}
          columns={columns}
          searchable
          searchPlaceholder={t.jobCards.searchPlaceholder}
          getRowKey={(c) => c.id}
          onRowClick={(c) => router.push(`/dashboard/job-cards/${c.id}`)}
          emptyMessage={t.jobCards.noJobCardsFound}
          exportable
          exportFilename="job-cards"
        />
      )}
    </div>
  );
}
