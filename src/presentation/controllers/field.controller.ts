import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';

export const createField = createServerFn({
  method: 'POST'
}).handler(async () => {
  const useCase = container.getCreateFieldUseCase();
  return {success: true, message: 'Field creation endpoint'};
});

export const listFields = createServerFn({
  method: 'GET'
}).handler(async () => {
  const useCase = container.getListFieldsUseCase();
  return {success: true, message: 'List fields endpoint'};
});
