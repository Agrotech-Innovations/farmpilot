import {Task, TaskPriority, TaskStatus} from '@/core/domain/entities';
import {TaskRepository, FarmRepository} from '@/core/domain/repositories';
import {v4 as uuidv4} from 'uuid';

export interface CreateTaskRequest {
  farmId: string;
  cropId?: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  assignedToEmail?: string;
  assignedToName?: string;
  dueDate?: Date;
  scheduledDate?: Date;
  estimatedHours?: number;
  category?: string;
  tags?: string[];
}

export interface CreateTaskResponse {
  task: Task;
}

export class CreateTaskUseCase {
  constructor(
    private taskRepository: TaskRepository,
    private farmRepository: FarmRepository
  ) {}

  async execute(request: CreateTaskRequest): Promise<CreateTaskResponse> {
    // Validate the farm exists
    const farm = await this.farmRepository.getById(request.farmId);
    if (!farm) {
      throw new Error('Farm not found');
    }

    // Create the task
    const task = new Task({
      id: uuidv4(),
      farmId: request.farmId,
      cropId: request.cropId,
      title: request.title,
      description: request.description,
      priority: request.priority || 'medium',
      status: 'pending',
      assignedToEmail: request.assignedToEmail,
      assignedToName: request.assignedToName,
      dueDate: request.dueDate,
      scheduledDate: request.scheduledDate,
      estimatedHours: request.estimatedHours,
      category: request.category,
      tags: request.tags,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.taskRepository.save(task);

    return {task};
  }
}
