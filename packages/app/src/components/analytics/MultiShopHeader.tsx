'use client';

import { BarChart3 } from 'lucide-react';

interface MultiShopHeaderProps {
  selectedShop: string | null;
  period: string;
  shops: Array<{ id: string; name: string; logo_url: string | null }>;
  onShopChange: (shopId: string | null) => void;
  onPeriodChange: (period: string) => void;
}

export function MultiShopHeader({
  selectedShop,
  period,
  shops,
  onShopChange,
  onPeriodChange,
}: MultiShopHeaderProps) {
  return (
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
          onChange={(e) => onShopChange(e.target.value || null)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="">All Shops</option>
          {shops.map(shop => (
            <option key={shop.id} value={shop.id}>{shop.name}</option>
          ))}
        </select>
        <select
          value={period}
          onChange={(e) => onPeriodChange(e.target.value)}
          className="h-10 px-3 rounded-md border border-input bg-background text-sm"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>
    </div>
  );
}
