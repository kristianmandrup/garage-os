import { Skeleton } from '@garageos/ui/skeleton';

export default function CustomersLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-48" />
      <div className="flex justify-between"><Skeleton className="h-8 w-32" /><Skeleton className="h-10 w-36 rounded-md" /></div>
      <Skeleton className="h-24 rounded-xl" />
      <Skeleton className="h-10 w-64 rounded-md" />
      <div className="rounded-lg border border-border overflow-hidden">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
