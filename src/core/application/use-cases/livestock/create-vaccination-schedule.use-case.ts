import {LivestockRepository} from '@/core/domain/repositories';
import {HealthRecord} from '@/core/domain/entities';

export interface CreateVaccinationScheduleItem {
  vaccinationType: string;
  description: string;
  intervalDays: number; // Days between vaccinations (e.g., 365 for annual)
  initialDate: Date;
  veterinarian?: string;
  estimatedCost?: number;
  notes?: string;
}

export interface CreateVaccinationScheduleRequest {
  animalIds: string[]; // Can schedule for multiple animals
  groupId?: string; // Or schedule for entire group
  scheduleItems: CreateVaccinationScheduleItem[];
  autoScheduleNext?: boolean; // Automatically schedule next vaccination after completion
}

export interface CreateVaccinationScheduleResponse {
  scheduledVaccinations: HealthRecord[];
  totalAnimalsScheduled: number;
  nextScheduledDates: Date[];
}

export class CreateVaccinationScheduleUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: CreateVaccinationScheduleRequest
  ): Promise<CreateVaccinationScheduleResponse> {
    let targetAnimals: string[] = [];

    // Determine target animals
    if (request.animalIds && request.animalIds.length > 0) {
      // Validate all animals exist
      for (const animalId of request.animalIds) {
        const animal = await this.livestockRepository.findAnimalById(animalId);
        if (!animal) {
          throw new Error(`Animal with ID ${animalId} not found`);
        }
      }
      targetAnimals = request.animalIds;
    } else if (request.groupId) {
      // Get all animals in the group
      const animals = await this.livestockRepository.findAnimalsByGroup(
        request.groupId
      );
      if (animals.length === 0) {
        throw new Error('No animals found in the specified group');
      }
      targetAnimals = animals.map((animal) => animal.id);
    } else {
      throw new Error('Either animalIds or groupId must be provided');
    }

    const scheduledVaccinations: HealthRecord[] = [];
    const nextScheduledDates: Date[] = [];

    // Create vaccination records for each animal and schedule item
    for (const animalId of targetAnimals) {
      for (const scheduleItem of request.scheduleItems) {
        // Create initial vaccination record
        const vaccinationRecord = new HealthRecord({
          id: crypto.randomUUID(),
          animalId,
          recordType: 'vaccination',
          description: `${scheduleItem.vaccinationType}: ${scheduleItem.description}`,
          veterinarian: scheduleItem.veterinarian,
          cost: scheduleItem.estimatedCost,
          notes: this.buildScheduleNotes(
            scheduleItem,
            request.autoScheduleNext
          ),
          createdAt: new Date(),
          updatedAt: new Date()
        });

        await this.livestockRepository.saveHealthRecord(vaccinationRecord);
        scheduledVaccinations.push(vaccinationRecord);

        // Calculate next vaccination date if auto-scheduling is enabled
        if (request.autoScheduleNext) {
          const nextDate = new Date(scheduleItem.initialDate);
          nextDate.setDate(nextDate.getDate() + scheduleItem.intervalDays);
          nextScheduledDates.push(nextDate);

          // Create future vaccination record
          const futureVaccinationRecord = new HealthRecord({
            id: crypto.randomUUID(),
            animalId,
            recordType: 'vaccination',
            description: `${scheduleItem.vaccinationType}: ${scheduleItem.description} (Next Scheduled)`,
            veterinarian: scheduleItem.veterinarian,
            cost: scheduleItem.estimatedCost,
            notes: `Scheduled for: ${nextDate.toISOString().split('T')[0]}. Auto-scheduled follow-up vaccination.${scheduleItem.notes ? ' ' + scheduleItem.notes : ''}`,
            createdAt: new Date(),
            updatedAt: new Date()
          });

          await this.livestockRepository.saveHealthRecord(
            futureVaccinationRecord
          );
          scheduledVaccinations.push(futureVaccinationRecord);
        }
      }
    }

    return {
      scheduledVaccinations,
      totalAnimalsScheduled: targetAnimals.length,
      nextScheduledDates
    };
  }

  private buildScheduleNotes(
    scheduleItem: CreateVaccinationScheduleItem,
    autoScheduleNext?: boolean
  ): string {
    let notes = `Initial vaccination scheduled for: ${scheduleItem.initialDate.toISOString().split('T')[0]}`;

    if (autoScheduleNext) {
      const nextDate = new Date(scheduleItem.initialDate);
      nextDate.setDate(nextDate.getDate() + scheduleItem.intervalDays);
      notes += `. Next vaccination scheduled for: ${nextDate.toISOString().split('T')[0]}`;
    }

    if (scheduleItem.notes) {
      notes += `. ${scheduleItem.notes}`;
    }

    return notes;
  }
}
