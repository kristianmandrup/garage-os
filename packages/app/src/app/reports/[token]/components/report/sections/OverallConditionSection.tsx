'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { cn } from '@garageos/ui/utils';
import { CONDITION_CONFIG } from '../constants';
import type { InspectionResult } from '../types';

interface OverallConditionSectionProps {
  inspectionResults: InspectionResult[];
}

export function OverallConditionSection({ inspectionResults }: OverallConditionSectionProps) {
  if (inspectionResults.length === 0) return null;

  const avgConfidence = inspectionResults.reduce((acc, r) => acc + r.confidence, 0) / inspectionResults.length;
  const conditionCounts = inspectionResults.reduce((acc, r) => {
    acc[r.overall_condition] = (acc[r.overall_condition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const worstCondition = Object.entries(conditionCounts)
    .sort(([, a], [, b]) => b - a)[0][0] as keyof typeof CONDITION_CONFIG;
  const config = CONDITION_CONFIG[worstCondition];

  return (
    <Card>
      <CardHeader>
        <CardTitle>ผลตรวจสภาพโดยรวม</CardTitle>
        <CardDescription>จากการวิเคราะห์ด้วย AI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className={cn('w-20 h-20 rounded-full flex items-center justify-center', config.color)}>
            <config.icon className="h-10 w-10" />
          </div>
          <div>
            <p className="text-2xl font-bold">{config.label}</p>
            <p className="text-sm text-muted-foreground">ความมั่นใจ: {(avgConfidence * 100).toFixed(0)}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
