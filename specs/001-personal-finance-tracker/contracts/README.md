# API Contracts: Personal Finance Tracker

**Date**: 2026-05-26
**Feature**: Personal Finance Tracker
**Branch**: 001-personal-finance-tracker

## Overview

This directory defines the public API contracts for the Personal Finance Tracker desktop application. These contracts represent the interfaces between the application layers and define the expected behavior for all operations.

## Contract Types

### 1. Repository Interfaces
Defines data access contracts for persistence layer.

### 2. Use Case Interfaces
Defines business operation contracts for application layer.

### 3. Error Types
Defines explicit error types for all operations.

### 4. Result Types
Defines success/failure return types.

## Repository Contracts

All repository operations return `Result<T, E>` types for explicit error handling.

### TransactionRepository

```typescript
interface TransactionRepository {
  /**
   * Save a new transaction or update existing one
   * @returns Result with saved transaction or SaveError
   */
  save(transaction: Transaction): Promise<Result<Transaction, SaveError>>;
  
  /**
   * Find transaction by ID
   * @returns Result with transaction or NotFoundError
   */
  findById(id: string): Promise<Result<Transaction, NotFoundError>>;
  
  /**
   * Find all transactions for an account
   * @returns Result with transactions array or QueryError
   */
  findByAccount(accountId: string): Promise<Result<Transaction[], QueryError>>;
  
  /**
   * Find transactions within date range
   * @returns Result with transactions array or QueryError
   */
  findByDateRange(
    startDate: Date,
    endDate: Date,
    accountId?: string
  ): Promise<Result<Transaction[], QueryError>>;
  
  /**
   * Find transactions by category
   * @returns Result with transactions array or QueryError
   */
  findByCategory(categoryId: string): Promise<Result<Transaction[], QueryError>>;
  
  /**
   * Delete transaction by ID
   * @returns Result with void or DeleteError
   */
  delete(id: string): Promise<Result<void, DeleteError>>;
  
  /**
   * Get total count of transactions
   * @returns Result with count or QueryError
   */
  count(accountId?: string): Promise<Result<number, QueryError>>;
}
```

### AccountRepository

```typescript
interface AccountRepository {
  save(account: Account): Promise<Result<Account, SaveError>>;
  findById(id: string): Promise<Result<Account, NotFoundError>>;
  findAll(): Promise<Result<Account[], QueryError>>;
  findActive(): Promise<Result<Account[], QueryError>>;
  delete(id: string): Promise<Result<void, DeleteError>>;
  archive(id: string): Promise<Result<Account, UpdateError>>;
  updateBalance(id: string, newBalance: number): Promise<Result<Account, UpdateError>>;
}
```

### CategoryRepository

```typescript
interface CategoryRepository {
  save(category: Category): Promise<Result<Category, SaveError>>;
  findById(id: string): Promise<Result<Category, NotFoundError>>;
  findAll(): Promise<Result<Category[], QueryError>>;
  findByType(type: 'income' | 'expense'): Promise<Result<Category[], QueryError>>;
  findChildren(parentId: string): Promise<Result<Category[], QueryError>>;
  delete(id: string): Promise<Result<void, DeleteError>>;
}
```

### BudgetRepository

```typescript
interface BudgetRepository {
  save(budget: Budget): Promise<Result<Budget, SaveError>>;
  findById(id: string): Promise<Result<Budget, NotFoundError>>;
  findByCategory(categoryId: string): Promise<Result<Budget[], QueryError>>;
  findActive(): Promise<Result<Budget[], QueryError>>;
  findByPeriod(startDate: Date, endDate: Date): Promise<Result<Budget[], QueryError>>;
  delete(id: string): Promise<Result<void, DeleteError>>;
}
```

### RecurringTransactionRepository

```typescript
interface RecurringTransactionRepository {
  save(recurring: RecurringTransaction): Promise<Result<RecurringTransaction, SaveError>>;
  findById(id: string): Promise<Result<RecurringTransaction, NotFoundError>>;
  findActive(): Promise<Result<RecurringTransaction[], QueryError>>;
  findDue(date: Date): Promise<Result<RecurringTransaction[], QueryError>>;
  delete(id: string): Promise<Result<void, DeleteError>>;
  updateNextOccurrence(id: string, nextDate: Date): Promise<Result<RecurringTransaction, UpdateError>>;
}
```

