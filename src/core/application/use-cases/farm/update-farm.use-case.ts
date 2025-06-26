import {FarmRepository} from '@/core/domain/repositories/farm.repository';
import {Farm} from '@/core/domain/entities/farm.entity';

export interface UpdateFarmRequest {
  farmId: string;
  organizationId: string;
  name?: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  farmType?: string;
  totalAcres?: number;
}

export interface UpdateFarmResponse {
  farm: Farm;
}

export class UpdateFarmUseCase {
  constructor(private readonly farmRepository: FarmRepository) {}

  async execute(request: UpdateFarmRequest): Promise<UpdateFarmResponse> {
    const {farmId, organizationId, ...updateData} = request;

    // Get the existing farm
    const existingFarm = await this.farmRepository.getById(farmId);

    if (!existingFarm) {
      throw new Error('Farm not found');
    }

    // Check if the farm belongs to the organization
    if (existingFarm.organizationId !== organizationId) {
      throw new Error('Access denied to this farm');
    }

    // Check name uniqueness if name is being updated
    if (updateData.name && updateData.name !== existingFarm.name) {
      const isNameUnique = await this.farmRepository.isNameUniqueInOrganization(
        organizationId,
        updateData.name,
        farmId
      );

      if (!isNameUnique) {
        throw new Error('Farm name already exists in this organization');
      }
    }

    // Create updated farm entity
    const updatedFarm = new Farm({
      id: existingFarm.id,
      organizationId: existingFarm.organizationId,
      name: updateData.name ?? existingFarm.name,
      description: updateData.description ?? existingFarm.description,
      address: updateData.address ?? existingFarm.address,
      latitude: updateData.latitude ?? existingFarm.latitude,
      longitude: updateData.longitude ?? existingFarm.longitude,
      farmType: updateData.farmType ?? existingFarm.farmType,
      totalAcres: updateData.totalAcres ?? existingFarm.totalAcres,
      createdAt: existingFarm.createdAt,
      updatedAt: new Date()
    });

    // Save the updated farm
    const savedFarm = await this.farmRepository.update(updatedFarm);

    return {
      farm: savedFarm
    };
  }
}
