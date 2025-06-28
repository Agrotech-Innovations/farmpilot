import {LivestockRepository} from '@/core/domain/repositories';
import {HealthRecord, LivestockAnimal} from '@/core/domain/entities';

export interface GetVaccinationRemindersRequest {
  farmId: string;
  daysAhead?: number; // How many days ahead to look for upcoming vaccinations
  includeOverdue?: boolean;
  vaccinationType?: string;
  priorityLevel?: 'high' | 'medium' | 'low' | 'all';
}

export interface VaccinationReminder {
  id: string;
  animalId: string;
  animalTagNumber: string;
  animalName?: string;
  groupId: string;
  groupName: string;
  vaccinationType: string;
  description: string;
  scheduledDate: Date;
  daysUntilDue: number; // Negative if overdue
  priority: 'high' | 'medium' | 'low';
  veterinarian?: string;
  estimatedCost?: number;
  notes?: string;
  reminderType: 'upcoming' | 'due_soon' | 'overdue';
}

export interface VaccinationRemindersResponse {
  reminders: VaccinationReminder[];
  totalReminders: number;
  upcomingCount: number;
  dueSoonCount: number; // Due within 7 days
  overdueCount: number;
  totalEstimatedCost: number;
  remindersByPriority: {
    high: number;
    medium: number;
    low: number;
  };
}

export class GetVaccinationRemindersUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: GetVaccinationRemindersRequest
  ): Promise<VaccinationRemindersResponse> {
    const daysAhead = request.daysAhead || 30;

    // Get all groups and animals for the farm
    const groups = await this.livestockRepository.findGroupsByFarm(
      request.farmId
    );

    const animalsPromises = groups.map((group) =>
      this.livestockRepository.findAnimalsByGroup(group.id)
    );
    const animalsArrays = await Promise.all(animalsPromises);
    const allAnimals = animalsArrays.flat();

    // Get vaccination records for all animals
    const vaccinationRecordsPromises = allAnimals.map((animal) =>
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

    const reminders: VaccinationReminder[] = [];
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + daysAhead);

    for (const record of vaccinationRecords) {
      const animal = allAnimals.find((a) => a.id === record.animalId);
      if (!animal) continue;

      const group = groups.find((g) => g.id === animal.groupId);
      if (!group) continue;

      const scheduledDate = this.extractScheduledDate(record.notes);
      if (!scheduledDate) continue;

      const daysUntilDue = Math.ceil(
        (scheduledDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Determine if this vaccination should be included
      const isUpcoming = daysUntilDue > 0 && scheduledDate <= futureDate;
      const isOverdue = daysUntilDue < 0;

      if (!isUpcoming && !isOverdue) continue;
      if (isOverdue && !request.includeOverdue) continue;

      // Determine reminder type
      let reminderType: 'upcoming' | 'due_soon' | 'overdue';
      if (isOverdue) {
        reminderType = 'overdue';
      } else if (daysUntilDue <= 7) {
        reminderType = 'due_soon';
      } else {
        reminderType = 'upcoming';
      }

      // Determine priority
      const priority = this.calculatePriority(daysUntilDue, record.description);

      // Filter by priority if specified
      if (
        request.priorityLevel &&
        request.priorityLevel !== 'all' &&
        priority !== request.priorityLevel
      ) {
        continue;
      }

      const vaccinationType = this.extractVaccinationType(record.description);

      reminders.push({
        id: record.id,
        animalId: record.animalId,
        animalTagNumber: animal.tagNumber,
        animalName: animal.name,
        groupId: group.id,
        groupName: group.name,
        vaccinationType,
        description: record.description,
        scheduledDate,
        daysUntilDue,
        priority,
        veterinarian: record.veterinarian,
        estimatedCost: record.cost,
        notes: record.notes,
        reminderType
      });
    }

    // Sort by priority and then by due date
    reminders.sort((a, b) => {
      const priorityOrder = {high: 0, medium: 1, low: 2};
      const priorityDiff =
        priorityOrder[a.priority] - priorityOrder[b.priority];

      if (priorityDiff !== 0) return priorityDiff;

      return a.scheduledDate.getTime() - b.scheduledDate.getTime();
    });

    // Calculate statistics
    const upcomingCount = reminders.filter(
      (r) => r.reminderType === 'upcoming'
    ).length;
    const dueSoonCount = reminders.filter(
      (r) => r.reminderType === 'due_soon'
    ).length;
    const overdueCount = reminders.filter(
      (r) => r.reminderType === 'overdue'
    ).length;

    const totalEstimatedCost = reminders
      .filter((r) => r.estimatedCost)
      .reduce((sum, r) => sum + (r.estimatedCost || 0), 0);

    const remindersByPriority = {
      high: reminders.filter((r) => r.priority === 'high').length,
      medium: reminders.filter((r) => r.priority === 'medium').length,
      low: reminders.filter((r) => r.priority === 'low').length
    };

    return {
      reminders,
      totalReminders: reminders.length,
      upcomingCount,
      dueSoonCount,
      overdueCount,
      totalEstimatedCost,
      remindersByPriority
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

  private calculatePriority(
    daysUntilDue: number,
    description: string
  ): 'high' | 'medium' | 'low' {
    // Overdue vaccinations are high priority
    if (daysUntilDue < 0) return 'high';

    // Critical vaccinations (rabies, core vaccines) are high priority
    const criticalVaccines = ['rabies', 'core', 'mandatory', 'required'];
    const descriptionLower = description.toLowerCase();

    if (
      criticalVaccines.some((vaccine) => descriptionLower.includes(vaccine))
    ) {
      return daysUntilDue <= 14 ? 'high' : 'medium';
    }

    // Due within 7 days is high priority
    if (daysUntilDue <= 7) return 'high';

    // Due within 14 days is medium priority
    if (daysUntilDue <= 14) return 'medium';

    // Everything else is low priority
    return 'low';
  }
}
