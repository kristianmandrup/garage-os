'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Progress } from '@garageos/ui/progress';

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

export default function InspectionPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      // Remove data URL prefix
      const base64Data = base64.split(',')[1];
      setSelectedImage(base64Data);
      setResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/inspection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const criticalCount = result?.detections.filter(d => d.severity === 'critical').length || 0;
  const warningCount = result?.detections.filter(d => d.severity === 'warning').length || 0;
  const totalCost = result?.detections.reduce((sum, d) => sum + (d.estimatedRepairCost || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Inspection</h1>
        <p className="text-muted-foreground">
          Upload vehicle photos for AI-powered damage detection
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Photo</CardTitle>
            <CardDescription>
              Take or upload a clear photo of the vehicle area to inspect
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {selectedImage ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden bg-black/5">
                  <img
                    src={`data:image/jpeg;base64,${selectedImage}`}
                    alt="Vehicle to inspect"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="flex-1 btn-gradient"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Camera className="h-4 w-4 mr-2" />
                        Analyze with AI
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Click to upload or take photo</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Supports JPG, PNG up to 10MB
                </p>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Inspection Results</CardTitle>
            <CardDescription>
              AI-detected issues and overall condition
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-6">
                {/* Overall Condition */}
                <div className={`p-6 rounded-xl ${conditionConfig[result.overallCondition].bg}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Condition</span>
                    <Badge className={severityConfig[result.overallCondition === 'critical' ? 'critical' : result.overallCondition === 'poor' ? 'warning' : 'info'].color}>
                      {(result.confidence * 100).toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <p className={`text-3xl font-bold ${conditionConfig[result.overallCondition].color}`}>
                    {conditionConfig[result.overallCondition].label}
                  </p>
                  <p className="text-sm mt-2 text-muted-foreground">{result.summary}</p>
                </div>

                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
                    <p className="text-xs text-muted-foreground">Critical</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <p className="text-2xl font-bold text-amber-600">{warningCount}</p>
                    <p className="text-xs text-muted-foreground">Warnings</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <p className="text-2xl font-bold text-blue-600">฿{totalCost.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Est. Cost</p>
                  </div>
                </div>

                {/* Detections */}
                {result.detections.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium">Detected Issues</h4>
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
                            {detection.severity}
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
                              ฿{detection.estimatedRepairCost.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                            <span>Confidence</span>
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
                    <p className="font-medium">No issues detected</p>
                    <p className="text-sm text-muted-foreground">
                      The inspected area looks good
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Upload a photo to see AI inspection results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
