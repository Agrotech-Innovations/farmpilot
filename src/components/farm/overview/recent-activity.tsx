import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {Activity} from 'lucide-react';
import {ActivityItem} from '../shared/activity-item';

export interface ActivityData {
  id: string;
  title: string;
  subtitle: string;
  colorClass: string;
}

interface RecentActivityProps {
  activities: ActivityData[];
  className?: string;
}

export function RecentActivity({
  activities,
  className = ''
}: RecentActivityProps) {
  return (
    <Card className={`lg:col-span-2 bg-card/70 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-chart-2" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest updates from your farms</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <ActivityItem
            key={activity.id}
            title={activity.title}
            subtitle={activity.subtitle}
            colorClass={activity.colorClass}
          />
        ))}
      </CardContent>
    </Card>
  );
}
