import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';

export const createTask = createServerFn({
  method: 'POST'
}).handler(async () => {
  const useCase = container.getCreateTaskUseCase();
  return {success: true, message: 'Task creation endpoint'};
});

export const listTasks = createServerFn({
  method: 'GET'
}).handler(async () => {
  const useCase = container.getListTasksUseCase();
  return {success: true, message: 'List tasks endpoint'};
});

export const updateTaskStatus = createServerFn({
  method: 'POST'
}).handler(async () => {
  const useCase = container.getUpdateTaskStatusUseCase();
  return {success: true, message: 'Update task status endpoint'};
});
