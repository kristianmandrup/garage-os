'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Lightbulb,
  Shield,
  AlertOctagon,
  Car,
  Wrench,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';
import { cn } from '@garageos/ui/utils';

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

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number | null;
}

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

const COMMON_SYMPTOMS = [
  'เครื่องยนต์สะดุด (Engine hesitation)',
  'เครื่องยนต์ติดยาก (Hard start)',
  'เสียงผิดปกติจากเครื่อง (Unusual engine noise)',
  'กินน้ำมันมากผิดปกติ (High fuel consumption)',
  'ควันดำ/ควันขาวจากท่อไอเสีย (Exhaust smoke)',
  'พวงมาลัยสั่น (Steering wheel vibration)',
  'เบรกมีเสียง (Brake noise)',
  'เบรกไม่ค่อยอยู่ (Brake fading)',
  'แอร์ไม่เย็น (AC not cooling)',
  'ไฟเตือนติด (Warning light on)',
];

export default function DiagnosticsPage() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [history, setHistory] = useState<DiagnosticResult[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchVehicles();
    fetchHistory();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch('/api/vehicles');
      if (response.ok) {
        const data = await response.json();
        setVehicles(data);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch('/api/ai/diagnostics');
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (error) {
      console.error('Failed to fetch diagnostics history:', error);
    }
  };

  const addSymptom = (symptom: string) => {
    if (symptom && !symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
    setCustomSymptom('');
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const runDiagnosis = async () => {
    if (symptoms.length === 0) return;

    setLoading(true);
    try {
      const vehicle = vehicles.find(v => v.id === selectedVehicle);
      const response = await fetch('/api/ai/diagnostics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicle_id: selectedVehicle || undefined,
          symptoms,
          mileage: vehicle?.mileage || undefined,
          year: vehicle?.year || undefined,
          brand: vehicle?.brand || undefined,
          model: vehicle?.model || undefined,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        fetchHistory();
      }
    } catch (error) {
      console.error('Failed to run diagnosis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Diagnostics</h1>
        <p className="text-muted-foreground">
          Describe symptoms for AI-powered diagnosis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Diagnosis Input */}
        <div className="space-y-6">
          {/* Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Select Vehicle (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <select
                value={selectedVehicle}
                onChange={(e) => setSelectedVehicle(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
              >
                <option value="">No vehicle selected</option>
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.license_plate} - {v.brand} {v.model}
                  </option>
                ))}
              </select>
            </CardContent>
          </Card>

          {/* Symptom Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Select Symptoms
              </CardTitle>
              <CardDescription>
                Choose one or more symptoms from the list or add custom symptoms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Common Symptoms */}
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Common Symptoms</Label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SYMPTOMS.map(symptom => (
                    <Button
                      key={symptom}
                      variant={symptoms.includes(symptom) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => symptoms.includes(symptom) ? removeSymptom(symptom) : addSymptom(symptom)}
                      className={symptoms.includes(symptom) ? 'btn-gradient' : ''}
                    >
                      {symptom}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Symptom */}
              <div>
                <Label className="text-sm text-muted-foreground mb-2 block">Add Custom Symptom</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Describe another symptom..."
                    value={customSymptom}
                    onChange={(e) => setCustomSymptom(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSymptom(customSymptom);
                      }
                    }}
                  />
                  <Button onClick={() => addSymptom(customSymptom)} variant="outline">
                    Add
                  </Button>
                </div>
              </div>

              {/* Selected Symptoms */}
              {symptoms.length > 0 && (
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Selected Symptoms ({symptoms.length})
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map(symptom => (
                      <Badge key={symptom} className="px-3 py-1 bg-blue-600">
                        {symptom}
                        <button
                          onClick={() => removeSymptom(symptom)}
                          className="ml-2 hover:text-red-200"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Run Diagnosis Button */}
              <Button
                onClick={runDiagnosis}
                disabled={symptoms.length === 0 || loading}
                className="w-full btn-gradient"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Run AI Diagnosis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (() => {
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
                  onClick={() => {
                    setResult(null);
                    setSymptoms([]);
                  }}
                >
                  New Diagnosis
                </Button>
              </CardContent>
            </Card>
            );
          })() : (
            <Card>
              <CardContent className="py-12 text-center">
                <Lightbulb className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Diagnosis Yet</h3>
                <p className="text-muted-foreground">
                  Select symptoms and click "Run AI Diagnosis" to get started
                </p>
              </CardContent>
            </Card>
          )}

          {/* History */}
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
        </div>
      </div>
    </div>
  );
}
