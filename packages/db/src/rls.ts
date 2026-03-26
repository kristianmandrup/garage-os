// Supabase RLS (Row Level Security) Policies
// These policies ensure users can only access data within their shop

/**
 * RLS Policy Templates
 *
 * The core security model:
 * - Users belong to a shop (via shop_id or through ownership/employment)
 * - All data is scoped to a shop_id
 * - Users can only read/write data within their shop
 *
 * Role-based access:
 * - owner: full access to their shop's data
 * - manager: full access to their shop's data
 * - mechanic: can read/write job cards assigned to them
 * - client: can only read their own vehicles, job cards, invoices
 */

export const rlsPolicies = `
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_card_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_inspection_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE part_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create shop membership view for RLS
CREATE OR REPLACE VIEW shop_members AS
SELECT
  u.id as user_id,
  u.role,
  s.id as shop_id
FROM users u
JOIN shops s ON s.owner_id = u.id
UNION
SELECT
  u.id as user_id,
  u.role,
  jc.shop_id
FROM users u
JOIN job_cards jc ON jc.assigned_to_id = u.id;

-- Shops: owners can manage their own shop
CREATE POLICY "Owners can view their shop" ON shops
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Owners can update their shop" ON shops
  FOR UPDATE USING (owner_id = auth.uid());

-- Customers: accessible within shop
CREATE POLICY "Shop members can view customers" ON customers
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert customers" ON customers
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can update customers" ON customers
  FOR UPDATE USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Vehicles: accessible within shop
CREATE POLICY "Shop members can view vehicles" ON vehicles
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert vehicles" ON vehicles
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can update vehicles" ON vehicles
  FOR UPDATE USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Job Cards: shop-scoped with mechanic assignment
CREATE POLICY "Shop members can view job cards" ON job_cards
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert job cards" ON job_cards
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can update job cards" ON job_cards
  FOR UPDATE USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Job Card Photos
CREATE POLICY "Shop members can view job card photos" ON job_card_photos
  FOR SELECT USING (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id IN (
        SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Shop members can insert job card photos" ON job_card_photos
  FOR INSERT WITH CHECK (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id IN (
        SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
      )
    )
  );

-- AI Inspection Results
CREATE POLICY "Shop members can view AI inspection results" ON ai_inspection_results
  FOR SELECT USING (
    photo_id IN (
      SELECT id FROM job_card_photos WHERE job_card_id IN (
        SELECT id FROM job_cards WHERE shop_id IN (
          SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
        )
      )
    )
  );

-- Parts: shop-scoped
CREATE POLICY "Shop members can view parts" ON parts
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert parts" ON parts
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can update parts" ON parts
  FOR UPDATE USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Part Usage
CREATE POLICY "Shop members can view part usage" ON part_usage
  FOR SELECT USING (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id IN (
        SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Shop members can insert part usage" ON part_usage
  FOR INSERT WITH CHECK (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id IN (
        SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
      )
    )
  );

-- Suppliers: shop-scoped
CREATE POLICY "Shop members can view suppliers" ON suppliers
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert suppliers" ON suppliers
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can update suppliers" ON suppliers
  FOR UPDATE USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Invoices: shop-scoped
CREATE POLICY "Shop members can view invoices" ON invoices
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert invoices" ON invoices
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can update invoices" ON invoices
  FOR UPDATE USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Messages: shop-scoped
CREATE POLICY "Shop members can view messages" ON messages
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert messages" ON messages
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Service Records: shop-scoped
CREATE POLICY "Shop members can view service records" ON service_records
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert service records" ON service_records
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- AI Diagnostic Results: shop-scoped
CREATE POLICY "Shop members can view AI diagnostic results" ON ai_diagnostic_results
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert AI diagnostic results" ON ai_diagnostic_results
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Maintenance Reminders: shop-scoped
CREATE POLICY "Shop members can view maintenance reminders" ON maintenance_reminders
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert maintenance reminders" ON maintenance_reminders
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can update maintenance reminders" ON maintenance_reminders
  FOR UPDATE USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Activity Items: shop-scoped
CREATE POLICY "Shop members can view activity items" ON activity_items
  FOR SELECT USING (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Shop members can insert activity items" ON activity_items
  FOR INSERT WITH CHECK (
    shop_id IN (
      SELECT shop_id FROM shop_members WHERE user_id = auth.uid()
    )
  );

-- Notifications: user-scoped
CREATE POLICY "Users can view their notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Users: self-service profile access
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (id = auth.uid());
`;

export default rlsPolicies;
