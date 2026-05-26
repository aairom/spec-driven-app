/**
 * Base error class for all application errors
 */
export abstract class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Error when saving data fails
 */
export class SaveError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'SAVE_ERROR', details);
  }
}

/**
 * Error when requested resource is not found
 */
export class NotFoundError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'NOT_FOUND', details);
  }
}

/**
 * Error when query operation fails
 */
export class QueryError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'QUERY_ERROR', details);
  }
}

/**
 * Error when delete operation fails
 */
export class DeleteError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'DELETE_ERROR', details);
  }
}

/**
 * Error when update operation fails
 */
export class UpdateError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'UPDATE_ERROR', details);
  }
}

/**
 * Error when validation fails
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'VALIDATION_ERROR', details);
  }
}

/**
 * Error when database operation fails
 */
export class DatabaseError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'DATABASE_ERROR', details);
  }
}

/**
 * Error when business rule is violated
 */
export class BusinessRuleError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'BUSINESS_RULE_ERROR', details);
  }
}

/**
 * Error when operation is not permitted
 */
export class PermissionError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'PERMISSION_ERROR', details);
  }
}

/**
 * Error when concurrent modification is detected
 */
export class ConcurrencyError extends AppError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'CONCURRENCY_ERROR', details);
  }
}

// Made with Bob
