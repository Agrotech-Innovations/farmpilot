import {Equipment, MaintenanceRecord} from '../entities';

export interface EquipmentRepository {
  // Equipment
  findEquipmentByFarm(farmId: string): Promise<Equipment[]>;
  findEquipmentById(id: string): Promise<Equipment | null>;
  findEquipmentByType(farmId: string, type: string): Promise<Equipment[]>;
  saveEquipment(equipment: Equipment): Promise<void>;
  deleteEquipment(id: string): Promise<void>;

  // Maintenance Records
  findMaintenanceRecordsByEquipment(
    equipmentId: string
  ): Promise<MaintenanceRecord[]>;
  findMaintenanceRecordById(id: string): Promise<MaintenanceRecord | null>;
  saveMaintenanceRecord(record: MaintenanceRecord): Promise<void>;
  deleteMaintenanceRecord(id: string): Promise<void>;

  // Analytics and Alerts
  findEquipmentNeedingMaintenance(farmId: string): Promise<Equipment[]>;
  findUpcomingMaintenance(
    farmId: string,
    daysAhead?: number
  ): Promise<MaintenanceRecord[]>;
  calculateEquipmentValue(farmId: string): Promise<number>;
  findMaintenanceCosts(
    farmId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<number>;
}
