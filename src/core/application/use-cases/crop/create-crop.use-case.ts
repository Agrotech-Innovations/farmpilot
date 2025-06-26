import {Crop} from '../../../domain/entities';
import {CropRepository, FarmRepository} from '../../../domain/repositories';
import {randomUUID} from 'crypto';

export interface CreateCropRequest {
  farmId: string;
  fieldId?: string;
  name: string;
  variety?: string;
  plantingDate?: Date;
  expectedHarvestDate?: Date;
  plannedAcres?: number;
}

export interface CreateCropResponse {
  crop: Crop;
}

export class CreateCropUseCase {
  constructor(
    private cropRepository: CropRepository,
    private farmRepository: FarmRepository
  ) {}

  async execute(request: CreateCropRequest): Promise<CreateCropResponse> {
    // Verify farm exists
    const farm = await this.farmRepository.getById(request.farmId);
    if (!farm) {
      throw new Error('Farm not found');
    }

    // Create crop
    const crop = new Crop({
      id: randomUUID(),
      farmId: request.farmId,
      fieldId: request.fieldId,
      name: request.name,
      variety: request.variety,
      plantingDate: request.plantingDate,
      expectedHarvestDate: request.expectedHarvestDate,
      plannedAcres: request.plannedAcres,
      status: 'planned'
    });

    const savedCrop = await this.cropRepository.create(crop);

    return {
      crop: savedCrop
    };
  }
}
