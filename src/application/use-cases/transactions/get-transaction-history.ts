import { Result, ok, err } from '@/shared/types/result';
import { QueryError } from '@/shared/types/errors';
import { Transaction } from '@/domain/entities/transaction';
import { TransactionRepository, TransactionFilters } from '@/application/ports/transaction-repository';

export interface GetTransactionHistoryInput {
  accountId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
  searchText?: string;
  tags?: string[];
  minAmount?: number;
  maxAmount?: number;
  sortBy?: 'date' | 'amount' | 'description';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface GetTransactionHistoryOutput {
  transactions: Transaction[];
  total: number;
  hasMore: boolean;
}

export class GetTransactionHistoryUseCase {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async execute(input: GetTransactionHistoryInput): Promise<Result<GetTransactionHistoryOutput, QueryError>> {
    try {
      // Build filter
      const filter: TransactionFilters = {
        accountId: input.accountId,
        categoryId: input.categoryId,
        type: input.type,
        startDate: input.startDate,
        endDate: input.endDate,
        searchText: input.searchText,
        tags: input.tags,
        minAmount: input.minAmount,
        maxAmount: input.maxAmount,
      };

      // Get transactions
      const transactionsResult = await this.transactionRepository.findAll(filter);
      if (!transactionsResult.ok) {
        return err(transactionsResult.error);
      }

      let transactions = transactionsResult.value;

      // Sort transactions
      const sortBy = input.sortBy ?? 'date';
      const sortOrder = input.sortOrder ?? 'desc';

      transactions = transactions.sort((a, b) => {
        let comparison = 0;

        if (sortBy === 'date') {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortBy === 'amount') {
          comparison = a.amount - b.amount;
        } else if (sortBy === 'description') {
          comparison = a.description.localeCompare(b.description);
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });

      // Apply pagination
      const total = transactions.length;
      const offset = input.offset ?? 0;
      const limit = input.limit ?? 50;

      const paginatedTransactions = transactions.slice(offset, offset + limit);
      const hasMore = offset + limit < total;

      return ok({
        transactions: paginatedTransactions,
        total,
        hasMore,
      });
    } catch (error) {
      return err(new QueryError('Failed to get transaction history', { error }));
    }
  }
}

// Made with Bob
