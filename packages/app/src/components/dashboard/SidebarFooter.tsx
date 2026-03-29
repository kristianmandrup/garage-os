'use client';

import { Sun, Moon, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@garageos/ui/utils';
import { Button } from '@garageos/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@garageos/ui/avatar';
import { LocaleSwitcher } from '@/components/locale/LocaleSwitcher';
import { NotificationCenter } from '@/components/NotificationCenter';

interface SidebarFooterProps {
  isCollapsed: boolean;
  onCollapse: () => void;
  isDark: boolean;
  onThemeToggle: () => void;
  userName: string;
  userEmail: string;
  onSignOut: () => void;
}

export function SidebarFooter({
  isCollapsed,
  onCollapse,
  isDark,
  onThemeToggle,
  userName,
  userEmail,
  onSignOut,
}: SidebarFooterProps) {
  return (
    <div className="p-3 border-t space-y-2">
      {/* Locale */}
      <LocaleSwitcher compact={isCollapsed} />

      {/* Notifications */}
      {!isCollapsed && <NotificationCenter />}

      {/* Theme Toggle */}
      <Button
        data-testid="theme-toggle-sidebar"
        variant="ghost"
        className={cn(
          'w-full justify-start gap-3',
          isCollapsed && 'justify-center px-2'
        )}
        onClick={onThemeToggle}
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
        onClick={onCollapse}
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
        data-testid="user-profile"
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
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
