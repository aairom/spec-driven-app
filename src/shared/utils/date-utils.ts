import {
  format,
  parseISO,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addMonths,
  addDays,
  differenceInDays,
  isValid,
  isBefore,
  isAfter,
  isSameDay,
} from 'date-fns';

/**
 * Format a date to ISO string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Parse ISO string to Date
 */
export const fromISOString = (iso: string): Date => {
  return parseISO(iso);
};

/**
 * Format date for display (e.g., "Jan 15, 2024")
 */
export const formatDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy');
};

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export const formatDateInput = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Get start of current month
 */
export const getStartOfMonth = (date: Date = new Date()): Date => {
  return startOfMonth(date);
};

/**
 * Get end of current month
 */
export const getEndOfMonth = (date: Date = new Date()): Date => {
  return endOfMonth(date);
};

/**
 * Get start of current year
 */
export const getStartOfYear = (date: Date = new Date()): Date => {
  return startOfYear(date);
};

/**
 * Get end of current year
 */
export const getEndOfYear = (date: Date = new Date()): Date => {
  return endOfYear(date);
};

/**
 * Add months to a date
 */
export const addMonthsToDate = (date: Date, months: number): Date => {
  return addMonths(date, months);
};

/**
 * Add days to a date
 */
export const addDaysToDate = (date: Date, days: number): Date => {
  return addDays(date, days);
};

/**
 * Get difference in days between two dates
 */
export const daysBetween = (start: Date, end: Date): number => {
  return differenceInDays(end, start);
};

/**
 * Check if date is valid
 */
export const isValidDate = (date: Date): boolean => {
  return isValid(date);
};

/**
 * Check if first date is before second
 */
export const isBeforeDate = (date1: Date, date2: Date): boolean => {
  return isBefore(date1, date2);
};

/**
 * Check if first date is after second
 */
export const isAfterDate = (date1: Date, date2: Date): boolean => {
  return isAfter(date1, date2);
};

/**
 * Check if two dates are the same day
 */
export const isSameDayAs = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

/**
 * Get today's date at midnight
 */
export const getToday = (): Date => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
};

/**
 * Check if date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDayAs(date, getToday());
};

// Made with Bob
