'use client';

import { AlertOctagon, AlertTriangle, CheckCircle, Lightbulb, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Button } from '@garageos/ui/button';
import { Label } from '@garageos/ui/label';
import { cn } from '@garageos/ui/utils';

const URGENCY_CONFIG = {
  high: { label: 'วิกฤต', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', icon: AlertOctagon },
  medium: { label: 'ปานกลาง', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', icon: AlertTriangle },
  low: { label: 'ต่ำ', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle },
};

const LIKELIHOOD_CONFIG = {
  high: { label: 'สูง', color: 'text-red-600' },
  medium: { label: 'ปานกลาง', color: 'text-amber-600' },
  low: { label: 'ต่ำ', color: 'text-blue-600' },
};

interface Diagnosis {
  symptom: string;
  possibleCauses: Array<{
    cause: string;
    likelihood: 'high' | 'medium' | 'low';
    description: string;
  }>;
  recommendedActions: string[];
  urgency: 'high' | 'medium' | 'low';
}

interface DiagnosticResult {
  id: string;
  symptoms: string[];
  diagnosis: {
    diagnoses: Diagnosis[];
    overallUrgency: 'high' | 'medium' | 'low';
    immediateAttention: boolean;
    safetyConcerns: string[];
    summary: string;
  };
  created_at: string;
  vehicle?: {
    id: string;
    license_plate: string;
    brand: string;
    model: string;
  };
}

interface DiagnosisResultCardProps {
  result: DiagnosticResult;
  onNewDiagnosis: () => void;
}

export function DiagnosisResultCard({ result, onNewDiagnosis }: DiagnosisResultCardProps) {
  const urgencyConfig = URGENCY_CONFIG[result.diagnosis.overallUrgency];
  const UrgencyIcon = urgencyConfig.icon;

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Diagnosis Results</CardTitle>
          <Badge className={urgencyConfig.color}>
            <UrgencyIcon className="h-4 w-4 mr-1" />
            {result.diagnosis.immediateAttention ? 'ต้องตรวจสอบทันที' : 'ความเร่งด่วน: ' + urgencyConfig.label}
          </Badge>
        </div>
        {result.vehicle && (
          <CardDescription>
            {result.vehicle.brand} {result.vehicle.model} - {result.vehicle.license_plate}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20">
          <p className="font-medium text-blue-800 dark:text-blue-200">
            {result.diagnosis.summary}
          </p>
        </div>

        {/* Safety Concerns */}
        {result.diagnosis.safetyConcerns.length > 0 && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-red-800 dark:text-red-200">ข้อกังวลด้านความปลอดภัย</span>
            </div>
            <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
              {result.diagnosis.safetyConcerns.map((concern, i) => (
                <li key={i}>{concern}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Individual Diagnoses */}
        {result.diagnosis.diagnoses.map((diagnosis, idx) => (
          <div key={idx} className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{diagnosis.symptom}</h4>
              <Badge className={URGENCY_CONFIG[diagnosis.urgency].color}>
                {URGENCY_CONFIG[diagnosis.urgency].label}
              </Badge>
            </div>

            {/* Possible Causes */}
            <div>
              <Label className="text-sm text-muted-foreground mb-1 block">
                Possible Causes / สาเหตุที่เป็นไปได้
              </Label>
              <div className="space-y-2">
                {diagnosis.possibleCauses.map((cause, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{cause.cause}</span>
                      <span className={cn('text-sm font-medium', LIKELIHOOD_CONFIG[cause.likelihood].color)}>
                        {LIKELIHOOD_CONFIG[cause.likelihood].label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{cause.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Actions */}
            <div>
              <Label className="text-sm text-muted-foreground mb-1 block">
                Recommended Actions / การดำเนินการที่แนะนำ
              </Label>
              <div className="flex flex-wrap gap-2">
                {diagnosis.recommendedActions.map((action, i) => (
                  <Badge key={i} variant="outline" className="bg-blue-50 dark:bg-blue-950/20">
                    <Lightbulb className="h-3 w-3 mr-1 text-blue-600" />
                    {action}
                  </Badge>
                ))}
              </div>
            </div>

            {idx < result.diagnosis.diagnoses.length - 1 && (
              <hr className="border-t" />
            )}
          </div>
        ))}

        <Button
          variant="outline"
          className="w-full"
          onClick={onNewDiagnosis}
        >
          New Diagnosis
        </Button>
      </CardContent>
    </Card>
  );
}
