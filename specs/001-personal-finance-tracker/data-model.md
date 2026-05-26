# Data Model: Personal Finance Tracker

**Date**: 2026-05-26
**Feature**: Personal Finance Tracker
**Branch**: 001-personal-finance-tracker

## Overview

This document defines the data entities, relationships, and validation rules for the Personal Finance Tracker. All entities are stored in IndexedDB with appropriate indexes for performance.

## Core Entities

### Transaction

Represents a financial transaction (income, expense, or transfer).

**Fields**:
- `id`: UUID (primary key, indexed)
- `type`: 'income' | 'expense' | 'transfer'
- `amount`: number (positive, 2 decimal places)
- `date`: ISO 8601 date string (indexed)
- `accountId`: UUID (foreign key to Account, indexed)
- `categoryId`: UUID | null (foreign key to Category, indexed)
- `description`: string (max 500 chars)
- `payee`: string | null (max 200 chars)
- `tags`: string[] (optional, for filtering)
- `transferToAccountId`: UUID | null (for transfer type only)
- `recurringTransactionId`: UUID | null (if auto-generated)
- `createdAt`: ISO 8601 timestamp
- `updatedAt`: ISO 8601 timestamp

**Validation Rules**:
- `amount` must be positive
- `date` must be valid ISO 8601 date
- `type` must be one of the enum values
- `accountId` must reference existing Account
- `categoryId` must reference existing Category (if not null)
- `transferToAccountId` required if type is 'transfer'
- `description` required, non-empty

**Indexes**:
- Primary: `id`
- Secondary: `date` (for date range queries)
- Secondary: `accountId` (for account transactions)
- Secondary: `categoryId` (for category spending)
- Compound: `[accountId, date]` (for account history)

**Relationships**:
- Belongs to one Account
- Belongs to zero or one Category
- May reference another Account (for transfers)
- May belong to RecurringTransaction

---

### Account

Represents a financial account (checking, savings, credit card, cash, investment).

**Fields**:
- `id`: UUID (primary key, indexed)
- `name`: string (max 100 chars, unique)
- `type`: 'checking' | 'savings' | 'credit' | 'cash' | 'investment'
- `initialBalance`: number (can be negative for credit cards)
- `currentBalance`: number (calculated from transactions)
- `currency`: string (ISO 4217 code, default 'USD')
- `isActive`: boolean (for archiving accounts)
- `createdAt`: ISO 8601 timestamp
- `updatedAt`: ISO 8601 timestamp

**Validation Rules**:
- `name` must be unique and non-empty
- `type` must be one of the enum values
- `currency` must be valid ISO 4217 code
- Cannot delete account with transactions (must archive)

**Indexes**:
- Primary: `id`
- Unique: `name`
- Secondary: `isActive` (for filtering active accounts)

**Relationships**:
- Has many Transactions
- Has many Budgets
- Has many Investments (if type is 'investment')

**Derived Data**:
- `currentBalance` = `initialBalance` + sum of all transaction amounts

---

### Category

Represents a transaction category with optional hierarchy.

**Fields**:
- `id`: UUID (primary key, indexed)
- `name`: string (max 100 chars)
- `parentCategoryId`: UUID | null (foreign key to Category)
- `type`: 'income' | 'expense'
- `color`: string (hex color code)
- `icon`: string (icon identifier)
- `isDefault`: boolean (system-provided categories)
- `createdAt`: ISO 8601 timestamp
- `updatedAt`: ISO 8601 timestamp

