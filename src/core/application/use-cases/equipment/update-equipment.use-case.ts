import {EquipmentRepository} from '@/core/domain/repositories';
import {Equipment} from '@/core/domain/entities';

export interface UpdateEquipmentRequest {
  id: string;
  name?: string;
  type?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currentValue?: number;
  status?: 'operational' | 'maintenance' | 'broken' | 'retired';
  location?: string;
}

export class UpdateEquipmentUseCase {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async execute(request: UpdateEquipmentRequest): Promise<Equipment> {
    const existingEquipment = await this.equipmentRepository.findEquipmentById(
      request.id
    );

    if (!existingEquipment) {
      throw new Error('Equipment not found');
    }

    const updatedEquipment = new Equipment({
      id: existingEquipment.id,
      farmId: existingEquipment.farmId,
      name: request.name ?? existingEquipment.name,
      type: request.type ?? existingEquipment.type,
      brand: request.brand ?? existingEquipment.brand,
      model: request.model ?? existingEquipment.model,
      serialNumber: request.serialNumber ?? existingEquipment.serialNumber,
      purchaseDate: request.purchaseDate ?? existingEquipment.purchaseDate,
      purchasePrice: request.purchasePrice ?? existingEquipment.purchasePrice,
      currentValue: request.currentValue ?? existingEquipment.currentValue,
      status: request.status ?? existingEquipment.status,
      location: request.location ?? existingEquipment.location,
      createdAt: existingEquipment.createdAt,
      updatedAt: new Date()
    });

    await this.equipmentRepository.saveEquipment(updatedEquipment);
    return updatedEquipment;
  }
}
