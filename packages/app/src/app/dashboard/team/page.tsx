'use client';

import { useState } from 'react';
import { Users, Plus } from 'lucide-react';
import { Button } from '@garageos/ui/button';
import { Skeleton } from '@garageos/ui/skeleton';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@garageos/ui/breadcrumb';
import { useTranslation } from '@/i18n';
import { useTeam } from '@/hooks/useTeam';
import { TeamMemberCard } from '@/components/team/TeamMemberCard';
import { InviteMemberForm } from '@/components/team/InviteMemberForm';

export default function TeamPage() {
  const t = useTranslation();
  const { members, loading, invite, updateRole, remove } = useTeam();
  const [showInvite, setShowInvite] = useState(false);
  const [inviting, setInviting] = useState(false);

  // Derive current user role from team data (owner by default for dashboard access)
  const currentUserRole = members.find((m) => m.role === 'owner')?.role || 'owner';

  const handleInvite = async (data: { email: string; name: string; role: string }) => {
    setInviting(true);
    try {
      await invite(data);
      setShowInvite(false);
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Team</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Team Management
          </h1>
          <p className="text-muted-foreground">
            Manage your shop team members and their roles
          </p>
        </div>
        <Button className="btn-gradient" onClick={() => setShowInvite(!showInvite)}>
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {showInvite && (
        <InviteMemberForm onInvite={handleInvite} loading={inviting} />
      )}

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-3 w-[220px]" />
              </div>
              <Skeleton className="h-6 w-[80px] ml-auto" />
            </div>
          ))
        ) : members.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No team members found. Invite someone to get started.
          </p>
        ) : (
          members.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              currentUserRole={currentUserRole}
              onRoleChange={updateRole}
              onRemove={remove}
            />
          ))
        )}
      </div>
    </div>
  );
}
