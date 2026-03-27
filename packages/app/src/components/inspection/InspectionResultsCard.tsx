'use client';

import { AlertTriangle, CheckCircle, Camera } from 'lucide-react';
import { Badge } from '@garageos/ui/badge';
import { Progress } from '@garageos/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { useTranslation, useLocale, formatCurrency } from '@/i18n';

interface Detection {
  label: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  category: string;
  description?: string;
  estimatedRepairCost?: number;
}

interface InspectionResult {
  detections: Detection[];
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  summary: string;
  confidence: number;
}

interface InspectionResultsCardProps {
  result: InspectionResult | null;
}

const severityConfig = {
  info: { label: 'Info', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' },
  warning: { label: 'Warning', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' },
  critical: { label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const conditionConfig = {
  excellent: { label: 'Excellent', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  good: { label: 'Good', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  fair: { label: 'Fair', color: 'text-amber-600', bg: 'bg-amber-100' },
  poor: { label: 'Poor', color: 'text-orange-600', bg: 'bg-orange-100' },
  critical: { label: 'Critical', color: 'text-red-600', bg: 'bg-red-100' },
};

export function InspectionResultsCard({ result }: InspectionResultsCardProps) {
  const t = useTranslation();
  const { locale } = useLocale();

  const criticalCount = result?.detections.filter(d => d.severity === 'critical').length || 0;
  const warningCount = result?.detections.filter(d => d.severity === 'warning').length || 0;
  const totalCost = result?.detections.reduce((sum, d) => sum + (d.estimatedRepairCost || 0), 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.inspection.inspectionResults}</CardTitle>
        <CardDescription>
          {t.inspection.resultsDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {result ? (
          <div className="space-y-6">
            {/* Overall Condition */}
            <div className={`p-6 rounded-xl ${conditionConfig[result.overallCondition].bg}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t.inspection.overallCondition}</span>
                <Badge className={severityConfig[result.overallCondition === 'critical' ? 'critical' : result.overallCondition === 'poor' ? 'warning' : 'info'].color}>
                  {t.inspection.confidencePercent.replace('{n}', ((result.confidence * 100)).toFixed(0))}
                </Badge>
              </div>
              <p className={`text-3xl font-bold ${conditionConfig[result.overallCondition].color}`}>
                {t.inspection[result.overallCondition as keyof typeof t.inspection] || result.overallCondition}
              </p>
              <p className="text-sm mt-2 text-muted-foreground">{result.summary}</p>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                <p className="text-xs text-muted-foreground">{t.inspection.critical}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
                <p className="text-xs text-muted-foreground">{t.inspection.warnings}</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalCost, locale)}</p>
                <p className="text-xs text-muted-foreground">{t.inspection.estCost}</p>
              </div>
            </div>

            {/* Detections */}
            {result.detections.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">{t.inspection.detectedIssues}</h4>
                {result.detections.map((detection, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border bg-card"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {detection.severity === 'critical' ? (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-amber-600" />
                        )}
                        <span className="font-medium">{detection.label}</span>
                      </div>
                      <Badge className={severityConfig[detection.severity].color}>
                        {t.inspection[detection.severity as keyof typeof t.inspection] || detection.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {detection.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground capitalize">
                        {detection.category}
                      </span>
                      {detection.estimatedRepairCost && (
                        <span className="font-medium">
                          {formatCurrency(detection.estimatedRepairCost, locale)}
                        </span>
                      )}
                    </div>
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{t.inspection.confidence}</span>
                        <span>{(detection.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={detection.confidence * 100} className="h-1" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {result.detections.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-emerald-500 mb-3" />
                <p className="font-medium">{t.inspection.noIssuesDetected}</p>
                <p className="text-sm text-muted-foreground">
                  {t.inspection.inspectedAreaLooksGood}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t.inspection.uploadToSeeResults}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
