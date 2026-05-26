# Tasks: Personal Finance Tracker

**Input**: Design documents from `/specs/001-personal-finance-tracker/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Following TDD approach as specified in constitution and quickstart.md. Tests are written FIRST and must FAIL before implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single project structure with clean architecture:
- `src/domain/` - Pure business logic
- `src/application/` - Use cases and interfaces
- `src/infrastructure/` - IndexedDB implementations
- `src/presentation/` - React components
- `tests/unit/`, `tests/integration/`, `tests/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per plan.md with src/, tests/, public/ directories
- [x] T002 Initialize TypeScript project with package.json, tsconfig.json (strict mode enabled)
- [ ] T003 [P] Install core dependencies: React 18.2+, Electron 28+, Vite 5+, Vitest 1+, Zod 3+, date-fns 3+
- [x] T004 [P] Configure ESLint with @typescript-eslint/no-explicit-any error, max-lines 200
- [x] T005 [P] Configure Prettier for code formatting
- [x] T006 [P] Setup Vitest configuration in vitest.config.ts with 80% coverage threshold
- [x] T007 [P] Setup Vite configuration in vite.config.ts for Electron
- [ ] T008 [P] Configure Git hooks with Husky for pre-commit linting and testing
- [x] T009 Create README.md with project overview, setup instructions, and architecture diagram

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T010 Create Result<T, E> type in src/shared/types/result.ts
- [ ] T011 [P] Create error classes in src/shared/types/errors.ts (SaveError, NotFoundError, QueryError, DeleteError, UpdateError, ValidationError)
- [ ] T012 [P] Create Money value object in src/domain/value-objects/money.ts
- [ ] T013 [P] Create DateRange value object in src/domain/value-objects/date-range.ts
- [ ] T014 [P] Create Percentage value object in src/domain/value-objects/percentage.ts
- [ ] T015 [P] Create date utilities in src/shared/utils/date-utils.ts (using date-fns)
- [ ] T016 [P] Create format utilities in src/shared/utils/format-utils.ts (currency, date, number formatting)
- [ ] T017 [P] Create validation utilities in src/shared/utils/validation-utils.ts (Zod schemas)
- [ ] T018 Setup IndexedDB database initialization in src/infrastructure/persistence/database-setup.ts
- [ ] T019 Create IndexedDB schema migrations in src/infrastructure/persistence/migrations.ts
- [ ] T020 [P] Create common React components: Button in src/presentation/components/common/Button.tsx
- [ ] T021 [P] Create common React components: Input in src/presentation/components/common/Input.tsx
- [ ] T022 [P] Create common React components: Select in src/presentation/components/common/Select.tsx
- [ ] T023 [P] Create common React components: Modal in src/presentation/components/common/Modal.tsx
- [ ] T024 [P] Create ErrorBoundary component in src/presentation/components/common/ErrorBoundary.tsx
- [ ] T025 Create App.tsx root component in src/presentation/App.tsx with routing structure
- [ ] T026 Create Electron main process in src/main.ts
- [ ] T027 Create Electron renderer entry in src/renderer.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick Transaction Entry (Priority: P1) 🎯 MVP

**Goal**: Enable users to quickly record income and expenses with immediate balance updates

**Independent Test**: Add a transaction with amount, category, and date, verify it appears in transaction list and balance updates

### Tests for User Story 1 (TDD - Write FIRST)

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T028 [P] [US1] Unit test for Transaction entity factory in tests/unit/domain/entities/transaction.test.ts
- [ ] T029 [P] [US1] Unit test for balance calculator in tests/unit/domain/services/balance-calculator.test.ts
- [ ] T030 [P] [US1] Unit test for AddTransaction use case in tests/unit/application/use-cases/transactions/add-transaction.test.ts
- [ ] T031 [P] [US1] Integration test for TransactionRepository in tests/integration/persistence/transaction-repository.test.ts
- [ ] T032 [P] [US1] E2E test for adding transaction in tests/e2e/add-transaction.spec.ts

### Implementation for User Story 1

