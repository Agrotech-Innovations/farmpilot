import {LivestockRepository} from '@/core/domain/repositories';
import {LivestockAnimal, LivestockGroup} from '@/core/domain/entities';

export interface AddLivestockAnimalRequest {
  groupId: string;
  tagNumber: string;
  name?: string;
  sex: 'male' | 'female';
  birthDate?: Date;
  breed?: string;
  motherTagNumber?: string;
  fatherTagNumber?: string;
  currentWeight?: number;
}

export class AddLivestockAnimalUseCase {
  constructor(private readonly livestockRepository: LivestockRepository) {}

  async execute(request: AddLivestockAnimalRequest): Promise<LivestockAnimal> {
    // Check if tag number already exists in the group
    const existingAnimal = await this.livestockRepository.findAnimalByTagNumber(
      request.groupId,
      request.tagNumber
    );

    if (existingAnimal) {
      throw new Error(
        `Animal with tag number ${request.tagNumber} already exists in this group`
      );
    }

    // Create the animal
    const animal = new LivestockAnimal({
      id: crypto.randomUUID(),
      groupId: request.groupId,
      tagNumber: request.tagNumber,
      name: request.name,
      sex: request.sex,
      birthDate: request.birthDate,
      breed: request.breed,
      motherTagNumber: request.motherTagNumber,
      fatherTagNumber: request.fatherTagNumber,
      currentWeight: request.currentWeight,
      healthStatus: 'healthy',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await this.livestockRepository.saveAnimal(animal);

    // Update group count
    const group = await this.livestockRepository.findGroupById(request.groupId);
    if (group) {
      const updatedGroup = group.updateCount(group.currentCount + 1);
      await this.livestockRepository.saveGroup(updatedGroup);
    }

    return animal;
  }
}
