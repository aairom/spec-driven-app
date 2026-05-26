# Quickstart Guide: Personal Finance Tracker

**Date**: 2026-05-26
**Feature**: Personal Finance Tracker
**Branch**: 001-personal-finance-tracker

## Overview

This guide helps developers get started with the Personal Finance Tracker codebase. It covers setup, architecture overview, and common development tasks.

## Prerequisites

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Git**: For version control
- **VS Code**: Recommended IDE (with TypeScript and ESLint extensions)

## Quick Setup

```bash
# Clone repository
git clone <repository-url>
cd personal-finance-tracker

# Install dependencies
npm install

# Run tests
npm test

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
personal-finance-tracker/
├── src/
│   ├── domain/              # Pure business logic (no dependencies)
│   │   ├── entities/        # Transaction, Account, Budget, etc.
│   │   ├── value-objects/   # Money, Date, Category
│   │   └── services/        # Pure calculation functions
│   ├── application/         # Use cases and interfaces
│   │   ├── use-cases/       # AddTransaction, CreateBudget, etc.
│   │   └── ports/           # Repository interfaces
│   ├── infrastructure/      # Framework-specific implementations
│   │   ├── persistence/     # IndexedDB repositories
│   │   └── ui/              # React components
│   └── presentation/        # UI layer
│       ├── components/      # React components
│       ├── hooks/           # Custom React hooks
│       └── pages/           # Page-level components
├── tests/
│   ├── unit/               # Domain and application layer tests
│   ├── integration/        # Repository and use case tests
│   └── e2e/                # End-to-end user flow tests
├── specs/                  # Feature specifications
└── docs/                   # Additional documentation
```

## Architecture Overview

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│      Presentation Layer             │
│  (React Components, Hooks, Pages)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│     Infrastructure Layer            │
│  (IndexedDB, React, Electron)       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Application Layer              │
│   (Use Cases, Interfaces/Ports)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Domain Layer                 │
│  (Entities, Value Objects, Services)│
└─────────────────────────────────────┘
```

**Key Principles**:
- Dependencies flow inward (outer layers depend on inner layers)
- Domain layer has no external dependencies
- Business logic is framework-agnostic
- Easy to test and maintain

### Data Flow

```
User Action → Component → Hook → Use Case → Repository → IndexedDB
                                     ↓
                                Domain Logic
                                     ↓
                                  Result
```

## Development Workflow

### 1. Test-Driven Development (TDD)

**Required by constitution**: Write tests before implementation.

```bash
# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

**TDD Cycle**:
1. Write a failing test
2. Run tests (see it fail)
3. Write minimal code to pass
4. Run tests (see it pass)
5. Refactor if needed
6. Repeat

**Example**:
```typescript
// 1. Write test first
describe('AddTransactionUseCase', () => {
  it('should add transaction and update account balance', async () => {
    const useCase = new AddTransactionUseCase(mockRepo);
    const result = await useCase.execute({
      type: 'expense',
      amount: 50,
      accountId: 'account-1',
      description: 'Groceries'
    });
    
    expect(result.success).toBe(true);
    expect(result.value.amount).toBe(50);
  });
});

// 2. Implement to pass test
class AddTransactionUseCase {
  async execute(params: AddTransactionParams) {
    // Implementation here
  }
}
```

### 2. Creating a New Feature

**Step-by-step process**:

```bash
# 1. Create feature branch
git checkout -b feature/new-feature-name

# 2. Write tests for domain logic
# tests/unit/domain/entities/new-entity.test.ts

# 3. Implement domain entity
# src/domain/entities/new-entity.ts

# 4. Write tests for use case
# tests/unit/application/use-cases/new-use-case.test.ts

# 5. Implement use case
# src/application/use-cases/new-use-case.ts

# 6. Write tests for repository
# tests/integration/infrastructure/persistence/new-repository.test.ts

# 7. Implement repository
# src/infrastructure/persistence/new-repository.ts

# 8. Create React components
# src/presentation/components/new-component.tsx

# 9. Write E2E tests
# tests/e2e/new-feature.test.ts

# 10. Run all tests
npm test

# 11. Check coverage (must be ≥80%)
npm run test:coverage
```

