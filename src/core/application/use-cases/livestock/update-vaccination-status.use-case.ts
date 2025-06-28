import {LivestockRepository} from '@/core/domain/repositories';
import {HealthRecord} from '@/core/domain/entities';

export interface UpdateVaccinationStatusRequest {
  vaccinationRecordId: string;
  status: 'completed' | 'rescheduled' | 'cancelled';
  completedDate?: Date;
  rescheduledDate?: Date;
  actualVeterinarian?: string;
  actualCost?: number;
  completionNotes?: string;
  scheduleNextVaccination?: boolean;
  nextVaccinationIntervalDays?: number;
}

export interface UpdateVaccinationStatusResponse {
  updatedRecord: HealthRecord;
  nextVaccinationRecord?: HealthRecord;
}

export class UpdateVaccinationStatusUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: UpdateVaccinationStatusRequest
  ): Promise<UpdateVaccinationStatusResponse> {
    // Find the vaccination record
    const existingRecord = await this.livestockRepository.findHealthRecordById(
      request.vaccinationRecordId
    );
    if (!existingRecord) {
      throw new Error('Vaccination record not found');
    }

    if (existingRecord.recordType !== 'vaccination') {
      throw new Error('Record is not a vaccination record');
    }

    // Verify animal exists
    const animal = await this.livestockRepository.findAnimalById(
      existingRecord.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    let updatedNotes = existingRecord.notes || '';
    let updatedDescription = existingRecord.description;

    // Update based on status
    switch (request.status) {
      case 'completed':
        const completedDate = request.completedDate || new Date();
        updatedNotes = this.updateNotesForCompletion(
          updatedNotes,
          completedDate,
          request.completionNotes
        );
        updatedDescription = `${existingRecord.description} (Completed)`;
        break;

      case 'rescheduled':
        if (!request.rescheduledDate) {
          throw new Error('Rescheduled date is required when rescheduling');
        }
        updatedNotes = this.updateNotesForReschedule(
          updatedNotes,
          request.rescheduledDate,
          request.completionNotes
        );
        updatedDescription = `${existingRecord.description} (Rescheduled)`;
        break;

      case 'cancelled':
        updatedNotes = this.updateNotesForCancellation(
          updatedNotes,
          request.completionNotes
        );
        updatedDescription = `${existingRecord.description} (Cancelled)`;
        break;
    }

    // Create updated vaccination record
    const updatedRecord = new HealthRecord({
      id: existingRecord.id,
      animalId: existingRecord.animalId,
      recordType: existingRecord.recordType,
      description: updatedDescription,
      treatment: existingRecord.treatment,
      medication: existingRecord.medication,
      dosage: existingRecord.dosage,
      veterinarian: request.actualVeterinarian || existingRecord.veterinarian,
      cost: request.actualCost ?? existingRecord.cost,
      notes: updatedNotes,
      createdAt: existingRecord.createdAt,
      updatedAt: new Date()
    });

    await this.livestockRepository.saveHealthRecord(updatedRecord);

    let nextVaccinationRecord: HealthRecord | undefined;

    // Schedule next vaccination if requested and vaccination was completed
    if (
      request.scheduleNextVaccination &&
      request.status === 'completed' &&
      request.nextVaccinationIntervalDays
    ) {
      const nextVaccinationDate = new Date(request.completedDate || new Date());
      nextVaccinationDate.setDate(
        nextVaccinationDate.getDate() + request.nextVaccinationIntervalDays
      );

      const vaccinationType = this.extractVaccinationType(
        existingRecord.description
      );

      nextVaccinationRecord = new HealthRecord({
        id: crypto.randomUUID(),
        animalId: existingRecord.animalId,
        recordType: 'vaccination',
        description: `${vaccinationType}: Follow-up vaccination`,
        veterinarian: existingRecord.veterinarian,
        cost: existingRecord.cost,
        notes: `Scheduled for: ${nextVaccinationDate.toISOString().split('T')[0]}. Auto-scheduled follow-up vaccination.`,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      await this.livestockRepository.saveHealthRecord(nextVaccinationRecord);
    }

    return {
      updatedRecord,
      nextVaccinationRecord
    };
  }

  private updateNotesForCompletion(
    existingNotes: string,
    completedDate: Date,
    completionNotes?: string
  ): string {
    let notes = existingNotes;
    notes += `\nCompleted on: ${completedDate.toISOString().split('T')[0]}`;

    if (completionNotes) {
      notes += `\nCompletion notes: ${completionNotes}`;
    }

    return notes;
  }

  private updateNotesForReschedule(
    existingNotes: string,
    rescheduledDate: Date,
    rescheduleReason?: string
  ): string {
    let notes = existingNotes;
    notes += `\nRescheduled to: ${rescheduledDate.toISOString().split('T')[0]}`;

    if (rescheduleReason) {
      notes += `\nReschedule reason: ${rescheduleReason}`;
    }

    return notes;
  }

  private updateNotesForCancellation(
    existingNotes: string,
    cancellationReason?: string
  ): string {
    let notes = existingNotes;
    notes += `\nCancelled on: ${new Date().toISOString().split('T')[0]}`;

    if (cancellationReason) {
      notes += `\nCancellation reason: ${cancellationReason}`;
    }

    return notes;
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
