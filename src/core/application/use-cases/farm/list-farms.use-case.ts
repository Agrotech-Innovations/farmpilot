import {Farm} from '@/core/domain/entities';
import {FarmRepository} from '@/core/domain/repositories';

export interface ListFarmsRequest {
  organizationId: string;
  limit?: number;
  offset?: number;
}

export interface ListFarmsResponse {
  farms: Farm[];
  total: number;
}

export class ListFarmsUseCase {
  constructor(private farmRepository: FarmRepository) {}

  async execute(request: ListFarmsRequest): Promise<ListFarmsResponse> {
    const farms = await this.farmRepository.findByOrganization(
      request.organizationId,
      {
        limit: request.limit,
        offset: request.offset
      }
    );

    const total = await this.farmRepository.countByOrganization(
      request.organizationId
    );

    return {
      farms,
      total
    };
  }
}
