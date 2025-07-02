import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {
  CreateLivestockGroupUseCase,
  AddLivestockAnimalUseCase,
  ListAnimalsByFarmUseCase,
  CreateHealthRecordUseCase,
  GetHealthRecordsUseCase,
  UpdateAnimalHealthStatusUseCase,
  GetLivestockHealthAnalyticsUseCase,
  UpdateAnimalWeightUseCase
} from '@/core/application/use-cases/livestock';
import {
  LivestockGroup,
  LivestockAnimal,
  HealthRecord
} from '@/core/domain/entities';
import {LivestockRepository} from '@/core/domain/repositories';
import {z} from 'zod';

// Validation schemas
const createLivestockGroupSchema = z.object({
  farmId: z.string().min(1),
  name: z.string().min(1),
  species: z.string().min(1),
  breed: z.string().optional(),
  initialCount: z.number().min(0).optional()
});

const addLivestockAnimalSchema = z.object({
  groupId: z.string().min(1),
  tagNumber: z.string().min(1),
  name: z.string().optional(),
  sex: z.enum(['male', 'female']),
  birthDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  breed: z.string().optional(),
  motherTagNumber: z.string().optional(),
  fatherTagNumber: z.string().optional(),
  currentWeight: z.number().min(0).optional()
});

const listGroupsByFarmSchema = z.object({
  farmId: z.string().min(1)
});

const listAnimalsByGroupSchema = z.object({
  groupId: z.string().min(1)
});

const listAnimalsByFarmSchema = z.object({
  farmId: z.string().min(1)
});

const updateAnimalHealthSchema = z.object({
  animalId: z.string().min(1),
  healthStatus: z.enum(['healthy', 'sick', 'injured', 'deceased'])
});

const updateAnimalWeightSchema = z.object({
  animalId: z.string().min(1),
  weight: z.number().min(0)
});

const createHealthRecordSchema = z.object({
  animalId: z.string().min(1),
  recordType: z.enum([
    'vaccination',
    'treatment',
    'checkup',
    'injury',
    'illness'
  ]),
  description: z.string().min(1),
  treatment: z.string().optional(),
  medication: z.string().optional(),
  dosage: z.string().optional(),
  veterinarian: z.string().optional(),
  cost: z.number().min(0).optional(),
  notes: z.string().optional()
});

const getHealthRecordsSchema = z.object({
  animalId: z.string().min(1)
});

const getAnalyticsSchema = z.object({
  farmId: z.string().min(1)
});

// Server functions
export const createLivestockGroup = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = createLivestockGroupSchema.parse(data);
    const createLivestockGroupUseCase =
      container.get<CreateLivestockGroupUseCase>('createLivestockGroupUseCase');

    const group = await createLivestockGroupUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        id: group.id,
        farmId: group.farmId,
        name: group.name,
        species: group.species,
        breed: group.breed,
        currentCount: group.currentCount,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create livestock group'
    };
  }
});

export const addLivestockAnimal = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = addLivestockAnimalSchema.parse(data);
    const addLivestockAnimalUseCase = container.get<AddLivestockAnimalUseCase>(
      'addLivestockAnimalUseCase'
    );

    const animal = await addLivestockAnimalUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        id: animal.id,
        groupId: animal.groupId,
        tagNumber: animal.tagNumber,
        name: animal.name,
        sex: animal.sex,
        birthDate: animal.birthDate,
        breed: animal.breed,
        motherTagNumber: animal.motherTagNumber,
        fatherTagNumber: animal.fatherTagNumber,
        currentWeight: animal.currentWeight,
        healthStatus: animal.healthStatus,
        age: animal.getAge(),
        isHealthy: animal.isHealthy(),
        createdAt: animal.createdAt,
        updatedAt: animal.updatedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to add livestock animal'
    };
  }
});

