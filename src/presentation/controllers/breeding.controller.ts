import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {
  CreateBreedingRecordUseCase,
  UpdatePregnancyStatusUseCase,
  GetBreedingRecordsUseCase,
  GetBreedingAnalyticsUseCase,
  DeleteBreedingRecordUseCase
} from '@/core/application/use-cases/livestock';
import {z} from 'zod';

// Validation schemas
const createBreedingRecordSchema = z.object({
  motherAnimalId: z.string().min(1),
  fatherAnimalId: z.string().optional(),
  breedingDate: z.string().transform((val) => new Date(val)),
  expectedBirthDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  notes: z.string().optional()
});

const updatePregnancyStatusSchema = z.object({
  breedingRecordId: z.string().min(1),
  pregnancyStatus: z.enum(['bred', 'confirmed', 'aborted', 'birthed']),
  actualBirthDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  offspringCount: z.number().min(0).optional()
});

const getBreedingRecordsSchema = z
  .object({
    farmId: z.string().optional(),
    motherAnimalId: z.string().optional()
  })
  .refine((data) => data.farmId || data.motherAnimalId, {
    message: 'Either farmId or motherAnimalId must be provided'
  });

const getBreedingAnalyticsSchema = z.object({
  farmId: z.string().min(1),
  daysAheadForUpcoming: z.number().min(1).optional()
});

const deleteBreedingRecordSchema = z.object({
  breedingRecordId: z.string().min(1)
});

// Server functions
export const createBreedingRecord = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return createBreedingRecordSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const useCase = container.get<CreateBreedingRecordUseCase>(
        'createBreedingRecordUseCase'
      );

      const record = await useCase.execute(data);

      return {
        success: true,
        data: {
          id: record.id,
          motherAnimalId: record.motherAnimalId,
          fatherAnimalId: record.fatherAnimalId,
          breedingDate: record.breedingDate,
          expectedBirthDate: record.expectedBirthDate,
          actualBirthDate: record.actualBirthDate,
          pregnancyStatus: record.pregnancyStatus,
          offspringCount: record.offspringCount,
          notes: record.notes,
          gestationDays: record.getGestationDays(),
          isPregnant: record.isPregnant(),
          hasGivenBirth: record.hasGivenBirth(),
          isOverdue: record.isOverdue(),
          createdAt: record.createdAt,
          updatedAt: record.updatedAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create breeding record'
      };
    }
  });

export const updatePregnancyStatus = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return updatePregnancyStatusSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const useCase = container.get<UpdatePregnancyStatusUseCase>(
        'updatePregnancyStatusUseCase'
      );

      const record = await useCase.execute(data);

      return {
        success: true,
        data: {
          id: record.id,
          motherAnimalId: record.motherAnimalId,
          fatherAnimalId: record.fatherAnimalId,
          breedingDate: record.breedingDate,
          expectedBirthDate: record.expectedBirthDate,
          actualBirthDate: record.actualBirthDate,
          pregnancyStatus: record.pregnancyStatus,
          offspringCount: record.offspringCount,
          notes: record.notes,
          gestationDays: record.getGestationDays(),
          isPregnant: record.isPregnant(),
          hasGivenBirth: record.hasGivenBirth(),
          isOverdue: record.isOverdue(),
          createdAt: record.createdAt,
          updatedAt: record.updatedAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update pregnancy status'
      };
    }
  });

export const getBreedingRecords = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getBreedingRecordsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const useCase = container.get<GetBreedingRecordsUseCase>(
        'getBreedingRecordsUseCase'
      );

      const records = await useCase.execute(data);

      return {
        success: true,
        data: {
          records: records.map((record) => ({
            id: record.id,
            motherAnimalId: record.motherAnimalId,
            fatherAnimalId: record.fatherAnimalId,
            breedingDate: record.breedingDate,
            expectedBirthDate: record.expectedBirthDate,
            actualBirthDate: record.actualBirthDate,
            pregnancyStatus: record.pregnancyStatus,
            offspringCount: record.offspringCount,
            notes: record.notes,
            gestationDays: record.getGestationDays(),
            isPregnant: record.isPregnant(),
            hasGivenBirth: record.hasGivenBirth(),
            isOverdue: record.isOverdue(),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get breeding records'
      };
    }
  });

export const getBreedingAnalytics = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getBreedingAnalyticsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const useCase = container.get<GetBreedingAnalyticsUseCase>(
        'getBreedingAnalyticsUseCase'
      );

      const analytics = await useCase.execute(data);

      return {
        success: true,
        data: {
          totalActivePregnancies: analytics.totalActivePregnancies,
          overduePregnancies: analytics.overduePregnancies,
          upcomingBirths: analytics.upcomingBirths,
          totalBirthsThisYear: analytics.totalBirthsThisYear,
          averageGestationDays: analytics.averageGestationDays,
          pregnancySuccessRate: analytics.pregnancySuccessRate,
          activePregnancies: analytics.activePregnancies.map((record) => ({
            id: record.id,
            motherAnimalId: record.motherAnimalId,
            fatherAnimalId: record.fatherAnimalId,
            breedingDate: record.breedingDate,
            expectedBirthDate: record.expectedBirthDate,
            actualBirthDate: record.actualBirthDate,
            pregnancyStatus: record.pregnancyStatus,
            offspringCount: record.offspringCount,
            notes: record.notes,
            gestationDays: record.getGestationDays(),
            isPregnant: record.isPregnant(),
            hasGivenBirth: record.hasGivenBirth(),
            isOverdue: record.isOverdue(),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt
          })),
          overduePregnanciesList: analytics.overduePregnanciesList.map(
            (record) => ({
              id: record.id,
              motherAnimalId: record.motherAnimalId,
              fatherAnimalId: record.fatherAnimalId,
              breedingDate: record.breedingDate,
              expectedBirthDate: record.expectedBirthDate,
              actualBirthDate: record.actualBirthDate,
              pregnancyStatus: record.pregnancyStatus,
              offspringCount: record.offspringCount,
              notes: record.notes,
              gestationDays: record.getGestationDays(),
              isPregnant: record.isPregnant(),
              hasGivenBirth: record.hasGivenBirth(),
              isOverdue: record.isOverdue(),
              createdAt: record.createdAt,
              updatedAt: record.updatedAt
            })
          ),
          upcomingBirthsList: analytics.upcomingBirthsList.map((record) => ({
            id: record.id,
            motherAnimalId: record.motherAnimalId,
            fatherAnimalId: record.fatherAnimalId,
            breedingDate: record.breedingDate,
            expectedBirthDate: record.expectedBirthDate,
            actualBirthDate: record.actualBirthDate,
            pregnancyStatus: record.pregnancyStatus,
            offspringCount: record.offspringCount,
            notes: record.notes,
            gestationDays: record.getGestationDays(),
            isPregnant: record.isPregnant(),
            hasGivenBirth: record.hasGivenBirth(),
            isOverdue: record.isOverdue(),
            createdAt: record.createdAt,
            updatedAt: record.updatedAt
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get breeding analytics'
      };
    }
  });

export const deleteBreedingRecord = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return deleteBreedingRecordSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const useCase = container.get<DeleteBreedingRecordUseCase>(
        'deleteBreedingRecordUseCase'
      );

      await useCase.execute(data);

      return {
        success: true,
        message: 'Breeding record deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete breeding record'
      };
    }
  });
