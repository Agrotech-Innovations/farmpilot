import {Field} from '@/core/domain/entities';
import {FieldRepository, FarmRepository} from '@/core/domain/repositories';
import {v4 as uuidv4} from 'uuid';

export interface CreateFieldRequest {
  farmId: string;
  name: string;
  description?: string;
  acres: number;
  soilType?: string;
  coordinates?: string;
}

export interface CreateFieldResponse {
  field: Field;
}

export class CreateFieldUseCase {
  constructor(
    private fieldRepository: FieldRepository,
    private farmRepository: FarmRepository
  ) {}

  async execute(request: CreateFieldRequest): Promise<CreateFieldResponse> {
    // Validate the farm exists
    const farm = await this.farmRepository.getById(request.farmId);
    if (!farm) {
      throw new Error('Farm not found');
    }

    // Check if field name is unique within the farm
    const isNameUnique = await this.fieldRepository.isNameUniqueInFarm(
      request.farmId,
      request.name
    );
    if (!isNameUnique) {
      throw new Error('Field name already exists in this farm');
    }

    // Create the field
    const field = new Field({
      id: uuidv4(),
      farmId: request.farmId,
      name: request.name,
      description: request.description,
      acres: request.acres,
      soilType: request.soilType,
      coordinates: request.coordinates,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const savedField = await this.fieldRepository.create(field);

    return {field: savedField};
  }
}
