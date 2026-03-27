'use client';

import { Building2, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';

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
  completionRate: number;
  lowStockCount: number;
}

interface ShopPerformanceCardProps {
  shopBreakdown: ShopAnalytics[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(amount);
};

export function ShopPerformanceCard({ shopBreakdown }: ShopPerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shop Performance</CardTitle>
        <CardDescription>Comparison across your shops</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {shopBreakdown.map((shop) => (
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
  );
}
