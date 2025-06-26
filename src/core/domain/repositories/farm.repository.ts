import {Farm} from '../entities';

export interface FarmRepository {
  // Basic CRUD operations
  getById(id: string): Promise<Farm | null>;
  create(farm: Farm): Promise<Farm>;
  save(farm: Farm): Promise<void>;
  update(farm: Farm): Promise<Farm>;
  delete(id: string): Promise<void>;

  // Organization-specific operations
  findByOrganizationId(organizationId: string): Promise<Farm[]>;
  findByOrganization(
    organizationId: string,
    options?: {limit?: number; offset?: number}
  ): Promise<Farm[]>;
  countByOrganizationId(organizationId: string): Promise<number>;
  countByOrganization(organizationId: string): Promise<number>;

  // Search and filtering
  searchFarms(
    organizationId: string,
    query: string,
    limit?: number
  ): Promise<Farm[]>;
  findByFarmType(organizationId: string, farmType: string): Promise<Farm[]>;
  findByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<Farm[]>;

  // Statistics
  getTotalAcresByOrganization(organizationId: string): Promise<number>;
  getFarmTypeDistribution(
    organizationId: string
  ): Promise<{farmType: string; count: number}[]>;

  // Validation
  isNameUniqueInOrganization(
    organizationId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean>;
}
