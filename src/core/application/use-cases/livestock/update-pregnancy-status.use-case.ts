import {BreedingRecord} from '@/core/domain/entities';
import {LivestockRepository} from '@/core/domain/repositories';

export interface UpdatePregnancyStatusRequest {
  breedingRecordId: string;
  pregnancyStatus: 'bred' | 'confirmed' | 'aborted' | 'birthed';
  actualBirthDate?: Date;
  offspringCount?: number;
}

export class UpdatePregnancyStatusUseCase {
  constructor(private livestockRepository: LivestockRepository) {}

  async execute(
    request: UpdatePregnancyStatusRequest
  ): Promise<BreedingRecord> {
    const breedingRecord =
      await this.livestockRepository.findBreedingRecordById(
        request.breedingRecordId
      );

    if (!breedingRecord) {
      throw new Error('Breeding record not found');
    }

    const updatedRecord = breedingRecord.updatePregnancyStatus(
      request.pregnancyStatus,
      request.actualBirthDate,
      request.offspringCount
    );

    await this.livestockRepository.saveBreedingRecord(updatedRecord);

    return updatedRecord;
  }
}
