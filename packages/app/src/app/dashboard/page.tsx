'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Wrench,
  Car,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowRight,
  Camera,
  FileText,
  Package,
  Plus,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Button } from '@garageos/ui/button';
import { Badge } from '@garageos/ui/badge';
import { Progress } from '@garageos/ui/progress';
import { useTranslation, useLocale } from '@/i18n';
import { formatRelativeTime } from '@/i18n';

interface JobCard {
  id: string;
  title: string;
  status: string;
  created_at: string;
  vehicle: { license_plate: string; brand: string; model: string };
  customer: { name: string };
  assigned_to: { name: string } | null;
}

interface Part {
  id: string;
  name: string;
  quantity: number;
  min_quantity: number | null;
  status: string;
}

interface Stats {
  activeJobs: number;
  totalVehicles: number;
  totalCustomers: number;
  lowStockCount: number;
}

const statusConfig: Record<string, { labelKey: string; color: string; icon: typeof CheckCircle }> = {
  inspection: { labelKey: 'inspection', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: Clock },
  diagnosed: { labelKey: 'diagnosed', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: FileText },
  parts_ordered: { labelKey: 'partsOrdered', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', icon: Package },
  in_progress: { labelKey: 'inProgress', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400', icon: Wrench },
  pending_approval: { labelKey: 'pendingApproval', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', icon: AlertCircle },
  completed: { labelKey: 'completed', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
  cancelled: { labelKey: 'cancelled', color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400', icon: AlertCircle },
};

export default function DashboardPage() {
  const t = useTranslation();
  const { locale } = useLocale();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    activeJobs: 0,
    totalVehicles: 0,
    totalCustomers: 0,
    lowStockCount: 0,
  });
  const [recentJobs, setRecentJobs] = useState<JobCard[]>([]);
  const [lowStockParts, setLowStockParts] = useState<Part[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch job cards
      const jobsRes = await fetch('/api/job-cards');
      if (jobsRes.ok) {
        const jobs = await jobsRes.json();
        const activeStatuses = ['inspection', 'diagnosed', 'parts_ordered', 'in_progress', 'pending_approval'];
        const activeJobs = jobs.filter((j: JobCard) => activeStatuses.includes(j.status)).length;
        setStats(prev => ({ ...prev, activeJobs }));
        setRecentJobs(jobs.slice(0, 5));
      }

      // Fetch vehicles
      const vehiclesRes = await fetch('/api/vehicles');
      if (vehiclesRes.ok) {
        const vehicles = await vehiclesRes.json();
        setStats(prev => ({ ...prev, totalVehicles: vehicles.length }));
      }

      // Fetch customers
      const customersRes = await fetch('/api/customers');
      if (customersRes.ok) {
        const customers = await customersRes.json();
        setStats(prev => ({ ...prev, totalCustomers: customers.length }));
      }

      // Fetch low stock parts
      const partsRes = await fetch('/api/parts?low_stock=true');
      if (partsRes.ok) {
        const parts = await partsRes.json();
        setLowStockParts(parts.slice(0, 5));
        setStats(prev => ({ ...prev, lowStockCount: parts.length }));
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    return formatRelativeTime(date, locale, t.dateTime);
  };

  const statCards = [
    { nameKey: 'activeJobs' as const, value: stats.activeJobs, icon: Wrench, color: 'blue' },
    { nameKey: 'totalVehicles' as const, value: stats.totalVehicles, icon: Car, color: 'emerald' },
    { nameKey: 'totalCustomers' as const, value: stats.totalCustomers, icon: Users, color: 'purple' },
    { nameKey: 'lowStockItems' as const, value: stats.lowStockCount, icon: AlertCircle, color: stats.lowStockCount > 0 ? 'red' : 'amber' },
  ];

  const quickActions = [
    { nameKey: 'newJobCard' as const, href: '/dashboard/job-cards/new', icon: Wrench, color: 'blue' },
    { nameKey: 'addVehicle' as const, href: '/dashboard/vehicles/new', icon: Car, color: 'emerald' },
    { nameKey: 'addCustomer' as const, href: '/dashboard/customers/new', icon: Users, color: 'purple' },
    { nameKey: 'aiInspection' as const, href: '/dashboard/inspection', icon: Camera, color: 'amber' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.nav.dashboard}</h1>
          <p className="text-muted-foreground">
            {t.dashboard.welcome}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/job-cards/new">
            <Button className="btn-gradient">
              <Plus className="h-4 w-4 mr-2" />
              {t.dashboard.newJobCard}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.nameKey} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  stat.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  stat.color === 'red' ? 'bg-red-100 dark:bg-red-900/30' :
                  'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  <stat.icon className={`h-6 w-6 ${
                    stat.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    stat.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    stat.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    stat.color === 'red' ? 'text-red-600 dark:text-red-400' :
                    'text-amber-600 dark:text-amber-400'
                  }`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{loading ? '-' : stat.value}</p>
                <p className="text-sm text-muted-foreground">{t.dashboard[stat.nameKey]}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link key={action.nameKey} href={action.href}>
            <Card className="card-hover cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
                  action.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                  action.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  action.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                  'bg-amber-100 dark:bg-amber-900/30'
                }`}>
                  <action.icon className={`h-7 w-7 ${
                    action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    action.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                    'text-amber-600 dark:text-amber-400'
                  }`} />
                </div>
                <p className="font-medium">{t.dashboard.quickActionsLabels[action.nameKey]}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Jobs */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{t.dashboard.recentJobCards}</CardTitle>
              <CardDescription>{t.dashboard.welcome}</CardDescription>
            </div>
            <Link href="/dashboard/job-cards">
              <Button variant="ghost" size="sm">
                {t.dashboard.viewAll}
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentJobs.length === 0 ? (
              <div className="text-center py-8">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">{t.dashboard.noJobCards}</p>
                <Link href="/dashboard/job-cards/new" className="mt-2 inline-block">
                  <Button size="sm">{t.dashboard.createFirstJobCard}</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentJobs.map((job) => {
                  const status = statusConfig[job.status] || statusConfig.inspection;
                  return (
                    <Link key={job.id} href={`/dashboard/job-cards/${job.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-xl bg-accent/50 hover:bg-accent transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                            <Wrench className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {job.vehicle?.brand} {job.vehicle?.model} - {job.vehicle?.license_plate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={status.color}>
                            <status.icon className="h-3 w-3 mr-1" />
                            {t.dashboard.statuses[status.labelKey as keyof typeof t.dashboard.statuses]}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {getTimeAgo(job.created_at)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>{t.dashboard.inventoryAlerts}</CardTitle>
            <CardDescription>{t.dashboard.lowStockItems}</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                ))}
              </div>
            ) : lowStockParts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
                <p className="font-medium">{t.dashboard.allStockedUp}</p>
                <p className="text-sm text-muted-foreground">{t.dashboard.noLowStockAlerts}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lowStockParts.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{item.name}</span>
                      <span className={`text-sm ${
                        item.quantity === 0 ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'
                      }`}>
                        {item.quantity}/{item.min_quantity || 0}
                      </span>
                    </div>
                    <Progress
                      value={item.min_quantity ? Math.min((item.quantity / item.min_quantity) * 100, 100) : 100}
                      className={item.quantity === 0 ? '[&>div]:bg-red-500' : '[&>div]:bg-amber-500'}
                    />
                  </div>
                ))}
              </div>
            )}
            <Link href="/dashboard/inventory">
              <Button variant="outline" className="w-full mt-4">
                {t.nav.inventory}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
