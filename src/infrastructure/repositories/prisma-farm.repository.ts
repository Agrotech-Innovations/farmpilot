import {PrismaClient} from '@prisma/client';
import {Farm} from '@/core/domain/entities';
import {FarmRepository} from '@/core/domain/repositories';

export class PrismaFarmRepository implements FarmRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: string): Promise<Farm | null> {
    const farm = await this.prisma.farm.findUnique({
      where: {id}
    });

    return farm ? this.toDomain(farm) : null;
  }

  async create(farm: Farm): Promise<Farm> {
    const created = await this.prisma.farm.create({
      data: {
        id: farm.id,
        organizationId: farm.organizationId,
        name: farm.name,
        description: farm.description,
        address: farm.address,
        latitude: farm.latitude,
        longitude: farm.longitude,
        totalAcres: farm.totalAcres,
        farmType: farm.farmType,
        createdAt: farm.createdAt,
        updatedAt: farm.updatedAt
      }
    });

    return this.toDomain(created);
  }

  async save(farm: Farm): Promise<void> {
    await this.prisma.farm.upsert({
      where: {id: farm.id},
      create: {
        id: farm.id,
        organizationId: farm.organizationId,
        name: farm.name,
        description: farm.description,
        address: farm.address,
        latitude: farm.latitude,
        longitude: farm.longitude,
        totalAcres: farm.totalAcres,
        farmType: farm.farmType,
        createdAt: farm.createdAt,
        updatedAt: farm.updatedAt
      },
      update: {
        name: farm.name,
        description: farm.description,
        address: farm.address,
        latitude: farm.latitude,
        longitude: farm.longitude,
        totalAcres: farm.totalAcres,
        farmType: farm.farmType,
        updatedAt: farm.updatedAt
      }
    });
  }

  async update(farm: Farm): Promise<Farm> {
    const updated = await this.prisma.farm.update({
      where: {id: farm.id},
      data: {
        name: farm.name,
        description: farm.description,
        address: farm.address,
        latitude: farm.latitude,
        longitude: farm.longitude,
        totalAcres: farm.totalAcres,
        farmType: farm.farmType,
        updatedAt: farm.updatedAt
      }
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.farm.delete({
      where: {id}
    });
  }

  async findByOrganizationId(organizationId: string): Promise<Farm[]> {
    const farms = await this.prisma.farm.findMany({
      where: {organizationId}
    });

    return farms.map((farm) => this.toDomain(farm));
  }

  async findByOrganization(
    organizationId: string,
    options?: {limit?: number; offset?: number}
  ): Promise<Farm[]> {
    const farms = await this.prisma.farm.findMany({
      where: {organizationId},
      take: options?.limit,
      skip: options?.offset
    });

    return farms.map((farm) => this.toDomain(farm));
  }

  async countByOrganizationId(organizationId: string): Promise<number> {
    return this.prisma.farm.count({
      where: {organizationId}
    });
  }

  async countByOrganization(organizationId: string): Promise<number> {
    return this.countByOrganizationId(organizationId);
  }

  async searchFarms(
    organizationId: string,
    query: string,
    limit = 50
  ): Promise<Farm[]> {
    const farms = await this.prisma.farm.findMany({
      where: {
        organizationId,
        OR: [
          {name: {contains: query}},
          {description: {contains: query}},
          {address: {contains: query}}
        ]
      },
      take: limit
    });

    return farms.map((farm) => this.toDomain(farm));
  }

  async findByFarmType(
    organizationId: string,
    farmType: string
  ): Promise<Farm[]> {
    const farms = await this.prisma.farm.findMany({
      where: {
        organizationId,
        farmType
      }
    });

    return farms.map((farm) => this.toDomain(farm));
  }

  async findByLocation(
    latitude: number,
    longitude: number,
    radiusKm: number
  ): Promise<Farm[]> {
    // This is a simplified implementation. For production, you'd want to use PostGIS or similar
    const farms = await this.prisma.farm.findMany({
      where: {
        latitude: {not: null},
        longitude: {not: null}
      }
    });

    return farms
      .map((farm) => this.toDomain(farm))
      .filter((farm) => {
        if (!farm.latitude || !farm.longitude) return false;
        const distance = this.calculateDistance(
          latitude,
          longitude,
          farm.latitude,
          farm.longitude
        );
        return distance <= radiusKm;
      });
  }

  async getTotalAcresByOrganization(organizationId: string): Promise<number> {
    const result = await this.prisma.farm.aggregate({
      where: {organizationId},
      _sum: {totalAcres: true}
    });

    return result._sum.totalAcres || 0;
  }

  async getFarmTypeDistribution(
    organizationId: string
  ): Promise<{farmType: string; count: number}[]> {
    const result = await this.prisma.farm.groupBy({
      by: ['farmType'],
      where: {
        organizationId,
        farmType: {not: null}
      },
      _count: {farmType: true}
    });

    return result.map((item) => ({
      farmType: item.farmType!,
      count: item._count.farmType
    }));
  }

  async isNameUniqueInOrganization(
    organizationId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const existingFarm = await this.prisma.farm.findFirst({
      where: {
        organizationId,
        name: {equals: name},
        ...(excludeId && {id: {not: excludeId}})
      }
    });

    return !existingFarm;
  }

  private toDomain(farm: {
    id: string;
    organizationId: string;
    name: string;
    description: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    totalAcres: number | null;
    farmType: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Farm {
    return new Farm({
      id: farm.id,
      organizationId: farm.organizationId,
      name: farm.name,
      description: farm.description ?? undefined,
      address: farm.address ?? undefined,
      latitude: farm.latitude ?? undefined,
      longitude: farm.longitude ?? undefined,
      totalAcres: farm.totalAcres ?? undefined,
      farmType: farm.farmType ?? undefined,
      createdAt: farm.createdAt,
      updatedAt: farm.updatedAt
    });
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }
}
