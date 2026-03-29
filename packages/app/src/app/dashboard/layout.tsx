'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Wrench, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '@/stores/useAppStore';
import { logRouteRender } from '@/lib/perf';
import { cn } from '@garageos/ui/utils';
import { Tooltip } from '@garageos/ui/tooltip';
import { signOut } from '@/lib/supabase/auth';
import { PageTransition } from '@/components/PageTransition';
import { BottomTabBar } from '@/components/BottomTabBar';
import { CommandPalette } from '@/components/CommandPalette';
import { KeyboardShortcutsHelp } from '@/components/KeyboardShortcutsHelp';
import { ShopSwitcher } from '@/components/shop/ShopSwitcher';
import { MobileHeader } from '@/components/dashboard/MobileHeader';
import { SidebarFooter } from '@/components/dashboard/SidebarFooter';
import { navGroups } from '@/config/navigationGroups';
import { useDashboardUser } from '@/hooks/useDashboardUser';
import { useLocale } from '@/i18n';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { isDark, setTheme } = useAppStore();
  const { t } = useLocale();
  const { userName, userEmail, userRole } = useDashboardUser();
  const prevPathname = useRef(pathname);

  // Route render timing — logs on every navigation
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
    }
    const end = logRouteRender(pathname);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => end());
    });
  }, [pathname]);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <CommandPalette />
      <KeyboardShortcutsHelp />

      {/* Mobile Header */}
      <MobileHeader
        onMenuOpen={() => setIsMobileOpen(true)}
        isDark={isDark}
        onThemeToggle={toggleTheme}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        data-testid="sidebar"
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
                if (!item.roles) return true;
                return item.roles.includes(userRole || '');
              });
              if (groupItems.length === 0) return null;
              return (
                <div key={gi} data-testid={group.label ? `sidebar-group-${group.label.toLowerCase()}` : undefined} className="space-y-1">
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
          <SidebarFooter
            isCollapsed={isCollapsed}
            onCollapse={() => setIsCollapsed(!isCollapsed)}
            isDark={isDark}
            onThemeToggle={toggleTheme}
            userName={userName}
            userEmail={userEmail}
            onSignOut={handleSignOut}
          />
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
