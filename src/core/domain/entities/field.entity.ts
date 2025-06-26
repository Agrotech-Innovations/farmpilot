import {BaseEntity} from '@/core/domain/entities/base.entity';

export interface FieldProps {
  id: string;
  farmId: string;
  name: string;
  description?: string;
  acres: number;
  soilType?: string;
  coordinates?: string; // GeoJSON polygon
  createdAt?: Date;
  updatedAt?: Date;
}

export class Field extends BaseEntity {
  public readonly farmId: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly acres: number;
  public readonly soilType?: string;
  public readonly coordinates?: string;

  constructor(props: FieldProps) {
    super(props.id, props.createdAt, props.updatedAt);

    // Validate required fields
    this.validateRequired(props.farmId, 'Farm ID');
    this.validateRequired(props.name, 'Field name');
    this.validatePositiveNumber(props.acres, 'Acres');

    this.farmId = props.farmId;
    this.name = props.name;
    this.description = props.description;
    this.acres = props.acres;
    this.soilType = props.soilType;
    this.coordinates = props.coordinates;
  }

  public updateBasicInfo(name: string, description?: string): Field {
    this.validateRequired(name, 'Field name');

    return new Field({
      ...this.toProps(),
      name,
      description,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateAcres(acres: number): Field {
    this.validatePositiveNumber(acres, 'Acres');

    return new Field({
      ...this.toProps(),
      acres,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateSoilInfo(soilType: string): Field {
    return new Field({
      ...this.toProps(),
      soilType,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateCoordinates(coordinates: string): Field {
    return new Field({
      ...this.toProps(),
      coordinates,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  private toProps(): FieldProps {
    return {
      id: this.id,
      farmId: this.farmId,
      name: this.name,
      description: this.description,
      acres: this.acres,
      soilType: this.soilType,
      coordinates: this.coordinates,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
