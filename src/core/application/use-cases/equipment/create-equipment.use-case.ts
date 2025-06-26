import {EquipmentRepository} from '@/core/domain/repositories';
import {Equipment} from '@/core/domain/entities';

export interface CreateEquipmentRequest {
  farmId: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  location?: string;
}

export class CreateEquipmentUseCase {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async execute(request: CreateEquipmentRequest): Promise<Equipment> {
    const equipment = new Equipment({
      id: crypto.randomUUID(),
      farmId: request.farmId,
      name: request.name,
      type: request.type,
      brand: request.brand,
      model: request.model,
      serialNumber: request.serialNumber,
      purchaseDate: request.purchaseDate,
      purchasePrice: request.purchasePrice,
      currentValue: request.purchasePrice, // Initially same as purchase price
      status: 'operational',
      location: request.location,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.equipmentRepository.saveEquipment(equipment);
    return equipment;
  }
}
