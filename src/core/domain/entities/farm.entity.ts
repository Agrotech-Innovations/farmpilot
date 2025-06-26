import {BaseEntity} from './base.entity';

export interface FarmProps {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  totalAcres?: number;
  farmType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Farm extends BaseEntity {
  public readonly organizationId: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly address?: string;
  public readonly latitude?: number;
  public readonly longitude?: number;
  public readonly totalAcres?: number;
  public readonly farmType?: string;

  constructor(props: FarmProps) {
    super(props.id, props.createdAt, props.updatedAt);

    // Validate required fields
    this.validateRequired(props.organizationId, 'Organization ID');
    this.validateRequired(props.name, 'Farm name');

    // Validate coordinates if provided
    if (props.latitude !== undefined) {
      this.validateLatitude(props.latitude);
    }
    if (props.longitude !== undefined) {
      this.validateLongitude(props.longitude);
    }

    // Validate total acres if provided
    if (props.totalAcres !== undefined) {
      this.validatePositiveNumber(props.totalAcres, 'Total acres');
    }

    this.organizationId = props.organizationId;
    this.name = props.name;
    this.description = props.description;
    this.address = props.address;
    this.latitude = props.latitude;
    this.longitude = props.longitude;
    this.totalAcres = props.totalAcres;
    this.farmType = props.farmType;
  }

  public updateBasicInfo(name: string, description?: string): Farm {
    this.validateRequired(name, 'Farm name');

    return new Farm({
      ...this.toProps(),
      name,
      description,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateLocation(
    address?: string,
    latitude?: number,
    longitude?: number
  ): Farm {
    // Validate coordinates if provided
    if (latitude !== undefined) {
      this.validateLatitude(latitude);
    }
    if (longitude !== undefined) {
      this.validateLongitude(longitude);
    }

    return new Farm({
      ...this.toProps(),
      address,
      latitude,
      longitude,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateFarmDetails(totalAcres?: number, farmType?: string): Farm {
    if (totalAcres !== undefined) {
      this.validatePositiveNumber(totalAcres, 'Total acres');
    }

    return new Farm({
      ...this.toProps(),
      totalAcres,
      farmType,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public hasLocation(): boolean {
    return this.latitude !== undefined && this.longitude !== undefined;
  }

  public getCoordinates(): {latitude: number; longitude: number} | null {
    if (this.hasLocation()) {
      return {
        latitude: this.latitude!,
        longitude: this.longitude!
      };
    }
    return null;
  }

  public getFarmTypeDisplay(): string {
    switch (this.farmType) {
      case 'crop':
        return 'Crop Farm';
      case 'livestock':
        return 'Livestock Farm';
      case 'mixed':
        return 'Mixed Farm';
      case 'organic':
        return 'Organic Farm';
      default:
        return 'General Farm';
    }
  }

  private validateLatitude(latitude: number): void {
    if (latitude < -90 || latitude > 90) {
      throw new Error('Latitude must be between -90 and 90 degrees');
    }
  }

  private validateLongitude(longitude: number): void {
    if (longitude < -180 || longitude > 180) {
      throw new Error('Longitude must be between -180 and 180 degrees');
    }
  }

  private toProps(): FarmProps {
    return {
      id: this.id,
      organizationId: this.organizationId,
      name: this.name,
      description: this.description,
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude,
      totalAcres: this.totalAcres,
      farmType: this.farmType,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
