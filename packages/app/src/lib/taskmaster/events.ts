// Event-driven task creation functions

import type { TaskMasterResponse } from './types';
import { getTaskMasterConfigFromEnv } from './config';
import { taskmasterService } from './client';

export async function createTaskForJobCard(
  jobCard: {
    id: string;
    title: string;
    vehicle?: { license_plate: string; brand: string; model: string };
    customer?: { name: string };
    status: string;
  },
  event: 'created' | 'status_change' | 'completed',
  previousStatus?: string
): Promise<TaskMasterResponse> {
  const config = getTaskMasterConfigFromEnv();
  if (!config) {
    return { success: false, error: 'TaskMaster not configured' };
  }

  taskmasterService.configure(config);

  let title: string;
  let description: string;
  let status: 'todo' | 'in_progress' | 'done' = 'todo';
  let priority: 0 | 1 | 2 | 3 | 4 = 2;

  const vehicleInfo = jobCard.vehicle
    ? `${jobCard.vehicle.brand} ${jobCard.vehicle.model} (${jobCard.vehicle.license_plate})`
    : 'Unknown Vehicle';

  switch (event) {
    case 'created':
      title = `New Repair: ${jobCard.title}`;
      description = `Vehicle: ${vehicleInfo}\nCustomer: ${jobCard.customer?.name || 'Unknown'}\nStatus: ${jobCard.status}`;
      break;

    case 'status_change':
      title = `Job Update: ${jobCard.title}`;
      description = `Vehicle: ${vehicleInfo}\nStatus changed: ${previousStatus} → ${jobCard.status}`;

      if (jobCard.status === 'pending_approval') {
        priority = 1; // High priority
        status = 'todo';
      } else if (jobCard.status === 'in_progress') {
        status = 'in_progress';
      }
      break;

    case 'completed':
      title = `Completed: ${jobCard.title}`;
      description = `Vehicle: ${vehicleInfo}\nJob completed successfully`;
      status = 'done';
      priority = 3; // Lower priority since done
      break;

    default:
      return { success: false, error: 'Unknown event type' };
  }

  return taskmasterService.createTask({
    title,
    description,
    status,
    priority,
  });
}

export async function createTaskForInvoice(
  invoice: {
    id: string;
    invoice_number: string;
    total: number;
    customer?: { name: string };
    vehicle?: { license_plate: string };
    due_date?: string;
  },
  event: 'created' | 'sent' | 'overdue'
): Promise<TaskMasterResponse> {
  const config = getTaskMasterConfigFromEnv();
  if (!config) {
    return { success: false, error: 'TaskMaster not configured' };
  }

  taskmasterService.configure(config);

  let title: string;
  let description: string;
  let priority: 0 | 1 | 2 | 3 | 4 = 2;

  const customerInfo = invoice.customer?.name || 'Unknown Customer';
  const vehicleInfo = invoice.vehicle?.license_plate || '';

  switch (event) {
    case 'created':
      title = `Invoice ${invoice.invoice_number} Created`;
      description = `Customer: ${customerInfo}\nVehicle: ${vehicleInfo}\nAmount: ฿${invoice.total.toLocaleString()}`;
      break;

    case 'sent':
      title = `Payment Request: Invoice ${invoice.invoice_number}`;
      description = `Customer: ${customerInfo}\nAmount: ฿${invoice.total.toLocaleString()}\nDue: ${invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('th-TH') : 'Not set'}`;
      priority = 2;
      break;

    case 'overdue':
      title = `OVERDUE: Invoice ${invoice.invoice_number}`;
      description = `Customer: ${customerInfo}\nAmount: ฿${invoice.total.toLocaleString()}\nInvoice is overdue!`;
      priority = 0; // Highest priority
      break;

    default:
      return { success: false, error: 'Unknown event type' };
  }

  return taskmasterService.createTask({
    title,
    description,
    status: 'todo',
    priority,
    dueDate: invoice.due_date,
  });
}

export async function createTaskForReminder(
  reminder: {
    id: string;
    description: string;
    vehicle?: { license_plate: string; brand: string; model: string };
    due_date: string;
    reminder_type: string;
  },
  isOverdue: boolean
): Promise<TaskMasterResponse> {
  const config = getTaskMasterConfigFromEnv();
  if (!config) {
    return { success: false, error: 'TaskMaster not configured' };
  }

  taskmasterService.configure(config);

  const vehicleInfo = reminder.vehicle
    ? `${reminder.vehicle.brand} ${reminder.vehicle.model} (${reminder.vehicle.license_plate})`
    : '';

  const title = isOverdue
    ? `URGENT: Overdue Service Reminder`
    : `Service Reminder: ${reminder.description}`;

  const description = [
    vehicleInfo ? `Vehicle: ${vehicleInfo}` : '',
    `Reminder Type: ${reminder.reminder_type}`,
    `Due: ${new Date(reminder.due_date).toLocaleDateString('th-TH')}`,
    isOverdue ? '⚠️ THIS REMINDER IS OVERDUE!' : '',
  ].filter(Boolean).join('\n');

  return taskmasterService.createTask({
    title,
    description,
    status: 'todo',
    priority: isOverdue ? 0 : 2,
    dueDate: reminder.due_date,
  });
}

export async function createTaskForLowStock(
  part: {
    id: string;
    name: string;
    quantity: number;
    min_quantity?: number;
  }
): Promise<TaskMasterResponse> {
  const config = getTaskMasterConfigFromEnv();
  if (!config) {
    return { success: false, error: 'TaskMaster not configured' };
  }

  taskmasterService.configure(config);

  const title = `Order Parts: ${part.name} Low Stock`;
  const description = [
    `Part: ${part.name}`,
    `Current Stock: ${part.quantity}`,
    `Minimum: ${part.min_quantity || 0}`,
    `Status: ${part.quantity === 0 ? 'OUT OF STOCK' : 'LOW STOCK'}`,
  ].join('\n');

  return taskmasterService.createTask({
    title,
    description,
    status: 'todo',
    priority: part.quantity === 0 ? 0 : 1,
  });
}
