import {InventoryRepository} from '@/core/domain/repositories';
import {InventoryItem} from '@/core/domain/entities';

export interface GetInventoryItemRequest {
  id: string;
}

export class GetInventoryItemUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(request: GetInventoryItemRequest): Promise<InventoryItem> {
    const item = await this.inventoryRepository.findItemById(request.id);

    if (!item) {
      throw new Error('Inventory item not found');
    }

    return item;
  }
}
