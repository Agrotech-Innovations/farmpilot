import {LivestockRepository} from '@/core/domain/repositories';
import {LivestockAnimal, HealthRecord} from '@/core/domain/entities';

export interface GetAnimalHealthHistoryRequest {
  animalId: string;
  recordType?: 'vaccination' | 'treatment' | 'checkup' | 'injury' | 'illness';
  startDate?: Date;
  endDate?: Date;
}

export interface AnimalHealthHistory {
  animal: {
    id: string;
    tagNumber: string;
    name?: string;
    healthStatus: string;
    currentWeight?: number;
    age?: number;
    groupId: string;
  };
  healthRecords: HealthRecord[];
  summary: {
    totalRecords: number;
    vaccinationCount: number;
    treatmentCount: number;
    checkupCount: number;
    injuryCount: number;
    illnessCount: number;
    totalCost: number;
    lastCheckup?: Date;
    lastVaccination?: Date;
    lastTreatment?: Date;
  };
}

export class GetAnimalHealthHistoryUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: GetAnimalHealthHistoryRequest
  ): Promise<AnimalHealthHistory> {
    // Find the animal
    const animal = await this.livestockRepository.findAnimalById(
      request.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    // Get all health records for the animal
    let healthRecords =
      await this.livestockRepository.findHealthRecordsByAnimal(
        request.animalId
      );

    // Filter by record type if specified
    if (request.recordType) {
      healthRecords = healthRecords.filter(
        (record) => record.recordType === request.recordType
      );
    }

    // Filter by date range if specified
    if (request.startDate || request.endDate) {
      healthRecords = healthRecords.filter((record) => {
        const recordDate = record.createdAt;
        if (!recordDate) return false;

        if (request.startDate && recordDate < request.startDate) {
          return false;
        }
        if (request.endDate && recordDate > request.endDate) {
          return false;
        }
        return true;
      });
    }

    // Calculate summary statistics
    const vaccinationCount = healthRecords.filter(
      (r) => r.recordType === 'vaccination'
    ).length;
    const treatmentCount = healthRecords.filter(
      (r) => r.recordType === 'treatment'
    ).length;
    const checkupCount = healthRecords.filter(
      (r) => r.recordType === 'checkup'
    ).length;
    const injuryCount = healthRecords.filter(
      (r) => r.recordType === 'injury'
    ).length;
    const illnessCount = healthRecords.filter(
      (r) => r.recordType === 'illness'
    ).length;

    const totalCost = healthRecords
      .filter((record) => record.cost)
      .reduce((sum, record) => sum + (record.cost || 0), 0);

    const getLastRecordDate = (type: string): Date | undefined => {
      const records = healthRecords
        .filter((r) => r.recordType === type && r.createdAt)
        .sort(
          (a, b) =>
            (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
        );
      return records[0]?.createdAt;
    };

    return {
      animal: {
        id: animal.id,
        tagNumber: animal.tagNumber,
        name: animal.name,
        healthStatus: animal.healthStatus,
        currentWeight: animal.currentWeight,
        age: animal.getAge() ?? undefined,
        groupId: animal.groupId
      },
      healthRecords: healthRecords.sort(
        (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
      ),
      summary: {
        totalRecords: healthRecords.length,
        vaccinationCount,
        treatmentCount,
        checkupCount,
        injuryCount,
        illnessCount,
        totalCost: Math.round(totalCost * 100) / 100,
        lastCheckup: getLastRecordDate('checkup'),
        lastVaccination: getLastRecordDate('vaccination'),
        lastTreatment: getLastRecordDate('treatment')
      }
    };
  }
}
