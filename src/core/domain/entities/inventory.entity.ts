import {BaseEntity} from './base.entity';

export interface InventoryItemProps {
  id: string;
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
  currentQuantity: number;
  unit: string;
  minimumQuantity?: number;
  unitCost?: number;
  totalValue?: number;
  supplier?: string;
  sku?: string;
  brand?: string;
  expirationDate?: Date;
  storageLocation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface InventoryTransactionProps {
  id: string;
  itemId: string;
  transactionType: 'purchase' | 'usage' | 'sale' | 'adjustment' | 'waste';
  quantity: number;
  unitCost?: number;
  totalCost?: number;
  notes?: string;
  referenceNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class InventoryItem extends BaseEntity {
  public readonly farmId: string;
  public readonly name: string;
  public readonly category:
    | 'seeds'
    | 'fertilizers'
    | 'feed'
    | 'tools'
    | 'harvested_produce'
    | 'other';
  public readonly subcategory?: string;
  public readonly description?: string;
  public readonly currentQuantity: number;
  public readonly unit: string;
  public readonly minimumQuantity?: number;
  public readonly unitCost?: number;
  public readonly totalValue?: number;
  public readonly supplier?: string;
  public readonly sku?: string;
  public readonly brand?: string;
  public readonly expirationDate?: Date;
  public readonly storageLocation?: string;

  constructor(props: InventoryItemProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.validateRequired(props.farmId, 'Farm ID');
    this.validateRequired(props.name, 'Item name');
    this.validateRequired(props.category, 'Category');
    this.validateRequired(props.unit, 'Unit');
    this.validatePositiveNumber(props.currentQuantity, 'Current quantity');

    if (props.minimumQuantity !== undefined) {
      this.validatePositiveNumber(props.minimumQuantity, 'Minimum quantity');
    }
    if (props.unitCost !== undefined) {
      this.validatePositiveNumber(props.unitCost, 'Unit cost');
    }
    if (props.totalValue !== undefined) {
      this.validatePositiveNumber(props.totalValue, 'Total value');
    }

    this.farmId = props.farmId;
    this.name = props.name;
    this.category = props.category;
    this.subcategory = props.subcategory;
    this.description = props.description;
    this.currentQuantity = props.currentQuantity;
    this.unit = props.unit;
    this.minimumQuantity = props.minimumQuantity;
    this.unitCost = props.unitCost;
    this.totalValue = props.totalValue;
    this.supplier = props.supplier;
    this.sku = props.sku;
    this.brand = props.brand;
    this.expirationDate = props.expirationDate;
    this.storageLocation = props.storageLocation;
  }

  public updateQuantity(newQuantity: number): InventoryItem {
    this.validatePositiveNumber(newQuantity, 'Quantity');

    return new InventoryItem({
      ...this.toProps(),
      currentQuantity: newQuantity,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public adjustQuantity(adjustment: number): InventoryItem {
    const newQuantity = this.currentQuantity + adjustment;
    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    return this.updateQuantity(newQuantity);
  }

  public updatePricing(unitCost?: number, totalValue?: number): InventoryItem {
    if (unitCost !== undefined) {
      this.validatePositiveNumber(unitCost, 'Unit cost');
    }
    if (totalValue !== undefined) {
      this.validatePositiveNumber(totalValue, 'Total value');
    }

    return new InventoryItem({
      ...this.toProps(),
      unitCost,
      totalValue,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public isLowStock(): boolean {
    if (!this.minimumQuantity) return false;
    return this.currentQuantity <= this.minimumQuantity;
  }

  public isExpired(): boolean {
    if (!this.expirationDate) return false;
    return new Date() > this.expirationDate;
  }

  public isExpiringSoon(daysAhead: number = 30): boolean {
    if (!this.expirationDate) return false;
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    return this.expirationDate <= futureDate;
  }

  private toProps(): InventoryItemProps {
    return {
      id: this.id,
      farmId: this.farmId,
      name: this.name,
      category: this.category,
      subcategory: this.subcategory,
      description: this.description,
      currentQuantity: this.currentQuantity,
      unit: this.unit,
      minimumQuantity: this.minimumQuantity,
      unitCost: this.unitCost,
      totalValue: this.totalValue,
      supplier: this.supplier,
      sku: this.sku,
      brand: this.brand,
      expirationDate: this.expirationDate,
      storageLocation: this.storageLocation,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export class InventoryTransaction extends BaseEntity {
  public readonly itemId: string;
  public readonly transactionType:
    | 'purchase'
    | 'usage'
    | 'sale'
    | 'adjustment'
    | 'waste';
  public readonly quantity: number;
  public readonly unitCost?: number;
  public readonly totalCost?: number;
  public readonly notes?: string;
  public readonly referenceNumber?: string;

  constructor(props: InventoryTransactionProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.validateRequired(props.itemId, 'Item ID');
    this.validateRequired(props.transactionType, 'Transaction type');
    this.validateRequired(props.quantity, 'Quantity');

    if (props.unitCost !== undefined) {
      this.validatePositiveNumber(props.unitCost, 'Unit cost');
    }
    if (props.totalCost !== undefined) {
      this.validatePositiveNumber(props.totalCost, 'Total cost');
    }

    this.itemId = props.itemId;
    this.transactionType = props.transactionType;
    this.quantity = props.quantity;
    this.unitCost = props.unitCost;
    this.totalCost = props.totalCost;
    this.notes = props.notes;
    this.referenceNumber = props.referenceNumber;
  }

  public isIncoming(): boolean {
    return (
      ['purchase', 'adjustment'].includes(this.transactionType) &&
      this.quantity > 0
    );
  }

  public isOutgoing(): boolean {
    return (
      ['usage', 'sale', 'waste'].includes(this.transactionType) ||
      (this.transactionType === 'adjustment' && this.quantity < 0)
    );
  }

  private toProps(): InventoryTransactionProps {
    return {
      id: this.id,
      itemId: this.itemId,
      transactionType: this.transactionType,
      quantity: this.quantity,
      unitCost: this.unitCost,
      totalCost: this.totalCost,
      notes: this.notes,
      referenceNumber: this.referenceNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
