import {LivestockRepository} from '@/core/domain/repositories';
import {LivestockAnimal} from '@/core/domain/entities';

export interface ListAnimalsByFarmRequest {
  farmId: string;
}

export interface ListAnimalsByFarmResponse {
  animals: LivestockAnimal[];
}

export class ListAnimalsByFarmUseCase {
  constructor(private livestockRepository: LivestockRepository) {}

  async execute(
    request: ListAnimalsByFarmRequest
  ): Promise<ListAnimalsByFarmResponse> {
    const animals = await this.livestockRepository.findAnimalsByFarm(
      request.farmId
    );

    return {
      animals
    };
  }
}
