import { useState } from 'react';
import { useTransactions } from '@/presentation/hooks/useTransactions';
import { TransactionForm, TransactionFormData } from '@/presentation/components/transactions/TransactionForm';
import { TransactionList } from '@/presentation/components/transactions/TransactionList';
import { Button } from '@/presentation/components/common/Button';

export function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const { 
    transactions, 
    accounts, 
    categories, 
    isLoading, 
    error,
    addTransaction,
    deleteTransaction 
  } = useTransactions();

  async function handleSubmit(formData: TransactionFormData) {
    try {
      await addTransaction({
        type: formData.type,
        amount: parseFloat(formData.amount),
        date: formData.date || new Date().toISOString().split('T')[0]!,
        accountId: formData.accountId,
        categoryId: formData.categoryId || null,
        description: formData.description,
      });
      setShowForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add transaction';
      alert(`Error: ${message}`);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await deleteTransaction(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete transaction';
      alert(`Error: ${message}`);
    }
  }

  if (error) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Transactions</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4" />
            <p className="text-gray-600">Loading transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Transactions</h1>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">No Accounts Found</h2>
          <p className="text-yellow-700">
            Please create an account first to start tracking transactions.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your income and expenses
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Transaction'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-6">
          <TransactionForm
            accounts={accounts}
            categories={categories}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <TransactionList
        transactions={transactions}
        accounts={accounts}
        categories={categories}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  );
}

// Made with Bob
