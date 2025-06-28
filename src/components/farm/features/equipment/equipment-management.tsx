import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'broken';
}

interface EquipmentManagementProps {
  operational: Equipment[];
  needsMaintenance: Equipment[];
  onEquipmentClick?: (id: string) => void;
  className?: string;
}

export function EquipmentManagement({
  operational,
  needsMaintenance,
  onEquipmentClick,
  className = ''
}: EquipmentManagementProps) {
  const getStatusColor = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return 'text-chart-1';
      case 'maintenance':
        return 'text-chart-5';
      case 'broken':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  };

  const getStatusText = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return 'Operational';
      case 'maintenance':
        return 'Maintenance Due';
      case 'broken':
        return 'Broken';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Equipment Management</CardTitle>
          <CardDescription>Track and maintain farm machinery</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold">Operational Equipment</h3>
              <div className="space-y-2">
                {operational.map((equipment) => (
                  <div
                    key={equipment.id}
                    className="flex justify-between items-center p-3 bg-accent rounded-lg cursor-pointer hover:bg-accent/80 transition-colors"
                    onClick={() => onEquipmentClick?.(equipment.id)}
                  >
                    <span>{equipment.name}</span>
                    <span
                      className={`text-sm ${getStatusColor(equipment.status)}`}
                    >
                      {getStatusText(equipment.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Needs Maintenance</h3>
              <div className="space-y-2">
                {needsMaintenance.map((equipment) => (
                  <div
                    key={equipment.id}
                    className="flex justify-between items-center p-3 bg-secondary rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => onEquipmentClick?.(equipment.id)}
                  >
                    <span>{equipment.name}</span>
                    <span
                      className={`text-sm ${getStatusColor(equipment.status)}`}
                    >
                      {getStatusText(equipment.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
