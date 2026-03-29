'use client';

import { FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { cn } from '@garageos/ui/utils';
import { STATUS_LABELS } from '../constants';
import type { ReportData } from '../types';

interface JobStatusSectionProps {
  jobCard: Pick<ReportData['jobCard'], 'title' | 'description' | 'status' | 'created_at' | 'completed_at'>;
}

export function JobStatusSection({ jobCard }: JobStatusSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          สถานะงาน
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">งาน</p>
            <p className="font-semibold">{jobCard.title}</p>
            {jobCard.description && (
              <p className="text-sm text-muted-foreground mt-1">{jobCard.description}</p>
            )}
          </div>
          <Badge className={cn(
            'text-sm px-3 py-1',
            jobCard.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'
          )}>
            {STATUS_LABELS[jobCard.status] || jobCard.status}
          </Badge>
        </div>
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 inline mr-2" />
            วันที่สร้าง: {new Date(jobCard.created_at).toLocaleDateString('th-TH')}
          </p>
          {jobCard.completed_at && (
            <p className="text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4 inline mr-2" />
              วันที่เสร็จสิ้น: {new Date(jobCard.completed_at).toLocaleDateString('th-TH')}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
