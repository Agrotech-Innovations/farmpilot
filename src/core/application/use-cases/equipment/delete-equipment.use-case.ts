import {EquipmentRepository} from '@/core/domain/repositories';

export interface DeleteEquipmentRequest {
  id: string;
}

export class DeleteEquipmentUseCase {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async execute(request: DeleteEquipmentRequest): Promise<void> {
    const equipment = await this.equipmentRepository.findEquipmentById(
      request.id
    );

    if (!equipment) {
      throw new Error('Equipment not found');
    }

    await this.equipmentRepository.deleteEquipment(request.id);
  }
}
