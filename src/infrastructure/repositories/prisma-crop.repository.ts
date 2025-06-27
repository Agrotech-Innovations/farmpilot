import {PrismaClient} from '@prisma/client';
import {Crop, CropStatus} from '@/core/domain/entities';
import {CropRepository} from '@/core/domain/repositories';

export class PrismaCropRepository implements CropRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: string): Promise<Crop | null> {
    const crop = await this.prisma.crop.findUnique({
      where: {id}
    });

    return crop ? this.toDomain(crop) : null;
  }

  async create(crop: Crop): Promise<Crop> {
    const created = await this.prisma.crop.create({
      data: {
        id: crop.id,
        farmId: crop.farmId,
        fieldId: crop.fieldId,
        name: crop.name,
        variety: crop.variety,
        plantingDate: crop.plantingDate,
        expectedHarvestDate: crop.expectedHarvestDate,
        actualHarvestDate: crop.actualHarvestDate,
        plannedAcres: crop.plannedAcres,
        actualAcres: crop.actualAcres,
        seedsPerAcre: crop.seedsPerAcre,
        status: crop.status,
        createdAt: crop.createdAt,
        updatedAt: crop.updatedAt
      }
    });

    return this.toDomain(created);
  }

  async save(crop: Crop): Promise<void> {
    await this.prisma.crop.upsert({
      where: {id: crop.id},
      create: {
        id: crop.id,
        farmId: crop.farmId,
        fieldId: crop.fieldId,
        name: crop.name,
        variety: crop.variety,
        plantingDate: crop.plantingDate,
        expectedHarvestDate: crop.expectedHarvestDate,
        actualHarvestDate: crop.actualHarvestDate,
        plannedAcres: crop.plannedAcres,
        actualAcres: crop.actualAcres,
        seedsPerAcre: crop.seedsPerAcre,
        status: crop.status,
        createdAt: crop.createdAt,
        updatedAt: crop.updatedAt
      },
      update: {
        fieldId: crop.fieldId,
        name: crop.name,
        variety: crop.variety,
        plantingDate: crop.plantingDate,
        expectedHarvestDate: crop.expectedHarvestDate,
        actualHarvestDate: crop.actualHarvestDate,
        plannedAcres: crop.plannedAcres,
        actualAcres: crop.actualAcres,
        seedsPerAcre: crop.seedsPerAcre,
        status: crop.status,
        updatedAt: crop.updatedAt
      }
    });
  }

  async update(crop: Crop): Promise<Crop> {
    const updated = await this.prisma.crop.update({
      where: {id: crop.id},
      data: {
        fieldId: crop.fieldId,
        name: crop.name,
        variety: crop.variety,
        plantingDate: crop.plantingDate,
        expectedHarvestDate: crop.expectedHarvestDate,
        actualHarvestDate: crop.actualHarvestDate,
        plannedAcres: crop.plannedAcres,
        actualAcres: crop.actualAcres,
        seedsPerAcre: crop.seedsPerAcre,
        status: crop.status,
        updatedAt: crop.updatedAt
      }
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.crop.delete({
      where: {id}
    });
  }

  async findByFarmId(farmId: string): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: {farmId}
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async findByFieldId(fieldId: string): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: {fieldId}
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async findByStatus(farmId: string, status: CropStatus): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: {
        farmId,
        status
      }
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async findOverdueCrops(farmId: string): Promise<Crop[]> {
    const now = new Date();
    const crops = await this.prisma.crop.findMany({
      where: {
        farmId,
        expectedHarvestDate: {
          lt: now
        },
        status: {
          in: ['planned', 'planted', 'growing']
        }
      }
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async findUpcomingHarvests(
    farmId: string,
    daysAhead: number
  ): Promise<Crop[]> {
    const now = new Date();
    const futureDate = new Date(
      now.getTime() + daysAhead * 24 * 60 * 60 * 1000
    );

    const crops = await this.prisma.crop.findMany({
      where: {
        farmId,
        expectedHarvestDate: {
          gte: now,
          lte: futureDate
        },
        status: {
          in: ['planted', 'growing']
        }
      }
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async findByPlantingDateRange(
    farmId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: {
        farmId,
        plantingDate: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async findByHarvestDateRange(
    farmId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: {
        farmId,
        expectedHarvestDate: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async findByFieldAndDateRange(
    fieldId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: {
        fieldId,
        OR: [
          {
            plantingDate: {
              gte: startDate,
              lte: endDate
            }
          },
          {
            expectedHarvestDate: {
              gte: startDate,
              lte: endDate
            }
          }
        ]
      }
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async findByCropName(farmId: string, cropName: string): Promise<Crop[]> {
    const crops = await this.prisma.crop.findMany({
      where: {
        farmId,
        name: {contains: cropName}
      }
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async getCropTypeDistribution(
    farmId: string
  ): Promise<{name: string; count: number}[]> {
    const result = await this.prisma.crop.groupBy({
      by: ['name'],
      where: {farmId},
      _count: {name: true}
    });

    return result.map((item) => ({
      name: item.name,
      count: item._count.name
    }));
  }

  async getAverageYieldByCrop(
    farmId: string,
    cropName: string
  ): Promise<number> {
    const result = await this.prisma.cropYield.aggregate({
      where: {
        crop: {
          farmId,
          name: cropName
        }
      },
      _avg: {quantity: true}
    });

    return result._avg.quantity || 0;
  }

  async getTotalAcresByCrop(
    farmId: string
  ): Promise<{name: string; acres: number}[]> {
    const result = await this.prisma.crop.groupBy({
      by: ['name'],
      where: {
        farmId,
        actualAcres: {not: null}
      },
      _sum: {actualAcres: true}
    });

    return result.map((item) => ({
      name: item.name,
      acres: item._sum.actualAcres || 0
    }));
  }

  async findCropsNeedingAttention(farmId: string): Promise<Crop[]> {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const crops = await this.prisma.crop.findMany({
      where: {
        farmId,
        OR: [
          // Overdue harvests
          {
            expectedHarvestDate: {lt: now},
            status: {in: ['planted', 'growing']}
          },
          // Upcoming harvests in next week
          {
            expectedHarvestDate: {gte: now, lte: weekFromNow},
            status: {in: ['planted', 'growing']}
          },
          // Planned crops that should be planted soon
          {
            plantingDate: {gte: now, lte: weekFromNow},
            status: 'planned'
          }
        ]
      }
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async getHarvestCalendar(
    farmId: string,
    month: number,
    year: number
  ): Promise<Crop[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const crops = await this.prisma.crop.findMany({
      where: {
        farmId,
        expectedHarvestDate: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    return crops.map((crop) => this.toDomain(crop));
  }

  async countByStatus(
    farmId: string
  ): Promise<{status: CropStatus; count: number}[]> {
    const result = await this.prisma.crop.groupBy({
      by: ['status'],
      where: {farmId},
      _count: {status: true}
    });

    return result.map((item) => ({
      status: item.status as CropStatus,
      count: item._count.status
    }));
  }

  async getTotalPlannedAcres(farmId: string): Promise<number> {
    const result = await this.prisma.crop.aggregate({
      where: {
        farmId,
        plannedAcres: {not: null}
      },
      _sum: {plannedAcres: true}
    });

    return result._sum.plannedAcres || 0;
  }

  async getSuccessRate(farmId: string): Promise<number> {
    const totalCrops = await this.prisma.crop.count({
      where: {farmId}
    });

    if (totalCrops === 0) return 0;

    const successfulCrops = await this.prisma.crop.count({
      where: {
        farmId,
        status: 'harvested'
      }
    });

    return (successfulCrops / totalCrops) * 100;
  }

  private toDomain(crop: {
    id: string;
    farmId: string;
    fieldId: string | null;
    name: string;
    variety: string | null;
    plantingDate: Date | null;
    expectedHarvestDate: Date | null;
    actualHarvestDate: Date | null;
    plannedAcres: number | null;
    actualAcres: number | null;
    seedsPerAcre: number | null;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): Crop {
    return new Crop({
      id: crop.id,
      farmId: crop.farmId,
      fieldId: crop.fieldId ?? undefined,
      name: crop.name,
      variety: crop.variety ?? undefined,
      plantingDate: crop.plantingDate ?? undefined,
      expectedHarvestDate: crop.expectedHarvestDate ?? undefined,
      actualHarvestDate: crop.actualHarvestDate ?? undefined,
      plannedAcres: crop.plannedAcres ?? undefined,
      actualAcres: crop.actualAcres ?? undefined,
      seedsPerAcre: crop.seedsPerAcre ?? undefined,
      status: crop.status as CropStatus,
      createdAt: crop.createdAt,
      updatedAt: crop.updatedAt
    });
  }
}
