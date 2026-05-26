import { useState, useEffect, useCallback } from 'react';
import { Transaction } from '@/domain/entities/transaction';
import { Account } from '@/domain/entities/account';
import { Category } from '@/domain/entities/category';
import { TransactionRepositoryImpl } from '@/infrastructure/persistence/transaction-repository-impl';
import { AccountRepositoryImpl } from '@/infrastructure/persistence/account-repository-impl';
import { CategoryRepositoryImpl } from '@/infrastructure/persistence/category-repository-impl';
import { AddTransactionUseCase } from '@/application/use-cases/transactions/add-transaction';
import { EditTransactionUseCase } from '@/application/use-cases/transactions/edit-transaction';
import { DeleteTransactionUseCase } from '@/application/use-cases/transactions/delete-transaction';
import { GetTransactionHistoryUseCase } from '@/application/use-cases/transactions/get-transaction-history';

export interface UseTransactionsResult {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  addTransaction: (data: AddTransactionData) => Promise<void>;
  editTransaction: (id: string, data: EditTransactionData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

export interface AddTransactionData {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  date: string;
  accountId: string;
  categoryId?: string | null;
  description: string;
  payee?: string | null;
  tags?: string[];
  transferToAccountId?: string | null;
}

export interface EditTransactionData {
  amount?: number;
  date?: string;
  categoryId?: string | null;
  description?: string;
  payee?: string | null;
  tags?: string[];
}

export function useTransactions(): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize repositories
  const transactionRepo = new TransactionRepositoryImpl();
  const accountRepo = new AccountRepositoryImpl();
  const categoryRepo = new CategoryRepositoryImpl();

  // Initialize use cases
  const getTransactionsUseCase = new GetTransactionHistoryUseCase(transactionRepo);
  const addTransactionUseCase = new AddTransactionUseCase(transactionRepo, accountRepo, categoryRepo);
  const editTransactionUseCase = new EditTransactionUseCase(transactionRepo, accountRepo, categoryRepo);
  const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionRepo, accountRepo);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load accounts
      const accountsResult = await accountRepo.findAll();
      if (accountsResult.ok) {
        setAccounts(accountsResult.value);
      } else {
        throw new Error(accountsResult.error.message);
      }

      // Load categories
      const categoriesResult = await categoryRepo.findAll();
      if (categoriesResult.ok) {
        setCategories(categoriesResult.value);
      } else {
        throw new Error(categoriesResult.error.message);
      }

      // Load transactions
      const transactionsResult = await getTransactionsUseCase.execute({});
      if (transactionsResult.ok) {
        setTransactions(transactionsResult.value.transactions);
      } else {
        throw new Error(transactionsResult.error.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load data';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const addTransaction = useCallback(async (data: AddTransactionData) => {
    const result = await addTransactionUseCase.execute(data);
    
    if (!result.ok) {
      throw new Error(result.error.message);
    }

    await loadData();
  }, [loadData]);

  const editTransaction = useCallback(async (id: string, data: EditTransactionData) => {
    const result = await editTransactionUseCase.execute({ id, ...data });
    
    if (!result.ok) {
      throw new Error(result.error.message);
    }

    await loadData();
  }, [loadData]);

  const deleteTransaction = useCallback(async (id: string) => {
    const result = await deleteTransactionUseCase.execute(id);
    
    if (!result.ok) {
      throw new Error(result.error.message);
    }

    await loadData();
  }, [loadData]);

  return {
    transactions,
    accounts,
    categories,
    isLoading,
    error,
    addTransaction,
    editTransaction,
    deleteTransaction,
    refreshTransactions: loadData,
  };
}

// Made with Bob
