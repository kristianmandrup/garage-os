// Shop membership view used by RLS policies

export function shopMembershipView(): string {
  return `-- Create shop membership view for RLS
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
JOIN job_cards jc ON jc.assigned_to_id = u.id;`;
}
