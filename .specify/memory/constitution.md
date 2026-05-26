<!--
Sync Impact Report:
- Version: 1.0.0 (Initial constitution)
- Created: 2026-05-26
- Principles defined: 7 core principles for personal finance tracker
- Templates requiring updates: ✅ All templates aligned with new principles
- Follow-up TODOs: None
-->

# Personal Finance Tracker Constitution

## Core Principles

### I. TypeScript Strict Mode (NON-NEGOTIABLE)
TypeScript strict mode MUST be enabled for all code. The `any` type is STRICTLY FORBIDDEN. All types must be explicitly defined or properly inferred. Functional programming style is PREFERRED over object-oriented patterns where appropriate (pure functions, immutability, composition over inheritance).

**Rationale**: Type safety prevents runtime errors and improves maintainability. Strict typing catches bugs at compile time rather than production. Functional style reduces side effects and improves testability.

### II. File Size Discipline
Every source file MUST NOT exceed 200 lines of code (excluding comments and blank lines). Files approaching this limit MUST be refactored into smaller, focused modules with clear single responsibilities.

**Rationale**: Smaller files are easier to understand, test, and maintain. This constraint enforces modularity and prevents god objects/files. Code reviews become more focused and effective.

### III. Test Coverage (NON-NEGOTIABLE)
Business logic MUST maintain a minimum of 80% line coverage. All critical paths, edge cases, and error conditions MUST be tested. Tests MUST be written before or alongside implementation (TDD encouraged). Coverage reports MUST be generated and reviewed before merging.

**Rationale**: High test coverage ensures reliability and confidence in changes. Business logic is the core value of the application and must be thoroughly validated. Tests serve as living documentation.

### IV. Privacy-First Architecture
All user financial data MUST be stored locally on the user's device. No financial data SHALL be transmitted to external servers without explicit user consent and encryption. Data export features MUST use encrypted formats. Third-party analytics or tracking MUST NOT access financial data.

**Rationale**: Financial data is highly sensitive. Local-first architecture protects user privacy, ensures data ownership, and eliminates server-side security risks. Users maintain complete control over their data.

### V. Clean Architecture
The application MUST follow clean architecture principles with clear separation of concerns:
- **Domain Layer**: Business logic, entities, and use cases (framework-agnostic)
- **Application Layer**: Application services, DTOs, and interfaces
- **Infrastructure Layer**: Data persistence, external services, UI frameworks
- **Presentation Layer**: UI components, view models, user interactions

Dependencies MUST flow inward (presentation → application → domain). The domain layer MUST NOT depend on infrastructure or presentation layers.

**Rationale**: Clean architecture ensures testability, maintainability, and flexibility. Business logic remains independent of frameworks and UI, enabling easy testing and future migrations.

### VI. Explicit Error Handling
All errors MUST use explicit, typed error classes. Silent failures are STRICTLY FORBIDDEN. Every error condition MUST be handled explicitly with appropriate user feedback or logging. Use Result/Either types for operations that can fail. Async operations MUST handle both success and error cases.

**Rationale**: Explicit error handling prevents silent bugs and improves debugging. Typed errors provide clear contracts and enable proper error recovery. Users receive meaningful feedback instead of cryptic failures.

### VII. Performance Standards
All user-facing operations MUST complete within 100ms. Database queries MUST be optimized and indexed appropriately. UI rendering MUST be non-blocking. Large computations MUST be performed asynchronously with progress indicators. Performance MUST be measured and monitored in development.

**Rationale**: Sub-100ms response time ensures a smooth, responsive user experience. Financial applications require immediate feedback for user confidence. Performance issues compound over time and are harder to fix later.

## Quality Standards

### Code Review Requirements
- All code changes MUST be reviewed by at least one other developer
- Reviews MUST verify compliance with all constitution principles
- Type safety, test coverage, and file size limits MUST be validated
- Performance implications MUST be considered for all changes

### Testing Requirements
- Unit tests for all business logic (80%+ coverage mandatory)
- Integration tests for data persistence and critical workflows
- End-to-end tests for key user journeys
- Performance tests for operations approaching 100ms threshold

### Documentation Requirements
- All public APIs MUST have TSDoc comments
- Complex algorithms MUST include explanatory comments
- Architecture decisions MUST be documented in ADRs (Architecture Decision Records)
- README MUST be kept up-to-date with setup and development instructions

## Development Workflow

### Pre-Commit Checks
- TypeScript compilation MUST pass with no errors
- All tests MUST pass
- Linting MUST pass (ESLint with strict rules)
- Code formatting MUST be consistent (Prettier)
- File size limits MUST be validated

### Continuous Integration
- Automated tests run on every commit
- Coverage reports generated and tracked
- Type checking enforced in CI pipeline
- Performance benchmarks tracked over time

### Deployment Standards
- All deployments MUST pass full test suite
- Performance metrics MUST be within acceptable ranges
- Privacy compliance MUST be verified
- User data migration scripts MUST be tested and reversible

## Governance

This constitution supersedes all other development practices and guidelines. All team members MUST adhere to these principles without exception.

### Amendment Process
1. Proposed amendments MUST be documented with rationale
2. Team consensus MUST be achieved before adoption
3. Version number MUST be incremented according to semantic versioning:
   - MAJOR: Backward incompatible principle changes
   - MINOR: New principles or significant expansions
   - PATCH: Clarifications, wording improvements, typo fixes
4. Migration plan MUST be provided for breaking changes
5. All dependent templates and documentation MUST be updated

### Compliance Review
- Constitution compliance MUST be verified in all code reviews
- Quarterly audits MUST assess adherence to principles
- Violations MUST be addressed immediately with corrective action
- Repeated violations MUST trigger team discussion and process improvement

### Complexity Justification
Any deviation from these principles MUST be explicitly justified, documented, and approved by the team. Technical debt introduced by deviations MUST be tracked and prioritized for resolution.

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
