import {InventoryRepository} from '@/core/domain/repositories';
import {InventoryItem} from '@/core/domain/entities';

export interface ListInventoryItemsRequest {
  farmId: string;
  category?: string;
}

export interface ListInventoryItemsResponse {
  items: InventoryItem[];
}

export class ListInventoryItemsUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(
    request: ListInventoryItemsRequest
  ): Promise<ListInventoryItemsResponse> {
    let items: InventoryItem[];

    if (request.category) {
      items = await this.inventoryRepository.findItemsByCategory(
        request.farmId,
        request.category
      );
    } else {
      items = await this.inventoryRepository.findItemsByFarm(request.farmId);
    }

    return {items};
  }
}