### 3. File Size Management

**Constitution requirement**: Max 200 lines per file.

**Strategies**:
- Split large files into smaller modules
- Extract helper functions to separate files
- Use barrel exports (index.ts) for public APIs
- Keep components focused on single responsibility

**Example**:
```typescript
// ❌ Bad: 300-line component
// TransactionList.tsx (300 lines)

// ✅ Good: Split into smaller files
// TransactionList.tsx (80 lines) - main component
// TransactionListItem.tsx (60 lines) - list item
// TransactionListFilters.tsx (70 lines) - filters
// useTransactionList.ts (50 lines) - custom hook
```

### 4. Error Handling

**Constitution requirement**: Explicit, typed errors.

**Pattern**:
```typescript
// Define error types
class AddTransactionError extends DomainError {
  constructor(message: string) {
    super(message, 'ADD_TRANSACTION_ERROR');
  }
}

// Use Result type
async function addTransaction(
  params: AddTransactionParams
): Promise<Result<Transaction, AddTransactionError>> {
  // Validate
  if (params.amount <= 0) {
    return failure(new ValidationError('Amount must be positive', 'amount'));
  }
  
  // Execute
  try {
    const transaction = createTransaction(params);
    const saveResult = await repo.save(transaction);
    
    if (!saveResult.success) {
      return failure(new AddTransactionError(saveResult.error.message));
    }
    
    return success(saveResult.value);
  } catch (error) {
    return failure(new AddTransactionError(error.message));
  }
}

// Handle in component
const result = await addTransaction(params);
if (!result.success) {
  showError(result.error.message);
  return;
}
showSuccess('Transaction added');
```

### 5. Performance Optimization

**Constitution requirement**: Sub-100ms operations.

**Strategies**:
- Use React.memo for expensive components
- Use useMemo for expensive calculations
- Use useCallback for stable function references
- Implement virtual scrolling for large lists
- Use IndexedDB indexes for fast queries
- Batch operations when possible

**Example**:
```typescript
// Memoize expensive calculations
const totalSpending = useMemo(() => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
}, [transactions]);

// Virtual scrolling for large lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={transactions.length}
  itemSize={60}
  width="100%"
>
  {({ index, style }) => (
    <TransactionItem 
      transaction={transactions[index]} 
      style={style} 
    />
  )}
</FixedSizeList>
```

## Common Tasks

### Adding a New Entity

1. **Define entity type** in `src/domain/entities/`
2. **Create Zod schema** for validation
3. **Write unit tests** for entity creation and validation
4. **Implement entity factory** function
5. **Add to data model** documentation

### Adding a New Use Case

1. **Define interface** in `src/application/use-cases/`
2. **Write unit tests** with mock repositories
3. **Implement use case** logic
4. **Add integration tests** with real repositories
5. **Update contracts** documentation

### Adding a New Repository

1. **Define interface** in `src/application/ports/`
2. **Write integration tests** with IndexedDB
3. **Implement repository** in `src/infrastructure/persistence/`
4. **Add indexes** for performance
5. **Test with large datasets** (10,000+ records)

### Adding a New Component

1. **Write component tests** with React Testing Library
2. **Implement component** with TypeScript
3. **Add to Storybook** (if using)
4. **Test accessibility** (ARIA labels, keyboard navigation)
5. **Verify performance** (<100ms render time)

## Testing Guidelines

### Unit Tests (70% of tests)

**Focus**: Domain logic, pure functions, calculations

```typescript
describe('calculateBudgetProgress', () => {
  it('should calculate percentage correctly', () => {
    const result = calculateBudgetProgress(500, 1000);
    expect(result.percentUsed).toBe(50);
    expect(result.remaining).toBe(500);
  });
  
  it('should handle over-budget scenario', () => {
    const result = calculateBudgetProgress(1200, 1000);
    expect(result.isOverBudget).toBe(true);
    expect(result.percentUsed).toBe(120);
  });
});
```

