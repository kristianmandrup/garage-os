// GarageOS — Notification Types

export type NotificationType =
  | 'job_assigned'
  | 'job_completed'
  | 'payment_received'
  | 'customer_message'
  | 'parts_low'
  | 'reminder_due';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
  read: boolean;
  sentAt?: Date;
  createdAt: Date;
}
