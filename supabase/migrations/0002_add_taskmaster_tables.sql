-- Add new notification types for TaskMaster integration
ALTER TYPE "notification_type" ADD VALUE IF NOT EXISTS 'task_assigned';
ALTER TYPE "notification_type" ADD VALUE IF NOT EXISTS 'task_updated';
ALTER TYPE "notification_type" ADD VALUE IF NOT EXISTS 'task_completed';
--> statement-breakpoint

-- TaskMaster tasks sync table
CREATE TABLE "taskmaster_tasks" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "taskmaster_id" varchar(255) NOT NULL,
  "shop_id" uuid NOT NULL REFERENCES "shops"("id"),
  "taskmaster_project_id" varchar(255),
  "title" varchar(255) NOT NULL,
  "description" text,
  "status" varchar(50) DEFAULT 'todo' NOT NULL,
  "priority" integer DEFAULT 2 NOT NULL,
  "due_date" timestamp,
  "linked_entity_type" varchar(50),
  "linked_entity_id" uuid,
  "taskmaster_assignee_id" varchar(255),
  "garageos_assignee_id" uuid REFERENCES "users"("id"),
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL,
  "synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- TaskMaster user mappings
CREATE TABLE "taskmaster_user_mappings" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "shop_id" uuid NOT NULL REFERENCES "shops"("id"),
  "garageos_user_id" uuid NOT NULL REFERENCES "users"("id"),
  "taskmaster_user_id" varchar(255) NOT NULL,
  "taskmaster_email" varchar(255),
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS "taskmaster_tasks_shop_id_idx" ON "taskmaster_tasks"("shop_id");
CREATE INDEX IF NOT EXISTS "taskmaster_tasks_taskmaster_id_idx" ON "taskmaster_tasks"("taskmaster_id");
CREATE INDEX IF NOT EXISTS "taskmaster_tasks_garageos_assignee_id_idx" ON "taskmaster_tasks"("garageos_assignee_id");
CREATE INDEX IF NOT EXISTS "taskmaster_tasks_status_idx" ON "taskmaster_tasks"("status");
CREATE INDEX IF NOT EXISTS "taskmaster_user_mappings_shop_id_idx" ON "taskmaster_user_mappings"("shop_id");
CREATE INDEX IF NOT EXISTS "taskmaster_user_mappings_garageos_user_id_idx" ON "taskmaster_user_mappings"("garageos_user_id");
CREATE INDEX IF NOT EXISTS "taskmaster_user_mappings_taskmaster_user_id_idx" ON "taskmaster_user_mappings"("taskmaster_user_id");
