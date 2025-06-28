import {BaseEntity} from './base.entity';

export interface LivestockGroupProps {
  id: string;
  farmId: string;
  name: string;
  species: string;
  breed?: string;
  currentCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LivestockAnimalProps {
  id: string;
  groupId: string;
  tagNumber: string;
  name?: string;
  sex: 'male' | 'female';
  birthDate?: Date;
  breed?: string;
  motherTagNumber?: string;
  fatherTagNumber?: string;
  currentWeight?: number;
  healthStatus: 'healthy' | 'sick' | 'injured' | 'deceased';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface HealthRecordProps {
  id: string;
  animalId: string;
  recordType: 'vaccination' | 'treatment' | 'checkup' | 'injury' | 'illness';
  description: string;
  treatment?: string;
  medication?: string;
  dosage?: string;
  veterinarian?: string;
  cost?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BreedingRecordProps {
  id: string;
  motherAnimalId: string;
  fatherAnimalId?: string;
  breedingDate: Date;
  expectedBirthDate?: Date;
  actualBirthDate?: Date;
  pregnancyStatus: 'bred' | 'confirmed' | 'aborted' | 'birthed';
  offspringCount?: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class LivestockGroup extends BaseEntity {
  public readonly farmId: string;
  public readonly name: string;
  public readonly species: string;
  public readonly breed?: string;
  public readonly currentCount: number;

  constructor(props: LivestockGroupProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.validateRequired(props.farmId, 'Farm ID');
    this.validateRequired(props.name, 'Group name');
    this.validateRequired(props.species, 'Species');
    this.validatePositiveNumber(props.currentCount, 'Current count');

    this.farmId = props.farmId;
    this.name = props.name;
    this.species = props.species;
    this.breed = props.breed;
    this.currentCount = props.currentCount;
  }

  public updateCount(newCount: number): LivestockGroup {
    this.validatePositiveNumber(newCount, 'Current count');

    return new LivestockGroup({
      ...this.toProps(),
      currentCount: newCount,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateDetails(name: string, breed?: string): LivestockGroup {
    this.validateRequired(name, 'Group name');

    return new LivestockGroup({
      ...this.toProps(),
      name,
      breed,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  private toProps(): LivestockGroupProps {
    return {
      id: this.id,
      farmId: this.farmId,
      name: this.name,
      species: this.species,
      breed: this.breed,
      currentCount: this.currentCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export class LivestockAnimal extends BaseEntity {
  public readonly groupId: string;
  public readonly tagNumber: string;
  public readonly name?: string;
  public readonly sex: 'male' | 'female';
  public readonly birthDate?: Date;
  public readonly breed?: string;
  public readonly motherTagNumber?: string;
  public readonly fatherTagNumber?: string;
  public readonly currentWeight?: number;
  public readonly healthStatus: 'healthy' | 'sick' | 'injured' | 'deceased';

  constructor(props: LivestockAnimalProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.validateRequired(props.groupId, 'Group ID');
    this.validateRequired(props.tagNumber, 'Tag number');
    this.validateRequired(props.sex, 'Sex');
    this.validateRequired(props.healthStatus, 'Health status');

    if (props.currentWeight !== undefined) {
      this.validatePositiveNumber(props.currentWeight, 'Current weight');
    }

    this.groupId = props.groupId;
    this.tagNumber = props.tagNumber;
    this.name = props.name;
    this.sex = props.sex;
    this.birthDate = props.birthDate;
    this.breed = props.breed;
    this.motherTagNumber = props.motherTagNumber;
    this.fatherTagNumber = props.fatherTagNumber;
    this.currentWeight = props.currentWeight;
    this.healthStatus = props.healthStatus;
  }

  public updateHealthStatus(
    status: 'healthy' | 'sick' | 'injured' | 'deceased'
  ): LivestockAnimal {
    return new LivestockAnimal({
      ...this.toProps(),
      healthStatus: status,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateWeight(weight: number): LivestockAnimal {
    this.validatePositiveNumber(weight, 'Weight');

    return new LivestockAnimal({
      ...this.toProps(),
      currentWeight: weight,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public getAge(): number | null {
    if (!this.birthDate) return null;
    const now = new Date();
    const birth = new Date(this.birthDate);
    return Math.floor(
      (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  public isHealthy(): boolean {
    return this.healthStatus === 'healthy';
  }

  private toProps(): LivestockAnimalProps {
    return {
      id: this.id,
      groupId: this.groupId,
      tagNumber: this.tagNumber,
      name: this.name,
      sex: this.sex,
      birthDate: this.birthDate,
      breed: this.breed,
      motherTagNumber: this.motherTagNumber,
      fatherTagNumber: this.fatherTagNumber,
      currentWeight: this.currentWeight,
      healthStatus: this.healthStatus,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export class HealthRecord extends BaseEntity {
  public readonly animalId: string;
  public readonly recordType:
    | 'vaccination'
    | 'treatment'
    | 'checkup'
    | 'injury'
    | 'illness';
  public readonly description: string;
  public readonly treatment?: string;
  public readonly medication?: string;
  public readonly dosage?: string;
  public readonly veterinarian?: string;
  public readonly cost?: number;
  public readonly notes?: string;

  constructor(props: HealthRecordProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.validateRequired(props.animalId, 'Animal ID');
    this.validateRequired(props.recordType, 'Record type');
    this.validateRequired(props.description, 'Description');

    if (props.cost !== undefined) {
      this.validatePositiveNumber(props.cost, 'Cost');
    }

    this.animalId = props.animalId;
    this.recordType = props.recordType;
    this.description = props.description;
    this.treatment = props.treatment;
    this.medication = props.medication;
    this.dosage = props.dosage;
    this.veterinarian = props.veterinarian;
    this.cost = props.cost;
    this.notes = props.notes;
  }

  private toProps(): HealthRecordProps {
    return {
      id: this.id,
      animalId: this.animalId,
      recordType: this.recordType,
      description: this.description,
      treatment: this.treatment,
      medication: this.medication,
      dosage: this.dosage,
      veterinarian: this.veterinarian,
      cost: this.cost,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

export class BreedingRecord extends BaseEntity {
  public readonly motherAnimalId: string;
  public readonly fatherAnimalId?: string;
  public readonly breedingDate: Date;
  public readonly expectedBirthDate?: Date;
  public readonly actualBirthDate?: Date;
  public readonly pregnancyStatus: 'bred' | 'confirmed' | 'aborted' | 'birthed';
  public readonly offspringCount?: number;
  public readonly notes?: string;

  constructor(props: BreedingRecordProps) {
    super(props.id, props.createdAt, props.updatedAt);

    this.validateRequired(props.motherAnimalId, 'Mother animal ID');
    this.validateRequired(props.breedingDate, 'Breeding date');
    this.validateRequired(props.pregnancyStatus, 'Pregnancy status');

    if (props.offspringCount !== undefined) {
      this.validatePositiveNumber(props.offspringCount, 'Offspring count');
    }

    // Validate dates
    if (props.expectedBirthDate && props.breedingDate) {
      if (props.expectedBirthDate <= props.breedingDate) {
        throw new Error('Expected birth date must be after breeding date');
      }
    }

    if (props.actualBirthDate && props.breedingDate) {
      if (props.actualBirthDate < props.breedingDate) {
        throw new Error('Actual birth date cannot be before breeding date');
      }
    }

    this.motherAnimalId = props.motherAnimalId;
    this.fatherAnimalId = props.fatherAnimalId;
    this.breedingDate = props.breedingDate;
    this.expectedBirthDate = props.expectedBirthDate;
    this.actualBirthDate = props.actualBirthDate;
    this.pregnancyStatus = props.pregnancyStatus;
    this.offspringCount = props.offspringCount;
    this.notes = props.notes;
  }

  public updatePregnancyStatus(
    status: 'bred' | 'confirmed' | 'aborted' | 'birthed',
    actualBirthDate?: Date,
    offspringCount?: number
  ): BreedingRecord {
    const props = this.toProps();

    if (status === 'birthed') {
      if (!actualBirthDate) {
        throw new Error('Actual birth date is required when status is birthed');
      }
      if (offspringCount === undefined || offspringCount < 0) {
        throw new Error(
          'Valid offspring count is required when status is birthed'
        );
      }
    }

    return new BreedingRecord({
      ...props,
      pregnancyStatus: status,
      actualBirthDate: actualBirthDate || props.actualBirthDate,
      offspringCount:
        offspringCount !== undefined ? offspringCount : props.offspringCount,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public updateExpectedBirthDate(expectedBirthDate: Date): BreedingRecord {
    if (expectedBirthDate <= this.breedingDate) {
      throw new Error('Expected birth date must be after breeding date');
    }

    return new BreedingRecord({
      ...this.toProps(),
      expectedBirthDate,
      updatedAt: this.withUpdatedTimestamp()
    });
  }

  public getGestationDays(): number | null {
    const endDate = this.actualBirthDate || new Date();
    return Math.floor(
      (endDate.getTime() - this.breedingDate.getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  public isPregnant(): boolean {
    return (
      this.pregnancyStatus === 'bred' || this.pregnancyStatus === 'confirmed'
    );
  }

  public hasGivenBirth(): boolean {
    return this.pregnancyStatus === 'birthed';
  }

  public isOverdue(): boolean {
    if (!this.expectedBirthDate || this.hasGivenBirth()) {
      return false;
    }
    return new Date() > this.expectedBirthDate;
  }

  private toProps(): BreedingRecordProps {
    return {
      id: this.id,
      motherAnimalId: this.motherAnimalId,
      fatherAnimalId: this.fatherAnimalId,
      breedingDate: this.breedingDate,
      expectedBirthDate: this.expectedBirthDate,
      actualBirthDate: this.actualBirthDate,
      pregnancyStatus: this.pregnancyStatus,
      offspringCount: this.offspringCount,
      notes: this.notes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}
