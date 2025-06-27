import {PrismaClient} from '@prisma/client';
import {InventoryItem, InventoryTransaction} from '@/core/domain/entities';
import {InventoryRepository} from '@/core/domain/repositories';

export class PrismaInventoryRepository implements InventoryRepository {
  constructor(private prisma: PrismaClient) {}

  // Inventory Items
  async findItemsByFarm(farmId: string): Promise<InventoryItem[]> {
    const items = await this.prisma.inventoryItem.findMany({
      where: {farmId},
      orderBy: {name: 'asc'}
    });

    return items.map((item) => this.toDomainItem(item));
  }

  async findItemById(id: string): Promise<InventoryItem | null> {
    const item = await this.prisma.inventoryItem.findUnique({
      where: {id}
    });

    return item ? this.toDomainItem(item) : null;
  }

  async findItemsByCategory(
    farmId: string,
    category: string
  ): Promise<InventoryItem[]> {
    const items = await this.prisma.inventoryItem.findMany({
      where: {
        farmId,
        category
      },
      orderBy: {name: 'asc'}
    });

    return items.map((item) => this.toDomainItem(item));
  }

  async saveItem(item: InventoryItem): Promise<void> {
    await this.prisma.inventoryItem.upsert({
      where: {id: item.id},
      create: {
        id: item.id,
        farmId: item.farmId,
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        description: item.description,
        currentQuantity: item.currentQuantity,
        unit: item.unit,
        minimumQuantity: item.minimumQuantity,
        unitCost: item.unitCost,
        totalValue: item.totalValue,
        supplier: item.supplier,
        sku: item.sku,
        brand: item.brand,
        expirationDate: item.expirationDate,
        storageLocation: item.storageLocation,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      },
      update: {
        name: item.name,
        category: item.category,
        subcategory: item.subcategory,
        description: item.description,
        currentQuantity: item.currentQuantity,
        unit: item.unit,
        minimumQuantity: item.minimumQuantity,
        unitCost: item.unitCost,
        totalValue: item.totalValue,
        supplier: item.supplier,
        sku: item.sku,
        brand: item.brand,
        expirationDate: item.expirationDate,
        storageLocation: item.storageLocation,
        updatedAt: item.updatedAt
      }
    });
  }

  async deleteItem(id: string): Promise<void> {
    await this.prisma.inventoryItem.delete({
      where: {id}
    });
  }

  // Inventory Transactions
  async findTransactionsByItem(
    itemId: string
  ): Promise<InventoryTransaction[]> {
    const transactions = await this.prisma.inventoryTransaction.findMany({
      where: {itemId},
      orderBy: {createdAt: 'desc'}
    });

    return transactions.map((transaction) =>
      this.toDomainTransaction(transaction)
    );
  }

  async findTransactionById(id: string): Promise<InventoryTransaction | null> {
    const transaction = await this.prisma.inventoryTransaction.findUnique({
      where: {id}
    });

    return transaction ? this.toDomainTransaction(transaction) : null;
  }

  async saveTransaction(transaction: InventoryTransaction): Promise<void> {
    await this.prisma.inventoryTransaction.upsert({
      where: {id: transaction.id},
      create: {
        id: transaction.id,
        itemId: transaction.itemId,
        transactionType: transaction.transactionType,
        quantity: transaction.quantity,
        unitCost: transaction.unitCost,
        totalCost: transaction.totalCost,
        notes: transaction.notes,
        referenceNumber: transaction.referenceNumber,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt
      },
      update: {
        transactionType: transaction.transactionType,
        quantity: transaction.quantity,
        unitCost: transaction.unitCost,
        totalCost: transaction.totalCost,
        notes: transaction.notes,
        referenceNumber: transaction.referenceNumber,
        updatedAt: transaction.updatedAt
      }
    });
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.prisma.inventoryTransaction.delete({
      where: {id}
    });
  }

