// GarageOS — AI Diagnostics Types

export interface DiagnosticSuggestion {
  symptom: string;
  possibleCauses: string[];
  recommendedActions: string[];
  urgency: 'low' | 'medium' | 'high';
}

export interface AIDiagnosticResult {
  id: string;
  shopId: string;
  vehicleId: string;
  symptoms: string[];
  suggestions: DiagnosticSuggestion[];
  confidence: number;
  createdAt: Date;
}
