import {createServerFn} from '@tanstack/react-start';
import {container} from '@/infrastructure/di/container';
import {
  CreateInventoryItemUseCase,
  RecordInventoryTransactionUseCase,
  GetInventoryItemUseCase,
  ListInventoryItemsUseCase,
  UpdateInventoryItemUseCase,
  DeleteInventoryItemUseCase,
  GetInventoryAlertsUseCase,
  GetInventoryAnalyticsUseCase,
  GetInventoryTransactionsUseCase
} from '@/core/application/use-cases/inventory';
import {InventoryItem, InventoryTransaction} from '@/core/domain/entities';
import {z} from 'zod';

// Validation schemas
const createInventoryItemSchema = z.object({
  farmId: z.string().min(1),
  name: z.string().min(1),
  category: z.enum([
    'seeds',
    'fertilizers',
    'feed',
    'tools',
    'harvested_produce',
    'other'
  ]),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  initialQuantity: z.number().min(0),
  unit: z.string().min(1),
  minimumQuantity: z.number().min(0).optional(),
  unitCost: z.number().min(0).optional(),
  supplier: z.string().optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  expirationDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  storageLocation: z.string().optional()
});

const updateInventoryItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).optional(),
  category: z
    .enum([
      'seeds',
      'fertilizers',
      'feed',
      'tools',
      'harvested_produce',
      'other'
    ])
    .optional(),
  subcategory: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().min(1).optional(),
  minimumQuantity: z.number().min(0).optional(),
  unitCost: z.number().min(0).optional(),
  supplier: z.string().optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  expirationDate: z
    .string()
    .datetime()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  storageLocation: z.string().optional()
});

const recordTransactionSchema = z.object({
  itemId: z.string().min(1),
  transactionType: z.enum(['purchase', 'usage', 'sale', 'adjustment', 'waste']),
  quantity: z.number(),
  unitCost: z.number().min(0).optional(),
  totalCost: z.number().min(0).optional(),
  notes: z.string().optional(),
  referenceNumber: z.string().optional()
});

const getInventoryItemSchema = z.object({
  id: z.string().min(1)
});

const listInventoryItemsSchema = z.object({
  farmId: z.string().min(1),
  category: z.string().optional()
});

const deleteInventoryItemSchema = z.object({
  id: z.string().min(1)
});

const getInventoryAlertsSchema = z.object({
  farmId: z.string().min(1),
  expirationDaysAhead: z.number().min(1).optional()
});

const getInventoryAnalyticsSchema = z.object({
  farmId: z.string().min(1),
  itemId: z.string().optional(),
  days: z.number().min(1).optional()
});

const getInventoryTransactionsSchema = z.object({
  itemId: z.string().min(1)
});

// Helper function to serialize inventory item
const serializeInventoryItem = (item: InventoryItem) => ({
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
  expirationDate: item.expirationDate?.toISOString(),
  storageLocation: item.storageLocation,
  createdAt: item.createdAt?.toISOString(),
  updatedAt: item.updatedAt?.toISOString()
});

// Helper function to serialize inventory transaction
const serializeInventoryTransaction = (transaction: InventoryTransaction) => ({
  id: transaction.id,
  itemId: transaction.itemId,
  transactionType: transaction.transactionType,
  quantity: transaction.quantity,
  unitCost: transaction.unitCost,
  totalCost: transaction.totalCost,
  notes: transaction.notes,
  referenceNumber: transaction.referenceNumber,
  createdAt: transaction.createdAt?.toISOString(),
  updatedAt: transaction.updatedAt?.toISOString()
});

// Server functions
export const createInventoryItem = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return createInventoryItemSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const createInventoryItemUseCase =
        container.get<CreateInventoryItemUseCase>('createInventoryItemUseCase');

      const result = await createInventoryItemUseCase.execute(data);

      return {
        success: true,
        data: serializeInventoryItem(result)
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to create inventory item'
      };
    }
  });

export const getInventoryItem = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getInventoryItemSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getInventoryItemUseCase = container.get<GetInventoryItemUseCase>(
        'getInventoryItemUseCase'
      );

      const result = await getInventoryItemUseCase.execute(data);

      return {
        success: true,
        data: serializeInventoryItem(result)
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get inventory item'
      };
    }
  });

export const listInventoryItems = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return listInventoryItemsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const listInventoryItemsUseCase =
        container.get<ListInventoryItemsUseCase>('listInventoryItemsUseCase');

      const result = await listInventoryItemsUseCase.execute(data);

      return {
        success: true,
        data: {
          items: result.items.map(serializeInventoryItem)
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to list inventory items'
      };
    }
  });

export const updateInventoryItem = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return updateInventoryItemSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const updateInventoryItemUseCase =
        container.get<UpdateInventoryItemUseCase>('updateInventoryItemUseCase');

      const result = await updateInventoryItemUseCase.execute(data);

      return {
        success: true,
        data: serializeInventoryItem(result)
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to update inventory item'
      };
    }
  });

export const deleteInventoryItem = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return deleteInventoryItemSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const deleteInventoryItemUseCase =
        container.get<DeleteInventoryItemUseCase>('deleteInventoryItemUseCase');

      await deleteInventoryItemUseCase.execute(data);

      return {
        success: true,
        message: 'Inventory item deleted successfully'
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to delete inventory item'
      };
    }
  });

export const recordInventoryTransaction = createServerFn({
  method: 'POST'
})
  .validator((data: unknown) => {
    return recordTransactionSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const recordInventoryTransactionUseCase =
        container.get<RecordInventoryTransactionUseCase>(
          'recordInventoryTransactionUseCase'
        );

      const result = await recordInventoryTransactionUseCase.execute(data);

      return {
        success: true,
        data: serializeInventoryTransaction(result)
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to record inventory transaction'
      };
    }
  });

export const getInventoryTransactions = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getInventoryTransactionsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getInventoryTransactionsUseCase =
        container.get<GetInventoryTransactionsUseCase>(
          'getInventoryTransactionsUseCase'
        );

      const result = await getInventoryTransactionsUseCase.execute(data);

      return {
        success: true,
        data: {
          transactions: result.transactions.map(serializeInventoryTransaction)
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get inventory transactions'
      };
    }
  });

export const getInventoryAlerts = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getInventoryAlertsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getInventoryAlertsUseCase =
        container.get<GetInventoryAlertsUseCase>('getInventoryAlertsUseCase');

      const result = await getInventoryAlertsUseCase.execute(data);

      return {
        success: true,
        data: {
          lowStockItems: result.lowStockItems.map(serializeInventoryItem),
          expiredItems: result.expiredItems.map(serializeInventoryItem),
          expiringSoonItems: result.expiringSoonItems.map(
            serializeInventoryItem
          )
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get inventory alerts'
      };
    }
  });

export const getInventoryAnalytics = createServerFn({
  method: 'GET'
})
  .validator((data: unknown) => {
    return getInventoryAnalyticsSchema.parse(data);
  })
  .handler(async ({data}) => {
    try {
      const getInventoryAnalyticsUseCase =
        container.get<GetInventoryAnalyticsUseCase>(
          'getInventoryAnalyticsUseCase'
        );

      const result = await getInventoryAnalyticsUseCase.execute(data);

      return {
        success: true,
        data: {
          totalInventoryValue: result.totalInventoryValue,
          itemUsageHistory: result.itemUsageHistory?.map(
            serializeInventoryTransaction
          )
        }
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : 'Failed to get inventory analytics'
      };
    }
  });
