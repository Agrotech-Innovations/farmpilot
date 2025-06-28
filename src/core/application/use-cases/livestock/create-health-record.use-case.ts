import {LivestockRepository} from '@/core/domain/repositories';
import {HealthRecord} from '@/core/domain/entities';

export interface CreateHealthRecordRequest {
  animalId: string;
  recordType: 'vaccination' | 'treatment' | 'checkup' | 'injury' | 'illness';
  description: string;
  treatment?: string;
  medication?: string;
  dosage?: string;
  veterinarian?: string;
  cost?: number;
  notes?: string;
}

export class CreateHealthRecordUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(request: CreateHealthRecordRequest): Promise<HealthRecord> {
    // Verify animal exists
    const animal = await this.livestockRepository.findAnimalById(
      request.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    // Create the health record
    const healthRecord = new HealthRecord({
      id: crypto.randomUUID(),
      animalId: request.animalId,
      recordType: request.recordType,
      description: request.description,
      treatment: request.treatment,
      medication: request.medication,
      dosage: request.dosage,
      veterinarian: request.veterinarian,
      cost: request.cost,
      notes: request.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.livestockRepository.saveHealthRecord(healthRecord);
    return healthRecord;
  }
}
