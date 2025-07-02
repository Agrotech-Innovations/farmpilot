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
})
  .validator((data: unknown) => {
    return createLivestockGroupSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const createLivestockGroupUseCase =
        container.get<CreateLivestockGroupUseCase>(
          'createLivestockGroupUseCase'
        );

      const group = await createLivestockGroupUseCase.execute(data);

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
})
  .validator((data: unknown) => {
    return addLivestockAnimalSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const addLivestockAnimalUseCase =
        container.get<AddLivestockAnimalUseCase>('addLivestockAnimalUseCase');

      const animal = await addLivestockAnimalUseCase.execute(data);

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
})
  .validator((data: unknown) => {
    return listGroupsByFarmSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const livestockRepository = container.get<LivestockRepository>(
        'livestockRepository'
      );

      const groups = await livestockRepository.findGroupsByFarm(data.farmId);

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
})
  .validator((data: unknown) => {
    return listAnimalsByGroupSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const livestockRepository = container.get<LivestockRepository>(
        'livestockRepository'
      );

      const animals = await livestockRepository.findAnimalsByGroup(
        data.groupId
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
  .validator((farmId: string) => {
    return listAnimalsByFarmSchema.parse({farmId: farmId});
  })
  .handler(async ({data}) => {
    const listAnimalsByFarmUseCase = container.get<ListAnimalsByFarmUseCase>(
      'listAnimalsByFarmUseCase'
    );

    return await listAnimalsByFarmUseCase
      .execute({
        farmId: data.farmId
      })
      .then((result) => {
        return {
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
        };
      })
      .catch((error) => {
        throw new Error('Failed to list animals by farm');
      });
  });

export const updateAnimalHealth = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return updateAnimalHealthSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const updateAnimalHealthStatusUseCase =
        container.get<UpdateAnimalHealthStatusUseCase>(
          'updateAnimalHealthStatusUseCase'
        );

      const updatedAnimal = await updateAnimalHealthStatusUseCase.execute({
        animalId: data.animalId,
        healthStatus: data.healthStatus
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
})
  .validator((data: unknown) => {
    return updateAnimalWeightSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const updateAnimalWeightUseCase =
        container.get<UpdateAnimalWeightUseCase>('updateAnimalWeightUseCase');

      const result = await updateAnimalWeightUseCase.execute({
        animalId: data.animalId,
        weight: data.weight,
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
})
  .validator((data: unknown) => {
    return createHealthRecordSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const createHealthRecordUseCase =
        container.get<CreateHealthRecordUseCase>('createHealthRecordUseCase');

      const healthRecord = await createHealthRecordUseCase.execute({
        animalId: data.animalId,
        recordType: data.recordType,
        description: data.description,
        treatment: data.treatment,
        medication: data.medication,
        dosage: data.dosage,
        veterinarian: data.veterinarian,
        cost: data.cost,
        notes: data.notes
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
})
  .validator((data: unknown) => {
    return getHealthRecordsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getHealthRecordsUseCase = container.get<GetHealthRecordsUseCase>(
        'getHealthRecordsUseCase'
      );

      const result = await getHealthRecordsUseCase.execute({
        animalId: data.animalId
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
          error instanceof Error
            ? error.message
            : 'Failed to get health records'
      };
    }
  });

export const getLivestockAnalytics = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getAnalyticsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getLivestockHealthAnalyticsUseCase =
        container.get<GetLivestockHealthAnalyticsUseCase>(
          'getLivestockHealthAnalyticsUseCase'
        );

      const analytics = await getLivestockHealthAnalyticsUseCase.execute({
        farmId: data.farmId,
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
})
  .validator((data: unknown) => {
    return z.object({groupId: z.string().min(1)}).parse(data);
  })
  .handler(async ({data}) => {
    try {
      const livestockRepository = container.get<LivestockRepository>(
        'livestockRepository'
      );

      // Check if group has animals
      const animals = await livestockRepository.findAnimalsByGroup(
        data.groupId
      );
      if (animals.length > 0) {
        throw new Error(
          'Cannot delete group with animals. Please remove all animals first.'
        );
      }

      await livestockRepository.deleteGroup(data.groupId);

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
})
  .validator((data: unknown) => {
    return z.object({animalId: z.string().min(1)}).parse(data);
  })
  .handler(async ({data}) => {
    try {
      const livestockRepository = container.get<LivestockRepository>(
        'livestockRepository'
      );

      // Get animal to update group count
      const animal = await livestockRepository.findAnimalById(data.animalId);
      if (!animal) {
        throw new Error('Animal not found');
      }

      // Delete the animal
      await livestockRepository.deleteAnimal(data.animalId);

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
})
  .validator((data: unknown) => {
    return z
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
  })
  .handler(async ({data}) => {
    try {
      const scheduleVaccinationUseCase = container.get<
        import('@/core/application/use-cases/livestock').ScheduleVaccinationUseCase
      >('scheduleVaccinationUseCase');

      const vaccinationRecord = await scheduleVaccinationUseCase.execute({
        animalId: data.animalId,
        vaccinationType: data.vaccinationType,
        description: data.description,
        scheduledDate: data.scheduledDate,
        veterinarian: data.veterinarian,
        cost: data.cost,
        notes: data.notes
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
})
  .validator((data: unknown) => {
    return z
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
  })
  .handler(async ({data}) => {
    try {
      const recordTreatmentUseCase = container.get<
        import('@/core/application/use-cases/livestock').RecordTreatmentUseCase
      >('recordTreatmentUseCase');

      const result = await recordTreatmentUseCase.execute({
        animalId: data.animalId,
        description: data.description,
        treatment: data.treatment,
        medication: data.medication,
        dosage: data.dosage,
        veterinarian: data.veterinarian,
        cost: data.cost,
        notes: data.notes,
        updateHealthStatus: data.updateHealthStatus,
        newHealthStatus: data.newHealthStatus
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
})
  .validator((data: unknown) => {
    return z
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
  })
  .handler(async ({data}) => {
    try {
      const getAnimalHealthHistoryUseCase = container.get<
        import('@/core/application/use-cases/livestock').GetAnimalHealthHistoryUseCase
      >('getAnimalHealthHistoryUseCase');

      const history = await getAnimalHealthHistoryUseCase.execute({
        animalId: data.animalId,
        recordType: data.recordType,
        startDate: data.startDate,
        endDate: data.endDate
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
})
  .validator((data: unknown) => {
    return z
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
  })
  .handler(async ({data}) => {
    try {
      const createVaccinationScheduleUseCase = container.get<
        import('@/core/application/use-cases/livestock').CreateVaccinationScheduleUseCase
      >('createVaccinationScheduleUseCase');

      const result = await createVaccinationScheduleUseCase.execute({
        animalIds: data.animalIds || [],
        groupId: data.groupId,
        scheduleItems: data.scheduleItems,
        autoScheduleNext: data.autoScheduleNext
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
})
  .validator((data: unknown) => {
    return z
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
  })
  .handler(async ({data}) => {
    try {
      const getVaccinationScheduleUseCase = container.get<
        import('@/core/application/use-cases/livestock').GetVaccinationScheduleUseCase
      >('getVaccinationScheduleUseCase');

      const result = await getVaccinationScheduleUseCase.execute(data);

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
})
  .validator((data: unknown) => {
    return z
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
  })
  .handler(async ({data}) => {
    try {
      const updateVaccinationStatusUseCase = container.get<
        import('@/core/application/use-cases/livestock').UpdateVaccinationStatusUseCase
      >('updateVaccinationStatusUseCase');

      const result = await updateVaccinationStatusUseCase.execute(data);

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
})
  .validator((data: unknown) => {
    return z
      .object({
        farmId: z.string().min(1),
        daysAhead: z.number().min(1).optional(),
        includeOverdue: z.boolean().optional(),
        vaccinationType: z.string().optional(),
        priorityLevel: z.enum(['high', 'medium', 'low', 'all']).optional()
      })
      .parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getVaccinationRemindersUseCase = container.get<
        import('@/core/application/use-cases/livestock').GetVaccinationRemindersUseCase
      >('getVaccinationRemindersUseCase');

      const result = await getVaccinationRemindersUseCase.execute(data);

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
})
  .validator((data: unknown) => {
    return z
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
  })
  .handler(async ({data}) => {
    try {
      const bulkScheduleVaccinationsUseCase = container.get<
        import('@/core/application/use-cases/livestock').BulkScheduleVaccinationsUseCase
      >('bulkScheduleVaccinationsUseCase');

      const result = await bulkScheduleVaccinationsUseCase.execute(data);

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
