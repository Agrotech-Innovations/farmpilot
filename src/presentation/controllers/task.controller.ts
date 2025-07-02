import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {
  CreateTaskUseCase,
  GetTaskUseCase,
  ListTasksUseCase,
  UpdateTaskStatusUseCase
} from '@/core/application/use-cases/task';
import {Task, TaskPriority, TaskStatus} from '@/core/domain/entities';
import {TaskRepository} from '@/core/domain/repositories';
import {z} from 'zod';

// Validation schemas
const createTaskSchema = z.object({
  farmId: z.string().min(1),
  cropId: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedToEmail: z.string().email().optional(),
  assignedToName: z.string().optional(),
  dueDate: z
    .string()
    .transform((str) => (str ? new Date(str) : undefined))
    .optional(),
  scheduledDate: z
    .string()
    .transform((str) => (str ? new Date(str) : undefined))
    .optional(),
  estimatedHours: z.number().min(0).optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional()
});

const getTaskSchema = z.object({
  taskId: z.string().min(1)
});

const listTasksSchema = z.object({
  farmId: z.string().min(1),
  status: z
    .enum(['pending', 'in_progress', 'completed', 'cancelled'])
    .optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignedToEmail: z.string().email().optional(),
  category: z.string().optional(),
  includeCompleted: z.boolean().optional()
});

const updateTaskStatusSchema = z.object({
  taskId: z.string().min(1),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  actualHours: z.number().min(0).optional()
});

// Helper function to serialize task data
const serializeTask = (task: Task) => ({
  id: task.id,
  farmId: task.farmId,
  cropId: task.cropId,
  title: task.title,
  description: task.description,
  priority: task.priority,
  status: task.status,
  assignedToEmail: task.assignedToEmail,
  assignedToName: task.assignedToName,
  dueDate: task.dueDate?.toISOString(),
  scheduledDate: task.scheduledDate?.toISOString(),
  completedDate: task.completedDate?.toISOString(),
  estimatedHours: task.estimatedHours,
  actualHours: task.actualHours,
  category: task.category,
  tags: task.tags,
  createdAt: task.createdAt?.toISOString(),
  updatedAt: task.updatedAt?.toISOString()
});

// Server functions
export const createTask = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return createTaskSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const createTaskUseCase =
        container.get<CreateTaskUseCase>('createTaskUseCase');

      const result = await createTaskUseCase.execute(data);

      return {
        success: true,
        data: {
          task: serializeTask(result.task)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create task'
      };
    }
  });

export const getTask = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getTaskSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getTaskUseCase = container.get<GetTaskUseCase>('getTaskUseCase');

      const result = await getTaskUseCase.execute(data);

      return {
        success: true,
        data: {
          task: serializeTask(result.task)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get task'
      };
    }
  });

export const listTasks = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return listTasksSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const listTasksUseCase =
        container.get<ListTasksUseCase>('listTasksUseCase');

      const result = await listTasksUseCase.execute(data);

      return {
        success: true,
        data: {
          tasks: result.tasks.map(serializeTask),
          stats: result.stats
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list tasks'
      };
    }
  });

export const updateTaskStatus = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return updateTaskStatusSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const updateTaskStatusUseCase = container.get<UpdateTaskStatusUseCase>(
        'updateTaskStatusUseCase'
      );

      const result = await updateTaskStatusUseCase.execute(data);

      return {
        success: true,
        data: {
          task: serializeTask(result.task)
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update task status'
      };
    }
  });

// Additional task management endpoints
export const deleteTask = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return z
      .object({
        taskId: z.string().min(1)
      })
      .parse(data);
  })
  .handler(async ({data}) => {
    try {
      // For now, we'll use the task repository directly since there's no delete use case
      const taskRepository = container.get<TaskRepository>('taskRepository');
      await taskRepository.delete(data.taskId);

      return {
        success: true,
        message: 'Task deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete task'
      };
    }
  });

export const searchTasks = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return z
      .object({
        farmId: z.string().min(1),
        query: z.string().min(1),
        limit: z.number().min(1).max(100).optional()
      })
      .parse(data);
  })
  .handler(async ({data}) => {
    try {
      const taskRepository = container.get<TaskRepository>('taskRepository');
      const tasks = await taskRepository.searchTasks(
        data.farmId,
        data.query,
        data.limit
      );

      return {
        success: true,
        data: {
          tasks: tasks.map(serializeTask)
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to search tasks'
      };
    }
  });

export const getTaskStats = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return z
      .object({
        farmId: z.string().min(1)
      })
      .parse(data);
  })
  .handler(async ({data}) => {
    try {
      const taskRepository = container.get<TaskRepository>('taskRepository');

      const [statusStats, priorityStats, categoryStats, assigneeStats] =
        await Promise.all([
          taskRepository.getTaskStatsByStatus(data.farmId),
          taskRepository.getTaskStatsByPriority(data.farmId),
          taskRepository.getTaskStatsByCategory(data.farmId),
          taskRepository.getTaskStatsByAssignee(data.farmId)
        ]);

      return {
        success: true,
        data: {
          statusStats,
          priorityStats,
          categoryStats,
          assigneeStats
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get task statistics'
      };
    }
  });

export const getTaskCalendar = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return z
      .object({
        farmId: z.string().min(1),
        month: z.number().min(1).max(12),
        year: z.number().min(2000).max(3000)
      })
      .parse(data);
  })
  .handler(async ({data}) => {
    try {
      const taskRepository = container.get<TaskRepository>('taskRepository');
      const tasks = await taskRepository.getTaskCalendar(
        data.farmId,
        data.month,
        data.year
      );

      return {
        success: true,
        data: {
          tasks: tasks.map(serializeTask)
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to get task calendar'
      };
    }
  });