export const listLivestockGroups = createServerFn({
  method: 'GET'
}).handler(async (data: unknown) => {
  try {
    const validatedData = listGroupsByFarmSchema.parse(data);
    const livestockRepository = container.get<LivestockRepository>(
      'livestockRepository'
    );

    const groups = await livestockRepository.findGroupsByFarm(
      validatedData.farmId
    );

    return {
      success: true,
      data: {
        groups: groups.map((group: LivestockGroup) => ({
          id: group.id,
          farmId: group.farmId,
          name: group.name,
          species: group.species,
          breed: group.breed,
          currentCount: group.currentCount,
          createdAt: group.createdAt,
          updatedAt: group.updatedAt
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to list livestock groups'
    };
  }
});

export const listLivestockAnimals = createServerFn({
  method: 'GET'
}).handler(async (data: unknown) => {
  try {
    const validatedData = listAnimalsByGroupSchema.parse(data);
    const livestockRepository = container.get<LivestockRepository>(
      'livestockRepository'
    );

    const animals = await livestockRepository.findAnimalsByGroup(
      validatedData.groupId
    );

    return {
      success: true,
      data: {
        animals: animals.map((animal: LivestockAnimal) => ({
          id: animal.id,
          groupId: animal.groupId,
          tagNumber: animal.tagNumber,
          name: animal.name,
          sex: animal.sex,
          birthDate: animal.birthDate,
          breed: animal.breed,
          motherTagNumber: animal.motherTagNumber,
          fatherTagNumber: animal.fatherTagNumber,
          currentWeight: animal.currentWeight,
          healthStatus: animal.healthStatus,
          age: animal.getAge(),
          isHealthy: animal.isHealthy(),
          createdAt: animal.createdAt,
          updatedAt: animal.updatedAt
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to list livestock animals'
    };
  }
});

export const listAnimalsByFarm = createServerFn({
  method: 'GET'
})
  .validator((farmId: string) => farmId)
  .handler(async ({data}) => {
    try {
      const validatedData = listAnimalsByFarmSchema.parse(data);
      const listAnimalsByFarmUseCase = container.get<ListAnimalsByFarmUseCase>(
        'listAnimalsByFarmUseCase'
      );

      const result = await listAnimalsByFarmUseCase.execute({
        farmId: validatedData.farmId
      });

      return {
        success: true,
        data: {
          animals: result.animals.map((animal: LivestockAnimal) => ({
            id: animal.id,
            groupId: animal.groupId,
            tagNumber: animal.tagNumber,
            name: animal.name,
            sex: animal.sex,
            birthDate: animal.birthDate,
            breed: animal.breed,
            motherTagNumber: animal.motherTagNumber,
            fatherTagNumber: animal.fatherTagNumber,
            currentWeight: animal.currentWeight,
            healthStatus: animal.healthStatus,
            age: animal.getAge(),
            isHealthy: animal.isHealthy(),
            createdAt: animal.createdAt,
            updatedAt: animal.updatedAt
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to list animals by farm'
      };
    }
  });

export const updateAnimalHealth = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = updateAnimalHealthSchema.parse(data);
    const updateAnimalHealthStatusUseCase =
      container.get<UpdateAnimalHealthStatusUseCase>(
        'updateAnimalHealthStatusUseCase'
      );

    const updatedAnimal = await updateAnimalHealthStatusUseCase.execute({
      animalId: validatedData.animalId,
      healthStatus: validatedData.healthStatus
    });

    return {
      success: true,
      data: {
        id: updatedAnimal.id,
        groupId: updatedAnimal.groupId,
        tagNumber: updatedAnimal.tagNumber,
        name: updatedAnimal.name,
        sex: updatedAnimal.sex,
        birthDate: updatedAnimal.birthDate,
        breed: updatedAnimal.breed,
        motherTagNumber: updatedAnimal.motherTagNumber,
        fatherTagNumber: updatedAnimal.fatherTagNumber,
        currentWeight: updatedAnimal.currentWeight,
        healthStatus: updatedAnimal.healthStatus,
        age: updatedAnimal.getAge(),
        isHealthy: updatedAnimal.isHealthy(),
        createdAt: updatedAnimal.createdAt,
        updatedAt: updatedAnimal.updatedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update animal health status'
    };
  }
});

export const updateAnimalWeight = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = updateAnimalWeightSchema.parse(data);
    const updateAnimalWeightUseCase = container.get<UpdateAnimalWeightUseCase>(
      'updateAnimalWeightUseCase'
    );

    const result = await updateAnimalWeightUseCase.execute({
      animalId: validatedData.animalId,
      weight: validatedData.weight,
      createHealthRecord: true
    });

    return {
      success: true,
      data: {
        id: result.updatedAnimal.id,
        groupId: result.updatedAnimal.groupId,
        tagNumber: result.updatedAnimal.tagNumber,
        name: result.updatedAnimal.name,
        sex: result.updatedAnimal.sex,
        birthDate: result.updatedAnimal.birthDate,
        breed: result.updatedAnimal.breed,
        motherTagNumber: result.updatedAnimal.motherTagNumber,
        fatherTagNumber: result.updatedAnimal.fatherTagNumber,
        currentWeight: result.updatedAnimal.currentWeight,
        healthStatus: result.updatedAnimal.healthStatus,
        age: result.updatedAnimal.getAge(),
        isHealthy: result.updatedAnimal.isHealthy(),
        createdAt: result.updatedAnimal.createdAt,
        updatedAt: result.updatedAnimal.updatedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update animal weight'
    };
  }
});

export const createHealthRecord = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = createHealthRecordSchema.parse(data);
    const createHealthRecordUseCase = container.get<CreateHealthRecordUseCase>(
      'createHealthRecordUseCase'
    );

    const healthRecord = await createHealthRecordUseCase.execute({
      animalId: validatedData.animalId,
      recordType: validatedData.recordType,
      description: validatedData.description,
      treatment: validatedData.treatment,
      medication: validatedData.medication,
      dosage: validatedData.dosage,
      veterinarian: validatedData.veterinarian,
      cost: validatedData.cost,
      notes: validatedData.notes
    });

    return {
      success: true,
      data: {
        id: healthRecord.id,
        animalId: healthRecord.animalId,
        recordType: healthRecord.recordType,
        description: healthRecord.description,
        treatment: healthRecord.treatment,
        medication: healthRecord.medication,
        dosage: healthRecord.dosage,
        veterinarian: healthRecord.veterinarian,
        cost: healthRecord.cost,
        notes: healthRecord.notes,
        createdAt: healthRecord.createdAt,
        updatedAt: healthRecord.updatedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create health record'
    };
  }
});

export const getHealthRecords = createServerFn({
  method: 'GET'
}).handler(async (data: unknown) => {
  try {
    const validatedData = getHealthRecordsSchema.parse(data);
    const getHealthRecordsUseCase = container.get<GetHealthRecordsUseCase>(
      'getHealthRecordsUseCase'
    );

    const result = await getHealthRecordsUseCase.execute({
      animalId: validatedData.animalId
    });

    return {
      success: true,
      data: {
        records: result.records.map((record: HealthRecord) => ({
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
          createdAt: record.createdAt,
          updatedAt: record.updatedAt
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get health records'
    };
  }
});

export const getLivestockAnalytics = createServerFn({
  method: 'GET'
}).handler(async (data: unknown) => {
  try {
    const validatedData = getAnalyticsSchema.parse(data);
    const getLivestockHealthAnalyticsUseCase =
      container.get<GetLivestockHealthAnalyticsUseCase>(
        'getLivestockHealthAnalyticsUseCase'
      );

    const analytics = await getLivestockHealthAnalyticsUseCase.execute({
      farmId: validatedData.farmId,
      daysAhead: 30
    });

    return {
      success: true,
      data: analytics
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get livestock analytics'
    };
  }
});

export const deleteLivestockGroup = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const {groupId} = z.object({groupId: z.string().min(1)}).parse(data);
    const livestockRepository = container.get<LivestockRepository>(
      'livestockRepository'
    );

    // Check if group has animals
    const animals = await livestockRepository.findAnimalsByGroup(groupId);
    if (animals.length > 0) {
      throw new Error(
        'Cannot delete group with animals. Please remove all animals first.'
      );
    }

    await livestockRepository.deleteGroup(groupId);

    return {
      success: true,
      message: 'Livestock group deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete livestock group'
    };
  }
});

export const deleteLivestockAnimal = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const {animalId} = z.object({animalId: z.string().min(1)}).parse(data);
    const livestockRepository = container.get<LivestockRepository>(
      'livestockRepository'
    );

    // Get animal to update group count
    const animal = await livestockRepository.findAnimalById(animalId);
    if (!animal) {
      throw new Error('Animal not found');
    }

    // Delete the animal
    await livestockRepository.deleteAnimal(animalId);

    // Update group count
    const group = await livestockRepository.findGroupById(animal.groupId);
    if (group && group.currentCount > 0) {
      const updatedGroup = group.updateCount(group.currentCount - 1);
      await livestockRepository.saveGroup(updatedGroup);
    }

    return {
      success: true,
      message: 'Livestock animal deleted successfully'
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete livestock animal'
    };
  }
});

export const scheduleVaccination = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = z
      .object({
        animalId: z.string().min(1),
        vaccinationType: z.string().min(1),
        description: z.string().min(1),
        scheduledDate: z
          .string()
          .optional()
          .transform((val) => (val ? new Date(val) : undefined)),
        veterinarian: z.string().optional(),
        cost: z.number().min(0).optional(),
        notes: z.string().optional()
      })
      .parse(data);

    const scheduleVaccinationUseCase = container.get<
      import('@/core/application/use-cases/livestock').ScheduleVaccinationUseCase
    >('scheduleVaccinationUseCase');

    const vaccinationRecord = await scheduleVaccinationUseCase.execute({
      animalId: validatedData.animalId,
      vaccinationType: validatedData.vaccinationType,
      description: validatedData.description,
      scheduledDate: validatedData.scheduledDate,
      veterinarian: validatedData.veterinarian,
      cost: validatedData.cost,
      notes: validatedData.notes
    });

    return {
      success: true,
      data: {
        id: vaccinationRecord.id,
        animalId: vaccinationRecord.animalId,
        recordType: vaccinationRecord.recordType,
        description: vaccinationRecord.description,
        veterinarian: vaccinationRecord.veterinarian,
        cost: vaccinationRecord.cost,
        notes: vaccinationRecord.notes,
        createdAt: vaccinationRecord.createdAt,
        updatedAt: vaccinationRecord.updatedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to schedule vaccination'
    };
  }
});

export const recordTreatment = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = z
      .object({
        animalId: z.string().min(1),
        description: z.string().min(1),
        treatment: z.string().min(1),
        medication: z.string().optional(),
        dosage: z.string().optional(),
        veterinarian: z.string().optional(),
        cost: z.number().min(0).optional(),
        notes: z.string().optional(),
        updateHealthStatus: z.boolean().optional(),
        newHealthStatus: z
          .enum(['healthy', 'sick', 'injured', 'deceased'])
          .optional()
      })
      .parse(data);

    const recordTreatmentUseCase = container.get<
      import('@/core/application/use-cases/livestock').RecordTreatmentUseCase
    >('recordTreatmentUseCase');

    const result = await recordTreatmentUseCase.execute({
      animalId: validatedData.animalId,
      description: validatedData.description,
      treatment: validatedData.treatment,
      medication: validatedData.medication,
      dosage: validatedData.dosage,
      veterinarian: validatedData.veterinarian,
      cost: validatedData.cost,
      notes: validatedData.notes,
      updateHealthStatus: validatedData.updateHealthStatus,
      newHealthStatus: validatedData.newHealthStatus
    });

    return {
      success: true,
      data: {
        healthRecord: {
          id: result.healthRecord.id,
          animalId: result.healthRecord.animalId,
          recordType: result.healthRecord.recordType,
          description: result.healthRecord.description,
          treatment: result.healthRecord.treatment,
          medication: result.healthRecord.medication,
          dosage: result.healthRecord.dosage,
          veterinarian: result.healthRecord.veterinarian,
          cost: result.healthRecord.cost,
          notes: result.healthRecord.notes,
          createdAt: result.healthRecord.createdAt,
          updatedAt: result.healthRecord.updatedAt
        },
        updatedAnimal: result.updatedAnimal
          ? {
              id: result.updatedAnimal.id,
              tagNumber: result.updatedAnimal.tagNumber,
              name: result.updatedAnimal.name,
              healthStatus: result.updatedAnimal.healthStatus,
              groupId: result.updatedAnimal.groupId
            }
          : undefined
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to record treatment'
    };
  }
});

