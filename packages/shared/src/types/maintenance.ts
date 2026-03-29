// GarageOS — Predictive Maintenance Types

export type ReminderStatus = 'pending' | 'sent' | 'completed' | 'cancelled';

export interface MaintenanceReminder {
  id: string;
  shopId: string;
  vehicleId: string;
  customerId: string;
  reminderType: 'oil_change' | 'tire_rotation' | 'inspection' | 'insurance' | 'custom';
  description: string;
  dueDate: Date;
  dueMileage?: number;
  status: ReminderStatus;
  sentAt?: Date;
  createdAt: Date;
}
