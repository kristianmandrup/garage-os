'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';
import type { InspectionResult } from '../types';

interface DetectionsSectionProps {
  inspectionResults: InspectionResult[];
}

export function DetectionsSection({ inspectionResults }: DetectionsSectionProps) {
  return (
    <>
      {inspectionResults.map((result) => (
        <Card key={result.id}>
          <CardHeader>
            <CardTitle>ผลการตรวจสอบ</CardTitle>
            <CardDescription>{result.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            {result.detections.length === 0 ? (
              <p className="text-muted-foreground">ไม่พบปัญหาที่ต้องสนใจ</p>
            ) : (
              <div className="space-y-3">
                {result.detections.map((detection, idx) => (
                  <div key={idx} className={cn(
                    'p-3 rounded-lg border',
                    detection.severity === 'critical' ? 'border-red-200 bg-red-50 dark:bg-red-900/20' :
                    detection.severity === 'warning' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/20' :
                    'border-blue-200 bg-blue-50 dark:bg-blue-900/20'
                  )}>
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">{detection.label}</p>
                        <p className="text-sm text-muted-foreground">{detection.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          ความมั่นใจ: {(detection.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                      <Badge className={cn(
                        detection.severity === 'critical' ? 'bg-red-500' :
                        detection.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                      )}>
                        {detection.severity === 'critical' ? 'วิกฤต' :
                         detection.severity === 'warning' ? 'เตือน' : 'ข้อมูล'}
                      </Badge>
                    </div>
                    {detection.estimatedRepairCost && (
                      <p className="text-sm font-medium mt-2 text-emerald-600">
                        ประมาณการค่าซ่อม: ฿{detection.estimatedRepairCost.toLocaleString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}
