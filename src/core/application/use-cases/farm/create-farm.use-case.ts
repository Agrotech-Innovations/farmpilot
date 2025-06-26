import {Farm} from '../../../domain/entities';
import {FarmRepository} from '../../../domain/repositories';
import {OrganizationRepository} from '../../../domain/repositories';
import {randomUUID} from 'crypto';

export interface CreateFarmRequest {
  organizationId: string;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  totalAcres?: number;
  farmType?: string;
}

export interface CreateFarmResponse {
  farm: Farm;
}

export class CreateFarmUseCase {
  constructor(
    private farmRepository: FarmRepository,
    private organizationRepository: OrganizationRepository
  ) {}

  async execute(request: CreateFarmRequest): Promise<CreateFarmResponse> {
    // Verify organization exists and is active
    const organization = await this.organizationRepository.getById(
      request.organizationId
    );
    if (!organization) {
      throw new Error('Organization not found');
    }

    if (!organization.canCreateFarms()) {
      throw new Error('Organization cannot create farms');
    }

    // Check farm limit
    const existingFarms = await this.farmRepository.findByOrganization(
      request.organizationId
    );
    if (existingFarms.length >= organization.getMaxFarms()) {
      throw new Error(
        `Maximum number of farms (${organization.getMaxFarms()}) reached for this subscription plan`
      );
    }

    // Create farm
    const farm = new Farm({
      id: randomUUID(),
      organizationId: request.organizationId,
      name: request.name,
      description: request.description,
      address: request.address,
      latitude: request.latitude,
      longitude: request.longitude,
      totalAcres: request.totalAcres,
      farmType: request.farmType
    });

    const savedFarm = await this.farmRepository.create(farm);

    return {
      farm: savedFarm
    };
  }
}
