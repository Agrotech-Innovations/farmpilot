import {LivestockRepository} from '@/core/domain/repositories';
import {LivestockAnimal, HealthRecord} from '@/core/domain/entities';

export interface GetLivestockHealthAnalyticsRequest {
  farmId: string;
  daysAhead?: number;
}

export interface LivestockHealthAnalytics {
  totalAnimals: number;
  healthyCount: number;
  sickCount: number;
  injuredCount: number;
  deceasedCount: number;
  healthPercentage: number;
  upcomingVaccinationsCount: number;
  recentTreatmentsCount: number;
  totalHealthCosts: number;
  averageCostPerAnimal: number;
  unhealthyAnimals: Array<{
    id: string;
    tagNumber: string;
    name?: string;
    healthStatus: string;
    groupId: string;
  }>;
  upcomingVaccinations: Array<{
    id: string;
    animalId: string;
    recordType: string;
    description: string;
    createdAt: Date;
  }>;
  recentHealthRecords: Array<{
    id: string;
    animalId: string;
    recordType: string;
    description: string;
    treatment?: string;
    medication?: string;
    dosage?: string;
    veterinarian?: string;
    cost?: number;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }>;
}

export class GetLivestockHealthAnalyticsUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(
    request: GetLivestockHealthAnalyticsRequest
  ): Promise<LivestockHealthAnalytics> {
    const daysAhead = request.daysAhead || 30;

    // Get all data in parallel
    const [totalAnimals, unhealthyAnimals, upcomingVaccinations, allGroups] =
      await Promise.all([
        this.livestockRepository.countAnimalsByFarm(request.farmId),
        this.livestockRepository.findUnhealthyAnimals(request.farmId),
        this.livestockRepository.findUpcomingVaccinations(
          request.farmId,
          daysAhead
        ),
        this.livestockRepository.findGroupsByFarm(request.farmId)
      ]);

    // Get all animals for health status breakdown
    const allAnimalsPromises = allGroups.map((group) =>
      this.livestockRepository.findAnimalsByGroup(group.id)
    );
    const allAnimalsArrays = await Promise.all(allAnimalsPromises);
    const allAnimals = allAnimalsArrays.flat();

    // Calculate health statistics
    const healthyCount = allAnimals.filter(
      (a) => a.healthStatus === 'healthy'
    ).length;
    const sickCount = allAnimals.filter(
      (a) => a.healthStatus === 'sick'
    ).length;
    const injuredCount = allAnimals.filter(
      (a) => a.healthStatus === 'injured'
    ).length;
    const deceasedCount = allAnimals.filter(
      (a) => a.healthStatus === 'deceased'
    ).length;
    const healthPercentage =
      totalAnimals > 0 ? (healthyCount / totalAnimals) * 100 : 0;

    // Get recent health records (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentHealthRecordsPromises = allAnimals.map((animal) =>
      this.livestockRepository.findHealthRecordsByAnimal(animal.id)
    );
    const allHealthRecordsArrays = await Promise.all(
      recentHealthRecordsPromises
    );
    const allHealthRecords = allHealthRecordsArrays.flat();

    const recentHealthRecords = allHealthRecords.filter(
      (record) => record.createdAt && record.createdAt >= thirtyDaysAgo
    );

    const recentTreatmentsCount = recentHealthRecords.filter(
      (record) => record.recordType === 'treatment'
    ).length;

    // Calculate costs
    const totalHealthCosts = allHealthRecords
      .filter((record) => record.cost)
      .reduce((sum, record) => sum + (record.cost || 0), 0);

    const averageCostPerAnimal =
      totalAnimals > 0 ? totalHealthCosts / totalAnimals : 0;

    return {
      totalAnimals,
      healthyCount,
      sickCount,
      injuredCount,
      deceasedCount,
      healthPercentage: Math.round(healthPercentage * 100) / 100,
      upcomingVaccinationsCount: upcomingVaccinations.length,
      recentTreatmentsCount,
      totalHealthCosts,
      averageCostPerAnimal: Math.round(averageCostPerAnimal * 100) / 100,
      unhealthyAnimals: unhealthyAnimals.map((animal) => ({
        id: animal.id,
        tagNumber: animal.tagNumber,
        name: animal.name,
        healthStatus: animal.healthStatus,
        groupId: animal.groupId
      })),
      upcomingVaccinations: upcomingVaccinations.map((record) => ({
        id: record.id,
        animalId: record.animalId,
        recordType: record.recordType,
        description: record.description,
        createdAt: record.createdAt || new Date()
      })),
      recentHealthRecords: recentHealthRecords
        .sort(
          (a, b) =>
            (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
        )
        .slice(0, 10)
        .map((record) => ({
          id: record.id,
          animalId: record.animalId,
          recordType: record.recordType,
          description: record.description,
          treatment: record.treatment,
          medication: record.medication,
          dosage: record.dosage,
          veterinarian: record.veterinarian,
          cost: record.cost,
          notes: record.notes,
          createdAt: record.createdAt || new Date(),
          updatedAt: record.updatedAt || new Date()
        }))
    };
  }
}
