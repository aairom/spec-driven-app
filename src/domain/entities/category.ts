import { ValidationError } from '@/shared/types/errors';
import { generateUUID, isValidUUID } from '@/shared/utils/validation-utils';

export type CategoryType = 'income' | 'expense';

export interface CategoryData {
  id: string;
  name: string;
  type: CategoryType;
  parentId: string | null;
  color: string;
  icon: string | null;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export class Category {
  private constructor(private readonly data: CategoryData) {
    this.validate();
  }

  static create(params: {
    name: string;
    type: CategoryType;
    parentId?: string | null;
    color: string;
    icon?: string | null;
    isSystem?: boolean;
  }): Category {
    const now = new Date().toISOString();
    return new Category({
      id: generateUUID(),
      name: params.name,
      type: params.type,
      parentId: params.parentId ?? null,
      color: params.color,
      icon: params.icon ?? null,
      isSystem: params.isSystem ?? false,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromData(data: CategoryData): Category {
    return new Category(data);
  }

  private validate(): void {
    if (!isValidUUID(this.data.id)) {
      throw new ValidationError('Invalid category ID', { id: this.data.id });
    }
    if (!this.data.name || this.data.name.trim().length === 0) {
      throw new ValidationError('Category name is required');
    }
    if (this.data.name.length > 100) {
      throw new ValidationError('Category name too long', { max: 100 });
    }
    if (this.data.parentId && !isValidUUID(this.data.parentId)) {
      throw new ValidationError('Invalid parent category ID', { parentId: this.data.parentId });
    }
    if (!this.isValidColor(this.data.color)) {
      throw new ValidationError('Invalid color format', { color: this.data.color });
    }
    if (this.data.icon && this.data.icon.length > 50) {
      throw new ValidationError('Icon name too long', { max: 50 });
    }
  }

  private isValidColor(color: string): boolean {
    // Validate hex color format (#RGB or #RRGGBB)
    return /^#([0-9A-F]{3}){1,2}$/i.test(color);
  }

  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get type(): CategoryType {
    return this.data.type;
  }

  get parentId(): string | null {
    return this.data.parentId;
  }

  get color(): string {
    return this.data.color;
  }

  get icon(): string | null {
    return this.data.icon;
  }

  get isSystem(): boolean {
    return this.data.isSystem;
  }

  get createdAt(): string {
    return this.data.createdAt;
  }

  get updatedAt(): string {
    return this.data.updatedAt;
  }

  update(params: {
    name?: string;
    color?: string;
    icon?: string | null;
  }): Category {
    if (this.data.isSystem) {
      throw new ValidationError('Cannot modify system category');
    }
    return new Category({
      ...this.data,
      name: params.name ?? this.data.name,
      color: params.color ?? this.data.color,
      icon: params.icon !== undefined ? params.icon : this.data.icon,
      updatedAt: new Date().toISOString(),
    });
  }

  isSubcategoryOf(parentId: string): boolean {
    return this.data.parentId === parentId;
  }

  toJSON(): CategoryData {
    return { ...this.data };
  }
}

// Made with Bob
