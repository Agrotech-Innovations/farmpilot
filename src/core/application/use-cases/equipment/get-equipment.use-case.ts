import {EquipmentRepository} from '@/core/domain/repositories';
import {Equipment} from '@/core/domain/entities';

export interface GetEquipmentRequest {
  id: string;
}

export class GetEquipmentUseCase {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async execute(request: GetEquipmentRequest): Promise<Equipment> {
    const equipment = await this.equipmentRepository.findEquipmentById(
      request.id
    );

    if (!equipment) {
      throw new Error('Equipment not found');
    }

    return equipment;
  }
}
