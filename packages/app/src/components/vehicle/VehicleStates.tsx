'use client';

export function VehicleLoadingState() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export function VehicleNotFoundState() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold">Vehicle not found</h2>
      <a href="/dashboard/vehicles" className="text-primary hover:underline mt-4 inline-block">
        Back to vehicles
      </a>
    </div>
  );
}
