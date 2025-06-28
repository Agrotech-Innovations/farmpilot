import {BreedingRecord} from '@/core/domain/entities';
import {LivestockRepository} from '@/core/domain/repositories';

export interface GetBreedingRecordsRequest {
  farmId?: string;
  motherAnimalId?: string;
}

export class GetBreedingRecordsUseCase {
  constructor(private livestockRepository: LivestockRepository) {}

  async execute(request: GetBreedingRecordsRequest): Promise<BreedingRecord[]> {
    if (request.motherAnimalId) {
      return await this.livestockRepository.findBreedingRecordsByMother(
        request.motherAnimalId
      );
    }

    if (request.farmId) {
      return await this.livestockRepository.findBreedingRecordsByFarm(
        request.farmId
      );
    }

    throw new Error('Either farmId or motherAnimalId must be provided');
  }
}
