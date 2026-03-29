'use client';

import { MoreHorizontal, Shield, Wrench, Crown } from 'lucide-react';
import { Card, CardContent } from '@garageos/ui/card';
import { Badge } from '@garageos/ui/badge';
import { Button } from '@garageos/ui/button';
import { Avatar, AvatarFallback } from '@garageos/ui/avatar';
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
} from '@garageos/ui/dropdown-menu';
import type { TeamMember } from '@/hooks/useTeam';

const ROLE_CONFIG: Record<string, { icon: typeof Shield; color: string; label: string }> = {
  owner: { icon: Crown, color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400', label: 'Owner' },
  manager: { icon: Shield, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Manager' },
  mechanic: { icon: Wrench, color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400', label: 'Mechanic' },
};

interface TeamMemberCardProps {
  member: TeamMember;
  currentUserRole: string;
  onRoleChange: (id: string, role: string) => void;
  onRemove: (id: string) => void;
}

export function TeamMemberCard({ member, currentUserRole, onRoleChange, onRemove }: TeamMemberCardProps) {
  const config = ROLE_CONFIG[member.role] || ROLE_CONFIG.mechanic;
  const Icon = config.icon;
  const isOwner = currentUserRole === 'owner';
  const isSelf = false; // Determined by parent; owner cannot remove themselves via API

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-sm font-medium">
              {member.name?.charAt(0)?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge className={`${config.color} gap-1`}>
            <Icon className="h-3 w-3" />
            {config.label}
          </Badge>

          {isOwner && member.role !== 'owner' && (
            <Dropdown>
              <DropdownTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownTrigger>
              <DropdownContent align="end">
                {member.role !== 'manager' && (
                  <DropdownItem onClick={() => onRoleChange(member.id, 'manager')}>
                    <Shield className="h-4 w-4 mr-2" /> Make Manager
                  </DropdownItem>
                )}
                {member.role !== 'mechanic' && (
                  <DropdownItem onClick={() => onRoleChange(member.id, 'mechanic')}>
                    <Wrench className="h-4 w-4 mr-2" /> Make Mechanic
                  </DropdownItem>
                )}
                <DropdownItem
                  className="text-red-600 dark:text-red-400"
                  onClick={() => onRemove(member.id)}
                >
                  Remove from Team
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
