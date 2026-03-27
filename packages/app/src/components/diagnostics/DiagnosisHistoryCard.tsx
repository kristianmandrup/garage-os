'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Button } from '@garageos/ui/button';
import { cn } from '@garageos/ui/utils';

const URGENCY_CONFIG = {
  high: { label: 'วิกฤต', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
  medium: { label: 'ปานกลาง', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  low: { label: 'ต่ำ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
};

interface DiagnosticResult {
  id: string;
  symptoms: string[];
  diagnosis: {
    overallUrgency: 'high' | 'medium' | 'low';
  };
  created_at: string;
  vehicle?: {
    license_plate: string;
  };
}

interface DiagnosisHistoryCardProps {
  history: DiagnosticResult[];
}

export function DiagnosisHistoryCard({ history }: DiagnosisHistoryCardProps) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <Card>
      <CardHeader>
        <Button
          variant="ghost"
          className="w-full justify-between"
          onClick={() => setShowHistory(!showHistory)}
        >
          <CardTitle className="text-lg">Recent Diagnoses</CardTitle>
          <ChevronRight className={cn('h-4 w-4 transition-transform', showHistory && 'rotate-90')} />
        </Button>
      </CardHeader>
      {showHistory && (
        <CardContent>
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No diagnosis history</p>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 5).map((item) => (
                <div key={item.id} className="p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={URGENCY_CONFIG[item.diagnosis.overallUrgency].color}>
                      {URGENCY_CONFIG[item.diagnosis.overallUrgency].label}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString('th-TH')}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">
                    {item.symptoms.slice(0, 2).join(', ')}
                    {item.symptoms.length > 2 && ` (+${item.symptoms.length - 2} more)`}
                  </p>
                  {item.vehicle && (
                    <p className="text-xs text-muted-foreground">
                      {item.vehicle.license_plate}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
