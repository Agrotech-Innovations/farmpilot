import {LivestockRepository} from '@/core/domain/repositories';
import {HealthRecord, LivestockAnimal} from '@/core/domain/entities';

export interface GetVaccinationScheduleRequest {
  animalId?: string;
  groupId?: string;
  farmId?: string;
  vaccinationType?: string;
  daysAhead?: number; // How many days ahead to look for upcoming vaccinations
  includeCompleted?: boolean; // Include completed vaccinations in the response
}

export interface GetVaccinationScheduleItem {
  id: string;
  animalId: string;
  animalTagNumber: string;
  animalName?: string;
  vaccinationType: string;
  description: string;
  scheduledDate?: Date;
  completedDate?: Date;
  status: 'scheduled' | 'completed' | 'overdue';
  veterinarian?: string;
  cost?: number;
  notes?: string;
  daysUntilDue?: number;
}

export interface GetVaccinationScheduleResponse {
  scheduleItems: GetVaccinationScheduleItem[];
  totalScheduled: number;
  totalCompleted: number;
  totalOverdue: number;
  upcomingCount: number;
}

export class GetVaccinationScheduleUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: GetVaccinationScheduleRequest
  ): Promise<GetVaccinationScheduleResponse> {
    const daysAhead = request.daysAhead || 30;
    let targetAnimals: LivestockAnimal[] = [];

    // Determine target animals
    if (request.animalId) {
      const animal = await this.livestockRepository.findAnimalById(
        request.animalId
      );
      if (!animal) {
        throw new Error('Animal not found');
      }
      targetAnimals = [animal];
    } else if (request.groupId) {
      targetAnimals = await this.livestockRepository.findAnimalsByGroup(
        request.groupId
      );
    } else if (request.farmId) {
      const groups = await this.livestockRepository.findGroupsByFarm(
        request.farmId
      );
      const animalsPromises = groups.map((group) =>
        this.livestockRepository.findAnimalsByGroup(group.id)
      );
      const animalsArrays = await Promise.all(animalsPromises);
      targetAnimals = animalsArrays.flat();
    } else {
      throw new Error('Either animalId, groupId, or farmId must be provided');
    }

    // Get vaccination records for all target animals
    const vaccinationRecordsPromises = targetAnimals.map((animal) =>
      this.livestockRepository.findHealthRecordsByAnimal(animal.id)
    );
    const allRecordsArrays = await Promise.all(vaccinationRecordsPromises);
    const allRecords = allRecordsArrays.flat();

    // Filter for vaccination records
    let vaccinationRecords = allRecords.filter(
      (record) => record.recordType === 'vaccination'
    );

    // Filter by vaccination type if specified
    if (request.vaccinationType) {
      vaccinationRecords = vaccinationRecords.filter((record) =>
        record.description
          .toLowerCase()
          .includes(request.vaccinationType!.toLowerCase())
      );
    }

    // Process records and determine status
    const scheduleItems: GetVaccinationScheduleItem[] = [];
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);

    for (const record of vaccinationRecords) {
      const animal = targetAnimals.find((a) => a.id === record.animalId);
      if (!animal) continue;

      const scheduledDate = this.extractScheduledDate(record.notes);
      const completedDate = record.createdAt;

      let status: 'scheduled' | 'completed' | 'overdue' = 'completed';
      let daysUntilDue: number | undefined;

      if (scheduledDate) {
        if (scheduledDate > now) {
          status = 'scheduled';
          daysUntilDue = Math.ceil(
            (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
          );
        } else if (scheduledDate < now && !completedDate) {
          status = 'overdue';
          daysUntilDue = Math.ceil(
            (now.getTime() - scheduledDate.getTime()) / (1000 * 60 * 60 * 24)
          );
        }
      }

      // Skip completed vaccinations if not requested
      if (!request.includeCompleted && status === 'completed') {
        continue;
      }

      const vaccinationType = this.extractVaccinationType(record.description);

      scheduleItems.push({
        id: record.id,
        animalId: record.animalId,
        animalTagNumber: animal.tagNumber,
        animalName: animal.name,
        vaccinationType,
        description: record.description,
        scheduledDate,
        completedDate,
        status,
        veterinarian: record.veterinarian,
        cost: record.cost,
        notes: record.notes,
        daysUntilDue
      });
    }

    // Sort by scheduled date (upcoming first)
    scheduleItems.sort((a, b) => {
      if (a.scheduledDate && b.scheduledDate) {
        return a.scheduledDate.getTime() - b.scheduledDate.getTime();
      }
      if (a.scheduledDate) return -1;
      if (b.scheduledDate) return 1;
      return 0;
    });

    // Calculate statistics
    const totalScheduled = scheduleItems.filter(
      (item) => item.status === 'scheduled'
    ).length;
    const totalCompleted = scheduleItems.filter(
      (item) => item.status === 'completed'
    ).length;
    const totalOverdue = scheduleItems.filter(
      (item) => item.status === 'overdue'
    ).length;
    const upcomingCount = scheduleItems.filter(
      (item) =>
        item.status === 'scheduled' &&
        item.scheduledDate &&
        item.scheduledDate <= futureDate
    ).length;

    return {
      scheduleItems,
      totalScheduled,
      totalCompleted,
      totalOverdue,
      upcomingCount
    };
  }

  private extractScheduledDate(notes?: string): Date | undefined {
    if (!notes) return undefined;

    // Look for "Scheduled for: YYYY-MM-DD" pattern in notes
    const scheduledMatch = notes.match(/Scheduled for: (\d{4}-\d{2}-\d{2})/);
    if (scheduledMatch) {
      return new Date(scheduledMatch[1]);
    }

    return undefined;
  }

  private extractVaccinationType(description: string): string {
    // Extract vaccination type from description (assuming format: "Type: Description")
    const colonIndex = description.indexOf(':');
    if (colonIndex > 0) {
      return description.substring(0, colonIndex).trim();
    }
    return 'General Vaccination';
  }
}
