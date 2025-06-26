import {InventoryRepository} from '@/core/domain/repositories';
import {InventoryItem, InventoryTransaction} from '@/core/domain/entities';

export interface RecordInventoryTransactionRequest {
  itemId: string;
  transactionType: 'purchase' | 'usage' | 'sale' | 'adjustment' | 'waste';
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  notes?: string;
  referenceNumber?: string;
}

export class RecordInventoryTransactionUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(
    request: RecordInventoryTransactionRequest
  ): Promise<InventoryTransaction> {
    // Get the current item
    const item = await this.inventoryRepository.findItemById(request.itemId);
    if (!item) {
      throw new Error('Inventory item not found');
    }

    // Calculate new quantity
    let quantityChange = request.quantity;
    if (['usage', 'sale', 'waste'].includes(request.transactionType)) {
      quantityChange = -Math.abs(request.quantity);
    } else if (request.transactionType === 'adjustment') {
      // For adjustments, the quantity can be positive or negative
      quantityChange = request.quantity;
    }

    // Create the transaction
    const transaction = new InventoryTransaction({
      id: crypto.randomUUID(),
      itemId: request.itemId,
      transactionType: request.transactionType,
      quantity: quantityChange,
      unitCost: request.unitCost,
      totalCost: request.totalCost,
      notes: request.notes,
      referenceNumber: request.referenceNumber,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update item quantity
    const updatedItem = item.adjustQuantity(quantityChange);

    // Save both transaction and updated item
    await this.inventoryRepository.saveTransaction(transaction);
    await this.inventoryRepository.saveItem(updatedItem);

    return transaction;
  }
}
