import { Result, ok, err } from '@/shared/types/result';
import { DeleteError, NotFoundError } from '@/shared/types/errors';
import { TransactionRepository } from '@/application/ports/transaction-repository';
import { AccountRepository } from '@/application/ports/account-repository';

export class DeleteTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(transactionId: string): Promise<Result<void, DeleteError | NotFoundError>> {
    // Find transaction
    const transactionResult = await this.transactionRepository.findById(transactionId);
    if (!transactionResult.ok) {
      return err(new NotFoundError('Transaction not found', { transactionId }));
    }

    const transaction = transactionResult.value;

    try {
      // Revert account balance changes
      const accountResult = await this.accountRepository.findById(transaction.accountId);
      if (accountResult.ok) {
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
      }

      // Revert transfer destination account if transfer
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

      // Delete transaction
      const deleteResult = await this.transactionRepository.delete(transactionId);
      if (!deleteResult.ok) {
        return err(deleteResult.error);
      }

      return ok(undefined);
    } catch (error) {
      return err(new DeleteError('Failed to delete transaction', { error }));
    }
  }
}

// Made with Bob
