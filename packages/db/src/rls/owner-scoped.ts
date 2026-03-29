// Shops: owners can manage their own shop

export function ownerScopedPolicies(): string {
  return `-- Shops: owners can manage their own shop
CREATE POLICY "Owners can view their shop" ON shops
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Owners can update their shop" ON shops
  FOR UPDATE USING (owner_id = auth.uid());`;
}
