import {InventoryRepository} from '@/core/domain/repositories';
import {InventoryTransaction} from '@/core/domain/entities';

export interface GetInventoryAnalyticsRequest {
  farmId: string;
  itemId?: string;
  days?: number;
}

export interface GetInventoryAnalyticsResponse {
  totalInventoryValue: number;
  itemUsageHistory?: InventoryTransaction[];
}

export class GetInventoryAnalyticsUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(
    request: GetInventoryAnalyticsRequest
  ): Promise<GetInventoryAnalyticsResponse> {
    const totalInventoryValue =
      await this.inventoryRepository.calculateTotalInventoryValue(
        request.farmId
      );

    let itemUsageHistory: InventoryTransaction[] | undefined;
    if (request.itemId) {
      itemUsageHistory = await this.inventoryRepository.findItemUsageHistory(
        request.itemId,
        request.days
      );
    }

    return {
      totalInventoryValue,
      itemUsageHistory
    };
  }
}
