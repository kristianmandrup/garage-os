'use client';

import { useState, useEffect } from 'react';
import {
  AnalyticsHeader,
  RevenueOverviewCards,
  RevenueChartCard,
  JobsByStatusCard,
  InventoryOverviewCard,
  MechanicProductivityCard,
  CustomerRetentionCard,
  CustomerGrowthCard,
  AnalyticsLoadingState,
  AnalyticsErrorState,
} from '@/components/analytics';

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

  if (loading) {
    return <AnalyticsLoadingState />;
  }

  if (!analytics || !analytics.revenue) {
    return <AnalyticsErrorState />;
  }

  return (
    <div className="space-y-6">
      <AnalyticsHeader period={period} onPeriodChange={setPeriod} />

      <RevenueOverviewCards revenue={analytics.revenue} jobs={analytics.jobs} />

      <RevenueChartCard byDay={analytics.revenue.byDay} period={analytics.period} />

      <div className="grid gap-6 lg:grid-cols-2">
        <JobsByStatusCard byStatus={analytics.jobs.byStatus} total={analytics.jobs.total} />
        <InventoryOverviewCard inventory={analytics.inventory} />
      </div>

      <MechanicProductivityCard mechanics={analytics.mechanics} />

      <div className="grid gap-6 lg:grid-cols-2">
        <CustomerRetentionCard retention={analytics.customerRetention} />
        <CustomerGrowthCard retention={analytics.customerRetention} />
      </div>
    </div>
  );
}
