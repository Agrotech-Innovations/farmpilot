import {EquipmentRepository} from '@/core/domain/repositories';
import {Equipment, MaintenanceRecord} from '@/core/domain/entities';

export interface GetEquipmentAnalyticsRequest {
  farmId: string;
  startDate?: Date;
  endDate?: Date;
}

export interface EquipmentAnalytics {
  totalEquipment: number;
  totalValue: number;
  equipmentByStatus: {
    operational: number;
    maintenance: number;
    broken: number;
    retired: number;
  };
  equipmentNeedingMaintenance: Equipment[];
  upcomingMaintenance: MaintenanceRecord[];
  maintenanceCosts: number;
  averageEquipmentAge: number;
}

export class GetEquipmentAnalyticsUseCase {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async execute(
    request: GetEquipmentAnalyticsRequest
  ): Promise<EquipmentAnalytics> {
    const [
      allEquipment,
      totalValue,
      equipmentNeedingMaintenance,
      upcomingMaintenance,
      maintenanceCosts
    ] = await Promise.all([
      this.equipmentRepository.findEquipmentByFarm(request.farmId),
      this.equipmentRepository.calculateEquipmentValue(request.farmId),
      this.equipmentRepository.findEquipmentNeedingMaintenance(request.farmId),
      this.equipmentRepository.findUpcomingMaintenance(request.farmId, 30),
      this.equipmentRepository.findMaintenanceCosts(
        request.farmId,
        request.startDate,
        request.endDate
      )
    ]);

    const equipmentByStatus = {
      operational: 0,
      maintenance: 0,
      broken: 0,
      retired: 0
    };

    let totalAge = 0;
    let equipmentWithAge = 0;

    allEquipment.forEach((equipment) => {
      equipmentByStatus[equipment.status]++;

      const age = equipment.getAge();
      if (age !== null) {
        totalAge += age;
        equipmentWithAge++;
      }
    });

    const averageEquipmentAge =
      equipmentWithAge > 0 ? totalAge / equipmentWithAge : 0;

    return {
      totalEquipment: allEquipment.length,
      totalValue,
      equipmentByStatus,
      equipmentNeedingMaintenance,
      upcomingMaintenance,
      maintenanceCosts,
      averageEquipmentAge
    };
  }
}
