'use client';

import { DollarSign, Wrench, Package, Building2 } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';

interface AggregateData {
  totalRevenue: number;
  totalJobs: number;
  completedJobs: number;
  completionRate: number;
  totalPartsUsed: number;
  totalPartsValue: number;
  totalShops: number;
}

interface AggregateStatsCardsProps {
  data: AggregateData;
  selectedShop: string | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
};

export function AggregateStatsCards({ data, selectedShop }: AggregateStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
          <p className="text-3xl font-bold mt-2">{formatCurrency(data.totalRevenue)}</p>
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
          <p className="text-3xl font-bold mt-2">{data.totalJobs}</p>
          <p className="text-sm text-muted-foreground">
            {data.completedJobs} completed ({data.completionRate}%)
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
          <p className="text-3xl font-bold mt-2">{data.totalPartsUsed}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(data.totalPartsValue)} value
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
          <p className="text-3xl font-bold mt-2">{data.totalShops}</p>
          <p className="text-sm text-muted-foreground">
            {selectedShop ? 'Single shop view' : 'All shops combined'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
