import {Field} from '@/core/domain/entities';
import {FieldRepository, FarmRepository} from '@/core/domain/repositories';

export interface ListFieldsRequest {
  farmId: string;
}

export interface ListFieldsResponse {
  fields: Field[];
}

export class ListFieldsUseCase {
  constructor(
    private fieldRepository: FieldRepository,
    private farmRepository: FarmRepository
  ) {}

  async execute(request: ListFieldsRequest): Promise<ListFieldsResponse> {
    // Validate the farm exists
    const farm = await this.farmRepository.getById(request.farmId);
    if (!farm) {
      throw new Error('Farm not found');
    }

    const fields = await this.fieldRepository.findByFarmId(request.farmId);

    return {fields};
  }
}
