import {LucideIcon} from 'lucide-react';
import {MetricCard} from '../shared/metric-card';

export interface MetricCardData {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  colorClass: string;
}

interface MetricsGridProps {
  metrics: MetricCardData[];
  className?: string;
}

export function MetricsGrid({metrics, className = ''}: MetricsGridProps) {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 ${className}`}
    >
      {metrics.map((metric, index) => (
        <MetricCard
          key={`${metric.title}-${index}`}
          title={metric.title}
          value={metric.value}
          subtitle={metric.subtitle}
          icon={metric.icon}
          colorClass={metric.colorClass}
        />
      ))}
    </div>
  );
}
