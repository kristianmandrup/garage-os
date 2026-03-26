'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Building2,
  DollarSign,
  Wrench,
  CheckCircle,
  Package,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';

interface ShopAnalytics {
  shop: {
    id: string;
    name: string;
    logo_url: string | null;
  };
  revenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalJobs: number;
  completedJobs: number;
  completionRate: number;
  lowStockCount: number;
  totalParts: number;
}

interface AggregateData {
  aggregate: {
    totalRevenue: number;
    paidRevenue: number;
    pendingRevenue: number;
    totalJobs: number;
    completedJobs: number;
    completionRate: number;
    totalPartsUsed: number;
    totalPartsValue: number;
    totalShops: number;
  };
  shopBreakdown: ShopAnalytics[];
  revenueByDay: Record<string, number>;
  jobsByStatus: Record<string, number>;
  period: number;
  shops: Array<{ id: string; name: string; logo_url: string | null }>;
}

const STATUS_LABELS: Record<string, string> = {
  inspection: 'Inspection',
  diagnosed: 'Diagnosed',
  parts_ordered: 'Parts Ordered',
  in_progress: 'In Progress',
  pending_approval: 'Pending Approval',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function MultiShopAnalyticsPage() {
  const [data, setData] = useState<AggregateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [selectedShop, setSelectedShop] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, [period, selectedShop]);

  const fetchAnalytics = async () => {
    try {
      const params = new URLSearchParams();
      params.set('period', period);
      if (selectedShop) params.set('shop_id', selectedShop);

      const response = await fetch(`/api/shops/analytics/aggregate?${params}`);
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="p-6"><div className="h-24 bg-muted rounded animate-pulse" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Unable to load analytics</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...Object.values(data.revenueByDay), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Multi-Shop Analytics
          </h1>
          <p className="text-muted-foreground">
            Overview across all your shops
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={selectedShop || ''}
            onChange={(e) => setSelectedShop(e.target.value || null)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">All Shops</option>
            {data.shops.map(shop => (
              <option key={shop.id} value={shop.id}>{shop.name}</option>
            ))}
          </select>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-10 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{formatCurrency(data.aggregate.totalRevenue)}</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Jobs</span>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Wrench className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{data.aggregate.totalJobs}</p>
            <p className="text-sm text-muted-foreground">
              {data.aggregate.completedJobs} completed ({data.aggregate.completionRate}%)
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Parts Used</span>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{data.aggregate.totalPartsUsed}</p>
            <p className="text-sm text-muted-foreground">
              {formatCurrency(data.aggregate.totalPartsValue)} value
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Shops</span>
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{data.aggregate.totalShops}</p>
            <p className="text-sm text-muted-foreground">
              {selectedShop ? 'Single shop view' : 'All shops combined'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Daily revenue over the last {data.period} days</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(data.revenueByDay).length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No revenue data for this period
            </div>
          ) : (
            <div className="flex items-end gap-1 h-48">
              {Object.entries(data.revenueByDay)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([day, amount]) => {
                  const height = (amount / maxRevenue) * 100;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t transition-all hover:from-emerald-500 hover:to-emerald-300"
                        style={{ height: `${Math.max(height, 4)}%` }}
                        title={formatCurrency(amount)}
                      />
                      <span className="text-xs text-muted-foreground">
                        {new Date(day).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shop Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Shop Performance</CardTitle>
          <CardDescription>Comparison across your shops</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.shopBreakdown.map((shop) => (
              <div key={shop.shop.id} className="p-4 rounded-xl border bg-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    {shop.shop.logo_url ? (
                      <img src={shop.shop.logo_url} alt="" className="w-full h-full rounded object-contain" />
                    ) : (
                      <Building2 className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{shop.shop.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {shop.totalJobs} jobs • {shop.completionRate}% completion
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold">{formatCurrency(shop.revenue)}</p>
                    <p className="text-xs text-muted-foreground">Revenue</p>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 text-center">
                    <p className="text-lg font-bold text-emerald-600">{formatCurrency(shop.paidRevenue)}</p>
                    <p className="text-xs text-muted-foreground">Collected</p>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-center">
                    <p className="text-lg font-bold text-amber-600">{formatCurrency(shop.pendingRevenue)}</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>

                {shop.lowStockCount > 0 && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-amber-600">
                    <Package className="h-4 w-4" />
                    {shop.lowStockCount} items low stock
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Jobs by Status */}
      <Card>
        <CardHeader>
          <CardTitle>Jobs by Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(data.jobsByStatus).map(([status, count]) => (
              <div key={status} className="p-3 rounded-lg border bg-card text-center">
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{STATUS_LABELS[status] || status}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
