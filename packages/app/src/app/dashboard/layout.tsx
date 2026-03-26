'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Wrench,
  Users,
  Package,
  Car,
  Settings,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Menu,
  X,
  MessageSquare,
  FileText,
  BarChart3,
  Search,
  Building2,
  CheckSquare,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { cn } from '@garageos/ui/utils';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@garageos/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@garageos/ui/avatar';
import { signOut } from '@/lib/supabase/auth';
import { ShopSwitcher } from '@/components/shop/ShopSwitcher';
import { LocaleSwitcher } from '@/components/locale/LocaleSwitcher';
import { useLocale } from '@/i18n';

type NavItem = {
  nameKey: keyof ReturnType<typeof useLocale>['t']['nav'];
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Garage Owner');
  const [userEmail, setUserEmail] = useState<string>('owner@garage.com');
  const { isDark, setTheme } = useAppStore();
  const { t } = useLocale();

  const navigation: NavItem[] = [
    { nameKey: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
    { nameKey: 'analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { nameKey: 'multiShop', href: '/dashboard/analytics/multi-shop', icon: Building2 },
    { nameKey: 'jobCards', href: '/dashboard/job-cards', icon: Wrench },
    { nameKey: 'vehicles', href: '/dashboard/vehicles', icon: Car },
    { nameKey: 'customers', href: '/dashboard/customers', icon: Users },
    { nameKey: 'inventory', href: '/dashboard/inventory', icon: Package },
    { nameKey: 'invoices', href: '/dashboard/invoices', icon: FileText },
    { nameKey: 'tasks', href: '/dashboard/tasks', icon: CheckSquare, roles: ['owner', 'manager'] },
    { nameKey: 'aiDiagnostics', href: '/dashboard/diagnostics', icon: Search },
    { nameKey: 'messages', href: '/dashboard/messages', icon: MessageSquare },
    { nameKey: 'reminders', href: '/dashboard/reminders', icon: Bell },
    { nameKey: 'settings', href: '/dashboard/settings', icon: Settings },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('name, role')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserRole(profile.role || 'owner');
          setUserName(profile.name || 'User');
          setUserEmail(user.email || '');
        } else {
          setUserRole('owner');
        }
      }
    };
    fetchUser();
  }, []);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return item.roles.includes(userRole || '');
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b flex items-center justify-between px-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 hover:bg-accent rounded-lg"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold gradient-text">GarageOS</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full bg-card border-r transition-all duration-300',
          isCollapsed ? 'w-20' : 'w-64',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  GarageOS
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileOpen(false)}
              className="lg:hidden p-2 hover:bg-accent rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Shop Switcher */}
          {!isCollapsed && (
            <div className="px-3 py-2 border-b">
              <ShopSwitcher />
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.nameKey}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium">{t.nav[item.nameKey]}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-3 border-t space-y-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3',
                isCollapsed && 'justify-center px-2'
              )}
              onClick={toggleTheme}
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
              {!isCollapsed && <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
            </Button>

            {/* Collapse Toggle (Desktop only) */}
            <Button
              variant="ghost"
              className="hidden lg:flex w-full justify-start gap-3"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
              {!isCollapsed && <span>Collapse</span>}
            </Button>

            {/* User Profile */}
            <div
              className={cn(
                'flex items-center gap-3 p-3 rounded-xl bg-accent/50',
                isCollapsed && 'justify-center p-2'
              )}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" />
                <AvatarFallback>GO</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{userName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className={cn(isCollapsed && 'hidden')}
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'min-h-screen pt-16 lg:pt-0 transition-all duration-300',
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>
    </div>
  );
}
