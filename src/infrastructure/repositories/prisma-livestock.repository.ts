import {PrismaClient} from '@prisma/client';
import {
  LivestockGroup,
  LivestockAnimal,
  HealthRecord
} from '@/core/domain/entities';
import {LivestockRepository} from '@/core/domain/repositories';

export class PrismaLivestockRepository implements LivestockRepository {
  constructor(private prisma: PrismaClient) {}

  // Livestock Groups
  async findGroupsByFarm(farmId: string): Promise<LivestockGroup[]> {
    const groups = await this.prisma.livestockGroup.findMany({
      where: {farmId},
      orderBy: {name: 'asc'}
    });

    return groups.map((group) => this.groupToDomain(group));
  }

  async findGroupById(id: string): Promise<LivestockGroup | null> {
    const group = await this.prisma.livestockGroup.findUnique({
      where: {id}
    });

    return group ? this.groupToDomain(group) : null;
  }

  async saveGroup(group: LivestockGroup): Promise<void> {
    await this.prisma.livestockGroup.upsert({
      where: {id: group.id},
      create: {
        id: group.id,
        farmId: group.farmId,
        name: group.name,
        species: group.species,
        breed: group.breed,
        currentCount: group.currentCount,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
      },
      update: {
        name: group.name,
        species: group.species,
        breed: group.breed,
        currentCount: group.currentCount,
        updatedAt: group.updatedAt
      }
    });
  }

  async deleteGroup(id: string): Promise<void> {
    await this.prisma.livestockGroup.delete({
      where: {id}
    });
  }

  // Livestock Animals
  async findAnimalsByGroup(groupId: string): Promise<LivestockAnimal[]> {
    const animals = await this.prisma.livestockAnimal.findMany({
      where: {groupId},
      orderBy: {tagNumber: 'asc'}
    });

    return animals.map((animal) => this.animalToDomain(animal));
  }

  async findAnimalById(id: string): Promise<LivestockAnimal | null> {
    const animal = await this.prisma.livestockAnimal.findUnique({
      where: {id}
    });

    return animal ? this.animalToDomain(animal) : null;
  }

  async findAnimalByTagNumber(
    groupId: string,
    tagNumber: string
  ): Promise<LivestockAnimal | null> {
    const animal = await this.prisma.livestockAnimal.findUnique({
      where: {
        groupId_tagNumber: {
          groupId,
          tagNumber
        }
      }
    });

    return animal ? this.animalToDomain(animal) : null;
  }

  async saveAnimal(animal: LivestockAnimal): Promise<void> {
    await this.prisma.livestockAnimal.upsert({
      where: {id: animal.id},
      create: {
        id: animal.id,
        groupId: animal.groupId,
        tagNumber: animal.tagNumber,
        name: animal.name,
        sex: animal.sex,
        birthDate: animal.birthDate,
        breed: animal.breed,
        motherTagNumber: animal.motherTagNumber,
        fatherTagNumber: animal.fatherTagNumber,
        currentWeight: animal.currentWeight,
        healthStatus: animal.healthStatus,
        createdAt: animal.createdAt,
        updatedAt: animal.updatedAt
      },
      update: {
        name: animal.name,
        sex: animal.sex,
        birthDate: animal.birthDate,
        breed: animal.breed,
        motherTagNumber: animal.motherTagNumber,
        fatherTagNumber: animal.fatherTagNumber,
        currentWeight: animal.currentWeight,
        healthStatus: animal.healthStatus,
        updatedAt: animal.updatedAt
      }
    });
  }

  async deleteAnimal(id: string): Promise<void> {
    await this.prisma.livestockAnimal.delete({
      where: {id}
    });
  }

  // Health Records
  async findHealthRecordsByAnimal(animalId: string): Promise<HealthRecord[]> {
    const records = await this.prisma.healthRecord.findMany({
      where: {animalId},
      orderBy: {createdAt: 'desc'}
    });

    return records.map((record) => this.healthRecordToDomain(record));
  }

  async findHealthRecordById(id: string): Promise<HealthRecord | null> {
    const record = await this.prisma.healthRecord.findUnique({
      where: {id}
    });

    return record ? this.healthRecordToDomain(record) : null;
  }

