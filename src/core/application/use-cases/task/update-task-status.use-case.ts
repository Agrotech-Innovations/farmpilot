import {Task, TaskStatus} from '@/core/domain/entities';
import {TaskRepository} from '@/core/domain/repositories';

export interface UpdateTaskStatusRequest {
  taskId: string;
  status: TaskStatus;
  actualHours?: number;
}

export interface UpdateTaskStatusResponse {
  task: Task;
}

export class UpdateTaskStatusUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(
    request: UpdateTaskStatusRequest
  ): Promise<UpdateTaskStatusResponse> {
    // Get the existing task
    const task = await this.taskRepository.getById(request.taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    let updatedTask: Task;

    // Update task based on the new status
    switch (request.status) {
      case 'in_progress':
        updatedTask = task.startWork();
        break;
      case 'completed':
        updatedTask = task.markAsCompleted(request.actualHours);
        break;
      case 'cancelled':
        updatedTask = task.cancel();
        break;
      case 'pending':
        updatedTask = task.reopen();
        break;
      default:
        throw new Error(`Invalid status: ${request.status}`);
    }

    await this.taskRepository.save(updatedTask);

    return {task: updatedTask};
  }
}
