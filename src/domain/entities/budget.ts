import { ValidationError } from '@/shared/types/errors';
import { generateUUID, isValidUUID } from '@/shared/utils/validation-utils';

export type BudgetPeriod = 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export interface BudgetData {
  id: string;
  name: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string | null;
  rollover: boolean;
  alertThreshold: number;
  createdAt: string;
  updatedAt: string;
}

export class Budget {
  private constructor(private readonly data: BudgetData) {
    this.validate();
  }

  static create(params: {
    name: string;
    categoryId: string;
    amount: number;
    period: BudgetPeriod;
    startDate: string;
    endDate?: string | null;
    rollover?: boolean;
    alertThreshold?: number;
  }): Budget {
    const now = new Date().toISOString();
    return new Budget({
      id: generateUUID(),
      name: params.name,
      categoryId: params.categoryId,
      amount: params.amount,
      period: params.period,
      startDate: params.startDate,
      endDate: params.endDate ?? null,
      rollover: params.rollover ?? false,
      alertThreshold: params.alertThreshold ?? 80,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromData(data: BudgetData): Budget {
    return new Budget(data);
  }

  private validate(): void {
    if (!isValidUUID(this.data.id)) {
      throw new ValidationError('Invalid budget ID', { id: this.data.id });
    }
    if (!this.data.name || this.data.name.trim().length === 0) {
      throw new ValidationError('Budget name is required');
    }
    if (this.data.name.length > 100) {
      throw new ValidationError('Budget name too long', { max: 100 });
    }
    if (!isValidUUID(this.data.categoryId)) {
      throw new ValidationError('Invalid category ID', { categoryId: this.data.categoryId });
    }
    if (this.data.amount <= 0) {
      throw new ValidationError('Budget amount must be positive', { amount: this.data.amount });
    }
    if (this.data.alertThreshold < 0 || this.data.alertThreshold > 100) {
      throw new ValidationError('Alert threshold must be between 0 and 100', {
        threshold: this.data.alertThreshold,
      });
    }
    if (this.data.endDate) {
      const start = new Date(this.data.startDate);
      const end = new Date(this.data.endDate);
      if (end <= start) {
        throw new ValidationError('End date must be after start date');
      }
    }
  }

  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get categoryId(): string {
    return this.data.categoryId;
  }

  get amount(): number {
    return this.data.amount;
  }

  get period(): BudgetPeriod {
    return this.data.period;
  }

  get startDate(): string {
    return this.data.startDate;
  }

  get endDate(): string | null {
    return this.data.endDate;
  }

  get rollover(): boolean {
    return this.data.rollover;
  }

  get alertThreshold(): number {
    return this.data.alertThreshold;
  }

  get createdAt(): string {
    return this.data.createdAt;
  }

  get updatedAt(): string {
    return this.data.updatedAt;
  }

  update(params: {
    name?: string;
    amount?: number;
    alertThreshold?: number;
    rollover?: boolean;
  }): Budget {
    return new Budget({
      ...this.data,
      name: params.name ?? this.data.name,
      amount: params.amount ?? this.data.amount,
      alertThreshold: params.alertThreshold ?? this.data.alertThreshold,
      rollover: params.rollover ?? this.data.rollover,
      updatedAt: new Date().toISOString(),
    });
  }

  isActive(date: Date = new Date()): boolean {
    const checkDate = date.toISOString();
    if (checkDate < this.data.startDate) {
      return false;
    }
    if (this.data.endDate && checkDate > this.data.endDate) {
      return false;
    }
    return true;
  }

  calculateSpentPercentage(spent: number): number {
    return (spent / this.data.amount) * 100;
  }

  shouldAlert(spent: number): boolean {
    return this.calculateSpentPercentage(spent) >= this.data.alertThreshold;
  }

  toJSON(): BudgetData {
    return { ...this.data };
  }
}

// Made with Bob
