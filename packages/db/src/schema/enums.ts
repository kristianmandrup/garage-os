import { pgEnum } from 'drizzle-orm/pg-core';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

export const userRoleEnum = pgEnum('user_role', ['owner', 'manager', 'mechanic', 'client']);
export const shopStatusEnum = pgEnum('shop_status', ['active', 'suspended', 'closed']);
export const fuelTypeEnum = pgEnum('fuel_type', ['gasoline', 'diesel', 'electric', 'hybrid']);
export const transmissionEnum = pgEnum('transmission', ['automatic', 'manual']);
export const jobCardStatusEnum = pgEnum('job_card_status', [
  'inspection', 'diagnosed', 'parts_ordered', 'in_progress', 'pending_approval', 'completed', 'cancelled'
]);
export const partStatusEnum = pgEnum('part_status', ['in_stock', 'low_stock', 'out_of_stock', 'discontinued']);
export const invoiceStatusEnum = pgEnum('invoice_status', ['draft', 'sent', 'paid', 'overdue', 'cancelled']);
export const messageTypeEnum = pgEnum('message_type', ['status_update', 'repair_approved', 'payment_reminder', 'ready_for_pickup', 'custom']);
export const messageChannelEnum = pgEnum('message_channel', ['sms', 'whatsapp', 'line', 'app']);
export const messageStatusEnum = pgEnum('message_status', ['pending', 'sent', 'delivered', 'read', 'failed']);
export const aiConditionEnum = pgEnum('ai_condition', ['excellent', 'good', 'fair', 'poor', 'critical']);
export const severityEnum = pgEnum('severity', ['info', 'warning', 'critical']);
export const urgencyEnum = pgEnum('urgency', ['low', 'medium', 'high']);
export const reminderTypeEnum = pgEnum('reminder_type', ['oil_change', 'tire_rotation', 'inspection', 'insurance', 'custom']);
export const reminderStatusEnum = pgEnum('reminder_status', ['pending', 'sent', 'completed', 'cancelled']);
export const paymentMethodEnum = pgEnum('payment_method', ['cash', 'transfer', 'card', 'qr']);
export const activityTypeEnum = pgEnum('activity_type', [
  'job_card_created', 'job_card_completed', 'photo_uploaded', 'inspection_complete',
  'invoice_sent', 'invoice_paid', 'message_sent', 'vehicle_added', 'part_used'
]);
export const notificationTypeEnum = pgEnum('notification_type', [
  'job_assigned', 'job_completed', 'payment_received', 'customer_message', 'parts_low', 'reminder_due',
  'task_assigned', 'task_updated', 'task_completed'
]);
