import {LucideIcon} from 'lucide-react';

export type AlertSeverity = 'low' | 'medium' | 'high';

interface AlertCardProps {
  type: string;
  title: string;
  description: string;
  icon: LucideIcon;
  severity: AlertSeverity;
  className?: string;
}

export function AlertCard({
  type,
  title,
  description,
  icon: Icon,
  severity,
  className = ''
}: AlertCardProps) {
  const getBorderClass = () => {
    switch (severity) {
      case 'high':
        return 'border-destructive';
      case 'medium':
        return 'border-chart-5';
      case 'low':
      default:
        return 'border-border';
    }
  };

  const getIconColor = () => {
    switch (severity) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-chart-5';
      case 'low':
      default:
        return 'text-chart-4';
    }
  };

  return (
    <div
      className={`p-4 bg-secondary border ${getBorderClass()} rounded-lg ${className}`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${getIconColor()}`} />
        <span className="font-medium text-foreground">{title}</span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
