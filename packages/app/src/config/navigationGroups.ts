import {
  LayoutDashboard,
  Wrench,
  Car,
  Users,
  Package,
  FileText,
  BarChart3,
  Building2,
  Search,
  MessageSquare,
  Bell,
  CheckSquare,
  Settings,
  TrendingUp,
  DollarSign,
  UsersRound,
  ClipboardList,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { nav } from '@/i18n/translations/en/nav';

type NavKey = keyof typeof nav;

export interface NavItem {
  nameKey: NavKey;
  href: string;
  icon: LucideIcon;
  roles?: string[];
}

export interface NavGroup {
  label: string | null;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: null,
    items: [
      { nameKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Operations',
    items: [
      { nameKey: 'jobCards', href: '/dashboard/job-cards', icon: Wrench },
      { nameKey: 'vehicles', href: '/dashboard/vehicles', icon: Car },
      { nameKey: 'customers', href: '/dashboard/customers', icon: Users },
      { nameKey: 'inventory', href: '/dashboard/inventory', icon: Package },
      { nameKey: 'invoices', href: '/dashboard/invoices', icon: FileText },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { nameKey: 'analytics', href: '/dashboard/analytics', icon: BarChart3 },
      { nameKey: 'multiShop', href: '/dashboard/analytics/multi-shop', icon: Building2 },
      { nameKey: 'aiDiagnostics', href: '/dashboard/diagnostics', icon: Search },
      { nameKey: 'growth', href: '/dashboard/analytics/growth', icon: TrendingUp, roles: ['owner', 'manager'] },
      { nameKey: 'financials', href: '/dashboard/analytics/financials', icon: DollarSign, roles: ['owner', 'manager'] },
    ],
  },
  {
    label: 'Communication',
    items: [
      { nameKey: 'messages', href: '/dashboard/messages', icon: MessageSquare },
      { nameKey: 'reminders', href: '/dashboard/reminders', icon: Bell },
      { nameKey: 'tasks', href: '/dashboard/tasks', icon: CheckSquare, roles: ['owner', 'manager'] },
    ],
  },
  {
    label: 'Admin',
    items: [
      { nameKey: 'team', href: '/dashboard/team', icon: UsersRound, roles: ['owner'] },
      { nameKey: 'auditLog', href: '/dashboard/audit-log', icon: ClipboardList, roles: ['owner', 'manager'] },
    ],
  },
  {
    label: null,
    items: [
      { nameKey: 'settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
];
