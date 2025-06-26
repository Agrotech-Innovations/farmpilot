import {FarmRepository} from '@/core/domain/repositories/farm.repository';

export interface DeleteFarmRequest {
  farmId: string;
  organizationId: string;
}

export interface DeleteFarmResponse {
  success: boolean;
}

export class DeleteFarmUseCase {
  constructor(private readonly farmRepository: FarmRepository) {}

  async execute(request: DeleteFarmRequest): Promise<DeleteFarmResponse> {
    const {farmId, organizationId} = request;

    // Get the existing farm to verify it exists and belongs to the organization
    const existingFarm = await this.farmRepository.getById(farmId);

    if (!existingFarm) {
      throw new Error('Farm not found');
    }

    // Check if the farm belongs to the organization
    if (existingFarm.organizationId !== organizationId) {
      throw new Error('Access denied to this farm');
    }

    // TODO: Add validation to check if farm has associated fields, crops, etc.
    // For now, we'll allow deletion

    // Delete the farm
    await this.farmRepository.delete(farmId);

    return {
      success: true
    };
  }
}
