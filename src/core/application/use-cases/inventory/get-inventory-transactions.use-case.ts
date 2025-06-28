import {InventoryRepository} from '@/core/domain/repositories';
import {InventoryTransaction} from '@/core/domain/entities';

export interface GetInventoryTransactionsRequest {
  itemId: string;
}

export interface GetInventoryTransactionsResponse {
  transactions: InventoryTransaction[];
}

export class GetInventoryTransactionsUseCase {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async execute(
    request: GetInventoryTransactionsRequest
  ): Promise<GetInventoryTransactionsResponse> {
    const transactions = await this.inventoryRepository.findTransactionsByItem(
      request.itemId
    );

    return {transactions};
  }
}
