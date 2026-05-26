# Personal Finance Tracker

A comprehensive desktop personal finance tracker with privacy-first design, built with TypeScript, React, and Electron.

## Features

- **Transaction Management**: Quick entry of income and expenses with categorization
- **Account Management**: Track multiple accounts (checking, savings, credit cards, cash, investments)
- **Budget Tracking**: Set monthly budgets and monitor spending in real-time
- **Recurring Transactions**: Automate predictable income and expenses
- **Investment Portfolio**: Track holdings, performance, and asset allocation
- **Financial Goals**: Set and monitor progress toward savings goals
- **Cash Flow Forecasting**: Project future cash flow based on historical patterns
- **Advanced Reporting**: Generate detailed reports with visualizations
- **Data Import/Export**: Import from CSV and export encrypted backups

## Architecture

Built with Clean Architecture principles:
- **Domain Layer**: Pure business logic (no framework dependencies)
- **Application Layer**: Use cases and interfaces
- **Infrastructure Layer**: IndexedDB repositories and React components
- **Presentation Layer**: UI components and pages

## Tech Stack

- **TypeScript 5.3+**: Strict mode, no `any` types
- **React 18.2+**: UI framework
- **Electron 28+**: Desktop application
- **IndexedDB**: Local storage (privacy-first)
- **Vite**: Build tool and dev server
- **Vitest**: Testing framework (80% coverage requirement)
- **Zod**: Runtime validation
- **date-fns**: Date manipulation

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Build for production
npm run build

# Run Electron app
npm run electron:dev
```

## Project Structure

```
src/
├── domain/              # Pure business logic
│   ├── entities/        # Core entities
│   ├── value-objects/   # Immutable value objects
│   └── services/        # Pure calculation functions
├── application/         # Use cases and interfaces
│   ├── use-cases/       # Business operations
│   └── ports/           # Repository interfaces
├── infrastructure/      # Framework implementations
│   ├── persistence/     # IndexedDB repositories
│   └── encryption/      # Web Crypto API
├── presentation/        # UI layer
│   ├── components/      # React components
│   ├── hooks/           # Custom hooks
│   └── pages/           # Page components
└── shared/              # Shared utilities
    ├── types/           # TypeScript types
    └── utils/           # Utility functions

tests/
├── unit/                # Unit tests (70%)
├── integration/         # Integration tests (20%)
└── e2e/                 # E2E tests (10%)
```

## Development Guidelines

### Constitution Principles

1. **TypeScript Strict Mode**: No `any` types, strict null checks
2. **File Size Limit**: Maximum 200 lines per file (excluding comments)
3. **Test Coverage**: Minimum 80% line coverage on business logic
4. **Privacy-First**: All data stored locally, no external requests
5. **Clean Architecture**: Clear separation of concerns
6. **Explicit Error Handling**: Result<T, E> types, no silent failures
7. **Performance**: Sub-100ms response time for all operations

### Testing Strategy

- **TDD Workflow**: Write tests first, ensure they fail, then implement
- **Test Pyramid**: 70% unit, 20% integration, 10% E2E
- **Coverage Threshold**: 80% minimum enforced by CI

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## License

MIT