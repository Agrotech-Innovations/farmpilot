import {Button} from '@/components/ui/button';
import {Plus, Calendar} from 'lucide-react';

interface DashboardHeaderProps {
  onQuickAdd?: () => void;
  onSchedule?: () => void;
}

export function DashboardHeader({
  onQuickAdd,
  onSchedule
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Farm Pilot Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive farm management and monitoring platform
        </p>
      </div>
      <div className="flex gap-3">
        <Button className="bg-primary hover:bg-primary/90" onClick={onQuickAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Quick Add
        </Button>
        <Button variant="outline" onClick={onSchedule}>
          <Calendar className="w-4 h-4 mr-2" />
          Schedule
        </Button>
      </div>
    </div>
  );
}
