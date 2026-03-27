'use client';

import { Package, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { useTranslation, useLocale, formatCurrency } from '@/i18n';
import { cn } from '@garageos/ui/utils';

interface TopPart {
  id: string;
  name: string;
  quantity: number;
  value: number;
}

interface InventoryOverviewCardProps {
  inventory: {
    totalParts: number;
    lowStock: number;
    outOfStock: number;
    partsUsed: number;
    topParts: TopPart[];
  };
}

export function InventoryOverviewCard({ inventory }: InventoryOverviewCardProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.analytics.inventoryHealth}</CardTitle>
        <CardDescription>{t.analytics.partsUsageStock}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <Package className="h-4 w-4" /> {t.analytics.totalParts}
            </div>
            <p className="text-2xl font-bold">{inventory.totalParts}</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" /> {t.analytics.partsUsed}
            </div>
            <p className="text-2xl font-bold">{inventory.partsUsed}</p>
          </div>
          <div className={cn(
            'p-4 rounded-xl',
            inventory.lowStock > 0 ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'
          )}>
            <div className="flex items-center gap-2 text-sm mb-1">
              <AlertTriangle className="h-4 w-4" /> {t.analytics.lowStock}
            </div>
            <p className={cn(
              'text-2xl font-bold',
              inventory.lowStock > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            )}>
              {inventory.lowStock}
            </p>
          </div>
          <div className={cn(
            'p-4 rounded-xl',
            inventory.outOfStock > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-muted/50'
          )}>
            <div className="flex items-center gap-2 text-sm mb-1">
              <AlertTriangle className="h-4 w-4" /> {t.analytics.outOfStock}
            </div>
            <p className={cn(
              'text-2xl font-bold',
              inventory.outOfStock > 0 ? 'text-red-600 dark:text-red-400' : ''
            )}>
              {inventory.outOfStock}
            </p>
          </div>
        </div>

        {/* Top Parts */}
        {inventory.topParts.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3">{t.analytics.mostUsedParts}</h4>
            <div className="space-y-2">
              {inventory.topParts.map((part) => (
                <div key={part.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium text-sm">{part.name}</p>
                    <p className="text-xs text-muted-foreground">{part.quantity} units</p>
                  </div>
                  <p className="font-medium text-sm">{formatCurrency(part.value, locale)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
