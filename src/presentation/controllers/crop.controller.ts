import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {
  CreateCropUseCase,
  PlanCropPlantingUseCase
} from '@/core/application/use-cases/crop';
import {z} from 'zod';

// Validation schemas
const createCropSchema = z.object({
  name: z.string().min(1),
  variety: z.string().optional(),
  plantingDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  expectedHarvestDate: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  farmId: z.string(),
  fieldId: z.string().optional(),
  plannedAcres: z.number().min(0).optional()
});

const planCropPlantingSchema = z.object({
  cropId: z.string(),
  plantingDate: z.string().transform((str) => new Date(str)),
  expectedHarvestDate: z.string().transform((str) => new Date(str)),
  plannedAcres: z.number().min(0),
  fieldId: z.string().optional(),
  rotationNotes: z.string().optional()
});

// Server functions
export const createCrop = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return createCropSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const createCropUseCase =
        container.get<CreateCropUseCase>('createCropUseCase');

      const result = await createCropUseCase.execute(data);

      return {
        success: true,
        data: {
          id: result.crop.id,
          name: result.crop.name,
          variety: result.crop.variety,
          plantingDate: result.crop.plantingDate,
          expectedHarvestDate: result.crop.expectedHarvestDate,
          farmId: result.crop.farmId,
          fieldId: result.crop.fieldId,
          plannedAcres: result.crop.plannedAcres,
          status: result.crop.status,
          createdAt: result.crop.createdAt,
          updatedAt: result.crop.updatedAt
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create crop'
      };
    }
  });

export const planCropPlanting = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return planCropPlantingSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const planCropPlantingUseCase = container.get<PlanCropPlantingUseCase>(
        'planCropPlantingUseCase'
      );

      const result = await planCropPlantingUseCase.execute(data);

      return {
        success: true,
        data: {
          crop: {
            id: result.crop.id,
            name: result.crop.name,
            variety: result.crop.variety,
            plantingDate: result.crop.plantingDate,
            expectedHarvestDate: result.crop.expectedHarvestDate,
            farmId: result.crop.farmId,
            fieldId: result.crop.fieldId,
            plannedAcres: result.crop.plannedAcres,
            status: result.crop.status
          },
          rotationWarnings: result.rotationWarnings
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to plan crop planting'
      };
    }
  });
