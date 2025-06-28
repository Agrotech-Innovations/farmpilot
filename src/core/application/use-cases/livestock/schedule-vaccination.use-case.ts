import {LivestockRepository} from '@/core/domain/repositories';
import {HealthRecord} from '@/core/domain/entities';

export interface ScheduleVaccinationRequest {
  animalId: string;
  vaccinationType: string;
  description: string;
  scheduledDate?: Date;
  veterinarian?: string;
  cost?: number;
  notes?: string;
}

export class ScheduleVaccinationUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(request: ScheduleVaccinationRequest): Promise<HealthRecord> {
    // Verify animal exists
    const animal = await this.livestockRepository.findAnimalById(
      request.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    // Create vaccination record
    const vaccinationRecord = new HealthRecord({
      id: crypto.randomUUID(),
      animalId: request.animalId,
      recordType: 'vaccination',
      description: `${request.vaccinationType}: ${request.description}`,
      veterinarian: request.veterinarian,
      cost: request.cost,
      notes: request.scheduledDate
        ? `Scheduled for: ${request.scheduledDate.toISOString().split('T')[0]}${request.notes ? '. ' + request.notes : ''}`
        : request.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.livestockRepository.saveHealthRecord(vaccinationRecord);
    return vaccinationRecord;
  }
}
