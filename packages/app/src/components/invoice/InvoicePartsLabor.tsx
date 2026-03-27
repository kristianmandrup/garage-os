'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation, useLocale, formatCurrency } from '@/i18n';

interface PartUsage {
  id: string;
  quantity: number;
  unit_price: number;
  part: {
    name: string;
    part_number: string | null;
  };
}

interface InvoicePartsLaborProps {
  partUsages: PartUsage[] | undefined;
  actualHours: number | null | undefined;
  actualCost: number | null;
  laborLabel: string;
  partsLabel: string;
  partsTotalLabel: string;
}

export function InvoicePartsLabor({
  partUsages,
  actualHours,
  actualCost,
  laborLabel,
  partsLabel,
  partsTotalLabel,
}: InvoicePartsLaborProps) {
  const { locale } = useLocale();

  const partsTotal = partUsages?.reduce(
    (sum, pu) => sum + (pu.quantity * pu.unit_price),
    0
  ) || 0;
  const laborCost = actualCost || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Parts */}
          {partUsages && partUsages.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">{partsLabel}</h4>
              <div className="space-y-2">
                {partUsages.map((pu) => (
                  <div key={pu.id} className="flex justify-between text-sm">
                    <span>{pu.part.name} x {pu.quantity}</span>
                    <span className="font-medium">{formatCurrency(pu.quantity * pu.unit_price, locale)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Labor */}
          <div className="flex justify-between text-sm pt-4 border-t">
            <span>{laborLabel.replace('{hours}', String(actualHours || 0))}</span>
            <span className="font-medium">{formatCurrency(laborCost, locale)}</span>
          </div>

          <div className="flex justify-between text-sm pt-4 border-t">
            <span>{partsTotalLabel}</span>
            <span className="font-medium">{formatCurrency(partsTotal, locale)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
