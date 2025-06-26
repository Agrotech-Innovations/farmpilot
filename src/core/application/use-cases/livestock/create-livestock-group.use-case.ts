import {LivestockRepository} from '@/core/domain/repositories';
import {LivestockGroup} from '@/core/domain/entities';

export interface CreateLivestockGroupRequest {
  farmId: string;
  name: string;
  species: string;
  breed?: string;
  initialCount?: number;
}

export class CreateLivestockGroupUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(request: CreateLivestockGroupRequest): Promise<LivestockGroup> {
    const group = new LivestockGroup({
      id: crypto.randomUUID(),
      farmId: request.farmId,
      name: request.name,
      species: request.species,
      breed: request.breed,
      currentCount: request.initialCount || 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.livestockRepository.saveGroup(group);
    return group;
  }
}
