import {BreedingRecord} from '@/core/domain/entities';
import {LivestockRepository} from '@/core/domain/repositories';

export interface CreateBreedingRecordRequest {
  motherAnimalId: string;
  fatherAnimalId?: string;
  breedingDate: Date;
  expectedBirthDate?: Date;
  notes?: string;
}

export class CreateBreedingRecordUseCase {
  constructor(private livestockRepository: LivestockRepository) {}

  async execute(request: CreateBreedingRecordRequest): Promise<BreedingRecord> {
    // Validate that the mother animal exists
    const motherAnimal = await this.livestockRepository.findAnimalById(
      request.motherAnimalId
    );
    if (!motherAnimal) {
      throw new Error('Mother animal not found');
    }

    // Validate that the mother is female
    if (motherAnimal.sex !== 'female') {
      throw new Error('Mother animal must be female');
    }

    // Validate that the father animal exists and is male (if provided)
    if (request.fatherAnimalId) {
      const fatherAnimal = await this.livestockRepository.findAnimalById(
        request.fatherAnimalId
      );
      if (!fatherAnimal) {
        throw new Error('Father animal not found');
      }
      if (fatherAnimal.sex !== 'male') {
        throw new Error('Father animal must be male');
      }
    }

    // Create the breeding record
    const breedingRecord = new BreedingRecord({
      id: crypto.randomUUID(),
      motherAnimalId: request.motherAnimalId,
      fatherAnimalId: request.fatherAnimalId,
      breedingDate: request.breedingDate,
      expectedBirthDate: request.expectedBirthDate,
      pregnancyStatus: 'bred',
      notes: request.notes
    });

    await this.livestockRepository.saveBreedingRecord(breedingRecord);

    return breedingRecord;
  }
}