export const getAnimalHealthHistory = createServerFn({
  method: 'GET'
}).handler(async (data: unknown) => {
  try {
    const validatedData = z
      .object({
        animalId: z.string().min(1),
        recordType: z
          .enum(['vaccination', 'treatment', 'checkup', 'injury', 'illness'])
          .optional(),
        startDate: z
          .string()
          .optional()
          .transform((val) => (val ? new Date(val) : undefined)),
        endDate: z
          .string()
          .optional()
          .transform((val) => (val ? new Date(val) : undefined))
      })
      .parse(data);

    const getAnimalHealthHistoryUseCase = container.get<
      import('@/core/application/use-cases/livestock').GetAnimalHealthHistoryUseCase
    >('getAnimalHealthHistoryUseCase');

    const history = await getAnimalHealthHistoryUseCase.execute({
      animalId: validatedData.animalId,
      recordType: validatedData.recordType,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate
    });

    return {
      success: true,
      data: {
        animal: history.animal,
        healthRecords: history.healthRecords.map((record) => ({
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
          createdAt: record.createdAt,
          updatedAt: record.updatedAt
        })),
        summary: history.summary
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get animal health history'
    };
  }
});

export const createVaccinationSchedule = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = z
      .object({
        animalIds: z.array(z.string().min(1)).optional(),
        groupId: z.string().min(1).optional(),
        scheduleItems: z.array(
          z.object({
            vaccinationType: z.string().min(1),
            description: z.string().min(1),
            intervalDays: z.number().min(1),
            initialDate: z.string().transform((val) => new Date(val)),
            veterinarian: z.string().optional(),
            estimatedCost: z.number().min(0).optional(),
            notes: z.string().optional()
          })
        ),
        autoScheduleNext: z.boolean().optional()
      })
      .refine((data) => data.animalIds || data.groupId, {
        message: 'Either animalIds or groupId must be provided'
      })
      .parse(data);

    const createVaccinationScheduleUseCase = container.get<
      import('@/core/application/use-cases/livestock').CreateVaccinationScheduleUseCase
    >('createVaccinationScheduleUseCase');

    const result = await createVaccinationScheduleUseCase.execute({
      animalIds: validatedData.animalIds || [],
      groupId: validatedData.groupId,
      scheduleItems: validatedData.scheduleItems,
      autoScheduleNext: validatedData.autoScheduleNext
    });

    return {
      success: true,
      data: {
        scheduledVaccinations: result.scheduledVaccinations.map((record) => ({
          id: record.id,
          animalId: record.animalId,
          recordType: record.recordType,
          description: record.description,
          veterinarian: record.veterinarian,
          cost: record.cost,
          notes: record.notes,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt
        })),
        totalAnimalsScheduled: result.totalAnimalsScheduled,
        nextScheduledDates: result.nextScheduledDates
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create vaccination schedule'
    };
  }
});

