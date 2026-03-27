'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, Plus, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Progress } from '@garageos/ui/progress';
import { DataTable, type Column } from '@garageos/ui/data-table';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from '@garageos/ui/breadcrumb';
import { useTranslation, useLocale, formatCurrency } from '@/i18n';

interface Part {
  id: string;
  name: string;
  part_number: string | null;
  category: string;
  brand: string | null;
  quantity: number;
  min_quantity: number | null;
  cost_price: number;
  sell_price: number;
  status: string;
  supplier: { name: string } | null;
}

export default function InventoryPage() {
  const t = useTranslation();
  const { locale } = useLocale();
  const router = useRouter();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => {
    fetchParts();
  }, [lowStockOnly]);

  const fetchParts = async () => {
    try {
      const params = new URLSearchParams();
      if (lowStockOnly) params.set('low_stock', 'true');

      const response = await fetch(`/api/parts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setParts(data);
      }
    } catch (error) {
      console.error('Failed to fetch parts:', error);
    } finally {
      setLoading(false);
    }
  };

  const lowStockCount = parts.filter(p => p.quantity <= (p.min_quantity || 0)).length;
  const totalValue = parts.reduce((sum, p) => sum + (p.quantity * p.sell_price), 0);

  const getStockStatus = (part: Part) => {
    if (part.quantity === 0) return { labelKey: 'outOfStock' as const, color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
    if (part.min_quantity && part.quantity <= part.min_quantity) return { labelKey: 'lowStock' as const, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' };
    return { labelKey: 'inStock' as const, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' };
  };

  const columns: Column<Part>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (part) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${part.quantity === 0 ? 'bg-red-100 dark:bg-red-900/30' : part.min_quantity && part.quantity <= part.min_quantity ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
            <Package className={`h-4 w-4 ${part.quantity === 0 ? 'text-red-600 dark:text-red-400' : part.min_quantity && part.quantity <= part.min_quantity ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
          </div>
          <div>
            <p className="font-medium">{part.name}</p>
            <p className="text-xs text-muted-foreground">{part.category}{part.brand ? ` • ${part.brand}` : ''}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'part_number',
      header: t.inventory.partNumber ?? 'Part #',
      render: (part) => part.part_number ? <span className="text-muted-foreground">#{part.part_number}</span> : <span className="text-muted-foreground">—</span>,
    },
    {
      key: 'quantity',
      header: t.inventory.quantity ?? 'Stock',
      sortable: true,
      render: (part) => {
        const stockPercent = part.min_quantity ? Math.min((part.quantity / part.min_quantity) * 100, 100) : 100;
        return (
          <div className="min-w-[120px]">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{part.quantity}</span>
              {part.min_quantity != null && (
                <span className="text-xs text-muted-foreground">/ {part.min_quantity}</span>
              )}
            </div>
            <Progress
              value={stockPercent}
              className={`h-1.5 mt-1 ${part.quantity === 0 ? '[&>div]:bg-red-500' : stockPercent < 50 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'}`}
            />
          </div>
        );
      },
    },
    {
      key: 'sell_price',
      header: t.inventory.sellPrice ?? 'Price',
      sortable: true,
      render: (part) => <span className="font-medium">{formatCurrency(part.sell_price, locale)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (part) => {
        const status = getStockStatus(part);
        return <Badge className={status.color}>{t.inventory[status.labelKey]}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Inventory</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.nav.inventory}</h1>
          <p className="text-muted-foreground">
            {t.inventory.description}
          </p>
        </div>
        <Link href="/dashboard/inventory/new">
          <Button className="btn-gradient">
            <Plus className="h-4 w-4 mr-2" />
            {t.inventory.addPart}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{parts.length}</p>
                <p className="text-sm text-muted-foreground">{t.inventory.totalParts}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={lowStockCount > 0 ? 'border-amber-500' : ''}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{lowStockCount}</p>
                <p className="text-sm text-muted-foreground">{t.dashboard.lowStockItems}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${lowStockCount > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                {lowStockCount > 0 ? (
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalValue, locale)}</p>
                <p className="text-sm text-muted-foreground">{t.inventory.totalValue}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Filter */}
      <div className="flex items-center gap-4">
        <Button
          variant={lowStockOnly ? 'default' : 'outline'}
          onClick={() => setLowStockOnly(!lowStockOnly)}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          {t.inventory.lowStockOnly}
        </Button>
      </div>

      {/* Parts Table */}
      {loading ? (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-muted rounded animate-pulse" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <DataTable<Part>
          data={parts}
          columns={columns}
          searchable
          searchPlaceholder={t.inventory.searchPlaceholder}
          emptyMessage={t.inventory.noPartsFound}
          getRowKey={(part) => part.id}
          onRowClick={(part) => router.push(`/dashboard/inventory/${part.id}`)}
          exportable
          exportFilename="inventory"
        />
      )}
    </div>
  );
}
