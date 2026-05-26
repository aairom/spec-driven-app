import { ValidationError } from '@/shared/types/errors';
import { generateUUID, isValidUUID } from '@/shared/utils/validation-utils';

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface TransactionData {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  accountId: string;
  categoryId: string | null;
  description: string;
  payee: string | null;
  tags: string[];
  transferToAccountId: string | null;
  recurringTransactionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export class Transaction {
  private constructor(private readonly data: TransactionData) {
    this.validate();
  }

  static create(params: {
    type: TransactionType;
    amount: number;
    date: string;
    accountId: string;
    categoryId?: string | null;
    description: string;
    payee?: string | null;
    tags?: string[];
    transferToAccountId?: string | null;
    recurringTransactionId?: string | null;
  }): Transaction {
    const now = new Date().toISOString();
    return new Transaction({
      id: generateUUID(),
      type: params.type,
      amount: params.amount,
      date: params.date,
      accountId: params.accountId,
      categoryId: params.categoryId ?? null,
      description: params.description,
      payee: params.payee ?? null,
      tags: params.tags ?? [],
      transferToAccountId: params.transferToAccountId ?? null,
      recurringTransactionId: params.recurringTransactionId ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromData(data: TransactionData): Transaction {
    return new Transaction(data);
  }

  private validate(): void {
    if (!isValidUUID(this.data.id)) {
      throw new ValidationError('Invalid transaction ID', { id: this.data.id });
    }
    if (this.data.amount <= 0) {
      throw new ValidationError('Amount must be positive', { amount: this.data.amount });
    }
    if (!this.data.description || this.data.description.trim().length === 0) {
      throw new ValidationError('Description is required');
    }
    if (this.data.description.length > 500) {
      throw new ValidationError('Description too long', { max: 500 });
    }
    if (this.data.payee && this.data.payee.length > 200) {
      throw new ValidationError('Payee name too long', { max: 200 });
    }
    if (this.data.type === 'transfer' && !this.data.transferToAccountId) {
      throw new ValidationError('Transfer requires transferToAccountId');
    }
  }

  get id(): string {
    return this.data.id;
  }

  get type(): TransactionType {
    return this.data.type;
  }

  get amount(): number {
    return this.data.amount;
  }

  get date(): string {
    return this.data.date;
  }

  get accountId(): string {
    return this.data.accountId;
  }

  get categoryId(): string | null {
    return this.data.categoryId;
  }

  get description(): string {
    return this.data.description;
  }

  get payee(): string | null {
    return this.data.payee;
  }

  get tags(): string[] {
    return [...this.data.tags];
  }

  get transferToAccountId(): string | null {
    return this.data.transferToAccountId;
  }

  get recurringTransactionId(): string | null {
    return this.data.recurringTransactionId;
  }

  get createdAt(): string {
    return this.data.createdAt;
  }

  get updatedAt(): string {
    return this.data.updatedAt;
  }

  update(params: {
    amount?: number;
    date?: string;
    categoryId?: string | null;
    description?: string;
    payee?: string | null;
    tags?: string[];
  }): Transaction {
    return new Transaction({
      ...this.data,
      amount: params.amount ?? this.data.amount,
      date: params.date ?? this.data.date,
      categoryId: params.categoryId !== undefined ? params.categoryId : this.data.categoryId,
      description: params.description ?? this.data.description,
      payee: params.payee !== undefined ? params.payee : this.data.payee,
      tags: params.tags ?? this.data.tags,
      updatedAt: new Date().toISOString(),
    });
  }

  toJSON(): TransactionData {
    return { ...this.data };
  }
}

// Made with Bob