- [ ] T033 [P] [US1] Create Transaction entity in src/domain/entities/transaction.ts
- [ ] T034 [P] [US1] Create Account entity in src/domain/entities/account.ts
- [ ] T035 [P] [US1] Create Category entity in src/domain/entities/category.ts
- [ ] T036 [US1] Create balance calculator service in src/domain/services/balance-calculator.ts (depends on T033, T034)
- [ ] T037 [P] [US1] Create TransactionRepository interface in src/application/ports/transaction-repository.ts
- [ ] T038 [P] [US1] Create AccountRepository interface in src/application/ports/account-repository.ts
- [ ] T039 [P] [US1] Create CategoryRepository interface in src/application/ports/category-repository.ts
- [ ] T040 [US1] Implement AddTransaction use case in src/application/use-cases/transactions/add-transaction.ts
- [ ] T041 [US1] Implement EditTransaction use case in src/application/use-cases/transactions/edit-transaction.ts
- [ ] T042 [US1] Implement DeleteTransaction use case in src/application/use-cases/transactions/delete-transaction.ts
- [ ] T043 [US1] Implement GetTransactionHistory use case in src/application/use-cases/transactions/get-transaction-history.ts
- [ ] T044 [US1] Implement IndexedDBTransactionRepository in src/infrastructure/persistence/indexeddb-transaction-repository.ts
- [ ] T045 [US1] Implement IndexedDBAccountRepository in src/infrastructure/persistence/indexeddb-account-repository.ts
- [ ] T046 [US1] Implement IndexedDBCategoryRepository in src/infrastructure/persistence/indexeddb-category-repository.ts
- [ ] T047 [P] [US1] Create TransactionForm component in src/presentation/components/transactions/TransactionForm.tsx
- [ ] T048 [P] [US1] Create TransactionList component in src/presentation/components/transactions/TransactionList.tsx
- [ ] T049 [P] [US1] Create TransactionListItem component in src/presentation/components/transactions/TransactionListItem.tsx
- [ ] T050 [US1] Create useTransactions hook in src/presentation/hooks/useTransactions.ts
- [ ] T051 [US1] Create Transactions page in src/presentation/pages/Transactions.tsx
- [ ] T052 [US1] Add validation and error handling for transaction operations
- [ ] T053 [US1] Add logging for transaction CRUD operations

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Account Management (Priority: P1)

**Goal**: Enable users to manage multiple accounts and track balances across all financial instruments

**Independent Test**: Create multiple accounts of different types, add transactions to each, verify individual and total balances

### Tests for User Story 2 (TDD - Write FIRST)

- [ ] T054 [P] [US2] Unit test for CreateAccount use case in tests/unit/application/use-cases/accounts/create-account.test.ts
- [ ] T055 [P] [US2] Unit test for GetAccountBalance use case in tests/unit/application/use-cases/accounts/get-account-balance.test.ts
- [ ] T056 [P] [US2] Unit test for GetNetWorth use case in tests/unit/application/use-cases/accounts/get-net-worth.test.ts
- [ ] T057 [P] [US2] Integration test for account operations in tests/integration/use-cases/account-operations.test.ts

### Implementation for User Story 2

- [ ] T058 [US2] Implement CreateAccount use case in src/application/use-cases/accounts/create-account.ts
- [ ] T059 [US2] Implement GetAccountBalance use case in src/application/use-cases/accounts/get-account-balance.ts
- [ ] T060 [US2] Implement GetNetWorth use case in src/application/use-cases/accounts/get-net-worth.ts
- [ ] T061 [US2] Implement ArchiveAccount use case in src/application/use-cases/accounts/archive-account.ts
- [ ] T062 [US2] Add transfer transaction support to AddTransaction use case in src/application/use-cases/transactions/add-transaction.ts
- [ ] T063 [P] [US2] Create AccountList component in src/presentation/components/accounts/AccountList.tsx
- [ ] T064 [P] [US2] Create AccountCard component in src/presentation/components/accounts/AccountCard.tsx
- [ ] T065 [P] [US2] Create AccountForm component in src/presentation/components/accounts/AccountForm.tsx
- [ ] T066 [US2] Create useAccounts hook in src/presentation/hooks/useAccounts.ts
- [ ] T067 [US2] Create Accounts page in src/presentation/pages/Accounts.tsx
- [ ] T068 [US2] Update Dashboard page to show net worth in src/presentation/pages/Dashboard.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Transaction Categorization (Priority: P1)

