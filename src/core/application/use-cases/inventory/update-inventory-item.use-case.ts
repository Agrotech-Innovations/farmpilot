import {InventoryRepository} from '@/core/domain/repositories';
import {InventoryItem} from '@/core/domain/entities';

export interface UpdateInventoryItemRequest {
  id: string;
  name?: string;
  category?:
    | 'seeds'
    | 'fertilizers'
    | 'feed'
    | 'tools'
    | 'harvested_produce'
    | 'other';
  subcategory?: string;
  description?: string;
  unit?: string;
  minimumQuantity?: number;
  unitCost?: number;
  supplier?: string;
  sku?: string;
  brand?: string;
  expirationDate?: Date;
  storageLocation?: string;
}

export class UpdateInventoryItemUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(request: UpdateInventoryItemRequest): Promise<InventoryItem> {
    const existingItem = await this.inventoryRepository.findItemById(
      request.id
    );

    if (!existingItem) {
      throw new Error('Inventory item not found');
    }

    // Calculate new total value if unit cost changes
    let totalValue = existingItem.totalValue;
    const unitCost = request.unitCost ?? existingItem.unitCost;
    if (unitCost !== undefined) {
      totalValue = unitCost * existingItem.currentQuantity;
    }

    const updatedItem = new InventoryItem({
      id: existingItem.id,
      farmId: existingItem.farmId,
      name: request.name ?? existingItem.name,
      category: request.category ?? existingItem.category,
      subcategory: request.subcategory ?? existingItem.subcategory,
      description: request.description ?? existingItem.description,
      currentQuantity: existingItem.currentQuantity,
      unit: request.unit ?? existingItem.unit,
      minimumQuantity: request.minimumQuantity ?? existingItem.minimumQuantity,
      unitCost,
      totalValue,
      supplier: request.supplier ?? existingItem.supplier,
      sku: request.sku ?? existingItem.sku,
      brand: request.brand ?? existingItem.brand,
      expirationDate: request.expirationDate ?? existingItem.expirationDate,
      storageLocation: request.storageLocation ?? existingItem.storageLocation,
      createdAt: existingItem.createdAt,
      updatedAt: new Date()
    });

    await this.inventoryRepository.saveItem(updatedItem);
    return updatedItem;
  }
}
