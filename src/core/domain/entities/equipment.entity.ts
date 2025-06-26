import {BaseEntity} from './base.entity';

export interface EquipmentProps {
  id: string;
  farmId: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currentValue?: number;
  status: 'operational' | 'maintenance' | 'broken' | 'retired';
  location?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface MaintenanceRecordProps {
  id: string;
  equipmentId: string;
  maintenanceType: 'routine' | 'repair' | 'inspection' | 'replacement';
  description: string;
  cost?: number;
  performedBy?: string;
  serviceProvider?: string;
  nextServiceDate?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Equipment extends BaseEntity {
  public readonly farmId: string;
  public readonly name: string;
  public readonly type: string;
  public readonly brand?: string;
  public readonly model?: string;
  public readonly serialNumber?: string;
  public readonly purchaseDate?: Date;
  public readonly purchasePrice?: number;
  public readonly currentValue?: number;
  public readonly status: 'operational' | 'maintenance' | 'broken' | 'retired';
  public readonly location?: string;

  constructor(props: EquipmentProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.validateRequired(props.farmId, 'Farm ID');
    this.validateRequired(props.name, 'Equipment name');
    this.validateRequired(props.type, 'Equipment type');
    this.validateRequired(props.status, 'Status');

    if (props.purchasePrice !== undefined) {
      this.validatePositiveNumber(props.purchasePrice, 'Purchase price');
    }
    if (props.currentValue !== undefined) {
      this.validatePositiveNumber(props.currentValue, 'Current value');
    }

    this.farmId = props.farmId;
    this.name = props.name;
    this.type = props.type;
    this.brand = props.brand;
    this.model = props.model;
    this.serialNumber = props.serialNumber;
    this.purchaseDate = props.purchaseDate;
    this.purchasePrice = props.purchasePrice;
    this.currentValue = props.currentValue;
    this.status = props.status;
    this.location = props.location;
  }

  public updateStatus(
    status: 'operational' | 'maintenance' | 'broken' | 'retired'
  ): Equipment {
    return new Equipment({
      ...this.toProps(),
      status,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateLocation(location: string): Equipment {
    return new Equipment({
      ...this.toProps(),
      location,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateValue(currentValue: number): Equipment {
    this.validatePositiveNumber(currentValue, 'Current value');

    return new Equipment({
      ...this.toProps(),
      currentValue,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public isOperational(): boolean {
    return this.status === 'operational';
  }

  public needsMaintenance(): boolean {
    return this.status === 'maintenance' || this.status === 'broken';
  }

  public getAge(): number | null {
    if (!this.purchaseDate) return null;
    const now = new Date();
    const purchase = new Date(this.purchaseDate);
    return Math.floor(
      (now.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
  }

  public getDepreciation(): number | null {
    if (!this.purchasePrice || !this.currentValue) return null;
    return (
      ((this.purchasePrice - this.currentValue) / this.purchasePrice) * 100
    );
  }

  private toProps(): EquipmentProps {
    return {
      id: this.id,
      farmId: this.farmId,
      name: this.name,
      type: this.type,
      brand: this.brand,
      model: this.model,
      serialNumber: this.serialNumber,
      purchaseDate: this.purchaseDate,
      purchasePrice: this.purchasePrice,
      currentValue: this.currentValue,
      status: this.status,
      location: this.location,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export class MaintenanceRecord extends BaseEntity {
  public readonly equipmentId: string;
  public readonly maintenanceType:
    | 'routine'
    | 'repair'
    | 'inspection'
    | 'replacement';
  public readonly description: string;
  public readonly cost?: number;
  public readonly performedBy?: string;
  public readonly serviceProvider?: string;
  public readonly nextServiceDate?: Date;
  public readonly notes?: string;

  constructor(props: MaintenanceRecordProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.validateRequired(props.equipmentId, 'Equipment ID');
    this.validateRequired(props.maintenanceType, 'Maintenance type');
    this.validateRequired(props.description, 'Description');

    if (props.cost !== undefined) {
      this.validatePositiveNumber(props.cost, 'Cost');
    }

    this.equipmentId = props.equipmentId;
    this.maintenanceType = props.maintenanceType;
    this.description = props.description;
    this.cost = props.cost;
    this.performedBy = props.performedBy;
    this.serviceProvider = props.serviceProvider;
    this.nextServiceDate = props.nextServiceDate;
    this.notes = props.notes;
  }

  public isRoutineMaintenance(): boolean {
    return this.maintenanceType === 'routine';
  }

  public isRepair(): boolean {
    return this.maintenanceType === 'repair';
  }

  private toProps(): MaintenanceRecordProps {
    return {
      id: this.id,
      equipmentId: this.equipmentId,
      maintenanceType: this.maintenanceType,
      description: this.description,
      cost: this.cost,
      performedBy: this.performedBy,
      serviceProvider: this.serviceProvider,
      nextServiceDate: this.nextServiceDate,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
