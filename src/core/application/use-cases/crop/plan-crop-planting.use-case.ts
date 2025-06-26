import {Crop} from '@/core/domain/entities';
import {CropRepository, FieldRepository} from '@/core/domain/repositories';

export interface PlanCropPlantingRequest {
  cropId: string;
  plantingDate: Date;
  expectedHarvestDate: Date;
  plannedAcres: number;
  fieldId?: string;
  rotationNotes?: string;
}

export interface PlanCropPlantingResponse {
  crop: Crop;
  rotationWarnings: string[];
}

export class PlanCropPlantingUseCase {
  constructor(
    private cropRepository: CropRepository,
    private fieldRepository: FieldRepository
  ) {}

  async execute(
    request: PlanCropPlantingRequest
  ): Promise<PlanCropPlantingResponse> {
    // Get the crop
    const crop = await this.cropRepository.getById(request.cropId);
    if (!crop) {
      throw new Error('Crop not found');
    }

    // Validate field assignment if provided
    let rotationWarnings: string[] = [];
    if (request.fieldId) {
      const field = await this.fieldRepository.getById(request.fieldId);
      if (!field) {
        throw new Error('Field not found');
      }

      // Check for rotation warnings
      rotationWarnings = await this.checkRotationIssues(
        request.fieldId,
        crop.name,
        request.plantingDate
      );
    }

    // Update crop with planting plan
    const updatedCrop = crop.planPlanting(
      request.plantingDate,
      request.expectedHarvestDate,
      request.plannedAcres
    );

    // Assign to field if specified
    const finalCrop = request.fieldId
      ? updatedCrop.assignToField(request.fieldId)
      : updatedCrop;

    const savedCrop = await this.cropRepository.update(finalCrop);

    return {
      crop: savedCrop,
      rotationWarnings
    };
  }

  private async checkRotationIssues(
    fieldId: string,
    cropName: string,
    plantingDate: Date
  ): Promise<string[]> {
    const warnings: string[] = [];

    // Get recent crops in this field
    const recentCrops = await this.cropRepository.findByFieldAndDateRange(
      fieldId,
      new Date(plantingDate.getFullYear() - 3, 0, 1), // Last 3 years
      plantingDate
    );

    // Check for same crop in previous season
    const previousSeasonCrops = recentCrops.filter(
      (crop) =>
        crop.name.toLowerCase() === cropName.toLowerCase() &&
        crop.actualHarvestDate &&
        crop.actualHarvestDate > new Date(plantingDate.getFullYear() - 1, 0, 1)
    );

    if (previousSeasonCrops.length > 0) {
      warnings.push(
        `Same crop (${cropName}) was grown in this field in the previous season. Consider crop rotation for soil health.`
      );
    }

    // Check for crop family rotation (simplified logic)
    const cropFamilies = this.getCropFamilies();
    const currentFamily = cropFamilies[cropName.toLowerCase()];

    if (currentFamily) {
      const sameFamily = recentCrops.filter((crop) => {
        const pastFamily = cropFamilies[crop.name.toLowerCase()];
        return pastFamily === currentFamily && crop.actualHarvestDate;
      });

      if (sameFamily.length >= 2) {
        warnings.push(
          `Multiple crops from the ${currentFamily} family have been grown in this field recently. Consider diversifying crop families.`
        );
      }
    }

    return warnings;
  }

  private getCropFamilies(): Record<string, string> {
    return {
      // Grasses
      corn: 'Grasses',
      wheat: 'Grasses',
      rice: 'Grasses',
      barley: 'Grasses',
      oats: 'Grasses',

      // Legumes
      soybeans: 'Legumes',
      beans: 'Legumes',
      peas: 'Legumes',
      lentils: 'Legumes',
      peanuts: 'Legumes',
      alfalfa: 'Legumes',

      // Brassicas
      canola: 'Brassicas',
      cabbage: 'Brassicas',
      broccoli: 'Brassicas',
      turnips: 'Brassicas',

      // Nightshades
      tomatoes: 'Nightshades',
      potatoes: 'Nightshades',
      peppers: 'Nightshades',
      eggplant: 'Nightshades'
    };
  }
}