**Goal**: Enable users to categorize transactions and analyze spending patterns

**Independent Test**: Create custom categories, assign transactions to categories, view spending breakdown by category

### Tests for User Story 3 (TDD - Write FIRST)

- [ ] T069 [P] [US3] Unit test for Category entity with hierarchy in tests/unit/domain/entities/category.test.ts
- [ ] T070 [P] [US3] Unit test for category spending rollup in tests/unit/domain/services/category-calculator.test.ts
- [ ] T071 [P] [US3] Integration test for category operations in tests/integration/use-cases/category-operations.test.ts

### Implementation for User Story 3

- [ ] T072 [US3] Create category calculator service in src/domain/services/category-calculator.ts
- [ ] T073 [US3] Implement CreateCategory use case in src/application/use-cases/categories/create-category.ts
- [ ] T074 [US3] Implement GetCategorySpending use case in src/application/use-cases/categories/get-category-spending.ts
- [ ] T075 [US3] Implement SetDefaultCategory use case in src/application/use-cases/categories/set-default-category.ts
- [ ] T076 [US3] Create default categories initialization in src/infrastructure/persistence/default-categories.ts
- [ ] T077 [P] [US3] Create CategoryList component in src/presentation/components/categories/CategoryList.tsx
- [ ] T078 [P] [US3] Create CategoryForm component in src/presentation/components/categories/CategoryForm.tsx
- [ ] T079 [P] [US3] Create SpendingByCategory component in src/presentation/components/categories/SpendingByCategory.tsx
- [ ] T080 [US3] Create useCategories hook in src/presentation/hooks/useCategories.ts
- [ ] T081 [US3] Add category management to Settings page in src/presentation/pages/Settings.tsx
- [ ] T082 [US3] Update TransactionFilters component in src/presentation/components/transactions/TransactionFilters.tsx

**Checkpoint**: All P1 user stories should now be independently functional

---

## Phase 6: User Story 4 - Budget Creation and Tracking (Priority: P2)

**Goal**: Enable users to set monthly budgets and track spending against limits

**Independent Test**: Create a budget for a category, add transactions in that category, verify budget progress and alerts

### Tests for User Story 4 (TDD - Write FIRST)

- [ ] T083 [P] [US4] Unit test for Budget entity in tests/unit/domain/entities/budget.test.ts
- [ ] T084 [P] [US4] Unit test for budget calculator in tests/unit/domain/services/budget-calculator.test.ts
- [ ] T085 [P] [US4] Unit test for CreateBudget use case in tests/unit/application/use-cases/budgets/create-budget.test.ts
- [ ] T086 [P] [US4] Integration test for budget tracking in tests/integration/use-cases/budget-tracking.test.ts

### Implementation for User Story 4

- [ ] T087 [P] [US4] Create Budget entity in src/domain/entities/budget.ts
- [ ] T088 [US4] Create budget calculator service in src/domain/services/budget-calculator.ts
- [ ] T089 [P] [US4] Create BudgetRepository interface in src/application/ports/budget-repository.ts
- [ ] T090 [US4] Implement CreateBudget use case in src/application/use-cases/budgets/create-budget.ts
- [ ] T091 [US4] Implement GetBudgetProgress use case in src/application/use-cases/budgets/get-budget-progress.ts
- [ ] T092 [US4] Implement CheckBudgetAlerts use case in src/application/use-cases/budgets/check-budget-alerts.ts
- [ ] T093 [US4] Implement IndexedDBBudgetRepository in src/infrastructure/persistence/indexeddb-budget-repository.ts
- [ ] T094 [P] [US4] Create BudgetList component in src/presentation/components/budgets/BudgetList.tsx
- [ ] T095 [P] [US4] Create BudgetCard component in src/presentation/components/budgets/BudgetCard.tsx
- [ ] T096 [P] [US4] Create BudgetProgress component in src/presentation/components/budgets/BudgetProgress.tsx
- [ ] T097 [P] [US4] Create BudgetForm component in src/presentation/components/budgets/BudgetForm.tsx
- [ ] T098 [US4] Create useBudgets hook in src/presentation/hooks/useBudgets.ts
- [ ] T099 [US4] Create Budgets page in src/presentation/pages/Budgets.tsx
- [ ] T100 [US4] Add budget alerts to Dashboard page in src/presentation/pages/Dashboard.tsx

