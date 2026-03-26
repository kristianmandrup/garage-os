import { pgTable, varchar, timestamp, text, integer, real, boolean, json, uuid, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

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

// ---------------------------------------------------------------------------
// Users & Authentication
// ---------------------------------------------------------------------------

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }),
  phone: varchar('phone', { length: 20 }),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  companyName: varchar('company_name', { length: 255 }),
  role: userRoleEnum('role').notNull().default('client'),
  locale: varchar('locale', { length: 10 }).notNull().default('en'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  role: userRoleEnum('role').notNull(),
});

// ---------------------------------------------------------------------------
// Shop
// ---------------------------------------------------------------------------

export const shops = pgTable('shops', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: uuid('owner_id').notNull().references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),
  logoUrl: varchar('logo_url', { length: 500 }),
  status: shopStatusEnum('status').notNull().default('active'),
  timezone: varchar('timezone', { length: 50 }).notNull().default('Asia/Bangkok'),
  currency: varchar('currency', { length: 10 }).notNull().default('THB'),
  // Messaging credentials
  twilioAccountSid: varchar('twilio_account_sid', { length: 100 }),
  twilioAuthToken: varchar('twilio_auth_token', { length: 255 }),
  twilioPhoneNumber: varchar('twilio_phone_number', { length: 20 }),
  twilioWhatsappFrom: varchar('twilio_whatsapp_from', { length: 20 }),
  lineChannelAccessToken: varchar('line_channel_access_token', { length: 500 }),
  lineUserId: varchar('line_user_id', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

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
// Parts & Inventory
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Supplier
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

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many, one }) => ({
  ownedShops: many(shops),
  assignedJobCards: many(jobCards),
  activities: many(activityItems),
  notifications: many(notifications),
  assignedTasks: many(taskmasterTasks),
  taskmasterUserMappings: many(taskmasterUserMappings),
}));

export const shopsRelations = relations(shops, ({ one, many }) => ({
  owner: one(users, { fields: [shops.ownerId], references: [users.id] }),
  customers: many(customers),
  vehicles: many(vehicles),
  jobCards: many(jobCards),
  parts: many(parts),
  suppliers: many(suppliers),
  invoices: many(invoices),
  messages: many(messages),
  serviceRecords: many(serviceRecords),
  aiDiagnosticResults: many(aiDiagnosticResults),
  maintenanceReminders: many(maintenanceReminders),
  activityItems: many(activityItems),
  taskmasterTasks: many(taskmasterTasks),
  taskmasterUserMappings: many(taskmasterUserMappings),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  shop: one(shops, { fields: [customers.shopId], references: [shops.id] }),
  vehicles: many(vehicles),
  jobCards: many(jobCards),
  invoices: many(invoices),
  messages: many(messages),
  maintenanceReminders: many(maintenanceReminders),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  shop: one(shops, { fields: [vehicles.shopId], references: [shops.id] }),
  customer: one(customers, { fields: [vehicles.customerId], references: [customers.id] }),
  jobCards: many(jobCards),
  serviceRecords: many(serviceRecords),
  aiDiagnosticResults: many(aiDiagnosticResults),
  maintenanceReminders: many(maintenanceReminders),
}));

export const jobCardsRelations = relations(jobCards, ({ one, many }) => ({
  shop: one(shops, { fields: [jobCards.shopId], references: [shops.id] }),
  vehicle: one(vehicles, { fields: [jobCards.vehicleId], references: [vehicles.id] }),
  customer: one(customers, { fields: [jobCards.customerId], references: [customers.id] }),
  assignedTo: one(users, { fields: [jobCards.assignedToId], references: [users.id] }),
  photos: many(jobCardPhotos),
  partUsages: many(partUsage),
  invoices: many(invoices),
  messages: many(messages),
  serviceRecords: many(serviceRecords),
}));

export const jobCardPhotosRelations = relations(jobCardPhotos, ({ one, many }) => ({
  jobCard: one(jobCards, { fields: [jobCardPhotos.jobCardId], references: [jobCards.id] }),
  aiInspectionResult: many(aiInspectionResults),
}));

export const aiInspectionResultsRelations = relations(aiInspectionResults, ({ one }) => ({
  photo: one(jobCardPhotos, { fields: [aiInspectionResults.photoId], references: [jobCardPhotos.id] }),
}));

export const partsRelations = relations(parts, ({ one, many }) => ({
  shop: one(shops, { fields: [parts.shopId], references: [shops.id] }),
  supplier: one(suppliers, { fields: [parts.supplierId], references: [suppliers.id] }),
  partUsages: many(partUsage),
}));

export const partUsageRelations = relations(partUsage, ({ one }) => ({
  jobCard: one(jobCards, { fields: [partUsage.jobCardId], references: [jobCards.id] }),
  part: one(parts, { fields: [partUsage.partId], references: [parts.id] }),
}));

export const suppliersRelations = relations(suppliers, ({ one, many }) => ({
  shop: one(shops, { fields: [suppliers.shopId], references: [shops.id] }),
  parts: many(parts),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  shop: one(shops, { fields: [invoices.shopId], references: [shops.id] }),
  jobCard: one(jobCards, { fields: [invoices.jobCardId], references: [jobCards.id] }),
  customer: one(customers, { fields: [invoices.customerId], references: [customers.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  shop: one(shops, { fields: [messages.shopId], references: [shops.id] }),
  customer: one(customers, { fields: [messages.customerId], references: [customers.id] }),
  jobCard: one(jobCards, { fields: [messages.jobCardId], references: [jobCards.id] }),
}));

export const serviceRecordsRelations = relations(serviceRecords, ({ one }) => ({
  shop: one(shops, { fields: [serviceRecords.shopId], references: [shops.id] }),
  vehicle: one(vehicles, { fields: [serviceRecords.vehicleId], references: [vehicles.id] }),
  jobCard: one(jobCards, { fields: [serviceRecords.jobCardId], references: [jobCards.id] }),
}));

export const aiDiagnosticResultsRelations = relations(aiDiagnosticResults, ({ one }) => ({
  shop: one(shops, { fields: [aiDiagnosticResults.shopId], references: [shops.id] }),
  vehicle: one(vehicles, { fields: [aiDiagnosticResults.vehicleId], references: [vehicles.id] }),
}));

export const maintenanceRemindersRelations = relations(maintenanceReminders, ({ one }) => ({
  shop: one(shops, { fields: [maintenanceReminders.shopId], references: [shops.id] }),
  vehicle: one(vehicles, { fields: [maintenanceReminders.vehicleId], references: [vehicles.id] }),
  customer: one(customers, { fields: [maintenanceReminders.customerId], references: [customers.id] }),
}));

export const activityItemsRelations = relations(activityItems, ({ one }) => ({
  shop: one(shops, { fields: [activityItems.shopId], references: [shops.id] }),
  user: one(users, { fields: [activityItems.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const taskmasterTasksRelations = relations(taskmasterTasks, ({ one }) => ({
  shop: one(shops, { fields: [taskmasterTasks.shopId], references: [shops.id] }),
  assignee: one(users, { fields: [taskmasterTasks.garageosAssigneeId], references: [users.id] }),
}));

export const taskmasterUserMappingsRelations = relations(taskmasterUserMappings, ({ one }) => ({
  shop: one(shops, { fields: [taskmasterUserMappings.shopId], references: [shops.id] }),
  garageosUser: one(users, { fields: [taskmasterUserMappings.garageosUserId], references: [users.id] }),
}));
