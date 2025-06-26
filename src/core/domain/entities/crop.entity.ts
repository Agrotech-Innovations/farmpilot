import {BaseEntity} from './base.entity';

export interface CropProps {
  id: string;
  farmId: string;
  fieldId?: string;
  name: string;
  variety?: string;
  plantingDate?: Date;
  expectedHarvestDate?: Date;
  actualHarvestDate?: Date;
  plannedAcres?: number;
  actualAcres?: number;
  seedsPerAcre?: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type CropStatus =
  | 'planned'
  | 'planted'
  | 'growing'
  | 'harvested'
  | 'failed';

export class Crop extends BaseEntity {
  public readonly farmId: string;
  public readonly fieldId?: string;
  public readonly name: string;
  public readonly variety?: string;
  public readonly plantingDate?: Date;
  public readonly expectedHarvestDate?: Date;
  public readonly actualHarvestDate?: Date;
  public readonly plannedAcres?: number;
  public readonly actualAcres?: number;
  public readonly seedsPerAcre?: number;
  public readonly status: CropStatus;

  constructor(props: CropProps) {
    super(props.id, props.createdAt, props.updatedAt);

    // Validate required fields
    this.validateRequired(props.farmId, 'Farm ID');
    this.validateRequired(props.name, 'Crop name');

    // Validate positive numbers if provided
    if (props.plannedAcres !== undefined) {
      this.validatePositiveNumber(props.plannedAcres, 'Planned acres');
    }
    if (props.actualAcres !== undefined) {
      this.validatePositiveNumber(props.actualAcres, 'Actual acres');
    }
    if (props.seedsPerAcre !== undefined) {
      this.validatePositiveNumber(props.seedsPerAcre, 'Seeds per acre');
    }

    // Validate status
    const validStatuses: CropStatus[] = [
      'planned',
      'planted',
      'growing',
      'harvested',
      'failed'
    ];
    const status = (props.status as CropStatus) ?? 'planned';
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid crop status: ${props.status}`);
    }

    this.farmId = props.farmId;
    this.fieldId = props.fieldId;
    this.name = props.name;
    this.variety = props.variety;
    this.plantingDate = props.plantingDate;
    this.expectedHarvestDate = props.expectedHarvestDate;
    this.actualHarvestDate = props.actualHarvestDate;
    this.plannedAcres = props.plannedAcres;
    this.actualAcres = props.actualAcres;
    this.seedsPerAcre = props.seedsPerAcre;
    this.status = status;
  }

  public updateBasicInfo(name: string, variety?: string): Crop {
    this.validateRequired(name, 'Crop name');

    return new Crop({
      ...this.toProps(),
      name,
      variety,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public planPlanting(
    plantingDate: Date,
    expectedHarvestDate?: Date,
    plannedAcres?: number
  ): Crop {
    if (plannedAcres !== undefined) {
      this.validatePositiveNumber(plannedAcres, 'Planned acres');
    }

    // Validate dates
    if (expectedHarvestDate && plantingDate >= expectedHarvestDate) {
      throw new Error('Expected harvest date must be after planting date');
    }

    return new Crop({
      ...this.toProps(),
      plantingDate,
      expectedHarvestDate,
      plannedAcres,
      status: 'planned',
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public markAsPlanted(actualAcres?: number, seedsPerAcre?: number): Crop {
    if (actualAcres !== undefined) {
      this.validatePositiveNumber(actualAcres, 'Actual acres');
    }
    if (seedsPerAcre !== undefined) {
      this.validatePositiveNumber(seedsPerAcre, 'Seeds per acre');
    }

    return new Crop({
      ...this.toProps(),
      actualAcres,
      seedsPerAcre,
      status: 'planted',
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public markAsGrowing(): Crop {
    if (this.status !== 'planted') {
      throw new Error(
        'Crop must be planted before it can be marked as growing'
      );
    }

    return new Crop({
      ...this.toProps(),
      status: 'growing',
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public markAsHarvested(harvestDate: Date): Crop {
    if (this.status !== 'growing') {
      throw new Error('Crop must be growing before it can be harvested');
    }

    if (this.plantingDate && harvestDate <= this.plantingDate) {
      throw new Error('Harvest date must be after planting date');
    }

    return new Crop({
      ...this.toProps(),
      actualHarvestDate: harvestDate,
      status: 'harvested',
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public markAsFailed(): Crop {
    return new Crop({
      ...this.toProps(),
      status: 'failed',
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public assignToField(fieldId: string): Crop {
    this.validateRequired(fieldId, 'Field ID');

    return new Crop({
      ...this.toProps(),
      fieldId,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public getDaysToHarvest(): number | null {
    if (!this.expectedHarvestDate) return null;

    const now = new Date();
    const timeDiff = this.expectedHarvestDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  public getGrowingDays(): number | null {
    if (!this.plantingDate) return null;

    const endDate = this.actualHarvestDate || new Date();
    const timeDiff = endDate.getTime() - this.plantingDate.getTime();
    return Math.floor(timeDiff / (1000 * 3600 * 24));
  }

  public isOverdue(): boolean {
    if (!this.expectedHarvestDate || this.status === 'harvested') return false;
    return new Date() > this.expectedHarvestDate;
  }

  public getStatusDisplay(): string {
    switch (this.status) {
      case 'planned':
        return 'Planned';
      case 'planted':
        return 'Planted';
      case 'growing':
        return 'Growing';
      case 'harvested':
        return 'Harvested';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  }

  private toProps(): CropProps {
    return {
      id: this.id,
      farmId: this.farmId,
      fieldId: this.fieldId,
      name: this.name,
      variety: this.variety,
      plantingDate: this.plantingDate,
      expectedHarvestDate: this.expectedHarvestDate,
      actualHarvestDate: this.actualHarvestDate,
      plannedAcres: this.plannedAcres,
      actualAcres: this.actualAcres,
      seedsPerAcre: this.seedsPerAcre,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
