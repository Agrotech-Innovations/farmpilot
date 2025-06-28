import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export interface AnalyticsData {
  yieldTrends: any[]; // Replace with proper chart data type when implementing charts
  financialPerformance: any[]; // Replace with proper chart data type when implementing charts
}

interface AnalyticsDashboardProps {
  data: AnalyticsData;
  className?: string;
}

export function AnalyticsDashboard({
  data,
  className = ''
}: AnalyticsDashboardProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Farm Analytics</CardTitle>
          <CardDescription>Performance insights and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">Yield Trends</h3>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Yield chart would go here
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Financial Performance</h3>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">
                  Financial chart would go here
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
