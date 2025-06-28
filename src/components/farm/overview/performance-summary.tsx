import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {TrendingUp, Users, DollarSign} from 'lucide-react';

export interface CropPerformanceData {
  name: string;
  change: string;
  isPositive: boolean;
}

export interface TeamActivityData {
  label: string;
  value: string;
  isPositive?: boolean;
}

export interface FinancialSummaryData {
  label: string;
  value: string;
  type: 'revenue' | 'expense' | 'profit';
}

interface PerformanceSummaryProps {
  cropPerformance: CropPerformanceData[];
  teamActivity: TeamActivityData[];
  financialSummary: FinancialSummaryData[];
  className?: string;
}

export function PerformanceSummary({
  cropPerformance,
  teamActivity,
  financialSummary,
  className = ''
}: PerformanceSummaryProps) {
  const getFinancialColor = (type: FinancialSummaryData['type']) => {
    switch (type) {
      case 'revenue':
      case 'profit':
        return 'text-chart-1';
      case 'expense':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${className}`}>
      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-chart-1" />
            Crop Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cropPerformance.map((crop, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm">{crop.name}</span>
                <span
                  className={`text-sm font-medium ${
                    crop.isPositive ? 'text-chart-1' : 'text-destructive'
                  }`}
                >
                  {crop.change}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-chart-2" />
            Team Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {teamActivity.map((activity, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm">{activity.label}</span>
                <span
                  className={`text-sm font-medium ${
                    activity.isPositive !== false
                      ? 'text-chart-1'
                      : 'text-foreground'
                  }`}
                >
                  {activity.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Financial Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {financialSummary.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm">{item.label}</span>
                <span
                  className={`text-sm font-medium ${getFinancialColor(item.type)}`}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
