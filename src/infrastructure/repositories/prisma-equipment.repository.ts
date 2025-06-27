import {PrismaClient} from '@prisma/client';
import {Equipment, MaintenanceRecord} from '@/core/domain/entities';
import {EquipmentRepository} from '@/core/domain/repositories';

export class PrismaEquipmentRepository implements EquipmentRepository {
  constructor(private prisma: PrismaClient) {}

  // Equipment
  async findEquipmentByFarm(farmId: string): Promise<Equipment[]> {
    const equipment = await this.prisma.equipment.findMany({
      where: {farmId},
      orderBy: {name: 'asc'}
    });

    return equipment.map((item) => this.toDomainEquipment(item));
  }

  async findEquipmentById(id: string): Promise<Equipment | null> {
    const equipment = await this.prisma.equipment.findUnique({
      where: {id}
    });

    return equipment ? this.toDomainEquipment(equipment) : null;
  }

  async findEquipmentByType(
    farmId: string,
    type: string
  ): Promise<Equipment[]> {
    const equipment = await this.prisma.equipment.findMany({
      where: {
        farmId,
        type
      },
      orderBy: {name: 'asc'}
    });

    return equipment.map((item) => this.toDomainEquipment(item));
  }

  async saveEquipment(equipment: Equipment): Promise<void> {
    await this.prisma.equipment.upsert({
      where: {id: equipment.id},
      create: {
        id: equipment.id,
        farmId: equipment.farmId,
        name: equipment.name,
        type: equipment.type,
        brand: equipment.brand,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        purchaseDate: equipment.purchaseDate,
        purchasePrice: equipment.purchasePrice,
        currentValue: equipment.currentValue,
        status: equipment.status,
        location: equipment.location,
        createdAt: equipment.createdAt,
        updatedAt: equipment.updatedAt
      },
      update: {
        name: equipment.name,
        type: equipment.type,
        brand: equipment.brand,
        model: equipment.model,
        serialNumber: equipment.serialNumber,
        purchaseDate: equipment.purchaseDate,
        purchasePrice: equipment.purchasePrice,
        currentValue: equipment.currentValue,
        status: equipment.status,
        location: equipment.location,
        updatedAt: equipment.updatedAt
      }
    });
  }

  async deleteEquipment(id: string): Promise<void> {
    await this.prisma.equipment.delete({
      where: {id}
    });
  }

  // Maintenance Records
  async findMaintenanceRecordsByEquipment(
    equipmentId: string
  ): Promise<MaintenanceRecord[]> {
    const records = await this.prisma.maintenanceRecord.findMany({
      where: {equipmentId},
      orderBy: {createdAt: 'desc'}
    });

    return records.map((record) => this.toDomainMaintenanceRecord(record));
  }

  async findMaintenanceRecordById(
    id: string
  ): Promise<MaintenanceRecord | null> {
    const record = await this.prisma.maintenanceRecord.findUnique({
      where: {id}
    });

    return record ? this.toDomainMaintenanceRecord(record) : null;
  }

  async saveMaintenanceRecord(record: MaintenanceRecord): Promise<void> {
    await this.prisma.maintenanceRecord.upsert({
      where: {id: record.id},
      create: {
        id: record.id,
        equipmentId: record.equipmentId,
        maintenanceType: record.maintenanceType,
        description: record.description,
        cost: record.cost,
        performedBy: record.performedBy,
        serviceProvider: record.serviceProvider,
        nextServiceDate: record.nextServiceDate,
        notes: record.notes,
        createdAt: record.createdAt,
        updatedAt: record.updatedAt
      },
      update: {
        maintenanceType: record.maintenanceType,
        description: record.description,
        cost: record.cost,
        performedBy: record.performedBy,
        serviceProvider: record.serviceProvider,
        nextServiceDate: record.nextServiceDate,
        notes: record.notes,
        updatedAt: record.updatedAt
      }
    });
  }

  async deleteMaintenanceRecord(id: string): Promise<void> {
    await this.prisma.maintenanceRecord.delete({
      where: {id}
    });
  }

  // Analytics and Alerts
  async findEquipmentNeedingMaintenance(farmId: string): Promise<Equipment[]> {
    const equipment = await this.prisma.equipment.findMany({
      where: {
        farmId,
        status: {
          in: ['maintenance', 'broken']
        }
      }
    });

    return equipment.map((item) => this.toDomainEquipment(item));
  }

  async findUpcomingMaintenance(
    farmId: string,
    daysAhead: number = 30
  ): Promise<MaintenanceRecord[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const records = await this.prisma.maintenanceRecord.findMany({
      where: {
        equipment: {
          farmId
        },
        nextServiceDate: {
          gte: new Date(),
          lte: futureDate
        }
      },
      orderBy: {nextServiceDate: 'asc'}
    });

    return records.map((record) => this.toDomainMaintenanceRecord(record));
  }

  async calculateEquipmentValue(farmId: string): Promise<number> {
    const result = await this.prisma.equipment.aggregate({
      where: {farmId},
      _sum: {currentValue: true}
    });

    return result._sum.currentValue || 0;
  }

  async findMaintenanceCosts(
    farmId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number> {
    const where: any = {
      equipment: {
        farmId
      }
    };

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = startDate;
      if (endDate) where.createdAt.lte = endDate;
    }

    const result = await this.prisma.maintenanceRecord.aggregate({
      where,
      _sum: {cost: true}
    });

    return result._sum.cost || 0;
  }

  // Domain conversion methods
  private toDomainEquipment(equipment: {
    id: string;
    farmId: string;
    name: string;
    type: string;
    brand: string | null;
    model: string | null;
    serialNumber: string | null;
    purchaseDate: Date | null;
    purchasePrice: number | null;
    currentValue: number | null;
    status: string;
    location: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): Equipment {
    return new Equipment({
      id: equipment.id,
      farmId: equipment.farmId,
      name: equipment.name,
      type: equipment.type,
      brand: equipment.brand || undefined,
      model: equipment.model || undefined,
      serialNumber: equipment.serialNumber || undefined,
      purchaseDate: equipment.purchaseDate || undefined,
      purchasePrice: equipment.purchasePrice || undefined,
      currentValue: equipment.currentValue || undefined,
      status: equipment.status as
        | 'operational'
        | 'maintenance'
        | 'broken'
        | 'retired',
      location: equipment.location || undefined,
      createdAt: equipment.createdAt,
      updatedAt: equipment.updatedAt
    });
  }

  private toDomainMaintenanceRecord(record: {
    id: string;
    equipmentId: string;
    maintenanceType: string;
    description: string;
    cost: number | null;
    performedBy: string | null;
    serviceProvider: string | null;
    nextServiceDate: Date | null;
    notes: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): MaintenanceRecord {
    return new MaintenanceRecord({
      id: record.id,
      equipmentId: record.equipmentId,
      maintenanceType: record.maintenanceType as
        | 'routine'
        | 'repair'
        | 'inspection'
        | 'replacement',
      description: record.description,
      cost: record.cost || undefined,
      performedBy: record.performedBy || undefined,
      serviceProvider: record.serviceProvider || undefined,
      nextServiceDate: record.nextServiceDate || undefined,
      notes: record.notes || undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt
    });
  }
}
