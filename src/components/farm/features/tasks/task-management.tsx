import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export interface Task {
  id: string;
  title: string;
  dueDate?: string;
  status: 'todo' | 'in-progress' | 'completed';
}

interface TaskManagementProps {
  tasks: Task[];
  onTaskUpdate?: (taskId: string, status: Task['status']) => void;
  className?: string;
}

export function TaskManagement({
  tasks,
  onTaskUpdate,
  className = ''
}: TaskManagementProps) {
  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'border-chart-2';
      case 'in-progress':
        return 'border-chart-5';
      case 'completed':
        return 'border-chart-1';
      default:
        return 'border-border';
    }
  };

  const getStatusTitle = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const TaskCard = ({task}: {task: Task}) => (
    <div
      className={`p-3 bg-secondary border ${getStatusColor(task.status)} rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors`}
      onClick={() => onTaskUpdate?.(task.id, task.status)}
    >
      <h4 className="font-medium">{task.title}</h4>
      {task.dueDate && (
        <p className="text-sm text-muted-foreground">
          {task.status === 'completed' ? 'Completed:' : 'Due:'} {task.dueDate}
        </p>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
          <CardDescription>Assign and track farm tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['todo', 'in-progress', 'completed'] as const).map((status) => (
                <div key={status}>
                  <h3 className="font-semibold mb-2">
                    {getStatusTitle(status)}
                  </h3>
                  <div className="space-y-2">
                    {getTasksByStatus(status).map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
