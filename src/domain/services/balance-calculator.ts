import { Transaction } from '../entities/transaction';
import { Account } from '../entities/account';

export interface BalanceCalculation {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netChange: number;
}

export class BalanceCalculator {
  static calculateAccountBalance(
    account: Account,
    transactions: Transaction[]
  ): BalanceCalculation {
    const accountTransactions = transactions.filter(
      (tx) => tx.accountId === account.id
    );

    let totalIncome = 0;
    let totalExpenses = 0;

    for (const tx of accountTransactions) {
      if (tx.type === 'income') {
        totalIncome += tx.amount;
      } else if (tx.type === 'expense') {
        totalExpenses += tx.amount;
      } else if (tx.type === 'transfer') {
        // For transfers, check if this account is source or destination
        if (tx.accountId === account.id) {
          totalExpenses += tx.amount; // Money leaving this account
        }
        if (tx.transferToAccountId === account.id) {
          totalIncome += tx.amount; // Money coming into this account
        }
      }
    }

    const netChange = totalIncome - totalExpenses;
    const currentBalance = account.balance + netChange;

    return {
      currentBalance,
      totalIncome,
      totalExpenses,
      netChange,
    };
  }

  static calculateTotalBalance(accounts: Account[], transactions: Transaction[]): number {
    let total = 0;
    for (const account of accounts) {
      if (account.isActive) {
        const calc = this.calculateAccountBalance(account, transactions);
        total += calc.currentBalance;
      }
    }
    return total;
  }

  static calculateBalanceForPeriod(
    account: Account,
    transactions: Transaction[],
    startDate: string,
    endDate: string
  ): BalanceCalculation {
    const periodTransactions = transactions.filter(
      (tx) =>
        tx.accountId === account.id &&
        tx.date >= startDate &&
        tx.date <= endDate
    );

    return this.calculateAccountBalance(account, periodTransactions);
  }

  static getBalanceHistory(
    account: Account,
    transactions: Transaction[],
    startDate: string,
    endDate: string,
    intervalDays: number = 1
  ): Array<{ date: string; balance: number }> {
    const history: Array<{ date: string; balance: number }> = [];
    const sortedTransactions = [...transactions]
      .filter((tx) => tx.accountId === account.id)
      .sort((a, b) => a.date.localeCompare(b.date));

    let currentBalance = account.balance;
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    let txIndex = 0;

    while (currentDate <= end) {
      const dateStr = currentDate.toISOString().split('T')[0]!;

      // Apply all transactions up to this date
      while (
        txIndex < sortedTransactions.length &&
        sortedTransactions[txIndex]!.date <= dateStr
      ) {
        const tx = sortedTransactions[txIndex]!;
        if (tx.type === 'income') {
          currentBalance += tx.amount;
        } else if (tx.type === 'expense') {
          currentBalance -= tx.amount;
        } else if (tx.type === 'transfer') {
          if (tx.accountId === account.id) {
            currentBalance -= tx.amount;
          }
          if (tx.transferToAccountId === account.id) {
            currentBalance += tx.amount;
          }
        }
        txIndex++;
      }

      history.push({ date: dateStr!, balance: currentBalance });
      currentDate.setDate(currentDate.getDate() + intervalDays);
    }

    return history;
  }
}

// Made with Bob