### InvestmentRepository

```typescript
interface InvestmentRepository {
  save(investment: Investment): Promise<Result<Investment, SaveError>>;
  findById(id: string): Promise<Result<Investment, NotFoundError>>;
  findByAccount(accountId: string): Promise<Result<Investment[], QueryError>>;
  findBySymbol(symbol: string): Promise<Result<Investment[], QueryError>>;
  delete(id: string): Promise<Result<void, DeleteError>>;
  updatePrice(id: string, newPrice: number): Promise<Result<Investment, UpdateError>>;
}
```

### GoalRepository

```typescript
interface GoalRepository {
  save(goal: Goal): Promise<Result<Goal, SaveError>>;
  findById(id: string): Promise<Result<Goal, NotFoundError>>;
  findAll(): Promise<Result<Goal[], QueryError>>;
  findActive(): Promise<Result<Goal[], QueryError>>;
  findByPriority(): Promise<Result<Goal[], QueryError>>;
  delete(id: string): Promise<Result<void, DeleteError>>;
  updateProgress(id: string, amount: number): Promise<Result<Goal, UpdateError>>;
}
```

## Use Case Contracts

### Transaction Use Cases

```typescript
interface AddTransactionUseCase {
  execute(params: AddTransactionParams): Promise<Result<Transaction, AddTransactionError>>;
}

interface AddTransactionParams {
  type: 'income' | 'expense' | 'transfer';
  amount: number;
  date: Date;
  accountId: string;
  categoryId?: string;
  description: string;
  payee?: string;
  tags?: string[];
  transferToAccountId?: string;
}

interface EditTransactionUseCase {
  execute(id: string, params: Partial<AddTransactionParams>): Promise<Result<Transaction, EditTransactionError>>;
}

interface DeleteTransactionUseCase {
  execute(id: string): Promise<Result<void, DeleteTransactionError>>;
}

interface GetTransactionHistoryUseCase {
  execute(params: TransactionHistoryParams): Promise<Result<TransactionHistory, QueryError>>;
}

interface TransactionHistoryParams {
  accountId?: string;
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  pageSize?: number;
}

interface TransactionHistory {
  transactions: Transaction[];
  total: number;
  page: number;
  pageSize: number;
}
```

### Account Use Cases

```typescript
interface CreateAccountUseCase {
  execute(params: CreateAccountParams): Promise<Result<Account, CreateAccountError>>;
}

interface CreateAccountParams {
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'cash' | 'investment';
  initialBalance: number;
  currency?: string;
}

interface GetAccountBalanceUseCase {
  execute(accountId: string): Promise<Result<AccountBalance, QueryError>>;
}

interface AccountBalance {
  accountId: string;
  currentBalance: number;
  availableBalance: number; // For credit accounts
  lastUpdated: Date;
}

interface GetNetWorthUseCase {
  execute(): Promise<Result<NetWorth, QueryError>>;
}

interface NetWorth {
  total: number;
  assets: number;
  liabilities: number;
  byAccount: Array<{ accountId: string; balance: number }>;
  asOfDate: Date;
}
```

### Budget Use Cases

```typescript
interface CreateBudgetUseCase {
  execute(params: CreateBudgetParams): Promise<Result<Budget, CreateBudgetError>>;
}

interface CreateBudgetParams {
  categoryId: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  rollover?: boolean;
  alertThreshold?: number;
}

interface GetBudgetProgressUseCase {
  execute(budgetId: string): Promise<Result<BudgetProgress, QueryError>>;
}

interface BudgetProgress {
  budgetId: string;
  categoryId: string;
  amount: number;
  spent: number;
  remaining: number;
  percentUsed: number;
  daysRemaining: number;
  isOverBudget: boolean;
  shouldAlert: boolean;
}
```

### Investment Use Cases

