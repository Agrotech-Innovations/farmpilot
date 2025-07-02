// src/routes/index.tsx
import {createFileRoute, Link} from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: Home
});

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">Farm Pilot</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Modern farm management and monitoring platform
        </p>
      </div>

      <div className="flex gap-4">
        <Link
          to="/dashboard"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4">
        <div className="p-6 border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Livestock Management</h3>
          <p className="text-muted-foreground">
            Track animal health, breeding records, and vaccination schedules
          </p>
        </div>
        <div className="p-6 border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Inventory Control</h3>
          <p className="text-muted-foreground">
            Monitor feed, supplies, and equipment with automated alerts
          </p>
        </div>
        <div className="p-6 border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Farm Analytics</h3>
          <p className="text-muted-foreground">
            Comprehensive insights and reporting for data-driven decisions
          </p>
        </div>
      </div>
    </div>
  );
}
