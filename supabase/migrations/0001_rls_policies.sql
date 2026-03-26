-- Enable Row Level Security on all tables
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE activity_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create a helper function to get current user's shop_id
CREATE OR REPLACE FUNCTION get_user_shop_id()
RETURNS uuid AS $$
BEGIN
  RETURN (
    SELECT s.id FROM shops s
    WHERE s.owner_id = auth.uid()
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Shops: Users can only see their own shop
CREATE POLICY "Users can view own shop"
  ON shops FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Users can update own shop"
  ON shops FOR UPDATE
  USING (owner_id = auth.uid());

-- Users: Users can view all users (for dropdowns etc)
CREATE POLICY "Users can view all users"
  ON users FOR SELECT
  USING (true);

-- Customers: Users can only access customers in their shop
CREATE POLICY "Users can view customers in own shop"
  ON customers FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert customers in own shop"
  ON customers FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update customers in own shop"
  ON customers FOR UPDATE
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can delete customers in own shop"
  ON customers FOR DELETE
  USING (shop_id = get_user_shop_id());

-- Vehicles: Users can only access vehicles in their shop
CREATE POLICY "Users can view vehicles in own shop"
  ON vehicles FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert vehicles in own shop"
  ON vehicles FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update vehicles in own shop"
  ON vehicles FOR UPDATE
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can delete vehicles in own shop"
  ON vehicles FOR DELETE
  USING (shop_id = get_user_shop_id());

-- Job Cards: Users can only access job cards in their shop
CREATE POLICY "Users can view job cards in own shop"
  ON job_cards FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert job cards in own shop"
  ON job_cards FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update job cards in own shop"
  ON job_cards FOR UPDATE
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can delete job cards in own shop"
  ON job_cards FOR DELETE
  USING (shop_id = get_user_shop_id());

-- Job Card Photos: Users can only access photos for job cards in their shop
CREATE POLICY "Users can view job card photos in own shop"
  ON job_card_photos FOR SELECT
  USING (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id = get_user_shop_id()
    )
  );

CREATE POLICY "Users can insert job card photos in own shop"
  ON job_card_photos FOR INSERT
  WITH CHECK (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id = get_user_shop_id()
    )
  );

CREATE POLICY "Users can delete job card photos in own shop"
  ON job_card_photos FOR DELETE
  USING (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id = get_user_shop_id()
    )
  );

-- AI Inspection Results: Access through job card photos
CREATE POLICY "Users can view ai inspection results in own shop"
  ON ai_inspection_results FOR SELECT
  USING (
    photo_id IN (
      SELECT jcp.id FROM job_card_photos jcp
      JOIN job_cards jc ON jcp.job_card_id = jc.id
      WHERE jc.shop_id = get_user_shop_id()
    )
  );

CREATE POLICY "Users can insert ai inspection results in own shop"
  ON ai_inspection_results FOR INSERT
  WITH CHECK (
    photo_id IN (
      SELECT jcp.id FROM job_card_photos jcp
      JOIN job_cards jc ON jcp.job_card_id = jc.id
      WHERE jc.shop_id = get_user_shop_id()
    )
  );

-- Parts: Users can only access parts in their shop
CREATE POLICY "Users can view parts in own shop"
  ON parts FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert parts in own shop"
  ON parts FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update parts in own shop"
  ON parts FOR UPDATE
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can delete parts in own shop"
  ON parts FOR DELETE
  USING (shop_id = get_user_shop_id());

-- Part Usage: Access through job cards in own shop
CREATE POLICY "Users can view part usage in own shop"
  ON part_usage FOR SELECT
  USING (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id = get_user_shop_id()
    )
  );

CREATE POLICY "Users can insert part usage in own shop"
  ON part_usage FOR INSERT
  WITH CHECK (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id = get_user_shop_id()
    )
  );

CREATE POLICY "Users can delete part usage in own shop"
  ON part_usage FOR DELETE
  USING (
    job_card_id IN (
      SELECT id FROM job_cards WHERE shop_id = get_user_shop_id()
    )
  );

-- Suppliers: Users can only access suppliers in their shop
CREATE POLICY "Users can view suppliers in own shop"
  ON suppliers FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert suppliers in own shop"
  ON suppliers FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update suppliers in own shop"
  ON suppliers FOR UPDATE
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can delete suppliers in own shop"
  ON suppliers FOR DELETE
  USING (shop_id = get_user_shop_id());

-- Invoices: Users can only access invoices in their shop
CREATE POLICY "Users can view invoices in own shop"
  ON invoices FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert invoices in own shop"
  ON invoices FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update invoices in own shop"
  ON invoices FOR UPDATE
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can delete invoices in own shop"
  ON invoices FOR DELETE
  USING (shop_id = get_user_shop_id());

-- Messages: Users can only access messages in their shop
CREATE POLICY "Users can view messages in own shop"
  ON messages FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert messages in own shop"
  ON messages FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update messages in own shop"
  ON messages FOR UPDATE
  USING (shop_id = get_user_shop_id());

-- Activity Items: Users can only access activity in their shop
CREATE POLICY "Users can view activity items in own shop"
  ON activity_items FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert activity items in own shop"
  ON activity_items FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

-- Service Records: Users can only access records in their shop
CREATE POLICY "Users can view service records in own shop"
  ON service_records FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert service records in own shop"
  ON service_records FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update service records in own shop"
  ON service_records FOR UPDATE
  USING (shop_id = get_user_shop_id());

-- Maintenance Reminders: Users can only access reminders in their shop
CREATE POLICY "Users can view maintenance reminders in own shop"
  ON maintenance_reminders FOR SELECT
  USING (shop_id = get_user_shop_id());

CREATE POLICY "Users can insert maintenance reminders in own shop"
  ON maintenance_reminders FOR INSERT
  WITH CHECK (shop_id = get_user_shop_id());

CREATE POLICY "Users can update maintenance reminders in own shop"
  ON maintenance_reminders FOR UPDATE
  USING (shop_id = get_user_shop_id());

-- Notifications: Users can only access their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Note: auth.users RLS is managed by Supabase, do not modify
