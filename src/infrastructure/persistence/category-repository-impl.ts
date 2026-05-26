import { Result, ok, err } from '@/shared/types/result';
import { SaveError, QueryError, DeleteError, NotFoundError, UpdateError } from '@/shared/types/errors';
import { Category, CategoryData } from '@/domain/entities/category';
import { CategoryRepository } from '@/application/ports/category-repository';
import { getDatabase } from './database';
import { promisifyRequest, promisifyTransaction } from './indexeddb-helpers';

export class CategoryRepositoryImpl implements CategoryRepository {
  private readonly storeName = 'categories';

  async save(category: Category): Promise<Result<Category, SaveError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new SaveError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      await promisifyRequest(store.add(category.toJSON()));
      await promisifyTransaction(tx);
      
      return ok(category);
    } catch (error) {
      return err(new SaveError('Failed to save category', { error }));
    }
  }

  async update(category: Category): Promise<Result<Category, UpdateError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new UpdateError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      
      await promisifyRequest(store.put(category.toJSON()));
      await promisifyTransaction(tx);
      
      return ok(category);
    } catch (error) {
      return err(new UpdateError('Failed to update category', { error }));
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
      return err(new DeleteError('Failed to delete category', { error }));
    }
  }

  async findById(id: string): Promise<Result<Category, NotFoundError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new NotFoundError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      const data = await promisifyRequest(store.get(id)) as CategoryData | undefined;
      
      if (!data) {
        return err(new NotFoundError('Category not found', { id }));
      }
      
      return ok(Category.fromData(data));
    } catch (error) {
      return err(new NotFoundError('Category not found', { id, error }));
    }
  }

  async findAll(): Promise<Result<Category[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      const allData = await promisifyRequest(store.getAll()) as CategoryData[];
      const categories = allData.map(data => Category.fromData(data));
      
      return ok(categories);
    } catch (error) {
      return err(new QueryError('Failed to query categories', { error }));
    }
  }

  async findByType(type: string): Promise<Result<Category[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const index = store.index('type');
      
      const data = await promisifyRequest(index.getAll(type)) as CategoryData[];
      const categories = data.map(d => Category.fromData(d));
      
      return ok(categories);
    } catch (error) {
      return err(new QueryError('Failed to query categories by type', { error }));
    }
  }

  async findByParentId(parentId: string | null): Promise<Result<Category[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      const allData = await promisifyRequest(store.getAll()) as CategoryData[];
      const filtered = allData.filter(data => data.parentId === parentId).map(d => Category.fromData(d));
      
      return ok(filtered);
    } catch (error) {
      return err(new QueryError('Failed to query categories by parent', { error }));
    }
  }

  async findRootCategories(): Promise<Result<Category[], QueryError>> {
    return this.findByParentId(null);
  }

  async findSystemCategories(): Promise<Result<Category[], QueryError>> {
    try {
      const dbResult = await getDatabase();
      if (!dbResult.ok) {
        return err(new QueryError('Failed to get database', { error: dbResult.error }));
      }
      const db = dbResult.value;
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      
      const allData = await promisifyRequest(store.getAll()) as CategoryData[];
      const systemCategories = allData.filter(data => data.isSystem).map(d => Category.fromData(d));
      
      return ok(systemCategories);
    } catch (error) {
      return err(new QueryError('Failed to query system categories', { error }));
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
      return err(new QueryError('Failed to count categories', { error }));
    }
  }
}

// Made with Bob
