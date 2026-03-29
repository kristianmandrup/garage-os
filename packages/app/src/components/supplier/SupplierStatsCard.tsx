'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation } from '@/i18n';

export function SupplierStatsCard() {
  const t = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.suppliers.supplierStats}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">{t.suppliers.partsFromSupplier}</p>
            <p className="text-2xl font-bold">-</p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm text-muted-foreground">{t.suppliers.totalOrders}</p>
            <p className="text-2xl font-bold">-</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
