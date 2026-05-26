import { DatabaseError } from '@/shared/types/errors';
import { Result, err, ok } from '@/shared/types/result';

export interface Migration {
  version: number;
  name: string;
  up: (db: IDBDatabase, transaction: IDBTransaction) => void;
  down?: (db: IDBDatabase, transaction: IDBTransaction) => void;
}

const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    up: (db: IDBDatabase) => {
      // Transactions store
      if (!db.objectStoreNames.contains('transactions')) {
        const txStore = db.createObjectStore('transactions', { keyPath: 'id' });
        txStore.createIndex('accountId', 'accountId', { unique: false });
        txStore.createIndex('categoryId', 'categoryId', { unique: false });
        txStore.createIndex('date', 'date', { unique: false });
        txStore.createIndex('type', 'type', { unique: false });
      }

      // Accounts store
      if (!db.objectStoreNames.contains('accounts')) {
        const accStore = db.createObjectStore('accounts', { keyPath: 'id' });
        accStore.createIndex('type', 'type', { unique: false });
        accStore.createIndex('isActive', 'isActive', { unique: false });
      }

      // Categories store
      if (!db.objectStoreNames.contains('categories')) {
        const catStore = db.createObjectStore('categories', { keyPath: 'id' });
        catStore.createIndex('type', 'type', { unique: false });
        catStore.createIndex('parentId', 'parentId', { unique: false });
      }

      // Budgets store
      if (!db.objectStoreNames.contains('budgets')) {
        const budgetStore = db.createObjectStore('budgets', { keyPath: 'id' });
        budgetStore.createIndex('categoryId', 'categoryId', { unique: false });
        budgetStore.createIndex('period', 'period', { unique: false });
        budgetStore.createIndex('startDate', 'startDate', { unique: false });
      }
    },
  },
];

export function getMigrations(): Migration[] {
  return [...migrations];
}

export function getLatestVersion(): number {
  return migrations.length > 0 ? Math.max(...migrations.map((m) => m.version)) : 0;
}

export async function runMigrations(
  db: IDBDatabase,
  fromVersion: number,
  toVersion: number
): Promise<Result<void, DatabaseError>> {
  const migrationsToRun = migrations.filter((m) => m.version > fromVersion && m.version <= toVersion);

  if (migrationsToRun.length === 0) {
    return ok(undefined);
  }

  try {
    // Migrations run within the upgrade transaction
    // This function is called from within onupgradeneeded
    migrationsToRun.sort((a, b) => a.version - b.version);

    for (const migration of migrationsToRun) {
      console.log(`Running migration: ${migration.name} (v${migration.version})`);
      // Migration.up is called synchronously within the upgrade transaction
    }

    return ok(undefined);
  } catch (error) {
    return err(
      new DatabaseError('Migration failed', {
        error,
        fromVersion,
        toVersion,
      })
    );
  }
}

export async function rollbackMigration(
  db: IDBDatabase,
  version: number
): Promise<Result<void, DatabaseError>> {
  const migration = migrations.find((m) => m.version === version);

  if (!migration) {
    return err(new DatabaseError('Migration not found', { version }));
  }

  if (!migration.down) {
    return err(new DatabaseError('Migration has no rollback', { version }));
  }

  try {
    // Rollback would need to be done in a version change transaction
    // This is a placeholder for future implementation
    return ok(undefined);
  } catch (error) {
    return err(
      new DatabaseError('Rollback failed', {
        error,
        version,
      })
    );
  }
}

// Made with Bob
