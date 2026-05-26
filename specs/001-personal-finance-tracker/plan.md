# Implementation Plan: Personal Finance Tracker

**Branch**: `001-personal-finance-tracker` | **Date**: 2026-05-26 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-personal-finance-tracker/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a comprehensive desktop personal finance tracker with transaction management, budgeting, investment tracking, financial goals, forecasting, and advanced reporting. The application follows clean architecture principles with TypeScript strict mode, local-first data storage (IndexedDB), and privacy-first design. All operations must complete in under 100ms, support 10,000+ transactions, maintain 80% test coverage, and enforce 200-line file size limits.

**Technical Approach**: Electron desktop app with React UI, TypeScript strict mode, IndexedDB for local storage, clean architecture with functional core, Result types for error handling, TDD with Vitest, and comprehensive testing strategy.

## Technical Context

**Language/Version**: TypeScript 5.3+ with strict mode enabled, targeting ES2022

**Primary Dependencies**: 
- React 18.2+ (UI framework)
- Electron 28+ (desktop application framework)
- Vite 5+ (build tool and dev server)
- Vitest 1+ (testing framework)
- IndexedDB (built-in browser storage)
- Zod 3+ (runtime validation and type generation)
- date-fns 3+ (date manipulation)
- react-window 1.8+ (virtual scrolling for performance)

**Storage**: IndexedDB (local browser storage, no external database)

**Testing**: Vitest for unit/integration tests, Playwright for E2E tests, React Testing Library for component tests

**Target Platform**: Desktop (Windows 10+, macOS 11+, Linux) via Electron

**Project Type**: Desktop application (Electron + React)

**Performance Goals**: 
- All operations complete in <100ms
- Support 10,000+ transactions per account
- Dashboard loads in <2 seconds
- Reports generate in <3 seconds
- UI remains responsive during heavy operations

**Constraints**: 
- Privacy-first: All data stored locally, no network requests
- File size: Maximum 200 lines per file (excluding comments/blank lines)
- Test coverage: Minimum 80% line coverage on business logic
- Type safety: No `any` types, TypeScript strict mode enforced
- Error handling: Explicit Result types, no silent failures

**Scale/Scope**: 
- Single-user desktop application
- Support 10,000+ transactions per account
- Multiple accounts (10-20 typical)
- 50+ categories (default + custom)
- 10+ budgets active simultaneously
- 100+ investment holdings
- 10+ financial goals
- 6-month forecast projections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. TypeScript Strict Mode (NON-NEGOTIABLE)
- **Status**: PASS
- **Implementation**: tsconfig.json with `strict: true`, `noImplicitAny: true`, `strictNullChecks: true`
- **Enforcement**: ESLint rule `@typescript-eslint/no-explicit-any` set to error
- **Verification**: TypeScript compiler errors on any violations, CI pipeline blocks merges

### ✅ II. File Size Discipline
- **Status**: PASS
- **Implementation**: ESLint rule `max-lines` set to 200 (excluding comments/blank lines)
- **Strategy**: Modular architecture with single-responsibility modules, barrel exports for public APIs
- **Verification**: Pre-commit hook checks file sizes, CI pipeline blocks violations

### ✅ III. Test Coverage (NON-NEGOTIABLE)
- **Status**: PASS
- **Implementation**: Vitest with coverage reporting, 80% threshold enforced
- **Strategy**: Test pyramid (70% unit, 20% integration, 10% E2E), TDD workflow
- **Verification**: Coverage reports generated on every test run, CI pipeline blocks <80% coverage

### ✅ IV. Privacy-First Architecture
- **Status**: PASS
- **Implementation**: IndexedDB for local storage, no network requests, optional encryption with Web Crypto API
- **Strategy**: All data stays on device, user controls all exports, no analytics/tracking
- **Verification**: Network tab inspection shows zero requests, code review for any fetch/axios usage

### ✅ V. Clean Architecture
- **Status**: PASS
- **Implementation**: Four-layer architecture (Domain → Application → Infrastructure → Presentation)
- **Strategy**: Dependencies flow inward, domain layer has zero external dependencies
- **Verification**: Dependency graph analysis, import linting rules enforce layer boundaries

### ✅ VI. Explicit Error Handling
- **Status**: PASS
- **Implementation**: Result<T, E> types for all operations, typed error classes
- **Strategy**: No try-catch for expected errors, explicit error handling at boundaries
- **Verification**: ESLint rules forbid unhandled promises, code review checks error handling

### ✅ VII. Performance Standards
- **Status**: PASS
- **Implementation**: IndexedDB indexes, virtual scrolling, memoization, web workers for heavy computations
- **Strategy**: Performance budgets enforced, profiling in development, optimization strategies documented
- **Verification**: Performance tests in CI, Lighthouse audits, manual profiling

