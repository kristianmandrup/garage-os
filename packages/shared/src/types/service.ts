// GarageOS — Service Record Types

export interface ServiceRecord {
  id: string;
  shopId: string;
  vehicleId: string;
  jobCardId?: string;
  date: Date;
  mileage: number;
  serviceType: string;
  description: string;
  partsUsed?: string;
  laborHours?: number;
  cost: number;
  notes?: string;
  createdAt: Date;
}
