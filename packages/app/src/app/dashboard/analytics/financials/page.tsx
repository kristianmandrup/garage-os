'use client';

import { useState, useEffect } from 'react';
import { ProfitLossCard } from '@/components/analytics/ProfitLossCard';
import { PaymentAgingCard } from '@/components/analytics/PaymentAgingCard';
import { TaxSummaryCard } from '@/components/analytics/TaxSummaryCard';
import { RevenueByServiceCard } from '@/components/analytics/RevenueByServiceCard';
import { AnalyticsLoadingState, AnalyticsErrorState } from '@/components/analytics';

interface FinancialData {
  profitAndLoss: {
    revenue: number; partsCost: number; laborRevenue: number;
    profit: number; margin: number;
  };
  taxSummary: { totalTax: number; taxRate: number; taxableRevenue: number };
  paymentAging: Array<{ bucket: '0-30' | '31-60' | '61-90' | '90+'; count: number; amount: number }>;
  revenueByService: Array<{ service: string; revenue: number; count: number }>;
  period: number;
}

export default function FinancialReportsPage() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [period, setPeriod] = useState('90');

  useEffect(() => {
    setLoading(true);
    setError(false);
    fetch(`/api/analytics/financials?period=${period}`)
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
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">
            Profit & loss, tax summary, payment aging, and revenue breakdown
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

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfitLossCard data={data.profitAndLoss} />
        <PaymentAgingCard data={data.paymentAging} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TaxSummaryCard data={data.taxSummary} />
        <RevenueByServiceCard data={data.revenueByService} />
      </div>
    </div>
  );
}
