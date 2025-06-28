import {LivestockRepository} from '@/core/domain/repositories';
import {HealthRecord, LivestockAnimal} from '@/core/domain/entities';

export interface BulkVaccinationScheduleItem {
  vaccinationType: string;
  description: string;
  scheduledDate: Date;
  veterinarian?: string;
  estimatedCost?: number;
  notes?: string;
}

export interface BulkScheduleVaccinationsRequest {
  farmId?: string;
  groupIds?: string[];
  animalIds?: string[];
  vaccinationSchedules: BulkVaccinationScheduleItem[];
  filterCriteria?: {
    species?: string;
    breed?: string;
    ageMinDays?: number;
    ageMaxDays?: number;
    healthStatus?: ('healthy' | 'sick' | 'injured' | 'deceased')[];
  };
  skipIfRecentlyVaccinated?: boolean; // Skip if vaccinated within last 30 days
  recentVaccinationDays?: number; // Days to look back for recent vaccinations
}

export interface BulkVaccinationResult {
  animalId: string;
  animalTagNumber: string;
  animalName?: string;
  groupId: string;
  scheduledVaccinations: HealthRecord[];
  skippedVaccinations: {
    vaccinationType: string;
    reason: string;
  }[];
  errors: string[];
}

export interface BulkScheduleVaccinationsResponse {
  results: BulkVaccinationResult[];
  totalAnimalsProcessed: number;
  totalVaccinationsScheduled: number;
  totalSkipped: number;
  totalErrors: number;
  summary: {
    byVaccinationType: Record<string, number>;
    byGroup: Record<string, number>;
    totalEstimatedCost: number;
  };
}

export class BulkScheduleVaccinationsUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: BulkScheduleVaccinationsRequest
  ): Promise<BulkScheduleVaccinationsResponse> {
    // Get target animals based on request criteria
    const targetAnimals = await this.getTargetAnimals(request);

    if (targetAnimals.length === 0) {
      throw new Error('No animals found matching the specified criteria');
    }

    const results: BulkVaccinationResult[] = [];
    const byVaccinationType: Record<string, number> = {};
    const byGroup: Record<string, number> = {};
    let totalVaccinationsScheduled = 0;
    let totalSkipped = 0;
    let totalErrors = 0;
    let totalEstimatedCost = 0;

    // Process each animal
    for (const animal of targetAnimals) {
      const result: BulkVaccinationResult = {
        animalId: animal.id,
        animalTagNumber: animal.tagNumber,
        animalName: animal.name,
        groupId: animal.groupId,
        scheduledVaccinations: [],
        skippedVaccinations: [],
        errors: []
      };

      // Get existing vaccination records if we need to check for recent vaccinations
      let existingVaccinations: HealthRecord[] = [];
      if (request.skipIfRecentlyVaccinated) {
        try {
          const allRecords =
            await this.livestockRepository.findHealthRecordsByAnimal(animal.id);
          existingVaccinations = allRecords.filter(
            (record) => record.recordType === 'vaccination'
          );
        } catch (error) {
          result.errors.push(
            `Failed to fetch existing vaccinations: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
          totalErrors++;
        }
      }

      // Process each vaccination schedule
      for (const schedule of request.vaccinationSchedules) {
        try {
          // Check if animal was recently vaccinated with this type
          if (
            request.skipIfRecentlyVaccinated &&
            this.wasRecentlyVaccinated(
              existingVaccinations,
              schedule.vaccinationType,
              request.recentVaccinationDays || 30
            )
          ) {
            result.skippedVaccinations.push({
              vaccinationType: schedule.vaccinationType,
              reason: `Recently vaccinated within ${request.recentVaccinationDays || 30} days`
            });
            totalSkipped++;
            continue;
          }

          // Create vaccination record
          const vaccinationRecord = new HealthRecord({
            id: crypto.randomUUID(),
            animalId: animal.id,
            recordType: 'vaccination',
            description: `${schedule.vaccinationType}: ${schedule.description}`,
            veterinarian: schedule.veterinarian,
            cost: schedule.estimatedCost,
            notes: `Scheduled for: ${schedule.scheduledDate.toISOString().split('T')[0]}${schedule.notes ? '. ' + schedule.notes : ''}`,
            createdAt: new Date(),
            updatedAt: new Date()
          });

          await this.livestockRepository.saveHealthRecord(vaccinationRecord);
          result.scheduledVaccinations.push(vaccinationRecord);

          // Update counters
          totalVaccinationsScheduled++;
          byVaccinationType[schedule.vaccinationType] =
            (byVaccinationType[schedule.vaccinationType] || 0) + 1;
          byGroup[animal.groupId] = (byGroup[animal.groupId] || 0) + 1;

          if (schedule.estimatedCost) {
            totalEstimatedCost += schedule.estimatedCost;
          }
        } catch (error) {
          result.errors.push(
            `Failed to schedule ${schedule.vaccinationType}: ${error instanceof Error ? error.message : 'Unknown error'}`
          );
          totalErrors++;
        }
      }

      results.push(result);
    }

    return {
      results,
      totalAnimalsProcessed: targetAnimals.length,
      totalVaccinationsScheduled,
      totalSkipped,
      totalErrors,
      summary: {
        byVaccinationType,
        byGroup,
        totalEstimatedCost
      }
    };
  }

  private async getTargetAnimals(
    request: BulkScheduleVaccinationsRequest
  ): Promise<LivestockAnimal[]> {
    let targetAnimals: LivestockAnimal[] = [];

    // Get animals based on the request criteria
    if (request.animalIds && request.animalIds.length > 0) {
      // Get specific animals
      const animalPromises = request.animalIds.map((id) =>
        this.livestockRepository.findAnimalById(id)
      );
      const animals = await Promise.all(animalPromises);
      targetAnimals = animals.filter(
        (animal): animal is LivestockAnimal => animal !== null
      );
    } else if (request.groupIds && request.groupIds.length > 0) {
      // Get animals from specific groups
      const groupPromises = request.groupIds.map((groupId) =>
        this.livestockRepository.findAnimalsByGroup(groupId)
      );
      const animalArrays = await Promise.all(groupPromises);
      targetAnimals = animalArrays.flat();
    } else if (request.farmId) {
      // Get all animals from the farm
      const groups = await this.livestockRepository.findGroupsByFarm(
        request.farmId
      );
      const groupPromises = groups.map((group) =>
        this.livestockRepository.findAnimalsByGroup(group.id)
      );
      const animalArrays = await Promise.all(groupPromises);
      targetAnimals = animalArrays.flat();
    }

    // Apply filters if specified
    if (request.filterCriteria) {
      targetAnimals = this.applyFilters(targetAnimals, request.filterCriteria);
    }

    return targetAnimals;
  }

  private applyFilters(
    animals: LivestockAnimal[],
    criteria: NonNullable<BulkScheduleVaccinationsRequest['filterCriteria']>
  ): LivestockAnimal[] {
    return animals.filter((animal) => {
      // Filter by species
      if (criteria.species) {
        // We need to get the group to check species - this is a simplified check
        // In a real implementation, you might want to join this data or structure it differently
      }

      // Filter by breed
      if (criteria.breed && animal.breed !== criteria.breed) {
        return false;
      }

      // Filter by age
      if (criteria.ageMinDays || criteria.ageMaxDays) {
        const ageInDays = animal.getAge();
        if (ageInDays === null) return false; // Skip animals without birth date

        if (criteria.ageMinDays && ageInDays < criteria.ageMinDays) {
          return false;
        }

        if (criteria.ageMaxDays && ageInDays > criteria.ageMaxDays) {
          return false;
        }
      }

      // Filter by health status
      if (
        criteria.healthStatus &&
        !criteria.healthStatus.includes(animal.healthStatus)
      ) {
        return false;
      }

      return true;
    });
  }

  private wasRecentlyVaccinated(
    existingVaccinations: HealthRecord[],
    vaccinationType: string,
    recentDays: number
  ): boolean {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - recentDays);

    return existingVaccinations.some((record) => {
      const recordDate = record.createdAt;
      if (!recordDate) return false;

      const isRecent = recordDate >= cutoffDate;
      const isSameType = record.description
        .toLowerCase()
        .includes(vaccinationType.toLowerCase());

      return isRecent && isSameType;
    });
  }
}
