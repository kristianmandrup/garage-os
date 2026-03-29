// GarageOS — Activity Feed Types

export type ActivityType =
  | 'job_card_created'
  | 'job_card_completed'
  | 'photo_uploaded'
  | 'inspection_complete'
  | 'invoice_sent'
  | 'invoice_paid'
  | 'message_sent'
  | 'vehicle_added'
  | 'part_used';

export interface ActivityItem {
  id: string;
  shopId: string;
  userId: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