**Checkpoint**: Budget tracking should work independently with real-time progress updates

---

## Phase 7: User Story 5 - Recurring Transaction Automation (Priority: P2)

**Goal**: Enable users to automate predictable recurring transactions

**Independent Test**: Create a recurring transaction rule, verify automatic transaction creation on schedule

### Tests for User Story 5 (TDD - Write FIRST)

- [ ] T101 [P] [US5] Unit test for RecurringTransaction entity in tests/unit/domain/entities/recurring-transaction.test.ts
- [ ] T102 [P] [US5] Unit test for recurring transaction scheduler in tests/unit/domain/services/recurring-scheduler.test.ts
- [ ] T103 [P] [US5] Integration test for recurring transaction automation in tests/integration/use-cases/recurring-automation.test.ts

### Implementation for User Story 5

- [ ] T104 [P] [US5] Create RecurringTransaction entity in src/domain/entities/recurring-transaction.ts
- [ ] T105 [US5] Create recurring scheduler service in src/domain/services/recurring-scheduler.ts
- [ ] T106 [P] [US5] Create RecurringTransactionRepository interface in src/application/ports/recurring-transaction-repository.ts
- [ ] T107 [US5] Implement CreateRecurringTransaction use case in src/application/use-cases/recurring/create-recurring-transaction.ts
- [ ] T108 [US5] Implement ProcessRecurringTransactions use case in src/application/use-cases/recurring/process-recurring-transactions.ts
- [ ] T109 [US5] Implement IndexedDBRecurringTransactionRepository in src/infrastructure/persistence/indexeddb-recurring-transaction-repository.ts
- [ ] T110 [P] [US5] Create RecurringTransactionList component in src/presentation/components/recurring/RecurringTransactionList.tsx
- [ ] T111 [P] [US5] Create RecurringTransactionForm component in src/presentation/components/recurring/RecurringTransactionForm.tsx
- [ ] T112 [US5] Create useRecurringTransactions hook in src/presentation/hooks/useRecurringTransactions.ts
- [ ] T113 [US5] Add recurring transaction management to Settings page in src/presentation/pages/Settings.tsx
- [ ] T114 [US5] Implement background scheduler in Electron main process in src/main.ts

**Checkpoint**: Recurring transactions should auto-create on schedule with notifications

---

## Phase 8: User Story 6 - Investment Portfolio Tracking (Priority: P2)

**Goal**: Enable users to track investment holdings and portfolio performance

**Independent Test**: Add investment holdings, update prices, view portfolio performance metrics

### Tests for User Story 6 (TDD - Write FIRST)

- [ ] T115 [P] [US6] Unit test for Investment entity in tests/unit/domain/entities/investment.test.ts
- [ ] T116 [P] [US6] Unit test for investment calculator in tests/unit/domain/services/investment-calculator.test.ts
- [ ] T117 [P] [US6] Integration test for portfolio tracking in tests/integration/use-cases/portfolio-tracking.test.ts

### Implementation for User Story 6

- [ ] T118 [P] [US6] Create Investment entity in src/domain/entities/investment.ts
- [ ] T119 [US6] Create investment calculator service in src/domain/services/investment-calculator.ts
- [ ] T120 [P] [US6] Create InvestmentRepository interface in src/application/ports/investment-repository.ts
- [ ] T121 [US6] Implement AddInvestment use case in src/application/use-cases/investments/add-investment.ts
- [ ] T122 [US6] Implement UpdateInvestmentPrice use case in src/application/use-cases/investments/update-investment-price.ts
- [ ] T123 [US6] Implement GetPortfolioPerformance use case in src/application/use-cases/investments/get-portfolio-performance.ts
- [ ] T124 [US6] Implement CalculateCapitalGains use case in src/application/use-cases/investments/calculate-capital-gains.ts
- [ ] T125 [US6] Implement IndexedDBInvestmentRepository in src/infrastructure/persistence/indexeddb-investment-repository.ts
- [ ] T126 [P] [US6] Create PortfolioSummary component in src/presentation/components/investments/PortfolioSummary.tsx
- [ ] T127 [P] [US6] Create HoldingsList component in src/presentation/components/investments/HoldingsList.tsx
- [ ] T128 [P] [US6] Create AssetAllocation component in src/presentation/components/investments/AssetAllocation.tsx
- [ ] T129 [P] [US6] Create InvestmentForm component in src/presentation/components/investments/InvestmentForm.tsx
- [ ] T130 [US6] Create useInvestments hook in src/presentation/hooks/useInvestments.ts
- [ ] T131 [US6] Create Investments page in src/presentation/pages/Investments.tsx

