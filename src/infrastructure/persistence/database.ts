import { DatabaseError } from '@/shared/types/errors';
import { Result, err, ok } from '@/shared/types/result';

const DB_NAME = 'personal-finance-tracker';
const DB_VERSION = 1;

export interface DatabaseSchema {
  transactions: {
    key: string;
    value: {
      id: string;
      type: string;
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
    };
    indexes: {
      accountId: string;
      categoryId: string;
      date: string;
      type: string;
    };
  };
  accounts: {
    key: string;
    value: {
      id: string;
      name: string;
      type: string;
      balance: number;
      currency: string;
      institution: string | null;
      accountNumber: string | null;
      isActive: boolean;
      notes: string | null;
      createdAt: string;
      updatedAt: string;
    };
    indexes: {
      type: string;
      isActive: boolean;
    };
  };
  categories: {
    key: string;
    value: {
      id: string;
      name: string;
      type: string;
      parentId: string | null;
      color: string;
      icon: string | null;
      isSystem: boolean;
      createdAt: string;
      updatedAt: string;
    };
    indexes: {
      type: string;
      parentId: string;
    };
  };
  budgets: {
    key: string;
    value: {
      id: string;
      name: string;
      categoryId: string;
      amount: number;
      period: string;
      startDate: string;
      endDate: string | null;
      rollover: boolean;
      alertThreshold: number;
      createdAt: string;
      updatedAt: string;
    };
    indexes: {
      categoryId: string;
      period: string;
      startDate: string;
    };
  };
}

let dbInstance: IDBDatabase | null = null;

export async function initializeDatabase(): Promise<Result<IDBDatabase, DatabaseError>> {
  if (dbInstance) {
    return ok(dbInstance);
  }

  return new Promise((resolve) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      resolve(err(new DatabaseError('Failed to open database', { error: request.error })));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(ok(dbInstance));
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
        txStore.createIndex('accountId', 'accountId', { unique: false });
        txStore.createIndex('categoryId', 'categoryId', { unique: false });
        txStore.createIndex('date', 'date', { unique: false });
        txStore.createIndex('type', 'type', { unique: false });
      }

      // Create accounts store
      if (!db.objectStoreNames.contains('accounts')) {
        const accStore = db.createObjectStore('accounts', { keyPath: 'id' });
        accStore.createIndex('type', 'type', { unique: false });
        accStore.createIndex('isActive', 'isActive', { unique: false });
      }

      // Create categories store
      if (!db.objectStoreNames.contains('categories')) {
        const catStore = db.createObjectStore('categories', { keyPath: 'id' });
        catStore.createIndex('type', 'type', { unique: false });
        catStore.createIndex('parentId', 'parentId', { unique: false });
      }

      // Create budgets store
      if (!db.objectStoreNames.contains('budgets')) {
        const budgetStore = db.createObjectStore('budgets', { keyPath: 'id' });
        budgetStore.createIndex('categoryId', 'categoryId', { unique: false });
        budgetStore.createIndex('period', 'period', { unique: false });
        budgetStore.createIndex('startDate', 'startDate', { unique: false });
      }
    };
  });
}

export async function getDatabase(): Promise<Result<IDBDatabase, DatabaseError>> {
  if (dbInstance) {
    return ok(dbInstance);
  }
  return initializeDatabase();
}

export async function closeDatabase(): Promise<void> {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

export async function clearDatabase(): Promise<Result<void, DatabaseError>> {
  const dbResult = await getDatabase();
  if (!dbResult.ok) {
    return err(dbResult.error);
  }

  const db = dbResult.value;
  const storeNames = ['transactions', 'accounts', 'categories', 'budgets'];

  return new Promise((resolve) => {
    const transaction = db.transaction(storeNames, 'readwrite');

    transaction.onerror = () => {
      resolve(err(new DatabaseError('Failed to clear database', { error: transaction.error })));
    };

    transaction.oncomplete = () => {
      resolve(ok(undefined));
    };

    storeNames.forEach((storeName) => {
      transaction.objectStore(storeName).clear();
    });
  });
}

// Made with Bob