  async saveHealthRecord(record: HealthRecord): Promise<void> {
    await this.prisma.healthRecord.upsert({
      where: {id: record.id},
      create: {
        id: record.id,
        animalId: record.animalId,
        recordType: record.recordType,
        description: record.description,
        treatment: record.treatment,
        medication: record.medication,
        dosage: record.dosage,
        veterinarian: record.veterinarian,
        cost: record.cost,
        notes: record.notes,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      },
      update: {
        recordType: record.recordType,
        description: record.description,
        treatment: record.treatment,
        medication: record.medication,
        dosage: record.dosage,
        veterinarian: record.veterinarian,
        cost: record.cost,
        notes: record.notes,
        updatedAt: record.updatedAt
      }
    });
  }

  async deleteHealthRecord(id: string): Promise<void> {
    await this.prisma.healthRecord.delete({
      where: {id}
    });
  }

  // Analytics
  async countAnimalsByFarm(farmId: string): Promise<number> {
    const result = await this.prisma.livestockAnimal.count({
      where: {
        group: {
          farmId
        }
      }
    });

    return result;
  }

  async findUnhealthyAnimals(farmId: string): Promise<LivestockAnimal[]> {
    const animals = await this.prisma.livestockAnimal.findMany({
      where: {
        group: {
          farmId
        },
        healthStatus: {
          in: ['sick', 'injured']
        }
      },
      orderBy: {tagNumber: 'asc'}
    });

    return animals.map((animal) => this.animalToDomain(animal));
  }

  async findUpcomingVaccinations(
    farmId: string,
    daysAhead = 30
  ): Promise<HealthRecord[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    // This is a simplified implementation. In a real system, you'd probably have
    // a separate vaccination schedule table or recurring vaccination records
    const records = await this.prisma.healthRecord.findMany({
      where: {
        animal: {
          group: {
            farmId
          }
        },
        recordType: 'vaccination',
        createdAt: {
          gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) // Last year
        }
      },
      include: {
        animal: true
      },
      orderBy: {createdAt: 'desc'}
    });

    // Filter for animals that might need follow-up vaccinations
    // This is a basic implementation - in practice, you'd have more sophisticated logic
    return records
      .filter((record) => {
        const daysSinceVaccination = Math.floor(
          (Date.now() - record.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        // Assume annual vaccinations need renewal after 330 days (allowing 35 days buffer)
        return daysSinceVaccination >= 330;
      })
      .map((record) => this.healthRecordToDomain(record));
  }

  // Domain mapping methods
  private groupToDomain(group: {
    id: string;
    farmId: string;
    name: string;
    species: string;
    breed: string | null;
    currentCount: number;
    createdAt: Date;
    updatedAt: Date;
  }): LivestockGroup {
    return new LivestockGroup({
      id: group.id,
      farmId: group.farmId,
      name: group.name,
      species: group.species,
      breed: group.breed || undefined,
      currentCount: group.currentCount,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt
    });
  }

  private animalToDomain(animal: {
    id: string;
    groupId: string;
    tagNumber: string;
    name: string | null;
    sex: string;
    birthDate: Date | null;
    breed: string | null;
    motherTagNumber: string | null;
    fatherTagNumber: string | null;
    currentWeight: number | null;
    healthStatus: string;
    createdAt: Date;
    updatedAt: Date;
  }): LivestockAnimal {
    return new LivestockAnimal({
      id: animal.id,
      groupId: animal.groupId,
      tagNumber: animal.tagNumber,
      name: animal.name || undefined,
      sex: animal.sex as 'male' | 'female',
      birthDate: animal.birthDate || undefined,
      breed: animal.breed || undefined,
      motherTagNumber: animal.motherTagNumber || undefined,
      fatherTagNumber: animal.fatherTagNumber || undefined,
      currentWeight: animal.currentWeight || undefined,
      healthStatus: animal.healthStatus as
        | 'healthy'
        | 'sick'
        | 'injured'
        | 'deceased',
      createdAt: animal.createdAt,
      updatedAt: animal.updatedAt
    });
  }

  private healthRecordToDomain(record: {
    id: string;
    animalId: string;
    recordType: string;
    description: string;
    treatment: string | null;
    medication: string | null;
    dosage: string | null;
    veterinarian: string | null;
    cost: number | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): HealthRecord {
    return new HealthRecord({
      id: record.id,
      animalId: record.animalId,
      recordType: record.recordType as
        | 'vaccination'
        | 'treatment'
        | 'checkup'
        | 'injury'
        | 'illness',
      description: record.description,
      treatment: record.treatment || undefined,
      medication: record.medication || undefined,
      dosage: record.dosage || undefined,
      veterinarian: record.veterinarian || undefined,
      cost: record.cost || undefined,
      notes: record.notes || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }
}
