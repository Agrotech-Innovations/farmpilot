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
}).handler(async (data: unknown) => {
  try {
    const validatedData = createInventoryItemSchema.parse(data);
    const createInventoryItemUseCase =
      container.get<CreateInventoryItemUseCase>('createInventoryItemUseCase');

    const result = await createInventoryItemUseCase.execute(validatedData);

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
}).handler(async (data: unknown) => {
  try {
    const validatedData = getInventoryItemSchema.parse(data);
    const getInventoryItemUseCase = container.get<GetInventoryItemUseCase>(
      'getInventoryItemUseCase'
    );

    const result = await getInventoryItemUseCase.execute(validatedData);

    return {
      success: true,
      data: serializeInventoryItem(result)
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get inventory item'
    };
  }
});

export const listInventoryItems = createServerFn({
  method: 'GET'
}).handler(async (data: unknown) => {
  try {
    const validatedData = listInventoryItemsSchema.parse(data);
    const listInventoryItemsUseCase = container.get<ListInventoryItemsUseCase>(
      'listInventoryItemsUseCase'
    );

    const result = await listInventoryItemsUseCase.execute(validatedData);

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
}).handler(async (data: unknown) => {
  try {
    const validatedData = updateInventoryItemSchema.parse(data);
    const updateInventoryItemUseCase =
      container.get<UpdateInventoryItemUseCase>('updateInventoryItemUseCase');

    const result = await updateInventoryItemUseCase.execute(validatedData);

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
}).handler(async (data: unknown) => {
  try {
    const validatedData = deleteInventoryItemSchema.parse(data);
    const deleteInventoryItemUseCase =
      container.get<DeleteInventoryItemUseCase>('deleteInventoryItemUseCase');

    await deleteInventoryItemUseCase.execute(validatedData);

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
}).handler(async (data: unknown) => {
  try {
    const validatedData = recordTransactionSchema.parse(data);
    const recordInventoryTransactionUseCase =
      container.get<RecordInventoryTransactionUseCase>(
        'recordInventoryTransactionUseCase'
      );

    const result =
      await recordInventoryTransactionUseCase.execute(validatedData);

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
}).handler(async (data: unknown) => {
  try {
    const validatedData = getInventoryTransactionsSchema.parse(data);
    const getInventoryTransactionsUseCase =
      container.get<GetInventoryTransactionsUseCase>(
        'getInventoryTransactionsUseCase'
      );

    const result = await getInventoryTransactionsUseCase.execute(validatedData);

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
}).handler(async (data: unknown) => {
  try {
    const validatedData = getInventoryAlertsSchema.parse(data);
    const getInventoryAlertsUseCase = container.get<GetInventoryAlertsUseCase>(
      'getInventoryAlertsUseCase'
    );

    const result = await getInventoryAlertsUseCase.execute(validatedData);

    return {
      success: true,
      data: {
        lowStockItems: result.lowStockItems.map(serializeInventoryItem),
        expiredItems: result.expiredItems.map(serializeInventoryItem),
        expiringSoonItems: result.expiringSoonItems.map(serializeInventoryItem)
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
}).handler(async (data: unknown) => {
  try {
    const validatedData = getInventoryAnalyticsSchema.parse(data);
    const getInventoryAnalyticsUseCase =
      container.get<GetInventoryAnalyticsUseCase>(
        'getInventoryAnalyticsUseCase'
      );

    const result = await getInventoryAnalyticsUseCase.execute(validatedData);

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
