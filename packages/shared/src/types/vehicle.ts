// GarageOS — Vehicle & Customer Types

export interface Vehicle {
  id: string;
  shopId: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  vin?: string;
  color?: string;
  mileage?: number;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission?: 'automatic' | 'manual';
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
