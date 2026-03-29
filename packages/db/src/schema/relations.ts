import { relations } from 'drizzle-orm';
import { users, shops } from './tables/core';
import { customers, vehicles, jobCards, jobCardPhotos } from './tables/operations';
import { parts, partUsage, suppliers } from './tables/inventory';
import { invoices, messages, serviceRecords } from './tables/business';
import { aiInspectionResults, aiDiagnosticResults, maintenanceReminders, activityItems, notifications, taskmasterTasks, taskmasterUserMappings } from './tables/features';

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
