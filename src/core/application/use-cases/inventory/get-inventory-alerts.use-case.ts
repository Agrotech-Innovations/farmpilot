import {InventoryRepository} from '@/core/domain/repositories';
import {InventoryItem} from '@/core/domain/entities';

export interface GetInventoryAlertsRequest {
  farmId: string;
  expirationDaysAhead?: number;
}

export interface GetInventoryAlertsResponse {
  lowStockItems: InventoryItem[];
  expiredItems: InventoryItem[];
  expiringSoonItems: InventoryItem[];
}

export class GetInventoryAlertsUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(
    request: GetInventoryAlertsRequest
  ): Promise<GetInventoryAlertsResponse> {
    const [lowStockItems, expiredItems, expiringSoonItems] = await Promise.all([
      this.inventoryRepository.findLowStockItems(request.farmId),
      this.inventoryRepository.findExpiredItems(request.farmId),
      this.inventoryRepository.findExpiringSoonItems(
        request.farmId,
        request.expirationDaysAhead
      )
    ]);

    return {
      lowStockItems,
      expiredItems,
      expiringSoonItems
    };
  }
}
