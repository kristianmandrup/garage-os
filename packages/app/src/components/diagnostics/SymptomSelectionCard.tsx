'use client';

import { useState } from 'react';
import { Wrench, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Button } from '@garageos/ui/button';
import { Input } from '@garageos/ui/input';
import { Label } from '@garageos/ui/label';

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

interface SymptomSelectionCardProps {
  symptoms: string[];
  loading: boolean;
  onAddSymptom: (symptom: string) => void;
  onRemoveSymptom: (symptom: string) => void;
  onRunDiagnosis: () => void;
}

export function SymptomSelectionCard({
  symptoms,
  loading,
  onAddSymptom,
  onRemoveSymptom,
  onRunDiagnosis,
}: SymptomSelectionCardProps) {
  const [customSymptom, setCustomSymptom] = useState('');

  const handleAddCustomSymptom = () => {
    if (customSymptom) {
      onAddSymptom(customSymptom);
      setCustomSymptom('');
    }
  };

  return (
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
                onClick={() => symptoms.includes(symptom) ? onRemoveSymptom(symptom) : onAddSymptom(symptom)}
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
                  handleAddCustomSymptom();
                }
              }}
            />
            <Button onClick={handleAddCustomSymptom} variant="outline">
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
                    onClick={() => onRemoveSymptom(symptom)}
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
          onClick={onRunDiagnosis}
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
  );
}
