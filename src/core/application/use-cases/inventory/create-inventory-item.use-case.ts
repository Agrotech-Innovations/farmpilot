import {InventoryRepository} from '@/core/domain/repositories';
import {InventoryItem} from '@/core/domain/entities';

export interface CreateInventoryItemRequest {
  farmId: string;
  name: string;
  category:
    | 'seeds'
    | 'fertilizers'
    | 'feed'
    | 'tools'
    | 'harvested_produce'
    | 'other';
  subcategory?: string;
  description?: string;
  initialQuantity: number;
  unit: string;
  minimumQuantity?: number;
  unitCost?: number;
  supplier?: string;
  sku?: string;
  brand?: string;
  expirationDate?: Date;
  storageLocation?: string;
}

export class CreateInventoryItemUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(request: CreateInventoryItemRequest): Promise<InventoryItem> {
    const totalValue = request.unitCost
      ? request.unitCost * request.initialQuantity
      : undefined;

    const item = new InventoryItem({
      id: crypto.randomUUID(),
      farmId: request.farmId,
      name: request.name,
      category: request.category,
      subcategory: request.subcategory,
      description: request.description,
      currentQuantity: request.initialQuantity,
      unit: request.unit,
      minimumQuantity: request.minimumQuantity,
      unitCost: request.unitCost,
      totalValue,
      supplier: request.supplier,
      sku: request.sku,
      brand: request.brand,
      expirationDate: request.expirationDate,
      storageLocation: request.storageLocation,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.inventoryRepository.saveItem(item);
    return item;
  }
}
