// GarageOS — Core Domain Types

// ---------------------------------------------------------------------------
// User & Authentication
// ---------------------------------------------------------------------------

export type UserRole = 'owner' | 'manager' | 'mechanic' | 'client';

export interface User {
  id: string;
  email?: string;
  phone?: string;
  name: string;
  avatarUrl?: string;
  companyName?: string;
  role: UserRole;
  locale: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  role: UserRole;
}

// ---------------------------------------------------------------------------
// Shop
// ---------------------------------------------------------------------------

export type ShopStatus = 'active' | 'suspended' | 'closed';

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  logoUrl?: string;
  status: ShopStatus;
  timezone: string;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Vehicle
// ---------------------------------------------------------------------------

export interface Vehicle {
  id: string;
  shopId: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  vin?: string;
  color?: string;
  mileage?: number;
  fuelType?: 'gasoline' | 'diesel' | 'electric' | 'hybrid';
  transmission?: 'automatic' | 'manual';
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  shopId: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Job Card
// ---------------------------------------------------------------------------

export type JobCardStatus =
  | 'inspection'
  | 'diagnosed'
  | 'parts_ordered'
  | 'in_progress'
  | 'pending_approval'
  | 'completed'
  | 'cancelled';

export interface JobCard {
  id: string;
  shopId: string;
  vehicleId: string;
  customerId: string;
  title: string;
  description?: string;
  status: JobCardStatus;
  assignedToId?: string;
  estimatedCost?: number;
  actualCost?: number;
  estimatedHours?: number;
  actualHours?: number;
  scheduledDate?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobCardPhoto {
  id: string;
  jobCardId: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  isDamagePhoto: boolean;
  uploadedBy: string;
  uploadedAt: Date;
}

// ---------------------------------------------------------------------------
// AI Inspection
// ---------------------------------------------------------------------------

export type DetectionCategory =
  | 'brake'
  | 'tire'
  | 'engine'
  | 'transmission'
  | 'suspension'
  | 'electrical'
  | 'body'
  | 'fluid'
  | 'exhaust'
  | 'safety';

export interface DetectionItem {
  label: string;
  severity: 'info' | 'warning' | 'critical';
  confidence: number;
  category: DetectionCategory;
  description?: string;
  estimatedRepairCost?: number;
}

export interface AIInspectionResult {
  id: string;
  photoId: string;
  detections: DetectionItem[];
  overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  summary: string;
  confidence: number;
  analyzedAt: Date;
}

// ---------------------------------------------------------------------------
// Parts & Inventory
// ---------------------------------------------------------------------------

export type PartStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';

export interface Part {
  id: string;
  shopId: string;
  name: string;
  partNumber?: string;
  category: string;
  brand?: string;
  supplierId?: string;
  costPrice: number;
  sellPrice: number;
  quantity: number;
  minQuantity?: number;
  status: PartStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartUsage {
  id: string;
  jobCardId: string;
  partId: string;
  quantity: number;
  unitPrice: number;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Supplier
// ---------------------------------------------------------------------------

export interface Supplier {
  id: string;
  shopId: string;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Invoice
// ---------------------------------------------------------------------------

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  shopId: string;
  jobCardId: string;
  invoiceNumber: string;
  customerId: string;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  dueDate?: Date;
  paidAt?: Date;
  paymentMethod?: 'cash' | 'transfer' | 'card' | 'qr';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ---------------------------------------------------------------------------
// Messaging
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Service Record
// ---------------------------------------------------------------------------

export interface ServiceRecord {
  id: string;
  shopId: string;
  vehicleId: string;
  jobCardId?: string;
  date: Date;
  mileage: number;
  serviceType: string;
  description: string;
  partsUsed?: string;
  laborHours?: number;
  cost: number;
  notes?: string;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// AI Diagnostics
// ---------------------------------------------------------------------------

export interface DiagnosticSuggestion {
  symptom: string;
  possibleCauses: string[];
  recommendedActions: string[];
  urgency: 'low' | 'medium' | 'high';
}

export interface AIDiagnosticResult {
  id: string;
  shopId: string;
  vehicleId: string;
  symptoms: string[];
  suggestions: DiagnosticSuggestion[];
  confidence: number;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Predictive Maintenance
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Activity Feed
// ---------------------------------------------------------------------------

export type ActivityType =
  | 'job_card_created'
  | 'job_card_completed'
  | 'photo_uploaded'
  | 'inspection_complete'
  | 'invoice_sent'
  | 'invoice_paid'
  | 'message_sent'
  | 'vehicle_added'
  | 'part_used';

export interface ActivityItem {
  id: string;
  shopId: string;
  userId: string;
  type: ActivityType;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

// ---------------------------------------------------------------------------
// Notification
// ---------------------------------------------------------------------------

export type NotificationType =
  | 'job_assigned'
  | 'job_completed'
  | 'payment_received'
  | 'customer_message'
  | 'parts_low'
  | 'reminder_due';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body?: string;
  data?: Record<string, unknown>;
  read: boolean;
  sentAt?: Date;
  createdAt: Date;
}
