import {InventoryItem, InventoryTransaction} from '../entities';

export interface InventoryRepository {
  // Inventory Items
  findItemsByFarm(farmId: string): Promise<InventoryItem[]>;
  findItemById(id: string): Promise<InventoryItem | null>;
  findItemsByCategory(
    farmId: string,
    category: string
  ): Promise<InventoryItem[]>;
  saveItem(item: InventoryItem): Promise<void>;
  deleteItem(id: string): Promise<void>;

  // Inventory Transactions
  findTransactionsByItem(itemId: string): Promise<InventoryTransaction[]>;
  findTransactionById(id: string): Promise<InventoryTransaction | null>;
  saveTransaction(transaction: InventoryTransaction): Promise<void>;
  deleteTransaction(id: string): Promise<void>;

  // Analytics and Alerts
  findLowStockItems(farmId: string): Promise<InventoryItem[]>;
  findExpiredItems(farmId: string): Promise<InventoryItem[]>;
  findExpiringSoonItems(
    farmId: string,
    daysAhead?: number
  ): Promise<InventoryItem[]>;
  calculateTotalInventoryValue(farmId: string): Promise<number>;
  findItemUsageHistory(
    itemId: string,
    days?: number
  ): Promise<InventoryTransaction[]>;
}
