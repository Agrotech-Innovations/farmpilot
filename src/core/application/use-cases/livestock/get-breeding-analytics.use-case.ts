import {BreedingRecord} from '@/core/domain/entities';
import {LivestockRepository} from '@/core/domain/repositories';

export interface BreedingAnalytics {
  totalActivePregnancies: number;
  overduePregnancies: number;
  upcomingBirths: number;
  totalBirthsThisYear: number;
  averageGestationDays: number;
  pregnancySuccessRate: number;
  activePregnancies: BreedingRecord[];
  overduePregnanciesList: BreedingRecord[];
  upcomingBirthsList: BreedingRecord[];
}

export interface GetBreedingAnalyticsRequest {
  farmId: string;
  daysAheadForUpcoming?: number;
}

export class GetBreedingAnalyticsUseCase {
  constructor(private livestockRepository: LivestockRepository) {}

  async execute(
    request: GetBreedingAnalyticsRequest
  ): Promise<BreedingAnalytics> {
    const [
      activePregnancies,
      overduePregnancies,
      upcomingBirths,
      allBreedingRecords
    ] = await Promise.all([
      this.livestockRepository.findActivePregnancies(request.farmId),
      this.livestockRepository.findOverduePregnancies(request.farmId),
      this.livestockRepository.findUpcomingBirths(
        request.farmId,
        request.daysAheadForUpcoming || 30
      ),
      this.livestockRepository.findBreedingRecordsByFarm(request.farmId)
    ]);

    // Calculate births this year
    const currentYear = new Date().getFullYear();
    const birthsThisYear = allBreedingRecords.filter(
      (record) =>
        record.actualBirthDate &&
        record.actualBirthDate.getFullYear() === currentYear
    );

    // Calculate average gestation days
    const completedPregnancies = allBreedingRecords.filter(
      (record) => record.actualBirthDate
    );
    const averageGestationDays =
      completedPregnancies.length > 0
        ? completedPregnancies.reduce((sum, record) => {
            const gestationDays = record.getGestationDays();
            return sum + (gestationDays || 0);
          }, 0) / completedPregnancies.length
        : 0;

    // Calculate pregnancy success rate
    const totalPregnancies = allBreedingRecords.length;
    const successfulPregnancies = allBreedingRecords.filter(
      (record) => record.pregnancyStatus === 'birthed'
    ).length;
    const pregnancySuccessRate =
      totalPregnancies > 0
        ? (successfulPregnancies / totalPregnancies) * 100
        : 0;

    return {
      totalActivePregnancies: activePregnancies.length,
      overduePregnancies: overduePregnancies.length,
      upcomingBirths: upcomingBirths.length,
      totalBirthsThisYear: birthsThisYear.length,
      averageGestationDays: Math.round(averageGestationDays),
      pregnancySuccessRate: Math.round(pregnancySuccessRate * 100) / 100,
      activePregnancies,
      overduePregnanciesList: overduePregnancies,
      upcomingBirthsList: upcomingBirths
    };
  }
}
