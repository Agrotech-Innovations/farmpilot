import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';

export const createEquipment = createServerFn({
  method: 'POST'
}).handler(async () => {
  const useCase = container.getCreateEquipmentUseCase();
  return {success: true, message: 'Equipment creation endpoint'};
});

export const scheduleMaintenance = createServerFn({
  method: 'POST'
}).handler(async () => {
  const useCase = container.getScheduleMaintenanceUseCase();
  return {success: true, message: 'Schedule maintenance endpoint'};
});
