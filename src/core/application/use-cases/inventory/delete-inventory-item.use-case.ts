import {InventoryRepository} from '@/core/domain/repositories';

export interface DeleteInventoryItemRequest {
  id: string;
}

export class DeleteInventoryItemUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(request: DeleteInventoryItemRequest): Promise<void> {
    const existingItem = await this.inventoryRepository.findItemById(
      request.id
    );

    if (!existingItem) {
      throw new Error('Inventory item not found');
    }

    await this.inventoryRepository.deleteItem(request.id);
  }
}
