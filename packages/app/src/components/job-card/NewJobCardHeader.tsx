'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@garageos/ui/button';

export function NewJobCardHeader() {
  return (
    <div className="flex items-center gap-4">
      <Link href="/dashboard/job-cards">
        <Button variant="ghost" size="icon">
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </Link>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Job Card</h1>
        <p className="text-muted-foreground">Create a new repair job</p>
      </div>
    </div>
  );
}
