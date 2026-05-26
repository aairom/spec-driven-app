import { useState } from 'react';
import { Account } from '@/domain/entities/account';
import { Category } from '@/domain/entities/category';
import { Button } from '@/presentation/components/common/Button';
import { Input } from '@/presentation/components/common/Input';
import { Select } from '@/presentation/components/common/Select';

export interface TransactionFormData {
  type: 'income' | 'expense' | 'transfer';
  amount: string;
  date: string;
  accountId: string;
  categoryId: string;
  description: string;
}

interface TransactionFormProps {
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<TransactionFormData>;
}

export function TransactionForm({ accounts, categories, onSubmit, onCancel, initialData }: TransactionFormProps) {
  const [formData, setFormData] = useState<TransactionFormData>({
    type: initialData?.type || 'expense',
    amount: initialData?.amount || '',
    date: initialData?.date || new Date().toISOString().split('T')[0]!,
    accountId: initialData?.accountId || (accounts[0]?.id || ''),
    categoryId: initialData?.categoryId || (categories[0]?.id || ''),
    description: initialData?.description || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  function validateForm(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors['amount'] = 'Amount must be greater than 0';
    }

    if (!formData.date) {
      newErrors['date'] = 'Date is required';
    }

    if (!formData.accountId) {
      newErrors['accountId'] = 'Account is required';
    }

    if (!formData.description.trim()) {
      newErrors['description'] = 'Description is required';
    }

    if (formData.description.length > 500) {
      newErrors['description'] = 'Description must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateField<K extends keyof TransactionFormData>(field: K, value: TransactionFormData[K]) {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Type"
          value={formData.type}
          onChange={(e) => {
            updateField('type', e.target.value as 'income' | 'expense');
            updateField('categoryId', '');
          }}
          options={[
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
          ]}
        />

        <Input
          label="Amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => updateField('amount', e.target.value)}
          error={errors['amount']}
          required
        />

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => updateField('date', e.target.value)}
          error={errors['date']}
          required
        />

        <Select
          label="Account"
          value={formData.accountId}
          onChange={(e) => updateField('accountId', e.target.value)}
          error={errors['accountId']}
          options={accounts.map(account => ({
            value: account.id,
            label: account.name,
          }))}
          required
        />

        {filteredCategories.length > 0 && (
          <Select
            label="Category"
            value={formData.categoryId}
            onChange={(e) => updateField('categoryId', e.target.value)}
            options={filteredCategories.map(category => ({
              value: category.id,
              label: `${category.icon || ''} ${category.name}`,
            }))}
          />
        )}

        <div className="md:col-span-2">
          <Input
            label="Description"
            type="text"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            error={errors['description']}
            helperText={`${formData.description.length}/500 characters`}
            required
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Transaction'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Made with Bob
