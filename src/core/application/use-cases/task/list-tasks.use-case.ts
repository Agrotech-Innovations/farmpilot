import {Task, TaskStatus, TaskPriority} from '@/core/domain/entities';
import {TaskRepository, FarmRepository} from '@/core/domain/repositories';

export interface ListTasksRequest {
  farmId: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignedToEmail?: string;
  category?: string;
  includeCompleted?: boolean;
}

export interface ListTasksResponse {
  tasks: Task[];
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
}

export class ListTasksUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private farmRepository: FarmRepository
  ) {}

  async execute(request: ListTasksRequest): Promise<ListTasksResponse> {
    // Validate the farm exists
    const farm = await this.farmRepository.getById(request.farmId);
    if (!farm) {
      throw new Error('Farm not found');
    }

    let tasks: Task[];

    // Filter tasks based on request parameters
    if (request.status) {
      tasks = await this.taskRepository.findByStatus(
        request.farmId,
        request.status
      );
    } else if (request.priority) {
      tasks = await this.taskRepository.findByPriority(
        request.farmId,
        request.priority
      );
    } else if (request.assignedToEmail) {
      tasks = await this.taskRepository.findByAssignedEmail(
        request.assignedToEmail
      );
    } else if (request.category) {
      tasks = await this.taskRepository.findByCategory(
        request.farmId,
        request.category
      );
    } else {
      tasks = await this.taskRepository.findByFarmId(request.farmId);
    }

    // Filter out completed tasks if not requested
    if (!request.includeCompleted) {
      tasks = tasks.filter((task) => task.status !== 'completed');
    }

    // Get task statistics
    const [pendingTasks, inProgressTasks, completedTasks, overdueTasks] =
      await Promise.all([
        this.taskRepository.findPendingTasks(request.farmId),
        this.taskRepository.findInProgressTasks(request.farmId),
        this.taskRepository.findCompletedTasks(request.farmId, 1), // Just get count
        this.taskRepository.findOverdueTasks(request.farmId)
      ]);

    const stats = {
      total: tasks.length,
      pending: pendingTasks.length,
      inProgress: inProgressTasks.length,
      completed: completedTasks.length,
      overdue: overdueTasks.length
    };

    return {tasks, stats};
  }
}
