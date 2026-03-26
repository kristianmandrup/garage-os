import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// Users & Authentication
// ---------------------------------------------------------------------------

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email'),
  phone: text('phone'),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  companyName: text('company_name'),
  role: text('role', { enum: ['owner', 'manager', 'mechanic', 'client'] }).notNull().default('client'),
  locale: text('locale').notNull().default('en'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const userProfiles = sqliteTable('user_profiles', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  role: text('role', { enum: ['owner', 'manager', 'mechanic', 'client'] }).notNull(),
});

// ---------------------------------------------------------------------------
// Shop
// ---------------------------------------------------------------------------

export const shops = sqliteTable('shops', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull().references(() => users.id),
  name: text('name').notNull(),
  description: text('description'),
  address: text('address'),
  phone: text('phone'),
  email: text('email'),
  logoUrl: text('logo_url'),
  status: text('status', { enum: ['active', 'suspended', 'closed'] }).notNull().default('active'),
  timezone: text('timezone').notNull().default('Asia/Bangkok'),
  currency: text('currency').notNull().default('THB'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Vehicle & Customer
// ---------------------------------------------------------------------------

export const customers = sqliteTable('customers', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const vehicles = sqliteTable('vehicles', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  licensePlate: text('license_plate').notNull(),
  brand: text('brand').notNull(),
  model: text('model').notNull(),
  year: integer('year').notNull(),
  vin: text('vin'),
  color: text('color'),
  mileage: integer('mileage'),
  fuelType: text('fuel_type', { enum: ['gasoline', 'diesel', 'electric', 'hybrid'] }),
  transmission: text('transmission', { enum: ['automatic', 'manual'] }),
  customerId: text('customer_id').notNull().references(() => customers.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Job Card
// ---------------------------------------------------------------------------

export const jobCards = sqliteTable('job_cards', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  vehicleId: text('vehicle_id').notNull().references(() => vehicles.id),
  customerId: text('customer_id').notNull().references(() => customers.id),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status', {
    enum: ['inspection', 'diagnosed', 'parts_ordered', 'in_progress', 'pending_approval', 'completed', 'cancelled']
  }).notNull().default('inspection'),
  assignedToId: text('assigned_to_id').references(() => users.id),
  estimatedCost: real('estimated_cost'),
  actualCost: real('actual_cost'),
  estimatedHours: real('estimated_hours'),
  actualHours: real('actual_hours'),
  scheduledDate: integer('scheduled_date', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const jobCardPhotos = sqliteTable('job_card_photos', {
  id: text('id').primaryKey(),
  jobCardId: text('job_card_id').notNull().references(() => jobCards.id),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  caption: text('caption'),
  isDamagePhoto: integer('is_damage_photo', { mode: 'boolean' }).notNull().default(false),
  uploadedBy: text('uploaded_by').notNull(),
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// AI Inspection
// ---------------------------------------------------------------------------

export const aiInspectionResults = sqliteTable('ai_inspection_results', {
  id: text('id').primaryKey(),
  photoId: text('photo_id').notNull().references(() => jobCardPhotos.id),
  detections: text('detections', { mode: 'json' }).notNull().$type<Array<{
    label: string;
    severity: 'info' | 'warning' | 'critical';
    confidence: number;
    category: string;
    description?: string;
    estimatedRepairCost?: number;
  }>>(),
  overallCondition: text('overall_condition', { enum: ['excellent', 'good', 'fair', 'poor', 'critical'] }).notNull(),
  summary: text('summary').notNull(),
  confidence: real('confidence').notNull(),
  analyzedAt: integer('analyzed_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Parts & Inventory
// ---------------------------------------------------------------------------

export const parts = sqliteTable('parts', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  name: text('name').notNull(),
  partNumber: text('part_number'),
  category: text('category').notNull(),
  brand: text('brand'),
  supplierId: text('supplier_id').references(() => suppliers.id),
  costPrice: real('cost_price').notNull().default(0),
  sellPrice: real('sell_price').notNull().default(0),
  quantity: integer('quantity').notNull().default(0),
  minQuantity: integer('min_quantity'),
  status: text('status', { enum: ['in_stock', 'low_stock', 'out_of_stock', 'discontinued'] }).notNull().default('in_stock'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const partUsage = sqliteTable('part_usage', {
  id: text('id').primaryKey(),
  jobCardId: text('job_card_id').notNull().references(() => jobCards.id),
  partId: text('part_id').notNull().references(() => parts.id),
  quantity: integer('quantity').notNull(),
  unitPrice: real('unit_price').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Supplier
// ---------------------------------------------------------------------------

export const suppliers = sqliteTable('suppliers', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  name: text('name').notNull(),
  contactPerson: text('contact_person'),
  phone: text('phone'),
  email: text('email'),
  address: text('address'),
  notes: text('notes'),
  rating: real('rating'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Invoice
// ---------------------------------------------------------------------------

export const invoices = sqliteTable('invoices', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  jobCardId: text('job_card_id').notNull().references(() => jobCards.id),
  invoiceNumber: text('invoice_number').notNull(),
  customerId: text('customer_id').notNull().references(() => customers.id),
  subtotal: real('subtotal').notNull(),
  tax: real('tax').notNull().default(0),
  discount: real('discount').notNull().default(0),
  total: real('total').notNull(),
  status: text('status', { enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'] }).notNull().default('draft'),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  paidAt: integer('paid_at', { mode: 'timestamp' }),
  paymentMethod: text('payment_method', { enum: ['cash', 'transfer', 'card', 'qr'] }),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

export const messages = sqliteTable('messages', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  customerId: text('customer_id').notNull().references(() => customers.id),
  jobCardId: text('job_card_id').references(() => jobCards.id),
  type: text('type', { enum: ['status_update', 'repair_approved', 'payment_reminder', 'ready_for_pickup', 'custom'] }).notNull(),
  channel: text('channel', { enum: ['sms', 'whatsapp', 'line', 'app'] }).notNull(),
  content: text('content').notNull(),
  sentAt: integer('sent_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  deliveredAt: integer('delivered_at', { mode: 'timestamp' }),
  readAt: integer('read_at', { mode: 'timestamp' }),
  status: text('status', { enum: ['pending', 'sent', 'delivered', 'read', 'failed'] }).notNull().default('pending'),
});

// ---------------------------------------------------------------------------
// Service Record
// ---------------------------------------------------------------------------

export const serviceRecords = sqliteTable('service_records', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  vehicleId: text('vehicle_id').notNull().references(() => vehicles.id),
  jobCardId: text('job_card_id').references(() => jobCards.id),
  date: integer('date', { mode: 'timestamp' }).notNull(),
  mileage: integer('mileage').notNull(),
  serviceType: text('service_type').notNull(),
  description: text('description').notNull(),
  partsUsed: text('parts_used'),
  laborHours: real('labor_hours'),
  cost: real('cost').notNull(),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// AI Diagnostics
// ---------------------------------------------------------------------------

export const aiDiagnosticResults = sqliteTable('ai_diagnostic_results', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  vehicleId: text('vehicle_id').notNull().references(() => vehicles.id),
  symptoms: text('symptoms', { mode: 'json' }).notNull().$type<string[]>(),
  suggestions: text('suggestions', { mode: 'json' }).notNull().$type<Array<{
    symptom: string;
    possibleCauses: string[];
    recommendedActions: string[];
    urgency: 'low' | 'medium' | 'high';
  }>>(),
  confidence: real('confidence').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Predictive Maintenance
// ---------------------------------------------------------------------------

export const maintenanceReminders = sqliteTable('maintenance_reminders', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  vehicleId: text('vehicle_id').notNull().references(() => vehicles.id),
  customerId: text('customer_id').notNull().references(() => customers.id),
  reminderType: text('reminder_type', { enum: ['oil_change', 'tire_rotation', 'inspection', 'insurance', 'custom'] }).notNull(),
  description: text('description').notNull(),
  dueDate: integer('due_date', { mode: 'timestamp' }).notNull(),
  dueMileage: integer('due_mileage'),
  status: text('status', { enum: ['pending', 'sent', 'completed', 'cancelled'] }).notNull().default('pending'),
  sentAt: integer('sent_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Activity Feed
// ---------------------------------------------------------------------------

export const activityItems = sqliteTable('activity_items', {
  id: text('id').primaryKey(),
  shopId: text('shop_id').notNull().references(() => shops.id),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type', {
    enum: ['job_card_created', 'job_card_completed', 'photo_uploaded', 'inspection_complete', 'invoice_sent', 'invoice_paid', 'message_sent', 'vehicle_added', 'part_used']
  }).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  metadata: text('metadata', { mode: 'json' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type', {
    enum: ['job_assigned', 'job_completed', 'payment_received', 'customer_message', 'parts_low', 'reminder_due']
  }).notNull(),
  title: text('title').notNull(),
  body: text('body'),
  data: text('data', { mode: 'json' }),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  sentAt: integer('sent_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// ---------------------------------------------------------------------------
// Relations
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  ownedShops: many(shops),
  assignedJobCards: many(jobCards),
  activities: many(activityItems),
  notifications: many(notifications),
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
  aiInspectionResult: one(aiInspectionResults),
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

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
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
