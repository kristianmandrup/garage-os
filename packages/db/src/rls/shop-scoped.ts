// Shop-scoped policies: tables that use the shop membership pattern directly

export function shopScopedPolicies(): string {
  return `-- Customers: accessible within shop
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
  );`;
}
