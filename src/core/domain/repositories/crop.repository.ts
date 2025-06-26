import {Crop, CropStatus} from '../entities';

export interface CropRepository {
  // Basic CRUD operations
  getById(id: string): Promise<Crop | null>;
  create(crop: Crop): Promise<Crop>;
  save(crop: Crop): Promise<void>;
  update(crop: Crop): Promise<Crop>;
  delete(id: string): Promise<void>;

  // Farm-specific operations
  findByFarmId(farmId: string): Promise<Crop[]>;
  findByFieldId(fieldId: string): Promise<Crop[]>;

  // Status-based queries
  findByStatus(farmId: string, status: CropStatus): Promise<Crop[]>;
  findOverdueCrops(farmId: string): Promise<Crop[]>;
  findUpcomingHarvests(farmId: string, daysAhead: number): Promise<Crop[]>;

  // Date-based queries
  findByPlantingDateRange(
    farmId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Crop[]>;
  findByHarvestDateRange(
    farmId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Crop[]>;
  findByFieldAndDateRange(
    fieldId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Crop[]>;

  // Crop type analysis
  findByCropName(farmId: string, cropName: string): Promise<Crop[]>;
  getCropTypeDistribution(
    farmId: string
  ): Promise<{name: string; count: number}[]>;

  // Performance analysis
  getAverageYieldByCrop(farmId: string, cropName: string): Promise<number>;
  getTotalAcresByCrop(farmId: string): Promise<{name: string; acres: number}[]>;

  // Planning and scheduling
  findCropsNeedingAttention(farmId: string): Promise<Crop[]>;
  getHarvestCalendar(
    farmId: string,
    month: number,
    year: number
  ): Promise<Crop[]>;

  // Statistics
  countByStatus(farmId: string): Promise<{status: CropStatus; count: number}[]>;
  getTotalPlannedAcres(farmId: string): Promise<number>;
  getSuccessRate(farmId: string): Promise<number>; // percentage of successful harvests
}
