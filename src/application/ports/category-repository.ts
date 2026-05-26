import { Result } from '@/shared/types/result';
import {
  SaveError,
  NotFoundError,
  QueryError,
  DeleteError,
  UpdateError,
} from '@/shared/types/errors';
import { Category, CategoryData, CategoryType } from '@/domain/entities/category';

export interface CategoryFilters {
  type?: CategoryType;
  parentId?: string | null;
  isSystem?: boolean;
}

export interface CategoryRepository {
  save(category: Category): Promise<Result<Category, SaveError>>;
  
  findById(id: string): Promise<Result<Category, NotFoundError>>;
  
  findAll(filters?: CategoryFilters): Promise<Result<Category[], QueryError>>;
  
  findByType(type: CategoryType): Promise<Result<Category[], QueryError>>;
  
  findByParentId(parentId: string | null): Promise<Result<Category[], QueryError>>;
  
  findSystemCategories(): Promise<Result<Category[], QueryError>>;
  
  update(category: Category): Promise<Result<Category, UpdateError>>;
  
  delete(id: string): Promise<Result<void, DeleteError>>;
  
  count(filters?: CategoryFilters): Promise<Result<number, QueryError>>;
}

// Made with Bob
