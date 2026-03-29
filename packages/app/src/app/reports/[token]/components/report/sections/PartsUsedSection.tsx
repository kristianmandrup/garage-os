'use client';

import { Wrench } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import type { PartUsage } from '../types';

interface PartsUsedSectionProps {
  partsUsed: PartUsage[];
}

export function PartsUsedSection({ partsUsed }: PartsUsedSectionProps) {
  if (partsUsed.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          อะไหล่ที่ใช้
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {partsUsed.map((usage) => (
            <div key={usage.id} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium">{usage.part.name}</p>
                <p className="text-sm text-muted-foreground">{usage.part.part_number}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">฿{usage.unit_price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">x{usage.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
