import { ValidationError } from '@/shared/types/errors';

/**
 * Money value object representing a monetary amount
 * Immutable and always positive
 */
export class Money {
  private constructor(private readonly _amount: number) {
    if (_amount < 0) {
      throw new ValidationError('Money amount cannot be negative', { amount: _amount });
    }
    if (!Number.isFinite(_amount)) {
      throw new ValidationError('Money amount must be finite', { amount: _amount });
    }
  }

  /**
   * Create a Money instance from a number
   */
  static fromNumber(amount: number): Money {
    // Round to 2 decimal places to avoid floating point issues
    const rounded = Math.round(amount * 100) / 100;
    return new Money(rounded);
  }

  /**
   * Create zero money
   */
  static zero(): Money {
    return new Money(0);
  }

  /**
   * Get the numeric value
   */
  get amount(): number {
    return this._amount;
  }

  /**
   * Add two money amounts
   */
  add(other: Money): Money {
    return Money.fromNumber(this._amount + other._amount);
  }

  /**
   * Subtract two money amounts
   */
  subtract(other: Money): Money {
    const result = this._amount - other._amount;
    if (result < 0) {
      throw new ValidationError('Subtraction would result in negative money', {
        minuend: this._amount,
        subtrahend: other._amount,
      });
    }
    return Money.fromNumber(result);
  }

  /**
   * Multiply money by a factor
   */
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new ValidationError('Cannot multiply money by negative factor', { factor });
    }
    return Money.fromNumber(this._amount * factor);
  }

  /**
   * Divide money by a divisor
   */
  divide(divisor: number): Money {
    if (divisor <= 0) {
      throw new ValidationError('Cannot divide money by zero or negative number', { divisor });
    }
    return Money.fromNumber(this._amount / divisor);
  }

  /**
   * Check if this money is greater than another
   */
  isGreaterThan(other: Money): boolean {
    return this._amount > other._amount;
  }

  /**
   * Check if this money is less than another
   */
  isLessThan(other: Money): boolean {
    return this._amount < other._amount;
  }

  /**
   * Check if this money equals another
   */
  equals(other: Money): boolean {
    return this._amount === other._amount;
  }

  /**
   * Check if this money is zero
   */
  isZero(): boolean {
    return this._amount === 0;
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return this._amount.toFixed(2);
  }

  /**
   * Convert to JSON
   */
  toJSON(): number {
    return this._amount;
  }
}

// Made with Bob
