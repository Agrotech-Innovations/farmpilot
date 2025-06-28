import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {AlertTriangle, LucideIcon} from 'lucide-react';
import {AlertCard, AlertSeverity} from '../shared/alert-card';

export interface AlertData {
  id: string;
  type: 'pest' | 'health' | 'weather' | 'inventory';
  title: string;
  description: string;
  severity: AlertSeverity;
  icon: LucideIcon;
}

export interface WeatherData {
  condition: string;
  temperature: string;
  description: string;
  emoji: string;
}

interface AlertsWeatherProps {
  alerts: AlertData[];
  weather?: WeatherData;
  className?: string;
}

export function AlertsWeather({
  alerts,
  weather,
  className = ''
}: AlertsWeatherProps) {
  return (
    <Card className={`bg-card/70 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-chart-5" />
          Alerts & Weather
        </CardTitle>
        <CardDescription>
          Important notifications and weather updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.map((alert) => (
          <AlertCard
            key={alert.id}
            type={alert.type}
            title={alert.title}
            description={alert.description}
            icon={alert.icon}
            severity={alert.severity}
          />
        ))}

        {weather && (
          <div className="p-4 bg-secondary border border-border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-foreground">
                {weather.condition}
              </span>
              <span className="text-2xl">{weather.emoji}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {weather.temperature}. {weather.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
