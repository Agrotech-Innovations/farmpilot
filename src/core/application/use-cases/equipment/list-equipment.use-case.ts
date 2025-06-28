import {EquipmentRepository} from '@/core/domain/repositories';
import {Equipment} from '@/core/domain/entities';

export interface ListEquipmentRequest {
  farmId: string;
  type?: string;
}

export interface ListEquipmentResponse {
  equipment: Equipment[];
}

export class ListEquipmentUseCase {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async execute(request: ListEquipmentRequest): Promise<ListEquipmentResponse> {
    let equipment: Equipment[];

    if (request.type) {
      equipment = await this.equipmentRepository.findEquipmentByType(
        request.farmId,
        request.type
      );
    } else {
      equipment = await this.equipmentRepository.findEquipmentByFarm(
        request.farmId
      );
    }

    return {equipment};
  }
}
