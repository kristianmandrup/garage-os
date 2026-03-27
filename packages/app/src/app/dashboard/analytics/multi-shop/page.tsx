'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@garageos/ui/card';
import {
  MultiShopHeader,
  AggregateStatsCards,
  RevenueChartCard,
  ShopPerformanceCard,
  JobsByStatusCard,
} from '@/components/analytics';

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
  shopBreakdown: Array<{
    shop: { id: string; name: string; logo_url: string | null };
    revenue: number;
    paidRevenue: number;
    pendingRevenue: number;
    totalJobs: number;
    completionRate: number;
    lowStockCount: number;
  }>;
  revenueByDay: Record<string, number>;
  jobsByStatus: Record<string, number>;
  period: number;
  shops: Array<{ id: string; name: string; logo_url: string | null }>;
}

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

  return (
    <div className="space-y-6">
      <MultiShopHeader
        selectedShop={selectedShop}
        period={period}
        shops={data.shops}
        onShopChange={setSelectedShop}
        onPeriodChange={setPeriod}
      />

      <AggregateStatsCards data={data.aggregate} selectedShop={selectedShop} />

      <RevenueChartCard byDay={data.revenueByDay} period={data.period} />

      <ShopPerformanceCard shopBreakdown={data.shopBreakdown} />

      <JobsByStatusCard byStatus={data.jobsByStatus} total={Object.values(data.jobsByStatus).reduce((a, b) => a + b, 0)} />
    </div>
  );
}