**Gate Result**: ✅ ALL CHECKS PASSED - Proceed to Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/001-personal-finance-tracker/
├── spec.md              # Feature specification (requirements)
├── plan.md              # This file (technical implementation plan)
├── research.md          # Phase 0 output (technology decisions)
├── data-model.md        # Phase 1 output (entity definitions)
├── quickstart.md        # Phase 1 output (developer guide)
├── contracts/           # Phase 1 output (API contracts)
│   └── README.md        # Repository and use case interfaces
├── checklists/          # Quality validation
│   └── requirements.md  # Specification quality checklist
└── tasks.md             # Phase 2 output (NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
personal-finance-tracker/
├── src/
│   ├── domain/                    # Pure business logic (no dependencies)
│   │   ├── entities/              # Core entities
│   │   │   ├── transaction.ts     # Transaction entity and factory
│   │   │   ├── account.ts         # Account entity and factory
│   │   │   ├── category.ts        # Category entity and factory
│   │   │   ├── budget.ts          # Budget entity and factory
│   │   │   ├── recurring-transaction.ts
│   │   │   ├── investment.ts      # Investment entity and factory
│   │   │   ├── goal.ts            # Goal entity and factory
│   │   │   └── index.ts           # Barrel export
│   │   ├── value-objects/         # Immutable value objects
│   │   │   ├── money.ts           # Money value object
│   │   │   ├── date-range.ts      # Date range value object
│   │   │   ├── percentage.ts      # Percentage value object
│   │   │   └── index.ts
│   │   ├── services/              # Pure calculation functions
│   │   │   ├── balance-calculator.ts
│   │   │   ├── budget-calculator.ts
│   │   │   ├── investment-calculator.ts
│   │   │   ├── forecast-generator.ts
│   │   │   └── index.ts
│   │   └── index.ts               # Domain layer public API
│   │
│   ├── application/               # Use cases and interfaces
│   │   ├── use-cases/             # Business operations
│   │   │   ├── transactions/
│   │   │   │   ├── add-transaction.ts
│   │   │   │   ├── edit-transaction.ts
│   │   │   │   ├── delete-transaction.ts
│   │   │   │   ├── get-transaction-history.ts
│   │   │   │   └── index.ts
│   │   │   ├── accounts/
│   │   │   │   ├── create-account.ts
│   │   │   │   ├── get-account-balance.ts
│   │   │   │   ├── get-net-worth.ts
│   │   │   │   └── index.ts
│   │   │   ├── budgets/
│   │   │   │   ├── create-budget.ts
│   │   │   │   ├── get-budget-progress.ts
│   │   │   │   └── index.ts
│   │   │   ├── investments/
│   │   │   │   ├── add-investment.ts
│   │   │   │   ├── get-portfolio-performance.ts
│   │   │   │   └── index.ts
│   │   │   ├── goals/
│   │   │   │   ├── create-goal.ts
│   │   │   │   ├── contribute-to-goal.ts
│   │   │   │   ├── get-goal-progress.ts
│   │   │   │   └── index.ts
│   │   │   ├── forecasts/
│   │   │   │   ├── generate-forecast.ts
│   │   │   │   └── index.ts
│   │   │   ├── reports/
│   │   │   │   ├── generate-report.ts
│   │   │   │   ├── export-report.ts
│   │   │   │   └── index.ts
│   │   │   └── data-management/
│   │   │       ├── import-transactions.ts
│   │   │       ├── export-data.ts
│   │   │       ├── import-data.ts
│   │   │       └── index.ts
│   │   ├── ports/                 # Repository interfaces
│   │   │   ├── transaction-repository.ts
│   │   │   ├── account-repository.ts
│   │   │   ├── category-repository.ts
│   │   │   ├── budget-repository.ts
│   │   │   ├── recurring-transaction-repository.ts
│   │   │   ├── investment-repository.ts
│   │   │   ├── goal-repository.ts
│   │   │   └── index.ts
│   │   └── index.ts               # Application layer public API
│   │
│   ├── infrastructure/            # Framework-specific implementations
│   │   ├── persistence/           # IndexedDB implementations
│   │   │   ├── indexeddb-transaction-repository.ts
│   │   │   ├── indexeddb-account-repository.ts
│   │   │   ├── indexeddb-category-repository.ts
│   │   │   ├── indexeddb-budget-repository.ts
│   │   │   ├── indexeddb-recurring-transaction-repository.ts
│   │   │   ├── indexeddb-investment-repository.ts
│   │   │   ├── indexeddb-goal-repository.ts
│   │   │   ├── database-setup.ts  # IndexedDB initialization
│   │   │   ├── migrations.ts      # Schema migrations
│   │   │   └── index.ts
│   │   ├── encryption/            # Web Crypto API wrapper
│   │   │   ├── crypto-service.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── presentation/              # UI layer
│   │   ├── components/            # React components
│   │   │   ├── transactions/
│   │   │   │   ├── TransactionList.tsx
│   │   │   │   ├── TransactionListItem.tsx
│   │   │   │   ├── TransactionForm.tsx
│   │   │   │   ├── TransactionFilters.tsx
│   │   │   │   └── index.ts
│   │   │   ├── accounts/
│   │   │   │   ├── AccountList.tsx
│   │   │   │   ├── AccountCard.tsx
│   │   │   │   ├── AccountForm.tsx
│   │   │   │   └── index.ts
│   │   │   ├── budgets/
│   │   │   │   ├── BudgetList.tsx
│   │   │   │   ├── BudgetCard.tsx
│   │   │   │   ├── BudgetProgress.tsx
│   │   │   │   └── index.ts
│   │   │   ├── investments/
│   │   │   │   ├── PortfolioSummary.tsx
│   │   │   │   ├── HoldingsList.tsx
│   │   │   │   ├── AssetAllocation.tsx
│   │   │   │   └── index.ts
│   │   │   ├── goals/
│   │   │   │   ├── GoalsList.tsx
│   │   │   │   ├── GoalCard.tsx
│   │   │   │   ├── GoalProgress.tsx
│   │   │   │   └── index.ts
│   │   │   ├── reports/
│   │   │   │   ├── ReportViewer.tsx
│   │   │   │   ├── ChartComponents.tsx
│   │   │   │   └── index.ts
│   │   │   ├── common/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   ├── Modal.tsx
│   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useTransactions.ts
│   │   │   ├── useAccounts.ts
│   │   │   ├── useBudgets.ts
│   │   │   ├── useInvestments.ts
│   │   │   ├── useGoals.ts
│   │   │   ├── useForecasts.ts
│   │   │   └── index.ts
│   │   ├── pages/                 # Page-level components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Transactions.tsx
│   │   │   ├── Accounts.tsx
│   │   │   ├── Budgets.tsx
│   │   │   ├── Investments.tsx
│   │   │   ├── Goals.tsx
│   │   │   ├── Reports.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── index.ts
│   │   ├── App.tsx                # Root component
│   │   └── index.ts
│   │
│   ├── shared/                    # Shared utilities
│   │   ├── types/                 # Shared TypeScript types
│   │   │   ├── result.ts          # Result<T, E> type
│   │   │   ├── errors.ts          # Error class definitions
│   │   │   └── index.ts
│   │   ├── utils/                 # Utility functions
│   │   │   ├── date-utils.ts
│   │   │   ├── format-utils.ts
│   │   │   ├── validation-utils.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   │
│   ├── main.ts                    # Electron main process
│   └── renderer.ts                # Electron renderer entry
│
├── tests/
│   ├── unit/                      # Unit tests (70% of tests)
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   ├── value-objects/
│   │   │   └── services/
│   │   └── application/
│   │       └── use-cases/
│   ├── integration/               # Integration tests (20% of tests)
│   │   ├── persistence/
│   │   └── use-cases/
│   ├── e2e/                       # E2E tests (10% of tests)
│   │   ├── add-transaction.spec.ts
│   │   ├── create-budget.spec.ts
│   │   └── generate-report.spec.ts
│   ├── helpers/                   # Test utilities
│   │   ├── test-data-builders.ts
│   │   ├── mock-repositories.ts
│   │   └── test-database.ts
│   └── setup.ts                   # Test setup and configuration
│
├── public/                        # Static assets
├── dist/                          # Build output
├── .vscode/                       # VS Code settings
├── .husky/                        # Git hooks
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── .eslintrc.json
├── .prettierrc
└── README.md
```

**Structure Decision**: Single project structure with clean architecture layers. The domain layer is completely framework-agnostic, application layer defines interfaces, infrastructure layer implements those interfaces with IndexedDB and React, and presentation layer contains UI components. This structure naturally enforces the 200-line file limit through modular design and supports the 80% test coverage requirement by making business logic easily testable.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution principles are satisfied by the technical design.

## Phase 0: Research (COMPLETED)

**Output**: `research.md`

**Key Decisions**:
1. **TypeScript + React + Electron**: Desktop-first with cross-platform support
2. **IndexedDB**: Local storage with transactional integrity and performance
3. **Vitest**: Fast testing with native TypeScript support
4. **Vite**: Fast builds and HMR for development productivity
5. **Zod**: Runtime validation with TypeScript type generation
6. **date-fns**: Immutable date operations, tree-shakeable
7. **Clean Architecture**: Framework-agnostic business logic
8. **Result Types**: Explicit error handling without exceptions
9. **Repository Pattern**: Abstraction over IndexedDB
10. **Custom Hooks**: React state management without Redux complexity

All decisions documented in [`research.md`](./research.md) with rationale and alternatives considered.

## Phase 1: Design & Contracts (COMPLETED)

**Prerequisites**: `research.md` complete ✅

### Data Model

**Output**: `data-model.md`

**Entities Defined**:
1. **Transaction**: Financial transaction with type, amount, date, account, category
2. **Account**: Financial account with type, balance, transactions
3. **Category**: Transaction category with optional hierarchy
4. **Budget**: Spending limit for category over time period
5. **RecurringTransaction**: Template for automatic transaction creation
6. **Investment**: Investment holding with performance tracking
7. **Goal**: Savings goal with target amount and progress
8. **GoalContribution**: Allocation of funds to goal
9. **Forecast**: Projected future cash flow
10. **Report**: Cached financial report data

**Relationships**: Defined with foreign keys, indexes for performance, validation rules for data integrity.

**IndexedDB Schema**: Object stores with compound indexes for common query patterns.

Full details in [`data-model.md`](./data-model.md).

### Interface Contracts

**Output**: `contracts/README.md`

**Repository Interfaces**: 7 repositories (Transaction, Account, Category, Budget, RecurringTransaction, Investment, Goal)

**Use Case Interfaces**: 25+ use cases covering all functional requirements

**Error Types**: 15+ explicit error classes for all failure modes

**Result Type**: `Result<T, E>` for type-safe error handling

**Performance Guarantees**: All operations <100ms, pagination for large datasets

Full details in [`contracts/README.md`](./contracts/README.md).

### Developer Guide

**Output**: `quickstart.md`

**Contents**:
- Quick setup instructions
- Architecture overview with diagrams
- Development workflow (TDD, creating features, file size management)
- Common tasks (adding entities, use cases, repositories, components)
- Testing guidelines (unit, integration, E2E)
- Debugging tips
- Code quality tools
- Troubleshooting guide

Full details in [`quickstart.md`](./quickstart.md).

### Agent Context Update

**File**: `AGENTS.md`

**Update**: Added reference to this plan between `<!-- SPECKIT START -->` and `<!-- SPECKIT END -->` markers.

## Phase 2: Constitution Re-Check

*Re-evaluate after Phase 1 design complete*

### ✅ I. TypeScript Strict Mode
- **Status**: PASS
- **Evidence**: All interfaces use explicit types, no `any` in contracts, Zod schemas generate types

### ✅ II. File Size Discipline
- **Status**: PASS
- **Evidence**: Modular structure with single-responsibility files, each entity/use case/repository in separate file

### ✅ III. Test Coverage
- **Status**: PASS
- **Evidence**: Test pyramid strategy defined, test helpers for data builders, contract tests for repositories

### ✅ IV. Privacy-First Architecture
- **Status**: PASS
- **Evidence**: IndexedDB local storage, no network layer, optional encryption with Web Crypto API

### ✅ V. Clean Architecture
- **Status**: PASS
- **Evidence**: Four-layer structure enforced, domain layer has zero dependencies, interfaces define boundaries

### ✅ VI. Explicit Error Handling
- **Status**: PASS
- **Evidence**: Result types in all contracts, typed error classes, no silent failures

### ✅ VII. Performance Standards
- **Status**: PASS
- **Evidence**: IndexedDB indexes defined, virtual scrolling planned, memoization strategy, web workers for heavy operations

**Final Gate Result**: ✅ ALL CHECKS PASSED - Ready for Phase 3 (Task Breakdown)

## Next Steps

1. **Run `/speckit.tasks`** to generate task breakdown from this plan
2. **Review tasks** for dependency order and completeness
3. **Optional: Run `/speckit.analyze`** to validate coverage between spec, plan, and tasks
4. **Begin implementation** following TDD workflow from quickstart guide

## Summary

This implementation plan provides a complete technical design for the Personal Finance Tracker that:

✅ **Satisfies all functional requirements** from the specification (57 requirements across 10 user stories)

✅ **Adheres to all constitution principles** (TypeScript strict, 200-line files, 80% coverage, privacy-first, clean architecture, explicit errors, sub-100ms performance)

✅ **Defines clear architecture** (clean architecture with four layers, dependencies flow inward)

✅ **Specifies technology stack** (TypeScript, React, Electron, IndexedDB, Vitest, Vite, Zod, date-fns)

✅ **Documents data model** (10 entities with relationships, validation rules, IndexedDB schema)

✅ **Defines API contracts** (7 repositories, 25+ use cases, 15+ error types, Result types)

✅ **Provides developer guide** (setup, architecture, workflows, testing, debugging, troubleshooting)

✅ **Ensures testability** (test pyramid, TDD workflow, contract tests, test helpers)

✅ **Optimizes performance** (indexes, virtual scrolling, memoization, web workers)

✅ **Maintains privacy** (local-only storage, no network, optional encryption)

The plan is ready for task breakdown and implementation.
