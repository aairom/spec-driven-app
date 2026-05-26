import { Result, ok, err } from '@/shared/types/result';
import { SaveError, ValidationError, NotFoundError } from '@/shared/types/errors';
import { Transaction } from '@/domain/entities/transaction';
import { TransactionRepository } from '@/application/ports/transaction-repository';
import { AccountRepository } from '@/application/ports/account-repository';
import { CategoryRepository } from '@/application/ports/category-repository';

export interface AddTransactionInput {
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

export class AddTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository,
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(input: AddTransactionInput): Promise<Result<Transaction, SaveError | ValidationError | NotFoundError>> {
    // Validate account exists
    const accountResult = await this.accountRepository.findById(input.accountId);
    if (!accountResult.ok) {
      return err(new NotFoundError('Account not found', { accountId: input.accountId }));
    }

    // Validate category if provided
    if (input.categoryId) {
      const categoryResult = await this.categoryRepository.findById(input.categoryId);
      if (!categoryResult.ok) {
        return err(new NotFoundError('Category not found', { categoryId: input.categoryId }));
      }
    }

    // Validate transfer account if transfer type
    if (input.type === 'transfer') {
      if (!input.transferToAccountId) {
        return err(new ValidationError('Transfer requires transferToAccountId'));
      }
      const transferAccountResult = await this.accountRepository.findById(input.transferToAccountId);
      if (!transferAccountResult.ok) {
        return err(new NotFoundError('Transfer account not found', { accountId: input.transferToAccountId }));
      }
    }

    // Create transaction
    try {
      const transaction = Transaction.create({
        type: input.type,
        amount: input.amount,
        date: input.date,
        accountId: input.accountId,
        categoryId: input.categoryId,
        description: input.description,
        payee: input.payee,
        tags: input.tags,
        transferToAccountId: input.transferToAccountId,
      });

      // Save transaction
      const saveResult = await this.transactionRepository.save(transaction);
      if (!saveResult.ok) {
        return err(saveResult.error);
      }

      // Update account balance
      const account = accountResult.value;
      let newBalance = account.balance;
      
      if (input.type === 'income') {
        newBalance += input.amount;
      } else if (input.type === 'expense') {
        newBalance -= input.amount;
      } else if (input.type === 'transfer') {
        newBalance -= input.amount;
      }

      const updatedAccount = account.updateBalance(newBalance);
      await this.accountRepository.update(updatedAccount);

      // Update transfer destination account if transfer
      if (input.type === 'transfer' && input.transferToAccountId) {
        const transferAccountResult = await this.accountRepository.findById(input.transferToAccountId);
        if (transferAccountResult.ok) {
          const transferAccount = transferAccountResult.value;
          const updatedTransferAccount = transferAccount.updateBalance(
            transferAccount.balance + input.amount
          );
          await this.accountRepository.update(updatedTransferAccount);
        }
      }

      return ok(saveResult.value);
    } catch (error) {
      if (error instanceof ValidationError) {
        return err(error);
      }
      return err(new SaveError('Failed to add transaction', { error }));
    }
  }
}

// Made with Bob
