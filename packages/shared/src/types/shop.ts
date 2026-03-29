// GarageOS — Shop Types

export type ShopStatus = 'active' | 'suspended' | 'closed';

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  status: ShopStatus;
  timezone: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}
