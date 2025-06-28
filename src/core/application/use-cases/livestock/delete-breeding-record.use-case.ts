import {LivestockRepository} from '@/core/domain/repositories';

export interface DeleteBreedingRecordRequest {
  breedingRecordId: string;
}

export class DeleteBreedingRecordUseCase {
  constructor(private livestockRepository: LivestockRepository) {}

  async execute(request: DeleteBreedingRecordRequest): Promise<void> {
    const breedingRecord =
      await this.livestockRepository.findBreedingRecordById(
        request.breedingRecordId
      );

    if (!breedingRecord) {
      throw new Error('Breeding record not found');
    }

    await this.livestockRepository.deleteBreedingRecord(
      request.breedingRecordId
    );
  }
}
