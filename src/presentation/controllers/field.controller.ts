import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {
  CreateFieldUseCase,
  ListFieldsUseCase
} from '@/core/application/use-cases/field';
import {z} from 'zod';

// Validation schemas
const createFieldSchema = z.object({
  farmId: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  acres: z.number().min(0),
  soilType: z.string().optional(),
  coordinates: z.string().optional()
});

const listFieldsSchema = z.object({
  farmId: z.string().min(1)
});

export const createField = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return createFieldSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const useCase = container.get<CreateFieldUseCase>('createFieldUseCase');
      const result = await useCase.execute(data);

      return {
        success: true,
        data: {
          id: result.field.id,
          farmId: result.field.farmId,
          name: result.field.name,
          description: result.field.description,
          acres: result.field.acres,
          soilType: result.field.soilType,
          coordinates: result.field.coordinates,
          createdAt: result.field.createdAt,
          updatedAt: result.field.updatedAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create field'
      };
    }
  });

export const listFields = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return listFieldsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const useCase = container.get<ListFieldsUseCase>('listFieldsUseCase');
      const result = await useCase.execute(data);

      return {
        success: true,
        data: {
          fields: result.fields.map((field) => ({
            id: field.id,
            farmId: field.farmId,
            name: field.name,
            description: field.description,
            acres: field.acres,
            soilType: field.soilType,
            coordinates: field.coordinates,
            createdAt: field.createdAt,
            updatedAt: field.updatedAt
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list fields'
      };
    }
  });
