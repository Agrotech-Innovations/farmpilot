import {createServerFn} from '@tanstack/react-start';
import {container} from '../../infrastructure/di/container';
import {
  CreateFarmUseCase,
  ListFarmsUseCase
} from '../../core/application/use-cases/farm';
import {z} from 'zod';

// Validation schemas
const createFarmSchema = z.object({
  organizationId: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  totalAcres: z.number().min(0).optional(),
  farmType: z.enum(['crop', 'livestock', 'mixed', 'organic']).optional()
});

const listFarmsSchema = z.object({
  organizationId: z.string(),
  limit: z.number().int().min(1).max(100).optional(),
  offset: z.number().int().min(0).optional()
});

// Server functions
export const createFarm = createServerFn('POST', async (data: unknown) => {
  try {
    const validatedData = createFarmSchema.parse(data);
    const createFarmUseCase =
      container.get<CreateFarmUseCase>('CreateFarmUseCase');

    const result = await createFarmUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        farm: {
          id: result.farm.id,
          name: result.farm.name,
          description: result.farm.description,
          address: result.farm.address,
          latitude: result.farm.latitude,
          longitude: result.farm.longitude,
          totalAcres: result.farm.totalAcres,
          farmType: result.farm.farmType,
          createdAt: result.farm.createdAt
        }
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create farm'
    };
  }
});

export const listFarms = createServerFn('GET', async (data: unknown) => {
  try {
    const validatedData = listFarmsSchema.parse(data);
    const listFarmsUseCase =
      container.get<ListFarmsUseCase>('ListFarmsUseCase');

    const result = await listFarmsUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        farms: result.farms.map((farm) => ({
          id: farm.id,
          name: farm.name,
          description: farm.description,
          address: farm.address,
          latitude: farm.latitude,
          longitude: farm.longitude,
          totalAcres: farm.totalAcres,
          farmType: farm.farmType,
          createdAt: farm.createdAt
        })),
        total: result.total
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list farms'
    };
  }
});