### Integration Tests (20% of tests)

**Focus**: Repository implementations, use cases with real dependencies

```typescript
describe('TransactionRepository Integration', () => {
  let db: IDBDatabase;
  let repo: TransactionRepository;
  
  beforeEach(async () => {
    db = await openTestDatabase();
    repo = new IndexedDBTransactionRepository(db);
  });
  
  it('should save and retrieve transaction', async () => {
    const transaction = createTestTransaction();
    const saveResult = await repo.save(transaction);
    expect(saveResult.success).toBe(true);
    
    const findResult = await repo.findById(transaction.id);
    expect(findResult.success).toBe(true);
    expect(findResult.value).toEqual(transaction);
  });
});
```

### E2E Tests (10% of tests)

**Focus**: Critical user flows

```typescript
describe('Add Transaction Flow', () => {
  it('should add transaction and update balance', async () => {
    await page.goto('http://localhost:3000');
    await page.click('[data-testid="add-transaction"]');
    await page.fill('[data-testid="amount"]', '50');
    await page.fill('[data-testid="description"]', 'Groceries');
    await page.click('[data-testid="save"]');
    
    await expect(page.locator('[data-testid="balance"]')).toContainText('$950');
  });
});
```

## Debugging Tips

### IndexedDB Inspection

**Chrome DevTools**:
1. Open DevTools (F12)
2. Go to Application tab
3. Expand IndexedDB
4. View object stores and data

### React DevTools

**Install extension**:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

**Features**:
- Inspect component tree
- View props and state
- Profile performance
- Track re-renders

### Performance Profiling

```typescript
// Add performance marks
performance.mark('operation-start');
await expensiveOperation();
performance.mark('operation-end');
performance.measure('operation', 'operation-start', 'operation-end');

// View in DevTools Performance tab
const measure = performance.getEntriesByName('operation')[0];
console.log(`Operation took ${measure.duration}ms`);
```

## Code Quality Tools

### ESLint

```bash
# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

**Key rules**:
- `@typescript-eslint/no-explicit-any`: Forbidden
- `@typescript-eslint/strict-boolean-expressions`: Required
- `max-lines`: 200 lines per file
- `complexity`: Max cyclomatic complexity 10

### Prettier

```bash
# Format code
npm run format

# Check formatting
npm run format:check
```

### Type Checking

```bash
# Run TypeScript compiler
npm run type-check

# Watch mode
npm run type-check:watch
```

## Troubleshooting

### Common Issues

**Issue**: Tests failing with "Cannot find module"
**Solution**: Check import paths, ensure barrel exports are correct

**Issue**: IndexedDB errors in tests
**Solution**: Use fake-indexeddb for testing, ensure proper cleanup

**Issue**: Performance below 100ms requirement
**Solution**: Add indexes, use memoization, implement virtual scrolling

**Issue**: File exceeds 200 lines
**Solution**: Extract functions, split into smaller modules, use composition

**Issue**: Coverage below 80%
**Solution**: Add tests for uncovered branches, test error cases

## Resources

- **TypeScript Docs**: https://www.typescriptlang.org/docs/
- **React Docs**: https://react.dev/
- **Vitest Docs**: https://vitest.dev/
- **IndexedDB Guide**: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API
- **Clean Architecture**: https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

## Getting Help

1. **Check documentation**: specs/, docs/, README.md
2. **Review tests**: See examples in tests/ directory
3. **Ask team**: Use team chat or create GitHub issue
4. **Pair programming**: Schedule session with experienced developer

## Next Steps

1. **Read the specification**: `specs/001-personal-finance-tracker/spec.md`
2. **Review the constitution**: `.specify/memory/constitution.md`
3. **Explore the codebase**: Start with `src/domain/` layer
4. **Run the tests**: `npm test` to see current state
5. **Pick a task**: Check `specs/001-personal-finance-tracker/tasks.md` (after `/speckit.tasks`)

Happy coding! 🚀