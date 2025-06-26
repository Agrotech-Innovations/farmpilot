import {LivestockGroup, LivestockAnimal, HealthRecord} from '../entities';

export interface LivestockRepository {
  // Livestock Groups
  findGroupsByFarm(farmId: string): Promise<LivestockGroup[]>;
  findGroupById(id: string): Promise<LivestockGroup | null>;
  saveGroup(group: LivestockGroup): Promise<void>;
  deleteGroup(id: string): Promise<void>;

  // Livestock Animals
  findAnimalsByGroup(groupId: string): Promise<LivestockAnimal[]>;
  findAnimalById(id: string): Promise<LivestockAnimal | null>;
  findAnimalByTagNumber(
    groupId: string,
    tagNumber: string
  ): Promise<LivestockAnimal | null>;
  saveAnimal(animal: LivestockAnimal): Promise<void>;
  deleteAnimal(id: string): Promise<void>;

  // Health Records
  findHealthRecordsByAnimal(animalId: string): Promise<HealthRecord[]>;
  findHealthRecordById(id: string): Promise<HealthRecord | null>;
  saveHealthRecord(record: HealthRecord): Promise<void>;
  deleteHealthRecord(id: string): Promise<void>;

  // Analytics
  countAnimalsByFarm(farmId: string): Promise<number>;
  findUnhealthyAnimals(farmId: string): Promise<LivestockAnimal[]>;
  findUpcomingVaccinations(
    farmId: string,
    daysAhead?: number
  ): Promise<HealthRecord[]>;
}
