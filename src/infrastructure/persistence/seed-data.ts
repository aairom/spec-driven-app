import { Account } from '@/domain/entities/account';
import { Category } from '@/domain/entities/category';
import { AccountRepositoryImpl } from './account-repository-impl';
import { CategoryRepositoryImpl } from './category-repository-impl';

export async function seedDefaultData(): Promise<void> {
  const accountRepo = new AccountRepositoryImpl();
  const categoryRepo = new CategoryRepositoryImpl();

  // Check if data already exists
  const accountsResult = await accountRepo.findAll();
  if (accountsResult.ok && accountsResult.value.length > 0) {
    return; // Already seeded
  }

  // Create default account
  const defaultAccount = Account.create({
    name: 'Cash',
    type: 'cash',
    balance: 0,
    currency: 'USD',
  });
  await accountRepo.save(defaultAccount);

  // Create default categories
  const categories = [
    { name: 'Food & Dining', type: 'expense', color: '#EF4444', icon: '🍔' },
    { name: 'Transportation', type: 'expense', color: '#F59E0B', icon: '🚗' },
    { name: 'Shopping', type: 'expense', color: '#8B5CF6', icon: '🛍️' },
    { name: 'Entertainment', type: 'expense', color: '#EC4899', icon: '🎬' },
    { name: 'Bills & Utilities', type: 'expense', color: '#6366F1', icon: '💡' },
    { name: 'Healthcare', type: 'expense', color: '#10B981', icon: '🏥' },
    { name: 'Salary', type: 'income', color: '#059669', icon: '💰' },
    { name: 'Freelance', type: 'income', color: '#0891B2', icon: '💼' },
    { name: 'Investments', type: 'income', color: '#7C3AED', icon: '📈' },
  ];

  for (const cat of categories) {
    const category = Category.create({
      name: cat.name,
      type: cat.type as 'income' | 'expense',
      color: cat.color,
      icon: cat.icon,
      isSystem: true,
    });
    await categoryRepo.save(category);
  }
}

// Made with Bob
