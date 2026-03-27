'use client';

import { Card, CardContent } from '@garageos/ui/card';

export function AnalyticsLoadingState() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-muted rounded animate-pulse" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}><CardContent className="p-6"><div className="h-24 bg-muted rounded animate-pulse" /></CardContent></Card>
        ))}
      </div>
    </div>
  );
}
