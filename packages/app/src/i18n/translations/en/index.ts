import { common } from './common';
import { nav } from './nav';
import { dashboard } from './dashboard';
import { tasks } from './tasks';
import { notifications } from './notifications';
import { jobCard } from './jobCard';
import { invoice } from './invoice';
import { invoiceDetail } from './invoiceDetail';
import { reminder } from './reminder';
import { inventory } from './inventory';
import { vehicle } from './vehicle';
import { customer } from './customer';
import { message } from './message';
import { analytics } from './analytics';
import { settings } from './settings';
import { errors } from './errors';
import { dateTime } from './dateTime';
import { jobCards } from './jobCards';
import { supplier } from './supplier';
import { inspection } from './inspection';
import { newVehicle } from './newVehicle';
import { vehicleDetail } from './vehicleDetail';
import { newCustomer } from './newCustomer';
import { customerDetail } from './customerDetail';
import { newPart } from './newPart';
import { partDetail } from './partDetail';
import { newSupplier } from './newSupplier';

export const en = {
  common,
  nav,
  dashboard,
  tasks,
  notifications,
  jobCard,
  invoice,
  invoiceDetail,
  reminder,
  inventory,
  vehicle,
  customer,
  message,
  analytics,
  settings,
  errors,
  dateTime,
  jobCards,
  supplier,
  inspection,
  newVehicle,
  vehicleDetail,
  newCustomer,
  customerDetail,
  newPart,
  partDetail,
  newSupplier,
} as const;

export type EnTranslationKeys = typeof en;
