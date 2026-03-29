import { pgTable, varchar, timestamp, text, integer, real, boolean, json, uuid } from 'drizzle-orm/pg-core';
import { aiConditionEnum, severityEnum, reminderTypeEnum, reminderStatusEnum, activityTypeEnum, notificationTypeEnum } from '../enums';
import { users, shops } from './core';
import { customers, vehicles, jobCardPhotos } from './operations';

// ---------------------------------------------------------------------------
// AI Inspection
// ---------------------------------------------------------------------------

export const detectionItemSchema = {
  label: varchar('label', { length: 255 }).notNull(),
  severity: severityEnum('severity').notNull(),
  confidence: real('confidence').notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  description: text('description'),
  estimatedRepairCost: real('estimated_repair_cost'),
};

export const aiInspectionResults = pgTable('ai_inspection_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  photoId: uuid('photo_id').notNull().references(() => jobCardPhotos.id),
  detections: json('detections').notNull().$type<Array<{
    label: string;
    severity: 'info' | 'warning' | 'critical';
    confidence: number;
    category: string;
    description?: string;
    estimatedRepairCost?: number;
  }>>(),
  overallCondition: aiConditionEnum('overall_condition').notNull(),
  summary: text('summary').notNull(),
  confidence: real('confidence').notNull(),
  analyzedAt: timestamp('analyzed_at').notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// AI Diagnostics
// ---------------------------------------------------------------------------

export const aiDiagnosticResults = pgTable('ai_diagnostic_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id),
  symptoms: json('symptoms').notNull().$type<string[]>(),
  suggestions: json('suggestions').notNull().$type<Array<{
    symptom: string;
    possibleCauses: string[];
    recommendedActions: string[];
    urgency: 'low' | 'medium' | 'high';
  }>>(),
  confidence: real('confidence').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Predictive Maintenance
// ---------------------------------------------------------------------------

export const maintenanceReminders = pgTable('maintenance_reminders', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  vehicleId: uuid('vehicle_id').notNull().references(() => vehicles.id),
  customerId: uuid('customer_id').notNull().references(() => customers.id),
  reminderType: reminderTypeEnum('reminder_type').notNull(),
  description: text('description').notNull(),
  dueDate: timestamp('due_date').notNull(),
  dueMileage: integer('due_mileage'),
  status: reminderStatusEnum('status').notNull().default('pending'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Activity Feed
// ---------------------------------------------------------------------------

export const activityItems = pgTable('activity_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: activityTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  metadata: json('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notifications = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  body: text('body'),
  data: json('data'),
  read: boolean('read').notNull().default(false),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// TaskMaster Integration
// ---------------------------------------------------------------------------

export const taskmasterTasks = pgTable('taskmaster_tasks', {
  id: uuid('id').primaryKey().defaultRandom(),
  taskmasterId: varchar('taskmaster_id', { length: 255 }).notNull().unique(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  taskmasterProjectId: varchar('taskmaster_project_id', { length: 255 }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: varchar('status', { length: 50 }).notNull().default('todo'),
  priority: integer('priority').notNull().default(2),
  dueDate: timestamp('due_date'),
  linkedEntityType: varchar('linked_entity_type', { length: 50 }), // 'job_card' | 'invoice' | 'reminder' | 'low_stock'
  linkedEntityId: uuid('linked_entity_id'),
  taskmasterAssigneeId: varchar('taskmaster_assignee_id', { length: 255 }),
  garageosAssigneeId: uuid('garageos_assignee_id').references(() => users.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  syncedAt: timestamp('synced_at').notNull().defaultNow(),
});

export const taskmasterUserMappings = pgTable('taskmaster_user_mappings', {
  id: uuid('id').primaryKey().defaultRandom(),
  shopId: uuid('shop_id').notNull().references(() => shops.id),
  garageosUserId: uuid('garageos_user_id').notNull().references(() => users.id),
  taskmasterUserId: varchar('taskmaster_user_id', { length: 255 }).notNull(),
  taskmasterEmail: varchar('taskmaster_email', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
