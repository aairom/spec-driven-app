import { ValidationError } from '@/shared/types/errors';

/**
 * Percentage value object representing a percentage value (0-100)
 * Immutable and ensures value is within valid range
 */
export class Percentage {
  private constructor(private readonly _value: number) {
    if (_value < 0 || _value > 100) {
      throw new ValidationError('Percentage must be between 0 and 100', { value: _value });
    }
    if (!Number.isFinite(_value)) {
      throw new ValidationError('Percentage must be finite', { value: _value });
    }
  }

  /**
   * Create a Percentage from a number (0-100)
   */
  static fromNumber(value: number): Percentage {
    const rounded = Math.round(value * 100) / 100;
    return new Percentage(rounded);
  }

  /**
   * Create a Percentage from a ratio (0-1)
   */
  static fromRatio(ratio: number): Percentage {
    if (ratio < 0 || ratio > 1) {
      throw new ValidationError('Ratio must be between 0 and 1', { ratio });
    }
    return new Percentage(ratio * 100);
  }

  /**
   * Create zero percentage
   */
  static zero(): Percentage {
    return new Percentage(0);
  }

  /**
   * Create 100% percentage
   */
  static full(): Percentage {
    return new Percentage(100);
  }

  /**
   * Get the numeric value (0-100)
   */
  get value(): number {
    return this._value;
  }

  /**
   * Get as ratio (0-1)
   */
  get ratio(): number {
    return this._value / 100;
  }

  /**
   * Add two percentages (capped at 100)
   */
  add(other: Percentage): Percentage {
    const sum = this._value + other._value;
    return Percentage.fromNumber(Math.min(sum, 100));
  }

  /**
   * Subtract two percentages (floored at 0)
   */
  subtract(other: Percentage): Percentage {
    const diff = this._value - other._value;
    return Percentage.fromNumber(Math.max(diff, 0));
  }

  /**
   * Check if this percentage is greater than another
   */
  isGreaterThan(other: Percentage): boolean {
    return this._value > other._value;
  }

  /**
   * Check if this percentage is less than another
   */
  isLessThan(other: Percentage): boolean {
    return this._value < other._value;
  }

  /**
   * Check if this percentage equals another
   */
  equals(other: Percentage): boolean {
    return this._value === other._value;
  }

  /**
   * Check if this percentage is zero
   */
  isZero(): boolean {
    return this._value === 0;
  }

  /**
   * Check if this percentage is full (100%)
   */
  isFull(): boolean {
    return this._value === 100;
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return `${this._value.toFixed(2)}%`;
  }

  /**
   * Convert to JSON
   */
  toJSON(): number {
    return this._value;
  }
}

// Made with Bob
