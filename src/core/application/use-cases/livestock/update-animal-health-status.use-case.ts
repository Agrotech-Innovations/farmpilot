import {LivestockRepository} from '@/core/domain/repositories';
import {LivestockAnimal} from '@/core/domain/entities';

export interface UpdateAnimalHealthStatusRequest {
  animalId: string;
  healthStatus: 'healthy' | 'sick' | 'injured' | 'deceased';
  notes?: string;
}

export class UpdateAnimalHealthStatusUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: UpdateAnimalHealthStatusRequest
  ): Promise<LivestockAnimal> {
    // Find the animal
    const animal = await this.livestockRepository.findAnimalById(
      request.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    // Update health status
    const updatedAnimal = animal.updateHealthStatus(request.healthStatus);
    await this.livestockRepository.saveAnimal(updatedAnimal);

    // Optionally create a health record for the status change
    if (request.notes && request.healthStatus !== 'healthy') {
      const healthRecord = {
        id: crypto.randomUUID(),
        animalId: request.animalId,
        recordType:
          request.healthStatus === 'sick'
            ? ('illness' as const)
            : ('injury' as const),
        description: `Health status changed to ${request.healthStatus}`,
        notes: request.notes,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await this.livestockRepository.saveHealthRecord(
        new (await import('@/core/domain/entities')).HealthRecord(healthRecord)
      );
    }

    return updatedAnimal;
  }
}
