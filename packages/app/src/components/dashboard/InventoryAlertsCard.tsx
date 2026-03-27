'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Progress } from '@garageos/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

interface InventoryAlertsCardProps {
  lowStockParts: Array<{
    id: string;
    name: string;
    quantity: number;
    min_quantity: number | null;
  }>;
  loading: boolean;
}

export function InventoryAlertsCard({ lowStockParts, loading }: InventoryAlertsCardProps) {
  const t = useTranslation();

  return (
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
  );
}
