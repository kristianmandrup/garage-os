// GarageOS — Supplier Types

export interface Supplier {
  id: string;
  shopId: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}