**Checkpoint**: Investment tracking should work with accurate performance calculations

---

## Phase 9: User Story 7 - Financial Goals Setting (Priority: P3)

**Goal**: Enable users to set and track progress toward savings goals

**Independent Test**: Create a goal with target amount and date, allocate funds, view progress indicators

### Tests for User Story 7 (TDD - Write FIRST)

- [ ] T132 [P] [US7] Unit test for Goal entity in tests/unit/domain/entities/goal.test.ts
- [ ] T133 [P] [US7] Unit test for GoalContribution entity in tests/unit/domain/entities/goal-contribution.test.ts
- [ ] T134 [P] [US7] Unit test for goal calculator in tests/unit/domain/services/goal-calculator.test.ts
- [ ] T135 [P] [US7] Integration test for goal tracking in tests/integration/use-cases/goal-tracking.test.ts

### Implementation for User Story 7

- [ ] T136 [P] [US7] Create Goal entity in src/domain/entities/goal.ts
- [ ] T137 [P] [US7] Create GoalContribution entity in src/domain/entities/goal-contribution.ts
- [ ] T138 [US7] Create goal calculator service in src/domain/services/goal-calculator.ts
- [ ] T139 [P] [US7] Create GoalRepository interface in src/application/ports/goal-repository.ts
- [ ] T140 [US7] Implement CreateGoal use case in src/application/use-cases/goals/create-goal.ts
- [ ] T141 [US7] Implement ContributeToGoal use case in src/application/use-cases/goals/contribute-to-goal.ts
- [ ] T142 [US7] Implement GetGoalProgress use case in src/application/use-cases/goals/get-goal-progress.ts
- [ ] T143 [US7] Implement PrioritizeGoals use case in src/application/use-cases/goals/prioritize-goals.ts
- [ ] T144 [US7] Implement IndexedDBGoalRepository in src/infrastructure/persistence/indexeddb-goal-repository.ts
- [ ] T145 [P] [US7] Create GoalsList component in src/presentation/components/goals/GoalsList.tsx
- [ ] T146 [P] [US7] Create GoalCard component in src/presentation/components/goals/GoalCard.tsx
- [ ] T147 [P] [US7] Create GoalProgress component in src/presentation/components/goals/GoalProgress.tsx
- [ ] T148 [P] [US7] Create GoalForm component in src/presentation/components/goals/GoalForm.tsx
- [ ] T149 [US7] Create useGoals hook in src/presentation/hooks/useGoals.ts
- [ ] T150 [US7] Create Goals page in src/presentation/pages/Goals.tsx

**Checkpoint**: Goal tracking should work with progress projections and prioritization

---

## Phase 10: User Story 8 - Cash Flow Forecasting (Priority: P3)

**Goal**: Enable users to see projected future cash flow based on historical patterns

**Independent Test**: With 3+ months of history and recurring transactions, view 6-month forecast projections

### Tests for User Story 8 (TDD - Write FIRST)

- [ ] T151 [P] [US8] Unit test for Forecast entity in tests/unit/domain/entities/forecast.ts
- [ ] T152 [P] [US8] Unit test for forecast generator in tests/unit/domain/services/forecast-generator.test.ts
- [ ] T153 [P] [US8] Integration test for forecast generation in tests/integration/use-cases/forecast-generation.test.ts

### Implementation for User Story 8

