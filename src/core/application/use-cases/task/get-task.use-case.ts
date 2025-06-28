import {Task} from '@/core/domain/entities';
import {TaskRepository} from '@/core/domain/repositories';

export interface GetTaskRequest {
  taskId: string;
}

export interface GetTaskResponse {
  task: Task;
}

export class GetTaskUseCase {
  constructor(private taskRepository: TaskRepository) {}

  async execute(request: GetTaskRequest): Promise<GetTaskResponse> {
    const task = await this.taskRepository.getById(request.taskId);

    if (!task) {
      throw new Error('Task not found');
    }

    return {task};
  }
}
