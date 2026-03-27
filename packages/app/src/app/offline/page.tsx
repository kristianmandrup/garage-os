import { WifiOff } from 'lucide-react';
import { Button } from '@garageos/ui/button';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center">
          <WifiOff className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">You&apos;re Offline</h1>
        <p className="text-muted-foreground max-w-sm">
          GarageOS needs an internet connection to work. Please check your connection and try again.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    </div>
  );
}
