import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {
  CreateLivestockGroupUseCase,
  AddLivestockAnimalUseCase
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

export const updateAnimalHealth = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = updateAnimalHealthSchema.parse(data);
    const livestockRepository = container.get<LivestockRepository>(
      'livestockRepository'
    );

    const animal = await livestockRepository.findAnimalById(
      validatedData.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    const updatedAnimal = animal.updateHealthStatus(validatedData.healthStatus);
    await livestockRepository.saveAnimal(updatedAnimal);

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
    const livestockRepository = container.get<LivestockRepository>(
      'livestockRepository'
    );

    const animal = await livestockRepository.findAnimalById(
      validatedData.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    const updatedAnimal = animal.updateWeight(validatedData.weight);
    await livestockRepository.saveAnimal(updatedAnimal);

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
          : 'Failed to update animal weight'
    };
  }
});

export const createHealthRecord = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = createHealthRecordSchema.parse(data);
    const livestockRepository = container.get<LivestockRepository>(
      'livestockRepository'
    );

    // Verify animal exists
    const animal = await livestockRepository.findAnimalById(
      validatedData.animalId
    );
    if (!animal) {
      throw new Error('Animal not found');
    }

    const healthRecord = new HealthRecord({
      id: crypto.randomUUID(),
      animalId: validatedData.animalId,
      recordType: validatedData.recordType,
      description: validatedData.description,
      treatment: validatedData.treatment,
      medication: validatedData.medication,
      dosage: validatedData.dosage,
      veterinarian: validatedData.veterinarian,
      cost: validatedData.cost,
      notes: validatedData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await livestockRepository.saveHealthRecord(healthRecord);

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
    const livestockRepository = container.get<LivestockRepository>(
      'livestockRepository'
    );

    const records = await livestockRepository.findHealthRecordsByAnimal(
      validatedData.animalId
    );

    return {
      success: true,
      data: {
        records: records.map((record: HealthRecord) => ({
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
    const livestockRepository = container.get<LivestockRepository>(
      'livestockRepository'
    );

    const [totalAnimals, unhealthyAnimals, upcomingVaccinations] =
      await Promise.all([
        livestockRepository.countAnimalsByFarm(validatedData.farmId),
        livestockRepository.findUnhealthyAnimals(validatedData.farmId),
        livestockRepository.findUpcomingVaccinations(validatedData.farmId, 30)
      ]);

    return {
      success: true,
      data: {
        totalAnimals,
        unhealthyCount: unhealthyAnimals.length,
        upcomingVaccinationsCount: upcomingVaccinations.length,
        unhealthyAnimals: unhealthyAnimals.map((animal: LivestockAnimal) => ({
          id: animal.id,
          tagNumber: animal.tagNumber,
          name: animal.name,
          healthStatus: animal.healthStatus,
          groupId: animal.groupId
        })),
        upcomingVaccinations: upcomingVaccinations.map(
          (record: HealthRecord) => ({
            id: record.id,
            animalId: record.animalId,
            recordType: record.recordType,
            description: record.description,
            createdAt: record.createdAt
          })
        )
      }
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