**Validation Rules**:
- `name` must be non-empty
- `parentCategoryId` must reference existing Category (if not null)
- Cannot create circular parent relationships
- `color` must be valid hex color (#RRGGBB)
- Cannot delete category with transactions (must reassign)

**Indexes**:
- Primary: `id`
- Secondary: `parentCategoryId` (for hierarchy queries)
- Secondary: `type` (for filtering by income/expense)

**Relationships**:
- May have one parent Category
- May have many child Categories
- Has many Transactions
- Has many Budgets

**Default Categories** (created on first run):
- Income: Salary, Freelance, Investments, Other Income
- Expense: Housing, Transportation, Food (Groceries, Restaurants), Utilities, Healthcare, Entertainment, Shopping, Personal Care, Education, Insurance, Taxes, Other Expense

---

### Budget

Represents a spending limit for a category over a time period.

**Fields**:
- `id`: UUID (primary key, indexed)
- `categoryId`: UUID (foreign key to Category, indexed)
- `amount`: number (positive, target spending limit)
- `period`: 'monthly' | 'quarterly' | 'yearly'
- `startDate`: ISO 8601 date string
- `endDate`: ISO 8601 date string | null (null for ongoing)
- `rollover`: boolean (carry unused amount to next period)
- `alertThreshold`: number (0-1, e.g., 0.8 for 80% alert)
- `isActive`: boolean
- `createdAt`: ISO 8601 timestamp
- `updatedAt`: ISO 8601 timestamp

**Validation Rules**:
- `amount` must be positive
- `categoryId` must reference existing Category
- `period` must be one of the enum values
- `startDate` must be before `endDate` (if endDate not null)
- `alertThreshold` must be between 0 and 1
- Only one active budget per category per period

**Indexes**:
- Primary: `id`
- Secondary: `categoryId` (for category budgets)
- Compound: `[categoryId, startDate]` (for period queries)

**Relationships**:
- Belongs to one Category

**Derived Data**:
- `spent` = sum of transaction amounts for category in period
- `remaining` = `amount` - `spent`
- `percentUsed` = `spent` / `amount`

---

### RecurringTransaction

Represents a template for automatic transaction creation.

**Fields**:
- `id`: UUID (primary key, indexed)
- `type`: 'income' | 'expense'
- `amount`: number (positive)
- `accountId`: UUID (foreign key to Account)
- `categoryId`: UUID | null (foreign key to Category)
- `description`: string (max 500 chars)
- `payee`: string | null (max 200 chars)
- `frequency`: 'daily' | 'weekly' | 'monthly' | 'yearly'
- `startDate`: ISO 8601 date string
- `endDate`: ISO 8601 date string | null (null for indefinite)
- `nextOccurrence`: ISO 8601 date string (calculated)
- `dayOfMonth`: number | null (1-31, for monthly)
- `dayOfWeek`: number | null (0-6, for weekly)
- `isActive`: boolean
- `requiresReview`: boolean (notify before creating)
- `createdAt`: ISO 8601 timestamp
- `updatedAt`: ISO 8601 timestamp

**Validation Rules**:
- `amount` must be positive
- `accountId` must reference existing Account
- `frequency` must be one of the enum values
- `startDate` must be before `endDate` (if endDate not null)
- `dayOfMonth` required if frequency is 'monthly'
- `dayOfWeek` required if frequency is 'weekly'

**Indexes**:
- Primary: `id`
- Secondary: `nextOccurrence` (for scheduling)
- Secondary: `isActive` (for filtering active rules)

**Relationships**:
- Belongs to one Account
- Belongs to zero or one Category
- Has many Transactions (generated)

**Business Logic**:
- System checks `nextOccurrence` daily
- Creates Transaction when date matches
- Updates `nextOccurrence` based on frequency
- Sends notification if `requiresReview` is true

---

### Investment

Represents an investment holding in an investment account.

**Fields**:
- `id`: UUID (primary key, indexed)
- `accountId`: UUID (foreign key to Account, must be investment type)
- `symbol`: string (ticker symbol, max 10 chars)
- `name`: string (security name, max 200 chars)
- `assetType`: 'stock' | 'bond' | 'mutual_fund' | 'etf' | 'crypto' | 'other'
- `quantity`: number (positive, up to 8 decimal places)
- `purchasePrice`: number (positive, cost per unit)
- `purchaseDate`: ISO 8601 date string
- `currentPrice`: number (positive, current market price)
- `priceUpdatedAt`: ISO 8601 timestamp
- `costBasis`: number (calculated: quantity * purchasePrice)
- `currentValue`: number (calculated: quantity * currentPrice)
- `unrealizedGain`: number (calculated: currentValue - costBasis)
- `notes`: string | null (max 1000 chars)
- `createdAt`: ISO 8601 timestamp
- `updatedAt`: ISO 8601 timestamp

**Validation Rules**:
- `accountId` must reference Account with type 'investment'
- `symbol` must be non-empty
- `quantity` must be positive
- `purchasePrice` must be positive
- `currentPrice` must be positive
- `purchaseDate` must be valid date

**Indexes**:
- Primary: `id`
- Secondary: `accountId` (for portfolio queries)
- Secondary: `symbol` (for symbol lookup)
- Secondary: `assetType` (for asset allocation)

**Relationships**:
- Belongs to one Account (investment type)
- May have many DividendTransactions

**Derived Data**:
- `costBasis` = `quantity` * `purchasePrice`
- `currentValue` = `quantity` * `currentPrice`
- `unrealizedGain` = `currentValue` - `costBasis`
- `percentReturn` = (`unrealizedGain` / `costBasis`) * 100

---

### Goal

Represents a savings goal with target amount and date.

**Fields**:
- `id`: UUID (primary key, indexed)
- `name`: string (max 100 chars)
- `description`: string | null (max 500 chars)
- `targetAmount`: number (positive)
- `currentAmount`: number (non-negative, default 0)
- `targetDate`: ISO 8601 date string
- `monthlyContribution`: number | null (suggested amount)
- `priority`: number (1-10, for ranking goals)
- `isCompleted`: boolean
- `completedAt`: ISO 8601 timestamp | null
- `createdAt`: ISO 8601 timestamp
- `updatedAt`: ISO 8601 timestamp

**Validation Rules**:
- `name` must be non-empty
- `targetAmount` must be positive
- `currentAmount` must be non-negative
- `targetDate` must be future date (when created)
- `priority` must be between 1 and 10
- `currentAmount` cannot exceed `targetAmount`

**Indexes**:
- Primary: `id`
- Secondary: `targetDate` (for timeline view)
- Secondary: `priority` (for sorting)
- Secondary: `isCompleted` (for filtering)

**Relationships**:
- Has many GoalContributions

**Derived Data**:
- `percentComplete` = (`currentAmount` / `targetAmount`) * 100
- `remainingAmount` = `targetAmount` - `currentAmount`
- `monthsRemaining` = months between now and `targetDate`
- `requiredMonthlyContribution` = `remainingAmount` / `monthsRemaining`
- `projectedCompletionDate` = based on `monthlyContribution` rate

---

### GoalContribution

Represents an allocation of funds to a goal.

**Fields**:
- `id`: UUID (primary key, indexed)
- `goalId`: UUID (foreign key to Goal, indexed)
- `transactionId`: UUID | null (foreign key to Transaction)
- `amount`: number (positive)
- `date`: ISO 8601 date string
- `notes`: string | null (max 500 chars)
- `createdAt`: ISO 8601 timestamp

**Validation Rules**:
- `goalId` must reference existing Goal
- `amount` must be positive
- `date` must be valid date
- Sum of contributions cannot exceed goal `targetAmount`

**Indexes**:
- Primary: `id`
- Secondary: `goalId` (for goal history)
- Secondary: `date` (for timeline)

**Relationships**:
- Belongs to one Goal
- May reference one Transaction

---

### Forecast

Represents projected future cash flow.

**Fields**:
- `id`: UUID (primary key, indexed)
- `accountId`: UUID | null (null for all accounts)
- `date`: ISO 8601 date string (indexed)
- `projectedIncome`: number
- `projectedExpenses`: number
- `projectedBalance`: number
- `confidence`: number (0-1, based on data availability)
- `basedOnMonths`: number (months of history used)
- `createdAt`: ISO 8601 timestamp

**Validation Rules**:
- `date` must be future date
- `confidence` must be between 0 and 1
- `basedOnMonths` must be positive

**Indexes**:
- Primary: `id`
- Secondary: `date` (for timeline queries)
- Compound: `[accountId, date]` (for account forecasts)

**Relationships**:
- May belong to one Account (null for aggregate)

**Business Logic**:
- Regenerated when transaction patterns change
- Uses historical averages and recurring transactions
- Confidence decreases for dates further in future
- Requires minimum 3 months history for generation

---

### Report

Represents a generated financial report (cached for performance).

**Fields**:
- `id`: UUID (primary key, indexed)
- `type`: 'spending_by_category' | 'income_vs_expense' | 'net_worth' | 'budget_performance' | 'investment_performance'
- `startDate`: ISO 8601 date string
- `endDate`: ISO 8601 date string
- `accountIds`: UUID[] | null (null for all accounts)
- `data`: JSON (report-specific data structure)
- `generatedAt`: ISO 8601 timestamp
- `expiresAt`: ISO 8601 timestamp (cache expiration)

**Validation Rules**:
- `type` must be one of the enum values
- `startDate` must be before `endDate`
- `data` must be valid JSON

**Indexes**:
- Primary: `id`
- Compound: `[type, startDate, endDate]` (for cache lookup)
- Secondary: `expiresAt` (for cleanup)

**Relationships**:
- None (cached aggregate data)

**Business Logic**:
- Reports cached for 1 hour
- Invalidated when related transactions change
- Expired reports deleted automatically

---

## Relationships Summary

```
Account (1) ──< (N) Transaction
Account (1) ──< (N) Budget
Account (1) ──< (N) Investment
Account (1) ──< (N) Forecast

Category (1) ──< (N) Transaction
Category (1) ──< (N) Budget
Category (1) ──< (N) Category (parent-child)

RecurringTransaction (1) ──< (N) Transaction

Goal (1) ──< (N) GoalContribution
Transaction (1) ──< (1) GoalContribution (optional)

Transaction (1) ──> (1) Account (transfer target, optional)
```

## IndexedDB Schema

### Object Stores

```typescript
// Object store definitions
const stores = {
  transactions: { keyPath: 'id', indexes: ['date', 'accountId', 'categoryId', ['accountId', 'date']] },
  accounts: { keyPath: 'id', indexes: ['name', 'isActive'] },
  categories: { keyPath: 'id', indexes: ['parentCategoryId', 'type'] },
  budgets: { keyPath: 'id', indexes: ['categoryId', ['categoryId', 'startDate']] },
  recurringTransactions: { keyPath: 'id', indexes: ['nextOccurrence', 'isActive'] },
  investments: { keyPath: 'id', indexes: ['accountId', 'symbol', 'assetType'] },
  goals: { keyPath: 'id', indexes: ['targetDate', 'priority', 'isCompleted'] },
  goalContributions: { keyPath: 'id', indexes: ['goalId', 'date'] },
  forecasts: { keyPath: 'id', indexes: ['date', ['accountId', 'date']] },
  reports: { keyPath: 'id', indexes: [['type', 'startDate', 'endDate'], 'expiresAt'] }
};
```

### Database Version

- **Version 1**: Initial schema with all entities
- Future versions will use migration scripts for schema changes

## Data Integrity Rules

### Referential Integrity

- Cannot delete Account with existing Transactions (must archive)
- Cannot delete Category with existing Transactions (must reassign)
- Deleting RecurringTransaction does not delete generated Transactions
- Deleting Goal deletes associated GoalContributions (cascade)
- Transfer transactions create two Transaction records (linked)

### Consistency Rules

- Account `currentBalance` must equal `initialBalance` + sum of transaction amounts
- Budget `spent` must equal sum of category transactions in period
- Goal `currentAmount` must equal sum of GoalContributions
- Investment `currentValue` must equal `quantity` * `currentPrice`

### Validation at Boundaries

- All user input validated with Zod schemas
- All data from IndexedDB validated before use
- Import data validated and sanitized
- Export data encrypted if password enabled

## Performance Considerations

### Query Optimization

- Use compound indexes for common query patterns
- Limit result sets with pagination (100 items per page)
- Use cursors for large dataset iteration
- Cache frequently accessed data (categories, accounts)

### Write Optimization

- Batch transaction writes when importing
- Use transactions for multi-record updates
- Defer index updates until transaction commit
- Clean up expired reports periodically

### Memory Management

- Lazy load transaction details (list shows summary only)
- Virtual scrolling for large lists
- Unload old data when navigating away
- Limit forecast generation to 6 months

## Migration Strategy

### Version Upgrades

```typescript
function upgradeDatabase(db: IDBDatabase, oldVersion: number, newVersion: number) {
  if (oldVersion < 1) {
    // Create initial schema
    createObjectStores(db);
    createIndexes(db);
    seedDefaultCategories(db);
  }
  // Future migrations here
}
```

### Data Export Format

```typescript
interface ExportData {
  version: string;
  exportedAt: string;
  encrypted: boolean;
  data: {
    accounts: Account[];
    transactions: Transaction[];
    categories: Category[];
    budgets: Budget[];
    recurringTransactions: RecurringTransaction[];
    investments: Investment[];
    goals: Goal[];
    goalContributions: GoalContribution[];
  };
}
```

## Summary

The data model supports all functional requirements from the specification:
- ✅ Transaction management with categorization
- ✅ Multiple account types with balance tracking
- ✅ Budget creation and progress monitoring
- ✅ Recurring transaction automation
- ✅ Investment portfolio tracking
- ✅ Financial goals with contribution tracking
- ✅ Cash flow forecasting
- ✅ Report generation and caching

All entities follow constitution principles:
- ✅ Explicit types (no `any`)
- ✅ Immutable by design (functional updates)
- ✅ Validation at boundaries
- ✅ Performance optimized (indexes, caching)
- ✅ Privacy-first (local storage only)