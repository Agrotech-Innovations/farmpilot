import {EquipmentRepository} from '@/core/domain/repositories';
import {MaintenanceRecord} from '@/core/domain/entities';

export interface ScheduleMaintenanceRequest {
  equipmentId: string;
  maintenanceType: 'routine' | 'repair' | 'inspection' | 'replacement';
  description: string;
  cost?: number;
  performedBy?: string;
  serviceProvider?: string;
  nextServiceDate?: Date;
  notes?: string;
}

export class ScheduleMaintenanceUseCase {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async execute(
    request: ScheduleMaintenanceRequest
  ): Promise<MaintenanceRecord> {
    // Verify equipment exists
    const equipment = await this.equipmentRepository.findEquipmentById(
      request.equipmentId
    );
    if (!equipment) {
      throw new Error('Equipment not found');
    }

    const record = new MaintenanceRecord({
      id: crypto.randomUUID(),
      equipmentId: request.equipmentId,
      maintenanceType: request.maintenanceType,
      description: request.description,
      cost: request.cost,
      performedBy: request.performedBy,
      serviceProvider: request.serviceProvider,
      nextServiceDate: request.nextServiceDate,
      notes: request.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.equipmentRepository.saveMaintenanceRecord(record);

    // Update equipment status if it's a repair
    if (request.maintenanceType === 'repair') {
      const updatedEquipment = equipment.updateStatus('maintenance');
      await this.equipmentRepository.saveEquipment(updatedEquipment);
    }

    return record;
  }
}
