import { Result, ok, err } from '@/shared/types/result';
import { SaveError, QueryError, DeleteError, NotFoundError, UpdateError } from '@/shared/types/errors';
import { Transaction, TransactionData } from '@/domain/entities/transaction';
import { TransactionRepository, TransactionFilters } from '@/application/ports/transaction-repository';
import { getDatabase } from './database';
import { promisifyRequest, promisifyTransaction } from './indexeddb-helpers';

export class TransactionRepositoryImpl implements TransactionRepository {
  private readonly storeName = 'transactions';

  async save(transaction: Transaction): Promise<Result<Transaction, SaveError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new SaveError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      await promisifyRequest(store.add(transaction.toJSON()));
      await promisifyTransaction(tx);
      
      return ok(transaction);
    } catch (error) {
      return err(new SaveError('Failed to save transaction', { error }));
    }
  }

  async update(transaction: Transaction): Promise<Result<Transaction, UpdateError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new UpdateError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      await promisifyRequest(store.put(transaction.toJSON()));
      await promisifyTransaction(tx);
      
      return ok(transaction);
    } catch (error) {
      return err(new UpdateError('Failed to update transaction', { error }));
    }
  }

  async delete(id: string): Promise<Result<void, DeleteError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new DeleteError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      await promisifyRequest(store.delete(id));
      await promisifyTransaction(tx);
      
      return ok(undefined);
    } catch (error) {
      return err(new DeleteError('Failed to delete transaction', { error }));
    }
  }

  async findById(id: string): Promise<Result<Transaction, NotFoundError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new NotFoundError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      const data = await promisifyRequest(store.get(id)) as TransactionData | undefined;
      
      if (!data) {
        return err(new NotFoundError('Transaction not found', { id }));
      }
      
      return ok(Transaction.fromData(data));
    } catch (error) {
      return err(new NotFoundError('Transaction not found', { id, error }));
    }
  }

  async findAll(filters?: TransactionFilters): Promise<Result<Transaction[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      let allData = await promisifyRequest(store.getAll()) as TransactionData[];
      
      if (filters) {
        allData = this.applyFilters(allData, filters);
      }
      
      const transactions = allData.map(data => Transaction.fromData(data));
      
      return ok(transactions);
    } catch (error) {
      return err(new QueryError('Failed to query transactions', { error }));
    }
  }

  async findByAccountId(accountId: string): Promise<Result<Transaction[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const index = store.index('accountId');
      
      const data = await promisifyRequest(index.getAll(accountId)) as TransactionData[];
      const transactions = data.map(d => Transaction.fromData(d));
      
      return ok(transactions);
    } catch (error) {
      return err(new QueryError('Failed to query transactions by account', { error }));
    }
  }

  async findByCategoryId(categoryId: string): Promise<Result<Transaction[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const index = store.index('categoryId');
      
      const data = await promisifyRequest(index.getAll(categoryId)) as TransactionData[];
      const transactions = data.map(d => Transaction.fromData(d));
      
      return ok(transactions);
    } catch (error) {
      return err(new QueryError('Failed to query transactions by category', { error }));
    }
  }

  async findByDateRange(startDate: string, endDate: string): Promise<Result<Transaction[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const index = store.index('date');
      
      const range = IDBKeyRange.bound(startDate, endDate);
      const data = await promisifyRequest(index.getAll(range)) as TransactionData[];
      const transactions = data.map(d => Transaction.fromData(d));
      
      return ok(transactions);
    } catch (error) {
      return err(new QueryError('Failed to query transactions by date range', { error }));
    }
  }

  async deleteByAccountId(accountId: string): Promise<Result<void, DeleteError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new DeleteError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const index = store.index('accountId');
      
      const keys = await promisifyRequest(index.getAllKeys(accountId));
      
      for (const key of keys) {
        await promisifyRequest(store.delete(key));
      }
      
      await promisifyTransaction(tx);
      
      return ok(undefined);
    } catch (error) {
      return err(new DeleteError('Failed to delete transactions by account', { error }));
    }
  }

  async count(filters?: TransactionFilters): Promise<Result<number, QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      if (!filters) {
        const count = await promisifyRequest(store.count());
        return ok(count);
      }
      
      const allData = await promisifyRequest(store.getAll()) as TransactionData[];
      const filtered = this.applyFilters(allData, filters);
      
      return ok(filtered.length);
    } catch (error) {
      return err(new QueryError('Failed to count transactions', { error }));
    }
  }

  private applyFilters(data: TransactionData[], filters: TransactionFilters): TransactionData[] {
    return data.filter(transaction => {
      if (filters.accountId && transaction.accountId !== filters.accountId) return false;
      if (filters.categoryId && transaction.categoryId !== filters.categoryId) return false;
      if (filters.type && transaction.type !== filters.type) return false;
      if (filters.startDate && transaction.date < filters.startDate) return false;
      if (filters.endDate && transaction.date > filters.endDate) return false;
      if (filters.searchText) {
        const searchLower = filters.searchText.toLowerCase();
        const matchesDescription = transaction.description.toLowerCase().includes(searchLower);
        const matchesPayee = transaction.payee?.toLowerCase().includes(searchLower) ?? false;
        if (!matchesDescription && !matchesPayee) return false;
      }
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every(tag => transaction.tags.includes(tag));
        if (!hasAllTags) return false;
      }
      if (filters.minAmount !== undefined && transaction.amount < filters.minAmount) return false;
      if (filters.maxAmount !== undefined && transaction.amount > filters.maxAmount) return false;
      return true;
    });
  }
}

// Made with Bob
