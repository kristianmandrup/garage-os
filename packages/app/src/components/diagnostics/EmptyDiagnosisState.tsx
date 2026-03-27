'use client';

import { Lightbulb } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';

export function EmptyDiagnosisState() {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Diagnosis Yet</h3>
        <p className="text-muted-foreground">
          Select symptoms and click "Run AI Diagnosis" to get started
        </p>
      </CardContent>
    </Card>
  );
}
