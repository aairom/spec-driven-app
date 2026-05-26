import { Result } from '@/shared/types/result';
import {
  SaveError,
  NotFoundError,
  QueryError,
  DeleteError,
  UpdateError,
} from '@/shared/types/errors';
import { Transaction, TransactionData } from '@/domain/entities/transaction';

export interface TransactionFilters {
  accountId?: string;
  categoryId?: string;
  type?: 'income' | 'expense' | 'transfer';
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
  searchText?: string;
  tags?: string[];
}

export interface TransactionRepository {
  save(transaction: Transaction): Promise<Result<Transaction, SaveError>>;
  
  findById(id: string): Promise<Result<Transaction, NotFoundError>>;
  
  findAll(filters?: TransactionFilters): Promise<Result<Transaction[], QueryError>>;
  
  findByAccountId(accountId: string): Promise<Result<Transaction[], QueryError>>;
  
  findByCategoryId(categoryId: string): Promise<Result<Transaction[], QueryError>>;
  
  findByDateRange(startDate: string, endDate: string): Promise<Result<Transaction[], QueryError>>;
  
  update(transaction: Transaction): Promise<Result<Transaction, UpdateError>>;
  
  delete(id: string): Promise<Result<void, DeleteError>>;
  
  deleteByAccountId(accountId: string): Promise<Result<void, DeleteError>>;
  
  count(filters?: TransactionFilters): Promise<Result<number, QueryError>>;
}

// Made with Bob
