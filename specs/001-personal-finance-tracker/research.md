# Research: Personal Finance Tracker

**Date**: 2026-05-26
**Feature**: Personal Finance Tracker
**Branch**: 001-personal-finance-tracker

## Purpose

This document consolidates research findings for technical decisions required to implement the Personal Finance Tracker according to the constitution principles.

## Technology Stack Decisions

### Decision: TypeScript + React + Electron
**Rationale**:
- **TypeScript**: Mandated by constitution (strict mode, no `any`). Provides compile-time type safety for financial calculations
- **React**: Component-based architecture aligns with clean architecture principles. Large ecosystem for UI components
- **Electron**: Enables desktop-first approach with local storage. Cross-platform (Windows, macOS, Linux) from single codebase
- **Why not web-only**: Privacy-first requirement demands local storage without server dependency. Electron provides native file system access

**Alternatives considered**:
- **Native apps (Swift/Kotlin)**: Rejected due to need for separate codebases per platform, increasing maintenance burden
- **Flutter**: Rejected due to team TypeScript expertise and constitution requirement for TypeScript
- **Tauri**: Considered but Electron has more mature ecosystem and better TypeScript integration

### Decision: IndexedDB for Local Storage
**Rationale**:
- Built into browsers/Electron, no external dependencies
- Supports large datasets (10,000+ transactions per constitution requirement)
- Transactional integrity for financial data
- Async API aligns with performance requirements (<100ms operations)
- Structured storage with indexes for fast queries

**Alternatives considered**:
- **SQLite**: Rejected because requires native bindings in Electron, adds complexity
- **LocalStorage**: Rejected due to 5-10MB limit, insufficient for large transaction histories
- **File-based JSON**: Rejected due to poor performance for large datasets and lack of transactional integrity

### Decision: Vitest for Testing
**Rationale**:
- Native TypeScript support without configuration
- Fast execution (important for TDD workflow)
- Compatible with React Testing Library for component tests
- Built-in coverage reporting (constitution requires 80% coverage)
- Modern API similar to Jest but faster

**Alternatives considered**:
- **Jest**: Rejected due to slower execution and more complex TypeScript setup
- **Mocha/Chai**: Rejected due to more configuration required and less integrated coverage reporting

### Decision: Vite for Build Tool
**Rationale**:
- Fast HMR (Hot Module Replacement) for development productivity
- Native TypeScript support
- Optimized production builds with tree-shaking
- Works seamlessly with Vitest
- Electron-vite integration available

**Alternatives considered**:
- **Webpack**: Rejected due to slower build times and more complex configuration
- **Parcel**: Rejected due to less mature Electron integration

### Decision: Zod for Runtime Validation
**Rationale**:
- TypeScript-first schema validation
- Generates TypeScript types from schemas (single source of truth)
- Explicit error messages (aligns with constitution error handling principle)
- Validates data at boundaries (file imports, user input)
- Lightweight with no dependencies

**Alternatives considered**:
- **Yup**: Rejected due to less TypeScript-native approach
- **Joi**: Rejected due to larger bundle size and Node.js focus
- **io-ts**: Rejected due to steeper learning curve

### Decision: date-fns for Date Handling
**Rationale**:
- Immutable date operations (aligns with functional programming preference)
- Tree-shakeable (only import functions you use)
- TypeScript support
- No timezone complexity (local-only app)
- Smaller than moment.js

**Alternatives considered**:
- **Moment.js**: Rejected due to large bundle size and mutable API
- **Day.js**: Considered but date-fns has better TypeScript support
- **Luxon**: Rejected due to larger size and timezone features not needed

## Architecture Patterns

### Decision: Clean Architecture with Functional Core
**Rationale**:
- **Domain Layer**: Pure TypeScript functions for business logic (no framework dependencies)
- **Application Layer**: Use cases orchestrate domain logic, define interfaces
- **Infrastructure Layer**: IndexedDB repositories implement interfaces, React components
- **Presentation Layer**: React components, hooks for state management
- Functional core enables easy testing (80% coverage requirement)
- Clear boundaries prevent framework lock-in

**Implementation approach**:
```
src/
├── domain/           # Pure business logic (no dependencies)
│   ├── entities/     # Transaction, Account, Budget, etc.
│   ├── value-objects/  # Money, Date, Category
│   └── services/     # Pure calculation functions
├── application/      # Use cases and interfaces
│   ├── use-cases/    # AddTransaction, CreateBudget, etc.
│   └── ports/        # Repository interfaces
├── infrastructure/   # Framework-specific implementations
│   ├── persistence/  # IndexedDB repositories
│   └── ui/           # React components
└── presentation/     # UI layer
    ├── components/   # React components
    ├── hooks/        # Custom React hooks
    └── pages/        # Page-level components
```

### Decision: Repository Pattern for Data Access
**Rationale**:
- Abstracts IndexedDB details from business logic
- Enables easy testing with in-memory implementations
- Supports future migration to different storage if needed
- Aligns with clean architecture port/adapter pattern

**Interface example**:
```typescript
interface TransactionRepository {
  save(transaction: Transaction): Promise<Result<Transaction, SaveError>>;
  findById(id: string): Promise<Result<Transaction, NotFoundError>>;
  findByDateRange(start: Date, end: Date): Promise<Result<Transaction[], QueryError>>;
  delete(id: string): Promise<Result<void, DeleteError>>;
}
```

### Decision: Result Type for Error Handling
**Rationale**:
- Explicit error handling (constitution requirement)
- Type-safe error propagation
- Forces handling of error cases at compile time
- No exceptions for expected errors (functional approach)

