import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';

export const createInventoryItem = createServerFn({
  method: 'POST'
}).handler(async () => {
  const useCase = container.getCreateInventoryItemUseCase();
  return {success: true, message: 'Inventory item creation endpoint'};
});

export const recordInventoryTransaction = createServerFn({
  method: 'POST'
}).handler(async () => {
  const useCase = container.getRecordInventoryTransactionUseCase();
  return {success: true, message: 'Record inventory transaction endpoint'};
});
