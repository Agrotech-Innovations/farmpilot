import {PrismaClient} from '@prisma/client';
import {Field} from '@/core/domain/entities';
import {FieldRepository} from '@/core/domain/repositories';

export class PrismaFieldRepository implements FieldRepository {
  constructor(private prisma: PrismaClient) {}

  async getById(id: string): Promise<Field | null> {
    const field = await this.prisma.field.findUnique({
      where: {id}
    });

    return field ? this.toDomain(field) : null;
  }

  async create(field: Field): Promise<Field> {
    const created = await this.prisma.field.create({
      data: {
        id: field.id,
        farmId: field.farmId,
        name: field.name,
        description: field.description,
        acres: field.acres,
        soilType: field.soilType,
        coordinates: field.coordinates,
        createdAt: field.createdAt,
        updatedAt: field.updatedAt
      }
    });

    return this.toDomain(created);
  }

  async save(field: Field): Promise<void> {
    await this.prisma.field.upsert({
      where: {id: field.id},
      create: {
        id: field.id,
        farmId: field.farmId,
        name: field.name,
        description: field.description,
        acres: field.acres,
        soilType: field.soilType,
        coordinates: field.coordinates,
        createdAt: field.createdAt,
        updatedAt: field.updatedAt
      },
      update: {
        name: field.name,
        description: field.description,
        acres: field.acres,
        soilType: field.soilType,
        coordinates: field.coordinates,
        updatedAt: field.updatedAt
      }
    });
  }

  async update(field: Field): Promise<Field> {
    const updated = await this.prisma.field.update({
      where: {id: field.id},
      data: {
        name: field.name,
        description: field.description,
        acres: field.acres,
        soilType: field.soilType,
        coordinates: field.coordinates,
        updatedAt: field.updatedAt
      }
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.field.delete({
      where: {id}
    });
  }

  async findByFarmId(farmId: string): Promise<Field[]> {
    const fields = await this.prisma.field.findMany({
      where: {farmId}
    });

    return fields.map((field) => this.toDomain(field));
  }

  async countByFarmId(farmId: string): Promise<number> {
    return this.prisma.field.count({
      where: {farmId}
    });
  }

  async searchFields(
    farmId: string,
    query: string,
    limit = 50
  ): Promise<Field[]> {
    const fields = await this.prisma.field.findMany({
      where: {
        farmId,
        OR: [
          {name: {contains: query}},
          {description: {contains: query}},
          {soilType: {contains: query}}
        ]
      },
      take: limit
    });

    return fields.map((field) => this.toDomain(field));
  }

  async findBySoilType(farmId: string, soilType: string): Promise<Field[]> {
    const fields = await this.prisma.field.findMany({
      where: {
        farmId,
        soilType
      }
    });

    return fields.map((field) => this.toDomain(field));
  }

  async getTotalAcresByFarm(farmId: string): Promise<number> {
    const result = await this.prisma.field.aggregate({
      where: {farmId},
      _sum: {acres: true}
    });

    return result._sum.acres || 0;
  }

  async getSoilTypeDistribution(
    farmId: string
  ): Promise<{soilType: string; count: number}[]> {
    const result = await this.prisma.field.groupBy({
      by: ['soilType'],
      where: {
        farmId,
        soilType: {not: null}
      },
      _count: {soilType: true}
    });

    return result.map((item) => ({
      soilType: item.soilType!,
      count: item._count.soilType
    }));
  }

  async isNameUniqueInFarm(
    farmId: string,
    name: string,
    excludeId?: string
  ): Promise<boolean> {
    const existingField = await this.prisma.field.findFirst({
      where: {
        farmId,
        name: {equals: name},
        ...(excludeId && {id: {not: excludeId}})
      }
    });

    return !existingField;
  }

  private toDomain(field: {
    id: string;
    farmId: string;
    name: string;
    description: string | null;
    acres: number;
    soilType: string | null;
    coordinates: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Field {
    return new Field({
      id: field.id,
      farmId: field.farmId,
      name: field.name,
      description: field.description ?? undefined,
      acres: field.acres,
      soilType: field.soilType ?? undefined,
      coordinates: field.coordinates ?? undefined,
      createdAt: field.createdAt,
      updatedAt: field.updatedAt
    });
  }
}