**Implementation**:
```typescript
type Result<T, E> = 
  | { success: true; value: T }
  | { success: false; error: E };
```

### Decision: Custom Hooks for State Management
**Rationale**:
- React hooks provide local state management
- No need for Redux/MobX complexity for single-user app
- Hooks encapsulate business logic calls
- Easy to test with React Testing Library

**Pattern**:
```typescript
function useTransactions(accountId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Load, add, update, delete operations
  return { transactions, loading, error, addTransaction, ... };
}
```

## Performance Optimization Strategies

### Decision: Virtual Scrolling for Large Lists
**Rationale**:
- Constitution requires handling 10,000+ transactions
- Rendering all transactions would violate <100ms requirement
- react-window library provides virtual scrolling
- Only renders visible items, maintains performance

### Decision: IndexedDB Indexes on Key Fields
**Rationale**:
- Index on date, accountId, categoryId for fast queries
- Enables sub-100ms query performance
- Compound indexes for common query patterns
- Trade-off: Slightly slower writes, much faster reads

### Decision: Memoization for Expensive Calculations
**Rationale**:
- Use React.useMemo for derived data (totals, aggregations)
- Prevents recalculation on every render
- Critical for dashboard performance
- Aligns with functional programming (pure functions)

### Decision: Web Workers for Heavy Computations
**Rationale**:
- Forecast calculations and report generation off main thread
- Maintains UI responsiveness
- Electron supports web workers
- Returns results via message passing

## Data Model Decisions

### Decision: Normalized Schema with Relationships
**Rationale**:
- Separate tables for Transactions, Accounts, Categories, Budgets
- Foreign key relationships (accountId, categoryId)
- Reduces data duplication
- Enables efficient queries and updates
- Supports data integrity

### Decision: UUID for Entity IDs
**Rationale**:
- Globally unique without coordination
- Enables offline-first architecture
- No collision risk when importing data
- TypeScript branded types for type safety

### Decision: Immutable Entities
**Rationale**:
- Aligns with functional programming preference
- Prevents accidental mutations
- Easier to reason about state changes
- Supports undo/redo if needed in future

## Testing Strategy

### Decision: Test Pyramid Approach
**Rationale**:
- **Unit tests (70%)**: Domain logic, pure functions, calculations
- **Integration tests (20%)**: Repository implementations, use cases
- **E2E tests (10%)**: Critical user flows
- Achieves 80% coverage requirement efficiently
- Fast feedback loop for TDD

### Decision: Test Data Builders
**Rationale**:
- Reusable test data creation
- Reduces test setup boilerplate
- Maintains test readability
- Supports testing edge cases

**Pattern**:
```typescript
class TransactionBuilder {
  private transaction: Partial<Transaction> = {};
  
  withAmount(amount: number) { ... }
  withCategory(category: Category) { ... }
  build(): Transaction { ... }
}
```

### Decision: In-Memory Repository for Tests
**Rationale**:
- Fast test execution (no IndexedDB overhead)
- Deterministic test results
- Easy to reset state between tests
- Implements same interface as real repository

## Security Decisions

### Decision: Encryption at Rest with Web Crypto API
**Rationale**:
- Built into browsers/Electron
- AES-256-GCM for data encryption
- PBKDF2 for key derivation from user password
- No external crypto libraries needed
- Meets privacy-first requirement

### Decision: Optional Password Protection
**Rationale**:
- User choice for convenience vs security
- Encrypted storage when password enabled
- Plain storage when password disabled
- Clear warning about unencrypted data

### Decision: No Network Requests
**Rationale**:
- Privacy-first: no data leaves device
- No analytics, no crash reporting, no updates check
- All features work offline
- User controls all data export/import

## File Size Management

### Decision: Module-per-Entity Pattern
**Rationale**:
- Each entity (Transaction, Account, etc.) in separate file
- Use cases in separate files
- Repositories in separate files
- Naturally stays under 200-line limit
- Clear module boundaries

### Decision: Barrel Exports for Public API
**Rationale**:
- index.ts files export public interfaces
- Internal implementation details remain private
- Reduces coupling between modules
- Makes refactoring easier

## Development Workflow

### Decision: TDD with Vitest Watch Mode
**Rationale**:
- Write test → See it fail → Implement → See it pass
- Fast feedback with watch mode
- Coverage tracking in real-time
- Aligns with constitution test-first principle

### Decision: ESLint + Prettier for Code Quality
**Rationale**:
- ESLint enforces TypeScript strict rules
- Prettier ensures consistent formatting
- Pre-commit hooks prevent violations
- Automated code review for style issues

### Decision: Husky for Git Hooks
**Rationale**:
- Pre-commit: Run linter and formatter
- Pre-push: Run tests and coverage check
- Prevents committing code that violates constitution
- Automated quality gates

## Deployment Strategy

### Decision: Electron Builder for Distribution
**Rationale**:
- Creates installers for Windows, macOS, Linux
- Code signing support for security
- Auto-update capability (optional, user-controlled)
- Handles platform-specific packaging

### Decision: GitHub Releases for Distribution
**Rationale**:
- Free hosting for open source
- Version tracking
- Release notes
- Download statistics

## Summary

All technical decisions align with constitution principles:
- ✅ TypeScript strict mode (no `any`)
- ✅ File size discipline (modular architecture)
- ✅ 80% test coverage (TDD approach, test pyramid)
- ✅ Privacy-first (local storage, no network)
- ✅ Clean architecture (clear layer separation)
- ✅ Explicit error handling (Result types)
- ✅ Sub-100ms performance (optimization strategies)

**Next Phase**: Proceed to data model design and contract definitions.