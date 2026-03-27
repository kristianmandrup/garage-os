'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { DataTable, type Column } from '@garageos/ui/data-table';
import { Skeleton } from '@garageos/ui/skeleton';
import { cn } from '@garageos/ui/utils';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@garageos/ui/breadcrumb';
import { useTranslation, useLocale, formatCurrency, formatDateOnly } from '@/i18n';

interface Invoice {
  id: string;
  invoice_number: string;
  status: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  created_at: string;
  due_date: string | null;
  customer: { name: string; phone: string };
  job_card: {
    title: string;
    vehicle: { license_plate: string; brand: string; model: string };
  };
}

const STATUS_CONFIG = {
  draft: { labelKey: 'draft', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400', icon: FileText },
  sent: { labelKey: 'sent', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  paid: { labelKey: 'paid', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  overdue: { labelKey: 'overdue', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertTriangle },
  cancelled: { labelKey: 'cancelled', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400', icon: XCircle },
};

export default function InvoicesPage() {
  const t = useTranslation();
  const { locale } = useLocale();
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/invoices?${params}`);
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalOutstanding = invoices
    .filter(i => ['draft', 'sent', 'overdue'].includes(i.status))
    .reduce((sum, i) => sum + i.total, 0);

  const totalPaid = invoices
    .filter(i => i.status === 'paid')
    .reduce((sum, i) => sum + i.total, 0);

  const columns: Column<Invoice>[] = [
    {
      key: 'invoice_number',
      header: 'Invoice #',
      sortable: true,
      render: (inv) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shrink-0">
            <FileText className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">{inv.invoice_number}</span>
        </div>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (inv) => <span>{inv.customer?.name}</span>,
    },
    {
      key: 'vehicle',
      header: 'Vehicle',
      render: (inv) => <span className="text-muted-foreground">{inv.job_card?.vehicle?.license_plate}</span>,
    },
    {
      key: 'total',
      header: 'Amount',
      sortable: true,
      render: (inv) => <span className="font-medium">{formatCurrency(inv.total, locale)}</span>,
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: (inv) => <span className="text-muted-foreground text-sm">{formatDateOnly(new Date(inv.created_at), locale)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (inv) => {
        const status = STATUS_CONFIG[inv.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
        return <Badge className={status.color}>{t.invoice.statuses[status.labelKey as keyof typeof t.invoice.statuses]}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Invoices</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.nav.invoices}</h1>
          <p className="text-muted-foreground">
            {t.invoice.description}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{invoices.length}</p>
                <p className="text-sm text-muted-foreground">{t.invoice.totalInvoices}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={totalOutstanding > 0 ? 'border-amber-500' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalOutstanding, locale)}</p>
                <p className="text-sm text-muted-foreground">{t.invoice.outstanding}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${totalOutstanding > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                <AlertTriangle className={`h-6 w-6 ${totalOutstanding > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalPaid, locale)}</p>
                <p className="text-sm text-muted-foreground">{t.invoice.paid}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Filter */}
      <div className="flex gap-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">{t.invoice.allStatus}</option>
          <option value="draft">{t.invoice.statuses.draft}</option>
          <option value="sent">{t.invoice.statuses.sent}</option>
          <option value="paid">{t.invoice.statuses.paid}</option>
          <option value="overdue">{t.invoice.statuses.overdue}</option>
        </select>
      </div>

      {/* Invoices List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32 ml-auto" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          data={invoices.filter(inv => !statusFilter || inv.status === statusFilter)}
          columns={columns}
          searchable
          searchPlaceholder={t.invoice.searchPlaceholder}
          getRowKey={(inv) => inv.id}
          onRowClick={(inv) => router.push(`/dashboard/invoices/${inv.id}`)}
          emptyMessage={t.invoice.noInvoicesFound}
          exportable
          exportFilename="invoices"
        />
      )}
    </div>
  );
}
