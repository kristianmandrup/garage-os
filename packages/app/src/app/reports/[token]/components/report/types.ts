export interface Photo {
  id: string;
  url: string;
  thumbnail_url: string | null;
  caption: string | null;
  is_damage_photo: boolean;
}

export interface DetectionItem {
  label: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  category: string;
  description?: string;
  estimatedRepairCost?: number;
}

export interface InspectionResult {
  id: string;
  detections: DetectionItem[];
  overall_condition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  summary: string;
  confidence: number;
}

export interface PartUsage {
  id: string;
  quantity: number;
  unit_price: number;
  part: {
    id: string;
    name: string;
    part_number: string;
  };
}

export interface Invoice {
  id: string;
  invoice_number: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: string;
}

export interface ReportData {
  jobCard: {
    id: string;
    title: string;
    description: string | null;
    status: string;
    estimated_cost: number | null;
    actual_cost: number | null;
    completed_at: string | null;
    created_at: string;
    vehicle: {
      id: string;
      license_plate: string;
      brand: string;
      model: string;
      year: number;
      color: string;
    };
    customer: {
      id: string;
      name: string;
      phone: string | null;
      email: string | null;
    };
    shop: {
      id: string;
      name: string;
      phone: string | null;
      email: string | null;
      logo_url: string | null;
    };
  };
  photos: Photo[];
  inspectionResults: InspectionResult[];
  partsUsed: PartUsage[];
  invoice: Invoice | null;
}
