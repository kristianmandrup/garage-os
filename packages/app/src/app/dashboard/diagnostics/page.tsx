'use client';

import { useState, useEffect } from 'react';
import {
  DiagnosticsHeader,
  VehicleSelectionCard,
  SymptomSelectionCard,
  DiagnosisResultCard,
  EmptyDiagnosisState,
  DiagnosisHistoryCard,
} from '@/components/diagnostics';

interface Vehicle {
  id: string;
  license_plate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number | null;
}

interface DiagnosticResult {
  id: string;
  symptoms: string[];
  diagnosis: {
    diagnoses: Array<{
      symptom: string;
      possibleCauses: Array<{
        cause: string;
        likelihood: 'high' | 'medium' | 'low';
        description: string;
      }>;
      recommendedActions: string[];
      urgency: 'high' | 'medium' | 'low';
    }>;
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

export default function DiagnosticsPage() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [history, setHistory] = useState<DiagnosticResult[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

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

  const handleNewDiagnosis = () => {
    setResult(null);
    setSymptoms([]);
  };

  return (
    <div className="space-y-6">
      <DiagnosticsHeader />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Diagnosis Input */}
        <div className="space-y-6">
          <VehicleSelectionCard
            vehicles={vehicles}
            selectedVehicle={selectedVehicle}
            onSelectVehicle={setSelectedVehicle}
          />

          <SymptomSelectionCard
            symptoms={symptoms}
            loading={loading}
            onAddSymptom={addSymptom}
            onRemoveSymptom={removeSymptom}
            onRunDiagnosis={runDiagnosis}
          />
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <DiagnosisResultCard
              result={result}
              onNewDiagnosis={handleNewDiagnosis}
            />
          ) : (
            <EmptyDiagnosisState />
          )}

          <DiagnosisHistoryCard history={history} />
        </div>
      </div>
    </div>
  );
}
