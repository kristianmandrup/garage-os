'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';

interface CostSummarySectionProps {
  estimated_cost: number | null;
  actual_cost: number | null;
}

export function CostSummarySection({ estimated_cost, actual_cost }: CostSummarySectionProps) {
  if (!estimated_cost && !actual_cost) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>สรุปค่าใช้จ่าย</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {estimated_cost && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">ประมาณการ</span>
              <span>฿{estimated_cost.toLocaleString()}</span>
            </div>
          )}
          {actual_cost && (
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>ค่าใช้จ่ายจริง</span>
              <span className="text-emerald-600">฿{actual_cost.toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
