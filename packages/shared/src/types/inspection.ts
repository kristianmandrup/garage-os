// GarageOS — AI Inspection Types

export type DetectionCategory =
  | 'brake'
  | 'tire'
  | 'engine'
  | 'transmission'
  | 'suspension'
  | 'electrical'
  | 'body'
  | 'fluid'
  | 'exhaust'
  | 'safety';

export interface DetectionItem {
  label: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  category: DetectionCategory;
  description?: string;
  estimatedRepairCost?: number;
}

export interface AIInspectionResult {
  id: string;
  photoId: string;
  detections: DetectionItem[];
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  summary: string;
  confidence: number;
  analyzedAt: Date;
}
