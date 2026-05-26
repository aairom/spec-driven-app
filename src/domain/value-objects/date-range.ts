import { ValidationError } from '@/shared/types/errors';

/**
 * DateRange value object representing a period between two dates
 * Immutable and ensures start is before or equal to end
 */
export class DateRange {
  private constructor(
    private readonly _start: Date,
    private readonly _end: Date
  ) {
    if (_start > _end) {
      throw new ValidationError('Start date must be before or equal to end date', {
        start: _start.toISOString(),
        end: _end.toISOString(),
      });
    }
  }

  /**
   * Create a DateRange from two dates
   */
  static fromDates(start: Date, end: Date): DateRange {
    return new DateRange(new Date(start), new Date(end));
  }

  /**
   * Create a DateRange from ISO strings
   */
  static fromStrings(start: string, end: string): DateRange {
    return new DateRange(new Date(start), new Date(end));
  }

  /**
   * Create a DateRange for the current month
   */
  static currentMonth(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return new DateRange(start, end);
  }

  /**
   * Create a DateRange for the current year
   */
  static currentYear(): DateRange {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const end = new Date(now.getFullYear(), 11, 31);
    return new DateRange(start, end);
  }

  /**
   * Get the start date
   */
  get start(): Date {
    return new Date(this._start);
  }

  /**
   * Get the end date
   */
  get end(): Date {
    return new Date(this._end);
  }

  /**
   * Check if a date falls within this range
   */
  contains(date: Date): boolean {
    return date >= this._start && date <= this._end;
  }

  /**
   * Check if this range overlaps with another
   */
  overlaps(other: DateRange): boolean {
    return this._start <= other._end && this._end >= other._start;
  }

  /**
   * Get the number of days in this range
   */
  getDays(): number {
    const diff = this._end.getTime() - this._start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
  }

  /**
   * Check if this range equals another
   */
  equals(other: DateRange): boolean {
    return this._start.getTime() === other._start.getTime() &&
           this._end.getTime() === other._end.getTime();
  }

  /**
   * Convert to string representation
   */
  toString(): string {
    return `${this._start.toISOString()} - ${this._end.toISOString()}`;
  }

  /**
   * Convert to JSON
   */
  toJSON(): { start: string; end: string } {
    return {
      start: this._start.toISOString(),
      end: this._end.toISOString(),
    };
  }
}

// Made with Bob
