import { pgTable, varchar, timestamp, text, integer, real, uuid } from 'drizzle-orm/pg-core';
import { invoiceStatusEnum, paymentMethodEnum, messageTypeEnum, messageChannelEnum, messageStatusEnum } from '../enums';
import { shops } from './core';
import { customers, vehicles, jobCards } from './operations';

// ---------------------------------------------------------------------------
// Invoice
// ---------------------------------------------------------------------------

export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  jobCardId: uuid('job_card_id').notNull().references(() => jobCards.id),
  invoiceNumber: varchar('invoice_number', { length: 50 }).notNull(),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  subtotal: real('subtotal').notNull(),
  tax: real('tax').notNull().default(0),
  discount: real('discount').notNull().default(0),
  total: real('total').notNull(),
  status: invoiceStatusEnum('status').notNull().default('draft'),
  dueDate: timestamp('due_date'),
  paidAt: timestamp('paid_at'),
  paymentMethod: paymentMethodEnum('payment_method'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  jobCardId: uuid('job_card_id').references(() => jobCards.id),
  type: messageTypeEnum('type').notNull(),
  channel: messageChannelEnum('channel').notNull(),
  content: text('content').notNull(),
  sentAt: timestamp('sent_at').notNull().defaultNow(),
  deliveredAt: timestamp('delivered_at'),
  readAt: timestamp('read_at'),
  status: messageStatusEnum('status').notNull().default('pending'),
});

// ---------------------------------------------------------------------------
// Service Record
// ---------------------------------------------------------------------------

export const serviceRecords = pgTable('service_records', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id),
  jobCardId: uuid('job_card_id').references(() => jobCards.id),
  date: timestamp('date').notNull(),
  mileage: integer('mileage').notNull(),
  serviceType: varchar('service_type', { length: 100 }).notNull(),
  description: text('description').notNull(),
  partsUsed: text('parts_used'),
  laborHours: real('labor_hours'),
  cost: real('cost').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
