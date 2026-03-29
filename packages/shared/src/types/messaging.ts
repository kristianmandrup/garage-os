// GarageOS — Messaging Types

export type MessageType = 'status_update' | 'repair_approved' | 'payment_reminder' | 'ready_for_pickup' | 'custom';
export type MessageChannel = 'sms' | 'whatsapp' | 'line' | 'app';

export interface Message {
  id: string;
  shopId: string;
  customerId: string;
  jobCardId?: string;
  type: MessageType;
  channel: MessageChannel;
  content: string;
  sentAt: Date;
  deliveredAt?: Date;
  readAt?: Date;
  status: 'pending' | 'sent' | 'delivered' | 'read' | 'failed';
}
