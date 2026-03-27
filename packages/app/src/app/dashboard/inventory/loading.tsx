import { Skeleton } from '@garageos/ui/skeleton';

export default function InventoryLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-48" />
      <div className="flex justify-between"><Skeleton className="h-8 w-32" /><Skeleton className="h-10 w-32 rounded-md" /></div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
      </div>
      <Skeleton className="h-10 w-48 rounded-md" />
      <div className="rounded-lg border border-border overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-2 w-24 rounded-full ml-auto" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