- [ ] T154 [P] [US8] Create Forecast entity in src/domain/entities/forecast.ts
- [ ] T155 [US8] Create forecast generator service in src/domain/services/forecast-generator.ts
- [ ] T156 [US8] Implement GenerateForecast use case in src/application/use-cases/forecasts/generate-forecast.ts
- [ ] T157 [US8] Implement UpdateForecastScenario use case in src/application/use-cases/forecasts/update-forecast-scenario.ts
- [ ] T158 [P] [US8] Create ForecastChart component in src/presentation/components/forecasts/ForecastChart.tsx
- [ ] T159 [P] [US8] Create ForecastScenario component in src/presentation/components/forecasts/ForecastScenario.tsx
- [ ] T160 [US8] Create useForecasts hook in src/presentation/hooks/useForecasts.ts
- [ ] T161 [US8] Add forecast section to Dashboard page in src/presentation/pages/Dashboard.tsx

**Checkpoint**: Forecast should show 6-month projections with scenario modeling

---

## Phase 11: User Story 9 - Advanced Reporting and Analytics (Priority: P3)

**Goal**: Enable users to generate detailed reports and visualizations

**Independent Test**: Generate various reports (spending by category, income vs expenses, net worth over time) and export them

### Tests for User Story 9 (TDD - Write FIRST)

- [ ] T162 [P] [US9] Unit test for Report entity in tests/unit/domain/entities/report.test.ts
- [ ] T163 [P] [US9] Unit test for report generator in tests/unit/domain/services/report-generator.test.ts
- [ ] T164 [P] [US9] Integration test for report generation in tests/integration/use-cases/report-generation.test.ts

### Implementation for User Story 9

- [ ] T165 [P] [US9] Create Report entity in src/domain/entities/report.ts
- [ ] T166 [US9] Create report generator service in src/domain/services/report-generator.ts
- [ ] T167 [US9] Implement GenerateReport use case in src/application/use-cases/reports/generate-report.ts
- [ ] T168 [US9] Implement ExportReport use case in src/application/use-cases/reports/export-report.ts (PDF, CSV, Excel)
- [ ] T169 [P] [US9] Create ReportViewer component in src/presentation/components/reports/ReportViewer.tsx
- [ ] T170 [P] [US9] Create ChartComponents (pie, line, bar) in src/presentation/components/reports/ChartComponents.tsx
- [ ] T171 [P] [US9] Create ReportFilters component in src/presentation/components/reports/ReportFilters.tsx
- [ ] T172 [US9] Create useReports hook in src/presentation/hooks/useReports.ts
- [ ] T173 [US9] Create Reports page in src/presentation/pages/Reports.tsx
- [ ] T174 [US9] Implement chart library integration (recharts or similar) in src/infrastructure/charts/

**Checkpoint**: Reports should generate with visualizations and export in multiple formats

---

## Phase 12: User Story 10 - Data Import and Export (Priority: P3)

**Goal**: Enable users to import transactions from CSV and export all data for backup

**Independent Test**: Import CSV file with transactions, verify they appear correctly, then export data and confirm completeness

### Tests for User Story 10 (TDD - Write FIRST)

- [ ] T175 [P] [US10] Unit test for CSV parser in tests/unit/infrastructure/import/csv-parser.test.ts
- [ ] T176 [P] [US10] Unit test for duplicate detection in tests/unit/domain/services/duplicate-detector.test.ts
- [ ] T177 [P] [US10] Integration test for import/export in tests/integration/use-cases/data-management.test.ts

### Implementation for User Story 10

- [ ] T178 [US10] Create duplicate detector service in src/domain/services/duplicate-detector.ts
- [ ] T179 [US10] Implement ImportTransactions use case in src/application/use-cases/data-management/import-transactions.ts
- [ ] T180 [US10] Implement ExportData use case in src/application/use-cases/data-management/export-data.ts
- [ ] T181 [US10] Implement ImportData use case in src/application/use-cases/data-management/import-data.ts
- [ ] T182 [US10] Create CSV parser in src/infrastructure/import/csv-parser.ts
- [ ] T183 [US10] Create data encryption service in src/infrastructure/encryption/crypto-service.ts (Web Crypto API)
- [ ] T184 [P] [US10] Create ImportWizard component in src/presentation/components/import/ImportWizard.tsx
- [ ] T185 [P] [US10] Create ExportDialog component in src/presentation/components/export/ExportDialog.tsx
- [ ] T186 [US10] Add import/export to Settings page in src/presentation/pages/Settings.tsx

**Checkpoint**: All user stories should now be independently functional

---

