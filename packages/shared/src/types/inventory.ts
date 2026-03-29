// GarageOS — Parts & Inventory Types

export type PartStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

export interface Part {
  id: string;
  shopId: string;
  name: string;
  partNumber?: string;
  category: string;
  brand?: string;
  supplierId?: string;
  costPrice: number;
  sellPrice: number;
  quantity: number;
  minQuantity?: number;
  status: PartStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartUsage {
  id: string;
  jobCardId: string;
  partId: string;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
}