```typescript
interface AddInvestmentUseCase {
  execute(params: AddInvestmentParams): Promise<Result<Investment, AddInvestmentError>>;
}

interface AddInvestmentParams {
  accountId: string;
  symbol: string;
  name: string;
  assetType: 'stock' | 'bond' | 'mutual_fund' | 'etf' | 'crypto' | 'other';
  quantity: number;
  purchasePrice: number;
  purchaseDate: Date;
}

interface GetPortfolioPerformanceUseCase {
  execute(accountId?: string): Promise<Result<PortfolioPerformance, QueryError>>;
}

interface PortfolioPerformance {
  totalValue: number;
  totalCostBasis: number;
  totalGain: number;
  percentReturn: number;
  byAssetType: Array<{
    assetType: string;
    value: number;
    percentage: number;
  }>;
  holdings: Array<{
    symbol: string;
    value: number;
    gain: number;
    percentReturn: number;
  }>;
}
```

### Goal Use Cases

```typescript
interface CreateGoalUseCase {
  execute(params: CreateGoalParams): Promise<Result<Goal, CreateGoalError>>;
}

interface CreateGoalParams {
  name: string;
  description?: string;
  targetAmount: number;
  targetDate: Date;
  monthlyContribution?: number;
  priority?: number;
}

interface ContributeToGoalUseCase {
  execute(goalId: string, amount: number, transactionId?: string): Promise<Result<Goal, ContributeError>>;
}

interface GetGoalProgressUseCase {
  execute(goalId: string): Promise<Result<GoalProgress, QueryError>>;
}

interface GoalProgress {
  goalId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  percentComplete: number;
  remainingAmount: number;
  targetDate: Date;
  monthsRemaining: number;
  requiredMonthlyContribution: number;
  projectedCompletionDate: Date;
  isOnTrack: boolean;
}
```

### Forecast Use Cases

```typescript
interface GenerateForecastUseCase {
  execute(params: ForecastParams): Promise<Result<Forecast[], GenerateForecastError>>;
}

interface ForecastParams {
  accountId?: string;
  months: number; // Number of months to forecast (max 6)
  includeRecurring: boolean;
  includeOneTime: boolean;
}

interface Forecast {
  date: Date;
  projectedIncome: number;
  projectedExpenses: number;
  projectedBalance: number;
  confidence: number;
}
```

### Report Use Cases

```typescript
interface GenerateReportUseCase {
  execute(params: ReportParams): Promise<Result<Report, GenerateReportError>>;
}

interface ReportParams {
  type: 'spending_by_category' | 'income_vs_expense' | 'net_worth' | 'budget_performance' | 'investment_performance';
  startDate: Date;
  endDate: Date;
  accountIds?: string[];
}

interface Report {
  type: string;
  startDate: Date;
  endDate: Date;
  data: unknown; // Type-specific data structure
  generatedAt: Date;
}

interface ExportReportUseCase {
  execute(report: Report, format: 'pdf' | 'csv' | 'excel'): Promise<Result<Blob, ExportError>>;
}
```

### Data Management Use Cases

```typescript
interface ImportTransactionsUseCase {
  execute(file: File, mapping: ColumnMapping): Promise<Result<ImportResult, ImportError>>;
}

interface ColumnMapping {
  date: string;
  amount: string;
  description: string;
  category?: string;
  payee?: string;
}

interface ImportResult {
  imported: number;
  skipped: number;
  errors: Array<{ row: number; error: string }>;
}

interface ExportDataUseCase {
  execute(password?: string): Promise<Result<Blob, ExportError>>;
}

interface ImportDataUseCase {
  execute(file: File, password?: string): Promise<Result<ImportResult, ImportError>>;
}
```

## Error Types

All errors are explicit, typed classes that extend a base Error class.

