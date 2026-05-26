import { Result } from '@/shared/types/result';
import {
  SaveError,
  NotFoundError,
  QueryError,
  DeleteError,
  UpdateError,
} from '@/shared/types/errors';
import { Account, AccountData, AccountType } from '@/domain/entities/account';

export interface AccountFilters {
  type?: AccountType;
  isActive?: boolean;
  currency?: string;
}

export interface AccountRepository {
  save(account: Account): Promise<Result<Account, SaveError>>;
  
  findById(id: string): Promise<Result<Account, NotFoundError>>;
  
  findAll(filters?: AccountFilters): Promise<Result<Account[], QueryError>>;
  
  findByType(type: AccountType): Promise<Result<Account[], QueryError>>;
  
  findActive(): Promise<Result<Account[], QueryError>>;
  
  update(account: Account): Promise<Result<Account, UpdateError>>;
  
  delete(id: string): Promise<Result<void, DeleteError>>;
  
  count(filters?: AccountFilters): Promise<Result<number, QueryError>>;
  
  getTotalBalance(currency: string): Promise<Result<number, QueryError>>;
}

// Made with Bob