export const getVaccinationSchedule = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = z
      .object({
        animalId: z.string().min(1).optional(),
        groupId: z.string().min(1).optional(),
        farmId: z.string().min(1).optional(),
        vaccinationType: z.string().optional(),
        daysAhead: z.number().min(1).optional(),
        includeCompleted: z.boolean().optional()
      })
      .refine((data) => data.animalId || data.groupId || data.farmId, {
        message: 'Either animalId, groupId, or farmId must be provided'
      })
      .parse(data);

    const getVaccinationScheduleUseCase = container.get<
      import('@/core/application/use-cases/livestock').GetVaccinationScheduleUseCase
    >('getVaccinationScheduleUseCase');

    const result = await getVaccinationScheduleUseCase.execute(validatedData);

    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get vaccination schedule'
    };
  }
});

export const updateVaccinationStatus = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = z
      .object({
        vaccinationRecordId: z.string().min(1),
        status: z.enum(['completed', 'rescheduled', 'cancelled']),
        completedDate: z
          .string()
          .optional()
          .transform((val) => (val ? new Date(val) : undefined)),
        rescheduledDate: z
          .string()
          .optional()
          .transform((val) => (val ? new Date(val) : undefined)),
        actualVeterinarian: z.string().optional(),
        actualCost: z.number().min(0).optional(),
        completionNotes: z.string().optional(),
        scheduleNextVaccination: z.boolean().optional(),
        nextVaccinationIntervalDays: z.number().min(1).optional()
      })
      .parse(data);

    const updateVaccinationStatusUseCase = container.get<
      import('@/core/application/use-cases/livestock').UpdateVaccinationStatusUseCase
    >('updateVaccinationStatusUseCase');

    const result = await updateVaccinationStatusUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        updatedRecord: {
          id: result.updatedRecord.id,
          animalId: result.updatedRecord.animalId,
          recordType: result.updatedRecord.recordType,
          description: result.updatedRecord.description,
          veterinarian: result.updatedRecord.veterinarian,
          cost: result.updatedRecord.cost,
          notes: result.updatedRecord.notes,
          createdAt: result.updatedRecord.createdAt,
          updatedAt: result.updatedRecord.updatedAt
        },
        nextVaccinationRecord: result.nextVaccinationRecord
          ? {
              id: result.nextVaccinationRecord.id,
              animalId: result.nextVaccinationRecord.animalId,
              recordType: result.nextVaccinationRecord.recordType,
              description: result.nextVaccinationRecord.description,
              veterinarian: result.nextVaccinationRecord.veterinarian,
              cost: result.nextVaccinationRecord.cost,
              notes: result.nextVaccinationRecord.notes,
              createdAt: result.nextVaccinationRecord.createdAt,
              updatedAt: result.nextVaccinationRecord.updatedAt
            }
          : undefined
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update vaccination status'
    };
  }
});

