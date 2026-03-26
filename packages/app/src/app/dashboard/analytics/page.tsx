'use client';

import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wrench,
  Users,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Car,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';

interface Analytics {
  revenue: {
    total: number;
    paid: number;
    pending: number;
    byDay: Record<string, number>;
  };
  jobs: {
    total: number;
    completed: number;
    inProgress: number;
    completionRate: number;
    avgJobHours: number;
    byStatus: Record<string, number>;
  };
  inventory: {
    totalParts: number;
    lowStock: number;
    outOfStock: number;
    partsUsed: number;
    partsValue: number;
    topParts: Array<{ id: string; name: string; quantity: number; value: number }>;
  };
  mechanics: Array<{
    id: string;
    name: string;
    completed: number;
    inProgress: number;
    totalHours: number;
  }>;
  customerRetention: {
    total: number;
    returning: number;
    rate: number;
  };
  period: number;
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

const STATUS_COLORS: Record<string, string> = {
  inspection: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  diagnosed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  parts_ordered: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  in_progress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  pending_approval: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  cancelled: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics?period=${period}`);
      if (response.ok) {
        const data = await response.json();
        setAnalytics(data);
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

  const getMaxRevenue = () => {
    if (!analytics?.revenue.byDay) return 0;
    return Math.max(...Object.values(analytics.revenue.byDay), 1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}><CardContent className="p-6"><div className="h-24 bg-muted rounded animate-pulse" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Unable to load analytics</h3>
        <p className="text-muted-foreground">Please try again later</p>
      </div>
    );
  }

  const maxRevenue = getMaxRevenue();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Insights for your shop performance
          </p>
        </div>
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

      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{formatCurrency(analytics.revenue.total)}</p>
            <div className="flex items-center mt-2 text-sm">
              {analytics.revenue.paid >= analytics.revenue.pending ? (
                <>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500 mr-1" />
                  <span className="text-emerald-600">{formatCurrency(analytics.revenue.paid)} collected</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-amber-600">{formatCurrency(analytics.revenue.pending)} pending</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Completed Jobs</span>
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{analytics.jobs.completed}</p>
            <p className="text-sm text-muted-foreground mt-2">
              of {analytics.jobs.total} total ({analytics.jobs.completionRate}% rate)
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Avg. Job Time</span>
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">{analytics.jobs.avgJobHours}h</p>
            <p className="text-sm text-muted-foreground mt-2">
              {analytics.jobs.inProgress} jobs in progress
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Trend</CardTitle>
          <CardDescription>Daily revenue over the last {analytics.period} days</CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(analytics.revenue.byDay).length === 0 ? (
            <div className="h-48 flex items-center justify-center text-muted-foreground">
              No revenue data for this period
            </div>
          ) : (
            <div className="flex items-end gap-1 h-48">
              {Object.entries(analytics.revenue.byDay)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([day, amount]) => {
                  const height = (amount / maxRevenue) * 100;
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-500 hover:to-blue-300"
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

      {/* Jobs & Inventory Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Jobs by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Job Status Distribution</CardTitle>
            <CardDescription>Current job breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.jobs.byStatus).map(([status, count]) => {
                const percentage = analytics.jobs.total > 0 ? (count / analytics.jobs.total) * 100 : 0;
                return (
                  <div key={status} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <Badge className={cn(STATUS_COLORS[status] || 'bg-slate-100')}>
                        {STATUS_LABELS[status] || status}
                      </Badge>
                      <span className="font-medium">{count} ({percentage.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', STATUS_COLORS[status]?.replace('bg-', 'bg-').replace('text-', 'text-') || 'bg-slate-500')}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Health</CardTitle>
            <CardDescription>Parts usage and stock status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Package className="h-4 w-4" /> Total Parts
                </div>
                <p className="text-2xl font-bold">{analytics.inventory.totalParts}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" /> Parts Used
                </div>
                <p className="text-2xl font-bold">{analytics.inventory.partsUsed}</p>
              </div>
              <div className={cn(
                'p-4 rounded-xl',
                analytics.inventory.lowStock > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
              )}>
                <div className="flex items-center gap-2 text-sm mb-1">
                  <AlertTriangle className="h-4 w-4" /> Low Stock
                </div>
                <p className={cn(
                  'text-2xl font-bold',
                  analytics.inventory.lowStock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
                )}>
                  {analytics.inventory.lowStock}
                </p>
              </div>
              <div className={cn(
                'p-4 rounded-xl',
                analytics.inventory.outOfStock > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted/50'
              )}>
                <div className="flex items-center gap-2 text-sm mb-1">
                  <AlertTriangle className="h-4 w-4" /> Out of Stock
                </div>
                <p className={cn(
                  'text-2xl font-bold',
                  analytics.inventory.outOfStock > 0 ? 'text-red-600 dark:text-red-400' : ''
                )}>
                  {analytics.inventory.outOfStock}
                </p>
              </div>
            </div>

            {/* Top Parts */}
            {analytics.inventory.topParts.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3">Most Used Parts</h4>
                <div className="space-y-2">
                  {analytics.inventory.topParts.map((part) => (
                    <div key={part.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-sm">{part.name}</p>
                        <p className="text-xs text-muted-foreground">{part.quantity} units</p>
                      </div>
                      <p className="font-medium text-sm">{formatCurrency(part.value)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Mechanic Productivity */}
      {analytics.mechanics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Mechanic Productivity</CardTitle>
            <CardDescription>Jobs completed and hours logged by mechanic</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {analytics.mechanics.map((mechanic) => (
                <div key={mechanic.id} className="p-4 rounded-xl border bg-card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-medium">{mechanic.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{mechanic.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {mechanic.inProgress} in progress
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                      <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{mechanic.completed}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{mechanic.totalHours.toFixed(0)}</p>
                      <p className="text-xs text-muted-foreground">Hours</p>
                    </div>
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                        {mechanic.completed > 0 ? (mechanic.totalHours / mechanic.completed).toFixed(1) : 0}h
                      </p>
                      <p className="text-xs text-muted-foreground">Avg/Job</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Customer Retention */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Retention</CardTitle>
          <CardDescription>Returning customers analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray={`${analytics.customerRetention.rate * 2.51} 251`}
                  className="text-emerald-500"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{analytics.customerRetention.rate}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Returning Customer Rate</p>
              <p className="text-lg font-semibold mt-1">
                {analytics.customerRetention.returning} returning out of {analytics.customerRetention.total} customers
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Customers with more than one job card
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
