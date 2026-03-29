// Nested-scoped policies: tables that nest through other tables

export function nestedScopedPolicies(): string {
  return `-- Job Card Photos
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
  );`;
}