export const getVaccinationReminders = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = z
      .object({
        farmId: z.string().min(1),
        daysAhead: z.number().min(1).optional(),
        includeOverdue: z.boolean().optional(),
        vaccinationType: z.string().optional(),
        priorityLevel: z.enum(['high', 'medium', 'low', 'all']).optional()
      })
      .parse(data);

    const getVaccinationRemindersUseCase = container.get<
      import('@/core/application/use-cases/livestock').GetVaccinationRemindersUseCase
    >('getVaccinationRemindersUseCase');

    const result = await getVaccinationRemindersUseCase.execute(validatedData);

    return {
      success: true,
      data: result
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to get vaccination reminders'
    };
  }
});

export const bulkScheduleVaccinations = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = z
      .object({
        farmId: z.string().min(1).optional(),
        groupIds: z.array(z.string().min(1)).optional(),
        animalIds: z.array(z.string().min(1)).optional(),
        vaccinationSchedules: z.array(
          z.object({
            vaccinationType: z.string().min(1),
            description: z.string().min(1),
            scheduledDate: z.string().transform((val) => new Date(val)),
            veterinarian: z.string().optional(),
            estimatedCost: z.number().min(0).optional(),
            notes: z.string().optional()
          })
        ),
        filterCriteria: z
          .object({
            species: z.string().optional(),
            breed: z.string().optional(),
            ageMinDays: z.number().min(0).optional(),
            ageMaxDays: z.number().min(0).optional(),
            healthStatus: z
              .array(z.enum(['healthy', 'sick', 'injured', 'deceased']))
              .optional()
          })
          .optional(),
        skipIfRecentlyVaccinated: z.boolean().optional(),
        recentVaccinationDays: z.number().min(1).optional()
      })
      .refine((data) => data.farmId || data.groupIds || data.animalIds, {
        message: 'Either farmId, groupIds, or animalIds must be provided'
      })
      .parse(data);

    const bulkScheduleVaccinationsUseCase = container.get<
      import('@/core/application/use-cases/livestock').BulkScheduleVaccinationsUseCase
    >('bulkScheduleVaccinationsUseCase');

    const result = await bulkScheduleVaccinationsUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        results: result.results.map((item) => ({
          animalId: item.animalId,
          animalTagNumber: item.animalTagNumber,
          animalName: item.animalName,
          groupId: item.groupId,
          scheduledVaccinations: item.scheduledVaccinations.map((record) => ({
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
            createdAt: record.createdAt,
            updatedAt: record.updatedAt
          })),
          skippedVaccinations: item.skippedVaccinations,
          errors: item.errors
        })),
        totalAnimalsProcessed: result.totalAnimalsProcessed,
        totalVaccinationsScheduled: result.totalVaccinationsScheduled,
        totalSkipped: result.totalSkipped,
        totalErrors: result.totalErrors,
        summary: result.summary
      }
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to bulk schedule vaccinations'
    };
  }
});
