import { ValidationError } from '@/shared/types/errors';
import { generateUUID, isValidUUID } from '@/shared/utils/validation-utils';

export type AccountType = 'checking' | 'savings' | 'credit' | 'investment' | 'cash';

export interface AccountData {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institution: string | null;
  accountNumber: string | null;
  isActive: boolean;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export class Account {
  private constructor(private readonly data: AccountData) {
    this.validate();
  }

  static create(params: {
    name: string;
    type: AccountType;
    balance: number;
    currency: string;
    institution?: string | null;
    accountNumber?: string | null;
    notes?: string | null;
  }): Account {
    const now = new Date().toISOString();
    return new Account({
      id: generateUUID(),
      name: params.name,
      type: params.type,
      balance: params.balance,
      currency: params.currency,
      institution: params.institution ?? null,
      accountNumber: params.accountNumber ?? null,
      isActive: true,
      notes: params.notes ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromData(data: AccountData): Account {
    return new Account(data);
  }

  private validate(): void {
    if (!isValidUUID(this.data.id)) {
      throw new ValidationError('Invalid account ID', { id: this.data.id });
    }
    if (!this.data.name || this.data.name.trim().length === 0) {
      throw new ValidationError('Account name is required');
    }
    if (this.data.name.length > 100) {
      throw new ValidationError('Account name too long', { max: 100 });
    }
    if (!this.data.currency || this.data.currency.length !== 3) {
      throw new ValidationError('Invalid currency code', { currency: this.data.currency });
    }
    if (this.data.institution && this.data.institution.length > 200) {
      throw new ValidationError('Institution name too long', { max: 200 });
    }
    if (this.data.accountNumber && this.data.accountNumber.length > 50) {
      throw new ValidationError('Account number too long', { max: 50 });
    }
    if (this.data.notes && this.data.notes.length > 1000) {
      throw new ValidationError('Notes too long', { max: 1000 });
    }
  }

  get id(): string {
    return this.data.id;
  }

  get name(): string {
    return this.data.name;
  }

  get type(): AccountType {
    return this.data.type;
  }

  get balance(): number {
    return this.data.balance;
  }

  get currency(): string {
    return this.data.currency;
  }

  get institution(): string | null {
    return this.data.institution;
  }

  get accountNumber(): string | null {
    return this.data.accountNumber;
  }

  get isActive(): boolean {
    return this.data.isActive;
  }

  get notes(): string | null {
    return this.data.notes;
  }

  get createdAt(): string {
    return this.data.createdAt;
  }

  get updatedAt(): string {
    return this.data.updatedAt;
  }

  update(params: {
    name?: string;
    institution?: string | null;
    accountNumber?: string | null;
    notes?: string | null;
  }): Account {
    return new Account({
      ...this.data,
      name: params.name ?? this.data.name,
      institution: params.institution !== undefined ? params.institution : this.data.institution,
      accountNumber: params.accountNumber !== undefined ? params.accountNumber : this.data.accountNumber,
      notes: params.notes !== undefined ? params.notes : this.data.notes,
      updatedAt: new Date().toISOString(),
    });
  }

  updateBalance(newBalance: number): Account {
    return new Account({
      ...this.data,
      balance: newBalance,
      updatedAt: new Date().toISOString(),
    });
  }

  deactivate(): Account {
    return new Account({
      ...this.data,
      isActive: false,
      updatedAt: new Date().toISOString(),
    });
  }

  activate(): Account {
    return new Account({
      ...this.data,
      isActive: true,
      updatedAt: new Date().toISOString(),
    });
  }

  toJSON(): AccountData {
    return { ...this.data };
  }
}

// Made with Bob
