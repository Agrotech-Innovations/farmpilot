import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {
  CreateFarmUseCase,
  ListFarmsUseCase
} from '@/core/application/use-cases/farm';
import {Farm} from '@/core/domain/entities';
import {z} from 'zod';

// Validation schemas
const createFarmSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  totalAcres: z.number().min(0).optional(),
  farmType: z.enum(['crop', 'livestock', 'mixed', 'organic']).optional(),
  organizationId: z.string()
});

const listFarmsSchema = z.object({
  organizationId: z.string()
});

// Server functions
export const createFarm = createServerFn({
  method: 'POST'
}).handler(async (data: unknown) => {
  try {
    const validatedData = createFarmSchema.parse(data);
    const createFarmUseCase =
      container.get<CreateFarmUseCase>('createFarmUseCase');

    const result = await createFarmUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        id: result.farm.id,
        name: result.farm.name,
        description: result.farm.description,
        address: result.farm.address,
        latitude: result.farm.latitude,
        longitude: result.farm.longitude,
        totalAcres: result.farm.totalAcres,
        farmType: result.farm.farmType,
        organizationId: result.farm.organizationId,
        createdAt: result.farm.createdAt,
        updatedAt: result.farm.updatedAt
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create farm'
    };
  }
});

export const listFarms = createServerFn({
  method: 'GET'
}).handler(async (data: unknown) => {
  try {
    const validatedData = listFarmsSchema.parse(data);
    const listFarmsUseCase =
      container.get<ListFarmsUseCase>('listFarmsUseCase');

    const result = await listFarmsUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        farms: result.farms.map((farm: Farm) => ({
          id: farm.id,
          name: farm.name,
          description: farm.description,
          address: farm.address,
          latitude: farm.latitude,
          longitude: farm.longitude,
          totalAcres: farm.totalAcres,
          farmType: farm.farmType,
          organizationId: farm.organizationId,
          createdAt: farm.createdAt,
          updatedAt: farm.updatedAt
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list farms'
    };
  }
});
