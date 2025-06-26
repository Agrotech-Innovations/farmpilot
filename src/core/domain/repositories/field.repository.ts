import {Field} from '@/core/domain/entities';

export interface FieldRepository {
  // Basic CRUD operations
  getById(id: string): Promise<Field | null>;
  create(field: Field): Promise<Field>;
  save(field: Field): Promise<void>;
  update(field: Field): Promise<Field>;
  delete(id: string): Promise<void>;

  // Farm-specific operations
  findByFarmId(farmId: string): Promise<Field[]>;
  countByFarmId(farmId: string): Promise<number>;

  // Search and filtering
  searchFields(farmId: string, query: string, limit?: number): Promise<Field[]>;
  findBySoilType(farmId: string, soilType: string): Promise<Field[]>;

  // Statistics
  getTotalAcresByFarm(farmId: string): Promise<number>;
  getSoilTypeDistribution(
    farmId: string
  ): Promise<{soilType: string; count: number}[]>;

  // Validation
  isNameUniqueInFarm(
    farmId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean>;
}
