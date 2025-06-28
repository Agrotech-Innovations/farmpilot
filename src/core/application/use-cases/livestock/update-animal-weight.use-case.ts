import {LivestockRepository} from '@/core/domain/repositories';
import {LivestockAnimal, HealthRecord} from '@/core/domain/entities';

export interface UpdateAnimalWeightRequest {
  animalId: string;
  weight: number;
  createHealthRecord?: boolean;
  notes?: string;
  veterinarian?: string;
}

export interface UpdateAnimalWeightResponse {
  updatedAnimal: LivestockAnimal;
  healthRecord?: HealthRecord;
}

export class UpdateAnimalWeightUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: UpdateAnimalWeightRequest
  ): Promise<UpdateAnimalWeightResponse> {
    // Find the animal
    const animal = await this.livestockRepository.findAnimalById(
      request.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    // Update weight
    const updatedAnimal = animal.updateWeight(request.weight);
    await this.livestockRepository.saveAnimal(updatedAnimal);

    let healthRecord: HealthRecord | undefined;

    // Create health record if requested
    if (request.createHealthRecord) {
      const previousWeight = animal.currentWeight;
      const weightChange = previousWeight
        ? request.weight - previousWeight
        : null;
      const weightChangeText = weightChange
        ? ` (${weightChange > 0 ? '+' : ''}${weightChange.toFixed(1)} lbs)`
        : '';

      healthRecord = new HealthRecord({
        id: crypto.randomUUID(),
        animalId: request.animalId,
        recordType: 'checkup',
        description: `Weight updated to ${request.weight} lbs${weightChangeText}`,
        veterinarian: request.veterinarian,
        notes: request.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await this.livestockRepository.saveHealthRecord(healthRecord);
    }

    return {
      updatedAnimal,
      healthRecord
    };
  }
}
