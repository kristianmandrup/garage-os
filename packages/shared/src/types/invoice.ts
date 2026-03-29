// GarageOS — Invoice Types

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
