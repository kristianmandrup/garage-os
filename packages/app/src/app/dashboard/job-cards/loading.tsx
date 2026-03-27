import { Skeleton } from '@garageos/ui/skeleton';

export default function JobCardsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-48" />
      <div className="flex justify-between"><Skeleton className="h-8 w-32" /><Skeleton className="h-10 w-40 rounded-md" /></div>
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
      </div>
      <Skeleton className="h-10 w-48 rounded-md" />
      <div className="rounded-lg border border-border overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-32" /></div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
