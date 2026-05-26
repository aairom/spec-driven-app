import { Result, ok, err } from '@/shared/types/result';
import { SaveError, ValidationError, NotFoundError } from '@/shared/types/errors';
import { Transaction } from '@/domain/entities/transaction';
import { TransactionRepository } from '@/application/ports/transaction-repository';
import { AccountRepository } from '@/application/ports/account-repository';
import { CategoryRepository } from '@/application/ports/category-repository';

export interface EditTransactionInput {
  id: string;
  amount?: number;
  date?: string;
  categoryId?: string | null;
  description?: string;
  payee?: string | null;
  tags?: string[];
}

export class EditTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: EditTransactionInput): Promise<Result<Transaction, SaveError | ValidationError | NotFoundError>> {
    // Find existing transaction
    const existingResult = await this.transactionRepository.findById(input.id);
    if (!existingResult.ok) {
      return err(new NotFoundError('Transaction not found', { transactionId: input.id }));
    }

    const existing = existingResult.value;

    // Validate account exists
    const accountResult = await this.accountRepository.findById(existing.accountId);
    if (!accountResult.ok) {
      return err(new NotFoundError('Account not found', { accountId: existing.accountId }));
    }

    // Validate new category if provided
    const newCategoryId = input.categoryId !== undefined ? input.categoryId : existing.categoryId;
    if (newCategoryId) {
      const categoryResult = await this.categoryRepository.findById(newCategoryId);
      if (!categoryResult.ok) {
        return err(new NotFoundError('Category not found', { categoryId: newCategoryId }));
      }
    }

    try {
      // Revert old transaction's effect on account balances
      await this.revertAccountBalances(existing);

      // Update transaction (type, accountId, transferToAccountId are immutable)
      const updated = existing.update({
        amount: input.amount,
        date: input.date,
        categoryId: input.categoryId,
        description: input.description,
        payee: input.payee,
        tags: input.tags,
      });

      // Save updated transaction
      const saveResult = await this.transactionRepository.update(updated);
      if (!saveResult.ok) {
        return err(saveResult.error);
      }

      // Apply new transaction's effect on account balances
      await this.applyAccountBalances(updated);

      return ok(saveResult.value);
    } catch (error) {
      if (error instanceof ValidationError) {
        return err(error);
      }
      return err(new SaveError('Failed to edit transaction', { error }));
    }
  }

  private async revertAccountBalances(transaction: Transaction): Promise<void> {
    const accountResult = await this.accountRepository.findById(transaction.accountId);
    if (!accountResult.ok) return;

    const account = accountResult.value;
    let newBalance = account.balance;

    if (transaction.type === 'income') {
      newBalance -= transaction.amount;
    } else if (transaction.type === 'expense') {
      newBalance += transaction.amount;
    } else if (transaction.type === 'transfer') {
      newBalance += transaction.amount;
    }

    const updatedAccount = account.updateBalance(newBalance);
    await this.accountRepository.update(updatedAccount);

    // Revert transfer destination account
    if (transaction.type === 'transfer' && transaction.transferToAccountId) {
      const transferAccountResult = await this.accountRepository.findById(transaction.transferToAccountId);
      if (transferAccountResult.ok) {
        const transferAccount = transferAccountResult.value;
        const updatedTransferAccount = transferAccount.updateBalance(
          transferAccount.balance - transaction.amount
        );
        await this.accountRepository.update(updatedTransferAccount);
      }
    }
  }

  private async applyAccountBalances(transaction: Transaction): Promise<void> {
    const accountResult = await this.accountRepository.findById(transaction.accountId);
    if (!accountResult.ok) return;

    const account = accountResult.value;
    let newBalance = account.balance;

    if (transaction.type === 'income') {
      newBalance += transaction.amount;
    } else if (transaction.type === 'expense') {
      newBalance -= transaction.amount;
    } else if (transaction.type === 'transfer') {
      newBalance -= transaction.amount;
    }

    const updatedAccount = account.updateBalance(newBalance);
    await this.accountRepository.update(updatedAccount);

    // Apply to transfer destination account
    if (transaction.type === 'transfer' && transaction.transferToAccountId) {
      const transferAccountResult = await this.accountRepository.findById(transaction.transferToAccountId);
      if (transferAccountResult.ok) {
        const transferAccount = transferAccountResult.value;
        const updatedTransferAccount = transferAccount.updateBalance(
          transferAccount.balance + transaction.amount
        );
        await this.accountRepository.update(updatedTransferAccount);
      }
    }
  }
}

// Made with Bob