  // Analytics and Alerts
  async findLowStockItems(farmId: string): Promise<InventoryItem[]> {
    const items = await this.prisma.inventoryItem.findMany({
      where: {
        farmId,
        minimumQuantity: {
          not: null
        }
      }
    });

    // Filter items where currentQuantity <= minimumQuantity
    const lowStockItems = items.filter(
      (item) =>
        item.minimumQuantity !== null &&
        item.currentQuantity <= item.minimumQuantity
    );

    return lowStockItems.map((item) => this.toDomainItem(item));
  }

  async findExpiredItems(farmId: string): Promise<InventoryItem[]> {
    const now = new Date();
    const items = await this.prisma.inventoryItem.findMany({
      where: {
        farmId,
        expirationDate: {
          lt: now
        }
      }
    });

    return items.map((item) => this.toDomainItem(item));
  }

  async findExpiringSoonItems(
    farmId: string,
    daysAhead: number = 30
  ): Promise<InventoryItem[]> {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);

    const items = await this.prisma.inventoryItem.findMany({
      where: {
        farmId,
        expirationDate: {
          gte: new Date(),
          lte: futureDate
        }
      }
    });

    return items.map((item) => this.toDomainItem(item));
  }

  async calculateTotalInventoryValue(farmId: string): Promise<number> {
    const result = await this.prisma.inventoryItem.aggregate({
      where: {farmId},
      _sum: {totalValue: true}
    });

    return result._sum.totalValue || 0;
  }

  async findItemUsageHistory(
    itemId: string,
    days: number = 30
  ): Promise<InventoryTransaction[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const transactions = await this.prisma.inventoryTransaction.findMany({
      where: {
        itemId,
        transactionType: {
          in: ['usage', 'sale', 'waste']
        },
        createdAt: {
          gte: startDate
        }
      },
      orderBy: {createdAt: 'desc'}
    });

    return transactions.map((transaction) =>
      this.toDomainTransaction(transaction)
    );
  }

  // Domain conversion methods
  private toDomainItem(item: {
    id: string;
    farmId: string;
    name: string;
    category: string;
    subcategory: string | null;
    description: string | null;
    currentQuantity: number;
    unit: string;
    minimumQuantity: number | null;
    unitCost: number | null;
    totalValue: number | null;
    supplier: string | null;
    sku: string | null;
    brand: string | null;
    expirationDate: Date | null;
    storageLocation: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): InventoryItem {
    return new InventoryItem({
      id: item.id,
      farmId: item.farmId,
      name: item.name,
      category: item.category as
        | 'seeds'
        | 'fertilizers'
        | 'feed'
        | 'tools'
        | 'harvested_produce'
        | 'other',
      subcategory: item.subcategory || undefined,
      description: item.description || undefined,
      currentQuantity: item.currentQuantity,
      unit: item.unit,
      minimumQuantity: item.minimumQuantity || undefined,
      unitCost: item.unitCost || undefined,
      totalValue: item.totalValue || undefined,
      supplier: item.supplier || undefined,
      sku: item.sku || undefined,
      brand: item.brand || undefined,
      expirationDate: item.expirationDate || undefined,
      storageLocation: item.storageLocation || undefined,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt
    });
  }

  private toDomainTransaction(transaction: {
    id: string;
    itemId: string;
    transactionType: string;
    quantity: number;
    unitCost: number | null;
    totalCost: number | null;
    notes: string | null;
    referenceNumber: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): InventoryTransaction {
    return new InventoryTransaction({
      id: transaction.id,
      itemId: transaction.itemId,
      transactionType: transaction.transactionType as
        | 'purchase'
        | 'usage'
        | 'sale'
        | 'adjustment'
        | 'waste',
      quantity: transaction.quantity,
      unitCost: transaction.unitCost || undefined,
      totalCost: transaction.totalCost || undefined,
      notes: transaction.notes || undefined,
      referenceNumber: transaction.referenceNumber || undefined,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt
    });
  }
}
