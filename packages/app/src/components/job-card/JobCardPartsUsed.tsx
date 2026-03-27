'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation, useLocale, formatCurrency } from '@/i18n';

interface PartUsage {
  id: string;
  quantity: number;
  unit_price: number;
  part: {
    id: string;
    name: string;
    part_number: string;
  };
}

interface JobCardPartsUsedProps {
  partUsages: PartUsage[];
}

export function JobCardPartsUsed({ partUsages }: JobCardPartsUsedProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.jobCard.partsUsed}</CardTitle>
      </CardHeader>
      <CardContent>
        {partUsages && partUsages.length > 0 ? (
          <div className="space-y-3">
            {partUsages.map((pu) => (
              <div key={pu.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{pu.part.name}</p>
                  <p className="text-sm text-muted-foreground">{pu.part.part_number}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(pu.quantity * pu.unit_price, locale)}</p>
                  <p className="text-sm text-muted-foreground">{t.jobCard.qty}: {pu.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            {t.jobCard.noPartsUsedYet}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
