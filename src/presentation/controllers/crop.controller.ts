import {createServerFn} from '@tanstack/react-start';
import {container} from '../../infrastructure/di/container';
import {
  CreateCropUseCase,
  PlanCropPlantingUseCase
} from '../../core/application/use-cases/crop';
import {z} from 'zod';

// Validation schemas
const createCropSchema = z.object({
  farmId: z.string(),
  fieldId: z.string().optional(),
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
export const createCrop = createServerFn('POST', async (data: unknown) => {
  try {
    const validatedData = createCropSchema.parse(data);
    const createCropUseCase =
      container.get<CreateCropUseCase>('CreateCropUseCase');

    const result = await createCropUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        crop: {
          id: result.crop.id,
          farmId: result.crop.farmId,
          fieldId: result.crop.fieldId,
          name: result.crop.name,
          variety: result.crop.variety,
          plantingDate: result.crop.plantingDate,
          expectedHarvestDate: result.crop.expectedHarvestDate,
          plannedAcres: result.crop.plannedAcres,
          status: result.crop.status,
          createdAt: result.crop.createdAt
        }
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create crop'
    };
  }
});

export const planCropPlanting = createServerFn(
  'POST',
  async (data: unknown) => {
    try {
      const validatedData = planCropPlantingSchema.parse(data);
      const planCropPlantingUseCase = container.get<PlanCropPlantingUseCase>(
        'PlanCropPlantingUseCase'
      );

      const result = await planCropPlantingUseCase.execute(validatedData);

      return {
        success: true,
        data: {
          crop: {
            id: result.crop.id,
            farmId: result.crop.farmId,
            fieldId: result.crop.fieldId,
            name: result.crop.name,
            variety: result.crop.variety,
            plantingDate: result.crop.plantingDate,
            expectedHarvestDate: result.crop.expectedHarvestDate,
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
  }
);
