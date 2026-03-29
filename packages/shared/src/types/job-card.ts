// GarageOS — Job Card Types

export type JobCardStatus =
  | 'inspection'
  | 'diagnosed'
  | 'parts_ordered'
  | 'in_progress'
  | 'pending_approval'
  | 'completed'
  | 'cancelled';

export interface JobCard {
  id: string;
  shopId: string;
  vehicleId: string;
  customerId: string;
  title: string;
  description?: string;
  status: JobCardStatus;
  assignedToId?: string;
  estimatedCost?: number;
  actualCost?: number;
  estimatedHours?: number;
  actualHours?: number;
  scheduledDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobCardPhoto {
  id: string;
  jobCardId: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  isDamagePhoto: boolean;
  uploadedBy: string;
  uploadedAt: Date;
}
