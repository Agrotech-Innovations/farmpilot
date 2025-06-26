import {FarmRepository} from '@/core/domain/repositories/farm.repository';
import {Farm} from '@/core/domain/entities/farm.entity';

export interface GetFarmRequest {
  farmId: string;
  organizationId: string;
}

export interface GetFarmResponse {
  farm: Farm;
}

export class GetFarmUseCase {
  constructor(private readonly farmRepository: FarmRepository) {}

  async execute(request: GetFarmRequest): Promise<GetFarmResponse> {
    const {farmId, organizationId} = request;

    // Get the farm by ID
    const farm = await this.farmRepository.getById(farmId);

    if (!farm) {
      throw new Error('Farm not found');
    }

    // Check if the farm belongs to the organization
    if (farm.organizationId !== organizationId) {
      throw new Error('Access denied to this farm');
    }

    return {
      farm
    };
  }
}
