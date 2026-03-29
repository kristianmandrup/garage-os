import { common } from './common';
import { nav } from './nav';
import { dashboard } from './dashboard';
import { tasks } from './tasks';
import { jobCards } from './jobCards';
import { invoices } from './invoices';
import { reminder } from './reminder';
import { inventory } from './inventory';
import { vehicles } from './vehicles';
import { customers } from './customers';
import { message } from './message';
import { analytics } from './analytics';
import { settings } from './settings';
import { dateTime } from './dateTime';
import { inspection } from './inspection';
import { suppliers } from './suppliers';
import { team } from './team';
import { growth } from './growth';
import { financials } from './financials';
import { auditLog } from './auditLog';

export const en = {
  common,
  nav,
  dashboard,
  tasks,
  jobCards,
  invoices,
  reminder,
  inventory,
  vehicles,
  customers,
  message,
  analytics,
  settings,
  dateTime,
  inspection,
  suppliers,
  team,
  growth,
  financials,
  auditLog,
} as const;

export type EnTranslationKeys = typeof en;
