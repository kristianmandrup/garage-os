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
import { Tooltip } from '@garageos/ui/tooltip';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@garageos/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@garageos/ui/avatar';
import { signOut } from '@/lib/supabase/auth';
import { PageTransition } from '@/components/PageTransition';
import { BottomTabBar } from '@/components/BottomTabBar';
import { CommandPalette } from '@/components/CommandPalette';
import { ShopSwitcher } from '@/components/shop/ShopSwitcher';
import { LocaleSwitcher } from '@/components/locale/LocaleSwitcher';
import { useLocale } from '@/i18n';

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

  const navGroups = [
    {
      label: null,
      items: [
        { nameKey: 'dashboard' as const, href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Operations',
      items: [
        { nameKey: 'jobCards' as const, href: '/dashboard/job-cards', icon: Wrench },
        { nameKey: 'vehicles' as const, href: '/dashboard/vehicles', icon: Car },
        { nameKey: 'customers' as const, href: '/dashboard/customers', icon: Users },
        { nameKey: 'inventory' as const, href: '/dashboard/inventory', icon: Package },
        { nameKey: 'invoices' as const, href: '/dashboard/invoices', icon: FileText },
      ],
    },
    {
      label: 'Intelligence',
      items: [
        { nameKey: 'analytics' as const, href: '/dashboard/analytics', icon: BarChart3 },
        { nameKey: 'multiShop' as const, href: '/dashboard/analytics/multi-shop', icon: Building2 },
        { nameKey: 'aiDiagnostics' as const, href: '/dashboard/diagnostics', icon: Search },
      ],
    },
    {
      label: 'Communication',
      items: [
        { nameKey: 'messages' as const, href: '/dashboard/messages', icon: MessageSquare },
        { nameKey: 'reminders' as const, href: '/dashboard/reminders', icon: Bell },
        { nameKey: 'tasks' as const, href: '/dashboard/tasks', icon: CheckSquare, roles: ['owner', 'manager'] as string[] },
      ],
    },
    {
      label: null,
      items: [
        { nameKey: 'settings' as const, href: '/dashboard/settings', icon: Settings },
      ],
    },
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


  return (
    <div className="min-h-screen bg-background">
      <CommandPalette />
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b flex items-center justify-between px-4">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-2 hover:bg-accent rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold gradient-text">GarageOS</span>
        </Link>
        <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
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
              aria-label="Close navigation menu"
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
          <nav className="flex-1 py-2 px-3 space-y-4 overflow-y-auto">
            {navGroups.map((group, gi) => {
              const groupItems = group.items.filter(item => {
                if (!('roles' in item) || !item.roles) return true;
                return item.roles.includes(userRole || '');
              });
              if (groupItems.length === 0) return null;
              return (
                <div key={gi} className="space-y-1">
                  {group.label && !isCollapsed && (
                    <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.label}
                    </p>
                  )}
                  {group.label && isCollapsed && (
                    <div className="mx-auto w-6 border-t border-border" />
                  )}
                  {groupItems.map((item) => {
                    const isActive = pathname === item.href;
                    const link = (
                      <Link
                        key={item.nameKey}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
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
                    return isCollapsed ? (
                      <Tooltip key={item.nameKey} content={t.nav[item.nameKey]} side="right">
                        {link}
                      </Tooltip>
                    ) : link;
                  })}
                </div>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-3 border-t space-y-2">
            {/* Locale */}
            {!isCollapsed && <LocaleSwitcher />}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              className={cn(
                'w-full justify-start gap-3',
                isCollapsed && 'justify-center px-2'
              )}
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
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
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
        id="main-content"
        className={cn(
          'min-h-screen pt-16 pb-20 lg:pt-0 lg:pb-0 transition-all duration-300',
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        )}
      >
        <div className="p-4 lg:p-6">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <BottomTabBar onMenuPress={() => setIsMobileOpen(true)} />
    </div>
  );
}
