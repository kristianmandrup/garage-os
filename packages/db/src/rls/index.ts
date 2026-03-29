// Supabase RLS (Row Level Security) Policies
// These policies ensure users can only access data within their shop
//
// The core security model:
// - Users belong to a shop (via shop_id or through ownership/employment)
// - All data is scoped to a shop_id
// - Users can only read/write data within their shop
//
// Role-based access:
// - owner: full access to their shop's data
// - manager: full access to their shop's data
// - mechanic: can read/write job cards assigned to them
// - client: can only read their own vehicles, job cards, invoices

import { enableRLS } from './enable-rls';
import { shopMembershipView } from './shop-membership';
import { ownerScopedPolicies } from './owner-scoped';
import { shopScopedPolicies } from './shop-scoped';
import { nestedScopedPolicies } from './nested-scoped';
import { userScopedPolicies } from './user-scoped';

export { enableRLS } from './enable-rls';
export { shopMembershipView } from './shop-membership';
export { ownerScopedPolicies } from './owner-scoped';
export { shopScopedPolicies } from './shop-scoped';
export { nestedScopedPolicies } from './nested-scoped';
export { userScopedPolicies } from './user-scoped';

export const rlsPolicies = [
  enableRLS(),
  shopMembershipView(),
  ownerScopedPolicies(),
  shopScopedPolicies(),
  nestedScopedPolicies(),
  userScopedPolicies(),
].join('\n\n');

export default rlsPolicies;
