import {LivestockRepository} from '@/core/domain/repositories';
import {HealthRecord, LivestockAnimal} from '@/core/domain/entities';

export interface RecordTreatmentRequest {
  animalId: string;
  description: string;
  treatment: string;
  medication?: string;
  dosage?: string;
  veterinarian?: string;
  cost?: number;
  notes?: string;
  updateHealthStatus?: boolean;
  newHealthStatus?: 'healthy' | 'sick' | 'injured' | 'deceased';
}

export interface RecordTreatmentResponse {
  healthRecord: HealthRecord;
  updatedAnimal?: LivestockAnimal;
}

export class RecordTreatmentUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: RecordTreatmentRequest
  ): Promise<RecordTreatmentResponse> {
    // Verify animal exists
    const animal = await this.livestockRepository.findAnimalById(
      request.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    // Create treatment record
    const treatmentRecord = new HealthRecord({
      id: crypto.randomUUID(),
      animalId: request.animalId,
      recordType: 'treatment',
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

    await this.livestockRepository.saveHealthRecord(treatmentRecord);

    let updatedAnimal: LivestockAnimal | undefined;

    // Update animal health status if requested
    if (request.updateHealthStatus && request.newHealthStatus) {
      updatedAnimal = animal.updateHealthStatus(request.newHealthStatus);
      await this.livestockRepository.saveAnimal(updatedAnimal);
    }

    return {
      healthRecord: treatmentRecord,
      updatedAnimal
    };
  }
}