```typescript
// Base error types
class DomainError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'DomainError';
  }
}

// Repository errors
class SaveError extends DomainError {
  constructor(message: string) {
    super(message, 'SAVE_ERROR');
  }
}

class NotFoundError extends DomainError {
  constructor(entityType: string, id: string) {
    super(`${entityType} with id ${id} not found`, 'NOT_FOUND');
  }
}

class QueryError extends DomainError {
  constructor(message: string) {
    super(message, 'QUERY_ERROR');
  }
}

class DeleteError extends DomainError {
  constructor(message: string) {
    super(message, 'DELETE_ERROR');
  }
}

class UpdateError extends DomainError {
  constructor(message: string) {
    super(message, 'UPDATE_ERROR');
  }
}

// Validation errors
class ValidationError extends DomainError {
  constructor(message: string, public field: string) {
    super(message, 'VALIDATION_ERROR');
  }
}

// Business logic errors
class InsufficientFundsError extends DomainError {
  constructor(available: number, required: number) {
    super(`Insufficient funds: ${available} available, ${required} required`, 'INSUFFICIENT_FUNDS');
  }
}

class BudgetExceededError extends DomainError {
  constructor(categoryName: string, amount: number, limit: number) {
    super(`Budget exceeded for ${categoryName}: ${amount} spent, ${limit} limit`, 'BUDGET_EXCEEDED');
  }
}

class DuplicateError extends DomainError {
  constructor(entityType: string, field: string, value: string) {
    super(`${entityType} with ${field} '${value}' already exists`, 'DUPLICATE');
  }
}

// Use case errors
class AddTransactionError extends DomainError {}
class EditTransactionError extends DomainError {}
class DeleteTransactionError extends DomainError {}
class CreateAccountError extends DomainError {}
class CreateBudgetError extends DomainError {}
class AddInvestmentError extends DomainError {}
class CreateGoalError extends DomainError {}
class ContributeError extends DomainError {}
class GenerateForecastError extends DomainError {}
class GenerateReportError extends DomainError {}
class ExportError extends DomainError {}
class ImportError extends DomainError {}
```

## Result Type

```typescript
type Result<T, E extends Error> =
  | { success: true; value: T }
  | { success: false; error: E };

// Helper functions
function success<T>(value: T): Result<T, never> {
  return { success: true, value };
}

function failure<E extends Error>(error: E): Result<never, E> {
  return { success: false, error };
}

// Usage example
async function addTransaction(params: AddTransactionParams): Promise<Result<Transaction, AddTransactionError>> {
  // Validation
  if (params.amount <= 0) {
    return failure(new ValidationError('Amount must be positive', 'amount'));
  }
  
  // Business logic
  const transaction = createTransaction(params);
  
  // Persistence
  const saveResult = await transactionRepo.save(transaction);
  if (!saveResult.success) {
    return failure(new AddTransactionError(saveResult.error.message));
  }
  
  return success(saveResult.value);
}
```

## Contract Guarantees

### Performance Guarantees
- All repository operations complete in <100ms for datasets up to 10,000 records
- Pagination used for large result sets (100 items per page)
- Indexes ensure fast lookups on common query patterns

### Data Integrity Guarantees
- All operations are atomic (succeed completely or fail completely)
- Referential integrity maintained (foreign keys validated)
- Balance calculations always consistent with transactions
- No silent failures (all errors explicitly returned)

### Type Safety Guarantees
- No `any` types in contracts
- All parameters and return types explicitly defined
- Zod schemas validate data at boundaries
- TypeScript strict mode enforced

### Error Handling Guarantees
- All operations return Result types
- Errors are typed and explicit
- Error messages are user-friendly
- Error codes enable programmatic handling

## Testing Contracts

All implementations must pass contract tests:

```typescript
describe('TransactionRepository Contract', () => {
  it('should save and retrieve transaction', async () => {
    const transaction = createTestTransaction();
    const saveResult = await repo.save(transaction);
    expect(saveResult.success).toBe(true);
    
    const findResult = await repo.findById(transaction.id);
    expect(findResult.success).toBe(true);
    expect(findResult.value).toEqual(transaction);
  });
  
  it('should return NotFoundError for non-existent ID', async () => {
    const result = await repo.findById('non-existent');
    expect(result.success).toBe(false);
    expect(result.error).toBeInstanceOf(NotFoundError);
  });
  
  it('should complete operations in <100ms', async () => {
    const start = Date.now();
    await repo.findAll();
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(100);
  });
});
```

## Summary

These contracts define the public API for the Personal Finance Tracker:
- ✅ Repository interfaces for data access
- ✅ Use case interfaces for business operations
- ✅ Explicit error types for all failure modes
- ✅ Result types for type-safe error handling
- ✅ Performance guarantees (<100ms operations)
- ✅ Type safety guarantees (no `any`)
- ✅ Data integrity guarantees (atomic operations)

All contracts align with constitution principles and support the functional requirements from the specification.