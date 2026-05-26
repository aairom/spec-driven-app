import { useState, useEffect } from 'react';
import { Transaction } from '@/domain/entities/transaction';
import { Account } from '@/domain/entities/account';
import { Category } from '@/domain/entities/category';
import { TransactionRepositoryImpl } from '@/infrastructure/persistence/transaction-repository-impl';
import { AccountRepositoryImpl } from '@/infrastructure/persistence/account-repository-impl';
import { CategoryRepositoryImpl } from '@/infrastructure/persistence/category-repository-impl';
import { AddTransactionUseCase } from '@/application/use-cases/transactions/add-transaction';
import { GetTransactionHistoryUseCase } from '@/application/use-cases/transactions/get-transaction-history';
import { DeleteTransactionUseCase } from '@/application/use-cases/transactions/delete-transaction';
import { Button } from '@/presentation/components/common/Button';

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense' | 'transfer',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    accountId: '',
    categoryId: '',
    description: '',
  });

  // Initialize repositories and use cases
  const transactionRepo = new TransactionRepositoryImpl();
  const accountRepo = new AccountRepositoryImpl();
  const categoryRepo = new CategoryRepositoryImpl();
  
  const getTransactionsUseCase = new GetTransactionHistoryUseCase(transactionRepo);
  const addTransactionUseCase = new AddTransactionUseCase(transactionRepo, accountRepo, categoryRepo);
  const deleteTransactionUseCase = new DeleteTransactionUseCase(transactionRepo, accountRepo);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    
    // Load accounts
    const accountsResult = await accountRepo.findAll();
    if (accountsResult.ok) {
      setAccounts(accountsResult.value);
      if (accountsResult.value.length > 0 && !formData.accountId) {
        setFormData(prev => ({ ...prev, accountId: accountsResult.value[0]!.id }));
      }
    }

    // Load categories
    const categoriesResult = await categoryRepo.findAll();
    if (categoriesResult.ok) {
      setCategories(categoriesResult.value);
      if (categoriesResult.value.length > 0 && !formData.categoryId) {
        setFormData(prev => ({ ...prev, categoryId: categoriesResult.value[0]!.id }));
      }
    }

    // Load transactions
    const transactionsResult = await getTransactionsUseCase.execute({});
    if (transactionsResult.ok) {
      setTransactions(transactionsResult.value.transactions);
    }

    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    const result = await addTransactionUseCase.execute({
      type: formData.type,
      amount: parseFloat(formData.amount),
      date: formData.date || new Date().toISOString().split('T')[0]!,
      accountId: formData.accountId,
      categoryId: formData.categoryId || null,
      description: formData.description,
    });

    if (result.ok) {
      setShowForm(false);
      setFormData({
        type: 'expense',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        accountId: formData.accountId,
        categoryId: formData.categoryId,
        description: '',
      });
      await loadData();
    } else {
      alert(`Error: ${result.error.message}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this transaction?')) return;
    
    const result = await deleteTransactionUseCase.execute(id);
    if (result.ok) {
      await loadData();
    } else {
      alert(`Error: ${result.error.message}`);
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (accounts.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        <p className="text-gray-600">Please create an account first to start tracking transactions.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Add Transaction'}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Amount</label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Account</label>
              <select
                value={formData.accountId}
                onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              >
                {accounts.map(account => (
                  <option key={account.id} value={account.id}>{account.name}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <Button type="submit">Add Transaction</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No transactions yet. Click "Add Transaction" to get started.
                </td>
              </tr>
            ) : (
              transactions.map(transaction => {
                const account = accounts.find(a => a.id === transaction.accountId);
                return (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{transaction.date}</td>
                    <td className="px-6 py-4 text-sm">{transaction.description}</td>
                    <td className="px-6 py-4 text-sm">{account?.name || 'Unknown'}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        onClick={() => handleDelete(transaction.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Made with Bob
