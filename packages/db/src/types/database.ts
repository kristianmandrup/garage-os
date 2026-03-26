// Database types for Supabase client
// This mirrors the schema structure for use with Supabase client generation

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          phone: string | null;
          name: string;
          avatarUrl: string | null;
          companyName: string | null;
          role: 'owner' | 'manager' | 'mechanic' | 'client';
          locale: string;
          createdAt: Date;
          updatedAt: Date;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'createdAt' | 'updatedAt'> & {
          createdAt?: Date;
          updatedAt?: Date;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      shops: {
        Row: {
          id: string;
          ownerId: string;
          name: string;
          description: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          logoUrl: string | null;
          status: 'active' | 'suspended' | 'closed';
          timezone: string;
          currency: string;
          createdAt: Date;
          updatedAt: Date;
        };
        Insert: Omit<Database['public']['Tables']['shops']['Row'], 'createdAt' | 'updatedAt'> & {
          createdAt?: Date;
          updatedAt?: Date;
        };
        Update: Partial<Database['public']['Tables']['shops']['Insert']>;
      };
      customers: {
        Row: {
          id: string;
          shopId: string;
          name: string;
          phone: string | null;
          email: string | null;
          address: string | null;
          notes: string | null;
          createdAt: Date;
          updatedAt: Date;
        };
        Insert: Omit<Database['public']['Tables']['customers']['Row'], 'createdAt' | 'updatedAt'> & {
          createdAt?: Date;
          updatedAt?: Date;
        };
        Update: Partial<Database['public']['Tables']['customers']['Insert']>;
      };
      vehicles: {
        Row: {
          id: string;
          shopId: string;
          licensePlate: string;
          brand: string;
          model: string;
          year: number;
          vin: string | null;
          color: string | null;
          mileage: number | null;
          fuelType: 'gasoline' | 'diesel' | 'electric' | 'hybrid' | null;
          transmission: 'automatic' | 'manual' | null;
          customerId: string;
          createdAt: Date;
          updatedAt: Date;
        };
        Insert: Omit<Database['public']['Tables']['vehicles']['Row'], 'createdAt' | 'updatedAt'> & {
          createdAt?: Date;
          updatedAt?: Date;
        };
        Update: Partial<Database['public']['Tables']['vehicles']['Insert']>;
      };
      job_cards: {
        Row: {
          id: string;
          shopId: string;
          vehicleId: string;
          customerId: string;
          title: string;
          description: string | null;
          status: 'inspection' | 'diagnosed' | 'parts_ordered' | 'in_progress' | 'pending_approval' | 'completed' | 'cancelled';
          assignedToId: string | null;
          estimatedCost: number | null;
          actualCost: number | null;
          estimatedHours: number | null;
          actualHours: number | null;
          scheduledDate: Date | null;
          completedAt: Date | null;
          createdAt: Date;
          updatedAt: Date;
        };
        Insert: Omit<Database['public']['Tables']['job_cards']['Row'], 'createdAt' | 'updatedAt'> & {
          createdAt?: Date;
          updatedAt?: Date;
        };
        Update: Partial<Database['public']['Tables']['job_cards']['Insert']>;
      };
      // ... other tables follow same pattern
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
