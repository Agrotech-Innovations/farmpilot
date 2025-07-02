import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {Equipment, MaintenanceRecord} from '@/core/domain/entities';
import {z} from 'zod';

// Validation schemas
const createEquipmentSchema = z.object({
  farmId: z.string().min(1),
  name: z.string().min(1),
  type: z.string().min(1),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.coerce.date().optional(),
  purchasePrice: z.number().min(0).optional(),
  location: z.string().optional()
});

const updateEquipmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  purchaseDate: z.coerce.date().optional(),
  purchasePrice: z.number().min(0).optional(),
  currentValue: z.number().min(0).optional(),
  status: z
    .enum(['operational', 'maintenance', 'broken', 'retired'])
    .optional(),
  location: z.string().optional()
});

const listEquipmentSchema = z.object({
  farmId: z.string().min(1),
  type: z.string().optional()
});

const getEquipmentSchema = z.object({
  id: z.string().min(1)
});

const deleteEquipmentSchema = z.object({
  id: z.string().min(1)
});

const scheduleMaintenanceSchema = z.object({
  equipmentId: z.string().min(1),
  maintenanceType: z.enum(['routine', 'repair', 'inspection', 'replacement']),
  description: z.string().min(1),
  cost: z.number().min(0).optional(),
  performedBy: z.string().optional(),
  serviceProvider: z.string().optional(),
  nextServiceDate: z.coerce.date().optional(),
  notes: z.string().optional()
});

const getMaintenanceRecordsSchema = z.object({
  equipmentId: z.string().min(1)
});

const getEquipmentAnalyticsSchema = z.object({
  farmId: z.string().min(1),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional()
});

// Helper function to serialize equipment data
const serializeEquipment = (equipment: Equipment) => ({
  id: equipment.id,
  farmId: equipment.farmId,
  name: equipment.name,
  type: equipment.type,
  brand: equipment.brand,
  model: equipment.model,
  serialNumber: equipment.serialNumber,
  purchaseDate: equipment.purchaseDate?.toISOString(),
  purchasePrice: equipment.purchasePrice,
  currentValue: equipment.currentValue,
  status: equipment.status,
  location: equipment.location,
  createdAt: equipment.createdAt?.toISOString(),
  updatedAt: equipment.updatedAt?.toISOString()
});

// Helper function to serialize maintenance record data
const serializeMaintenanceRecord = (record: MaintenanceRecord) => ({
  id: record.id,
  equipmentId: record.equipmentId,
  maintenanceType: record.maintenanceType,
  description: record.description,
  cost: record.cost,
  performedBy: record.performedBy,
  serviceProvider: record.serviceProvider,
  nextServiceDate: record.nextServiceDate?.toISOString(),
  notes: record.notes,
  createdAt: record.createdAt?.toISOString(),
  updatedAt: record.updatedAt?.toISOString()
});

// Equipment CRUD endpoints
export const createEquipment = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return createEquipmentSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const createEquipmentUseCase = container.getCreateEquipmentUseCase();

      const equipment = await createEquipmentUseCase.execute(data);

      return {
        success: true,
        data: serializeEquipment(equipment)
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to create equipment'
      };
    }
  });

export const listEquipment = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return listEquipmentSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const listEquipmentUseCase = container.getListEquipmentUseCase();

      const result = await listEquipmentUseCase.execute(data);

      return {
        success: true,
        data: {
          equipment: result.equipment.map(serializeEquipment)
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to list equipment'
      };
    }
  });

export const getEquipment = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getEquipmentSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getEquipmentUseCase = container.getGetEquipmentUseCase();

      const equipment = await getEquipmentUseCase.execute(data);

      return {
        success: true,
        data: serializeEquipment(equipment)
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to get equipment'
      };
    }
  });

export const updateEquipment = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return updateEquipmentSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const updateEquipmentUseCase = container.getUpdateEquipmentUseCase();

      const equipment = await updateEquipmentUseCase.execute(data);

      return {
        success: true,
        data: serializeEquipment(equipment)
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to update equipment'
      };
    }
  });

export const deleteEquipment = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return deleteEquipmentSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const deleteEquipmentUseCase = container.getDeleteEquipmentUseCase();

      await deleteEquipmentUseCase.execute(data);

      return {
        success: true,
        message: 'Equipment deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Failed to delete equipment'
      };
    }
  });

// Maintenance endpoints
export const scheduleMaintenance = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return scheduleMaintenanceSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const scheduleMaintenanceUseCase =
        container.getScheduleMaintenanceUseCase();

      const record = await scheduleMaintenanceUseCase.execute(data);

      return {
        success: true,
        data: serializeMaintenanceRecord(record)
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to schedule maintenance'
      };
    }
  });

export const getMaintenanceRecords = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getMaintenanceRecordsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getMaintenanceRecordsUseCase =
        container.getGetMaintenanceRecordsUseCase();

      const result = await getMaintenanceRecordsUseCase.execute(data);

      return {
        success: true,
        data: {
          records: result.records.map(serializeMaintenanceRecord)
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get maintenance records'
      };
    }
  });

// Analytics endpoints
export const getEquipmentAnalytics = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getEquipmentAnalyticsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getEquipmentAnalyticsUseCase =
        container.getGetEquipmentAnalyticsUseCase();

      const analytics = await getEquipmentAnalyticsUseCase.execute(data);

      return {
        success: true,
        data: {
          totalEquipment: analytics.totalEquipment,
          totalValue: analytics.totalValue,
          equipmentByStatus: analytics.equipmentByStatus,
          equipmentNeedingMaintenance:
            analytics.equipmentNeedingMaintenance.map(serializeEquipment),
          upcomingMaintenance: analytics.upcomingMaintenance.map(
            serializeMaintenanceRecord
          ),
          maintenanceCosts: analytics.maintenanceCosts,
          averageEquipmentAge: analytics.averageEquipmentAge
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get equipment analytics'
      };
    }
  });
