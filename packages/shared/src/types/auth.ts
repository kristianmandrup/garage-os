// GarageOS — User & Authentication Types

export type UserRole = 'owner' | 'manager' | 'mechanic' | 'client';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatarUrl?: string;
  companyName?: string;
  role: UserRole;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
}
