import {LivestockRepository} from '@/core/domain/repositories';
import {HealthRecord} from '@/core/domain/entities';

export interface GetHealthRecordsRequest {
  animalId: string;
}

export interface GetHealthRecordsResponse {
  records: HealthRecord[];
}

export class GetHealthRecordsUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: GetHealthRecordsRequest
  ): Promise<GetHealthRecordsResponse> {
    // Verify animal exists
    const animal = await this.livestockRepository.findAnimalById(
      request.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    const records = await this.livestockRepository.findHealthRecordsByAnimal(
      request.animalId
    );

    return {
      records
    };
  }
}
