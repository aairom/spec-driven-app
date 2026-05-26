import { Result, ok, err } from '@/shared/types/result';
import { SaveError, QueryError, DeleteError, NotFoundError, UpdateError } from '@/shared/types/errors';
import { Account, AccountData } from '@/domain/entities/account';
import { AccountRepository } from '@/application/ports/account-repository';
import { getDatabase } from './database';
import { promisifyRequest, promisifyTransaction } from './indexeddb-helpers';

export class AccountRepositoryImpl implements AccountRepository {
  private readonly storeName = 'accounts';

  async save(account: Account): Promise<Result<Account, SaveError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new SaveError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      await promisifyRequest(store.add(account.toJSON()));
      await promisifyTransaction(tx);
      
      return ok(account);
    } catch (error) {
      return err(new SaveError('Failed to save account', { error }));
    }
  }

  async update(account: Account): Promise<Result<Account, UpdateError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new UpdateError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      await promisifyRequest(store.put(account.toJSON()));
      await promisifyTransaction(tx);
      
      return ok(account);
    } catch (error) {
      return err(new UpdateError('Failed to update account', { error }));
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
      return err(new DeleteError('Failed to delete account', { error }));
    }
  }

  async findById(id: string): Promise<Result<Account, NotFoundError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new NotFoundError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      const data = await promisifyRequest(store.get(id)) as AccountData | undefined;
      
      if (!data) {
        return err(new NotFoundError('Account not found', { id }));
      }
      
      return ok(Account.fromData(data));
    } catch (error) {
      return err(new NotFoundError('Account not found', { id, error }));
    }
  }

  async findAll(): Promise<Result<Account[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      const allData = await promisifyRequest(store.getAll()) as AccountData[];
      const accounts = allData.map(data => Account.fromData(data));
      
      return ok(accounts);
    } catch (error) {
      return err(new QueryError('Failed to query accounts', { error }));
    }
  }

  async findByType(type: string): Promise<Result<Account[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const index = store.index('type');
      
      const data = await promisifyRequest(index.getAll(type)) as AccountData[];
      const accounts = data.map(d => Account.fromData(d));
      
      return ok(accounts);
    } catch (error) {
      return err(new QueryError('Failed to query accounts by type', { error }));
    }
  }

  async findActive(): Promise<Result<Account[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      const allData = await promisifyRequest(store.getAll()) as AccountData[];
      const activeAccounts = allData.filter(data => data.isActive).map(d => Account.fromData(d));
      
      return ok(activeAccounts);
    } catch (error) {
      return err(new QueryError('Failed to query active accounts', { error }));
    }
  }

  async getTotalBalance(): Promise<Result<number, QueryError>> {
    try {
      const accountsResult = await this.findAll();
      if (!accountsResult.ok) {
        return err(accountsResult.error);
      }
      
      const total = accountsResult.value.reduce((sum, account) => sum + account.balance, 0);
      
      return ok(total);
    } catch (error) {
      return err(new QueryError('Failed to calculate total balance', { error }));
    }
  }

  async count(): Promise<Result<number, QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      const count = await promisifyRequest(store.count());
      
      return ok(count);
    } catch (error) {
      return err(new QueryError('Failed to count accounts', { error }));
    }
  }
}

// Made with Bob
