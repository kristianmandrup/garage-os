'use client';

import { useState, useEffect } from 'react';
import { GrowthCharts } from '@/components/analytics/GrowthCharts';
import { AnalyticsLoadingState, AnalyticsErrorState } from '@/components/analytics';

interface GrowthData {
  customerGrowth: Array<{ week: string; newCustomers: number; totalCustomers: number }>;
  revenueComparison: { currentMonth: number; previousMonth: number; changePercent: number };
  jobVolume: Array<{ week: string; jobs: number }>;
  avgTicketSize: Array<{ month: string; avg: number }>;
  period: number;
}

export default function GrowthDashboardPage() {
  const [data, setData] = useState<GrowthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState('90');

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/analytics/growth?period=${period}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading) return <AnalyticsLoadingState />;
  if (error || !data) return <AnalyticsErrorState />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Growth Dashboard</h1>
          <p className="text-muted-foreground">
            Track customer acquisition, revenue trends, and job volume
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="30">Last 30 days</option>
          <option value="60">Last 60 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <GrowthCharts
        customerGrowth={data.customerGrowth}
        revenueComparison={data.revenueComparison}
        jobVolume={data.jobVolume}
        avgTicketSize={data.avgTicketSize}
      />
    </div>
  );
}
