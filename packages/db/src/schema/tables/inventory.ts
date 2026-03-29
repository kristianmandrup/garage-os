import { pgTable, varchar, timestamp, text, integer, real, uuid } from 'drizzle-orm/pg-core';
import { partStatusEnum } from '../enums';
import { shops } from './core';
import { jobCards } from './operations';

// ---------------------------------------------------------------------------
// Parts & Inventory
// ---------------------------------------------------------------------------

export const suppliers = pgTable('suppliers', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  name: varchar('name', { length: 255 }).notNull(),
  contactPerson: varchar('contact_person', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  notes: text('notes'),
  rating: real('rating'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const parts = pgTable('parts', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  name: varchar('name', { length: 255 }).notNull(),
  partNumber: varchar('part_number', { length: 100 }),
  category: varchar('category', { length: 100 }).notNull(),
  brand: varchar('brand', { length: 100 }),
  supplierId: uuid('supplier_id').references(() => suppliers.id),
  costPrice: real('cost_price').notNull().default(0),
  sellPrice: real('sell_price').notNull().default(0),
  quantity: integer('quantity').notNull().default(0),
  minQuantity: integer('min_quantity'),
  status: partStatusEnum('status').notNull().default('in_stock'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const partUsage = pgTable('part_usage', {
  id: uuid('id').primaryKey().defaultRandom(),
  jobCardId: uuid('job_card_id').notNull().references(() => jobCards.id),
  partId: uuid('part_id').notNull().references(() => parts.id),
  quantity: integer('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
