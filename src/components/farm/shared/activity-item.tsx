interface ActivityItemProps {
  title: string;
  subtitle: string;
  colorClass: string;
  className?: string;
}

export function ActivityItem({
  title,
  subtitle,
  colorClass,
  className = ''
}: ActivityItemProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 bg-accent rounded-lg ${className}`}
    >
      <div className={`w-2 h-2 ${colorClass} rounded-full`}></div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
