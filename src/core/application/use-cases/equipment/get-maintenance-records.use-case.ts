import {EquipmentRepository} from '@/core/domain/repositories';
import {MaintenanceRecord} from '@/core/domain/entities';

export interface GetMaintenanceRecordsRequest {
  equipmentId: string;
}

export interface GetMaintenanceRecordsResponse {
  records: MaintenanceRecord[];
}

export class GetMaintenanceRecordsUseCase {
  constructor(private readonly equipmentRepository: EquipmentRepository) {}

  async execute(
    request: GetMaintenanceRecordsRequest
  ): Promise<GetMaintenanceRecordsResponse> {
    // Verify equipment exists
    const equipment = await this.equipmentRepository.findEquipmentById(
      request.equipmentId
    );
    if (!equipment) {
      throw new Error('Equipment not found');
    }

    const records =
      await this.equipmentRepository.findMaintenanceRecordsByEquipment(
        request.equipmentId
      );

    return {records};
  }
}