## Phase 13: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T187 [P] Add comprehensive error handling across all use cases
- [ ] T188 [P] Implement performance optimizations: IndexedDB indexes, virtual scrolling in TransactionList
- [ ] T189 [P] Add memoization to expensive calculations (portfolio performance, forecasts, reports)
- [ ] T190 [P] Implement web workers for heavy computations (report generation, forecast calculations)
- [ ] T191 [P] Add loading states and skeleton screens to all pages
- [ ] T192 [P] Implement toast notifications for user feedback
- [ ] T193 [P] Add keyboard shortcuts for common actions
- [ ] T194 [P] Implement dark mode support
- [ ] T195 [P] Add accessibility improvements (ARIA labels, keyboard navigation)
- [ ] T196 [P] Create comprehensive documentation in docs/ directory
- [ ] T197 [P] Add JSDoc comments to all public APIs
- [ ] T198 [P] Create user guide in docs/user-guide.md
- [ ] T199 [P] Create developer guide in docs/developer-guide.md
- [ ] T200 [P] Run Lighthouse audits and optimize performance
- [ ] T201 [P] Run security audit and implement recommendations
- [ ] T202 [P] Verify all files are under 200 lines (constitution requirement)
- [ ] T203 [P] Verify 80% test coverage across all modules (constitution requirement)
- [ ] T204 [P] Verify all operations complete in <100ms (constitution requirement)
- [ ] T205 Run quickstart.md validation and fix any issues
- [ ] T206 Create release build and test Electron packaging
- [ ] T207 Final E2E testing of complete user workflows

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-12)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 13)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 3 (P1)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Requires US3 (categories) but independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - Requires US2 (investment accounts) but independently testable
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable
- **User Story 8 (P3)**: Can start after Foundational (Phase 2) - Requires US1, US5 for data but independently testable
- **User Story 9 (P3)**: Can start after Foundational (Phase 2) - Requires US1-US6 for data but independently testable
- **User Story 10 (P3)**: Can start after Foundational (Phase 2) - Integrates with US1 but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation (TDD)
- Entities before services
- Services before use cases
- Use cases before repositories
- Repositories before UI components
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Entities within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together (TDD - write first):
Task: "Unit test for Transaction entity factory in tests/unit/domain/entities/transaction.test.ts"
Task: "Unit test for balance calculator in tests/unit/domain/services/balance-calculator.test.ts"
Task: "Unit test for AddTransaction use case in tests/unit/application/use-cases/transactions/add-transaction.test.ts"
Task: "Integration test for TransactionRepository in tests/integration/persistence/transaction-repository.test.ts"
Task: "E2E test for adding transaction in tests/e2e/add-transaction.spec.ts"

# Launch all entities for User Story 1 together:
Task: "Create Transaction entity in src/domain/entities/transaction.ts"
Task: "Create Account entity in src/domain/entities/account.ts"
Task: "Create Category entity in src/domain/entities/category.ts"

# Launch all repository interfaces together:
Task: "Create TransactionRepository interface in src/application/ports/transaction-repository.ts"
Task: "Create AccountRepository interface in src/application/ports/account-repository.ts"
Task: "Create CategoryRepository interface in src/application/ports/category-repository.ts"

# Launch all UI components together:
Task: "Create TransactionForm component in src/presentation/components/transactions/TransactionForm.tsx"
Task: "Create TransactionList component in src/presentation/components/transactions/TransactionList.tsx"
Task: "Create TransactionListItem component in src/presentation/components/transactions/TransactionListItem.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1-3 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Quick Transaction Entry)
4. Complete Phase 4: User Story 2 (Account Management)
5. Complete Phase 5: User Story 3 (Transaction Categorization)
6. **STOP and VALIDATE**: Test all P1 stories independently
7. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Continue through remaining stories in priority order
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Transactions)
   - Developer B: User Story 2 (Accounts)
   - Developer C: User Story 3 (Categories)
3. Stories complete and integrate independently
4. Continue with P2 stories in parallel
5. Finish with P3 stories in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- TDD approach: Write tests FIRST, ensure they FAIL, then implement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution requirements: 200-line file limit, 80% test coverage, <100ms operations, no `any` types
- All operations must use Result<T, E> types for explicit error handling
- Follow clean architecture: domain → application → infrastructure → presentation