import { pgTable, varchar, timestamp, text, integer, real, boolean, uuid } from 'drizzle-orm/pg-core';
import { fuelTypeEnum, transmissionEnum, jobCardStatusEnum } from '../enums';
import { shops } from './core';
import { users } from './core';

// ---------------------------------------------------------------------------
// Vehicle & Customer
// ---------------------------------------------------------------------------

export const customers = pgTable('customers', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  name: varchar('name', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  lineId: varchar('line_id', { length: 255 }),
  address: text('address'),
  notes: text('notes'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const vehicles = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  licensePlate: varchar('license_plate', { length: 20 }).notNull(),
  brand: varchar('brand', { length: 100 }).notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  year: integer('year').notNull(),
  vin: varchar('vin', { length: 17 }),
  color: varchar('color', { length: 50 }),
  mileage: integer('mileage'),
  fuelType: fuelTypeEnum('fuel_type'),
  transmission: transmissionEnum('transmission'),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Job Card
// ---------------------------------------------------------------------------

export const jobCards = pgTable('job_cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: jobCardStatusEnum('status').notNull().default('inspection'),
  assignedToId: uuid('assigned_to_id').references(() => users.id),
  estimatedCost: real('estimated_cost'),
  actualCost: real('actual_cost'),
  estimatedHours: real('estimated_hours'),
  actualHours: real('actual_hours'),
  scheduledDate: timestamp('scheduled_date'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const jobCardPhotos = pgTable('job_card_photos', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobCardId: uuid('job_card_id').notNull().references(() => jobCards.id),
  url: varchar('url', { length: 500 }).notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }),
  caption: text('caption'),
  isDamagePhoto: boolean('is_damage_photo').notNull().default(false),
  uploadedBy: uuid('uploaded_by').notNull(),
  uploadedAt: timestamp('uploaded_at').notNull().defaultNow(),
});
