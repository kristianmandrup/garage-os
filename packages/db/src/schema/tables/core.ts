import { pgTable, varchar, timestamp, text, uuid } from 'drizzle-orm/pg-core';
import { userRoleEnum, shopStatusEnum } from '../enums';

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
